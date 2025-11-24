"use client";

import { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
import { useRouter } from "next/navigation";

export default function InvoiceCreatePage() {
  const router = useRouter();
  const API_BASE = "http://127.0.0.1:8000/api";
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access") : null;

  const [customerType, setCustomerType] = useState("existing");
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [products, setProducts] = useState([]);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [unitPrice, setUnitPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [notes, setNotes] = useState("");

  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const [warning, setWarning] = useState(""); // New state
  const [maxQuantity, setMaxQuantity] = useState(0); // To store product stock

  const [formData, setFormData] = useState({
    company_name: "",
    contact_person: "",
    email: "",
    phone: "",
    address: "",
    status: "active",
  });

  // Fetch customers and products on load
  useEffect(() => {
    if (!token) return;

    // Fetch customers
    fetch(`${API_BASE}/customer/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setCustomers(data))
      .catch(console.error);

    // Fetch products
    fetch(`${API_BASE}/product/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(console.error);
  }, [token]);

  // Update totals whenever invoiceItems change
  useEffect(() => {
    const sub = invoiceItems.reduce(
      (acc, item) => acc + item.unit_price * item.quantity,
      0
    );
    setSubtotal(sub);
    const t = sub * 0.05; // 5% tax
    setTax(t);
    setTotalAmount(sub + t);
  }, [invoiceItems]);

  // Customer selection toggle
  const toggleCustomerForm = (type) => {
    setCustomerType(type);
    setSelectedCustomer("");
  };

  const selectPaymentMethod = (method) => {
    setPaymentMethod(method);
    // Automatically set status based on payment method
    if (method === "credit") {
      setFormData({ ...formData, status: "unpaid" });
    } else {
      setFormData({ ...formData, status: "paid" });
    }
  };

  const handleProductChange = (e) => {
    const prodId = e.target.value;
    setSelectedProduct(prodId);
    const prod = products.find((p) => p.id === parseInt(prodId));
    setUnitPrice(prod ? prod.unit_price : 0);
    setQuantity(1);
    setMaxQuantity(prod ? prod.stock_qty : 0); // store max available
    setWarning(""); // reset warning
  };

  const addProduct = () => {
    if (!selectedProduct) return alert("Select a product first");
    if (quantity > maxQuantity) {
      setWarning(`Cannot add ${quantity} items. Only ${maxQuantity} in stock.`);
      return; // stop adding
    }
    const prod = products.find((p) => p.id === parseInt(selectedProduct));
    const newItem = {
      product: prod.id,
      product_name: prod.name,
      unit_price: unitPrice,
      quantity: quantity,
      total: unitPrice * quantity,
    };
    setInvoiceItems([...invoiceItems, newItem]);
    setSelectedProduct("");
    setUnitPrice(0);
    setQuantity(1);
    setWarning(""); // reset warning
  };

  const removeItem = (index) => {
    const updatedItems = invoiceItems.filter((_, i) => i !== index);
    setInvoiceItems(updatedItems);
  };

  const createInvoice = async () => {
    if (!selectedCustomer) return alert("Select or add a customer first");
    if (!paymentMethod) return alert("Select a payment method");
    if (invoiceItems.length === 0) return alert("Add at least one product");

    const invoiceData = {
      customer: selectedCustomer,
      invoice_number: `INV-${Math.floor(Math.random() * 100000)}`,
      invoice_date: new Date().toISOString().split("T")[0],
      due_date: new Date().toISOString().split("T")[0],
      subtotal: subtotal,
      tax: tax,
      total_amount: totalAmount,
      payment_method: paymentMethod,
      status: paymentMethod === "credit" ? "unpaid" : "paid", // <-- Add this line
      notes: notes,
      items: invoiceItems.map((item) => ({
        product: item.product,
        unit_price: item.unit_price,
        quantity: item.quantity,
        total: item.total,
      })),
    };

    try {
      const res = await fetch(`${API_BASE}/invoice/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(invoiceData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.error(errorData);
        return alert("Failed to create invoice");
      }
      alert("Invoice created successfully!");
      // Reset form
      setInvoiceItems([]);
      setSelectedCustomer("");
      setPaymentMethod("");
      setNotes("");
    } catch (err) {
      console.error(err);
      alert("Error creating invoice");
    }
  };

  const handleProceedPayment = async () => {
    if (!selectedCustomer) return alert("Select or add a customer first");
    if (!paymentMethod) return alert("Select a payment method");
    if (invoiceItems.length === 0) return alert("Add at least one product");

    const invoiceData = {
      customer:
        typeof selectedCustomer === "object"
          ? selectedCustomer.id
          : selectedCustomer,
      invoice_number: `INV-${Math.floor(Math.random() * 100000)}`,
      invoice_date: new Date().toISOString().split("T")[0],
      due_date: new Date().toISOString().split("T")[0],
      subtotal,
      tax,
      total_amount: totalAmount,
      payment_method: paymentMethod,
      status: paymentMethod === "credit" ? "unpaid" : "paid", // <-- Add this line
      notes,
      items: invoiceItems.map((item) => ({
        product: item.product,
        unit_price: item.unit_price,
        quantity: item.quantity,
        total: item.total,
      })),
      export_pdf: true,
    };

    try {
      const token = localStorage.getItem("access");
      const res = await fetch(`${API_BASE}/invoice/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(invoiceData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error(errorData);
        return alert("Failed to create invoice");
      }

      const invoice = await res.json();

      // Call backend PDF generation
      const pdfRes = await fetch(
        `${API_BASE}/invoice/${invoice.id}/generate_pdf/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!pdfRes.ok) {
        console.error("PDF generation failed", await pdfRes.json());
        return alert("Invoice created but PDF generation failed");
      }

      const pdfData = await pdfRes.json();
      console.log("PDF URL:", pdfData.pdf_url);

      // Redirect to invoice detail page
      router.push(`/invoice/${invoice.id}`);
    } catch (err) {
      console.error(err);
      alert("Error creating invoice");
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">
              Create New Invoice
            </h1>
            <p className="text-indigo-100 mt-1">
              Generate professional invoices with ease
            </p>
          </div>

          <div className="p-6">
            <form>
              {/* Customer Section */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Customer Information
                </h2>
                <div className="flex items-center space-x-4 mb-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="customerType"
                      value="existing"
                      checked={customerType === "existing"}
                      onChange={() => toggleCustomerForm("existing")}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Select Existing Customer
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="customerType"
                      value="new"
                      checked={customerType === "new"}
                      onChange={() => toggleCustomerForm("new")}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Add New Customer
                    </span>
                  </label>
                </div>

                {customerType === "existing" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Customer
                    </label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={selectedCustomer}
                      onChange={(e) => setSelectedCustomer(e.target.value)}
                    >
                      <option value="">Choose a customer...</option>
                      {customers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.company_name} - {c.email}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {customerType === "new" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name *
                        </label>
                        <input
                          type="text"
                          name="company_name"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter company name"
                          value={formData.company_name}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              [e.target.name]: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Person *
                        </label>
                        <input
                          type="text"
                          name="contact_person"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter contact person name"
                          value={formData.contact_person}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              [e.target.name]: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter email address"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              [e.target.name]: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter phone number"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              [e.target.name]: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <textarea
                        rows={2}
                        name="address"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter full address"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [e.target.name]: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status *
                      </label>
                      <select
                        name="status"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [e.target.name]: e.target.value,
                          })
                        }
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="vip">VIP</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={async () => {
                        // Validate required fields
                        if (
                          !formData.company_name ||
                          !formData.contact_person ||
                          !formData.email ||
                          !formData.phone ||
                          !formData.status ||
                          !formData.address
                        ) {
                          return alert("Please fill all required fields");
                        }

                        try {
                          const token = localStorage.getItem("access");
                          const res = await fetch(`${API_BASE}/customer/`, {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify(formData),
                          });

                          if (!res.ok) {
                            const errorData = await res.json();
                            console.error("Error response:", errorData);
                            return alert(
                              "Error creating customer. Check console."
                            );
                          }

                          const data = await res.json();
                          alert("Customer created successfully!");

                          // Add customer to list & select it
                          setCustomers([...customers, data]);
                          setSelectedCustomer(data.id);
                          setCustomerType("existing");

                          // Reset form
                          setFormData({
                            company_name: "",
                            contact_person: "",
                            email: "",
                            phone: "",
                            address: "",
                            status: "active",
                          });
                        } catch (err) {
                          console.error(err);
                          alert("Error creating customer");
                        }
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
                    >
                      Save Customer
                    </button>
                  </div>
                )}
              </div>

              {/* Warning Message */}
              {warning && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 font-semibold">
                  {warning}
                </div>
              )}

              {/* Products Section */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Invoice Items
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <select
                    className="border px-3 py-2 rounded-lg"
                    value={selectedProduct}
                    onChange={handleProductChange}
                  >
                    <option value="">Select product</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} - ৳{p.unit_price} -Stock: {p.stock_qty}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={unitPrice}
                    readOnly
                    className="border px-3 py-2 rounded-lg bg-gray-100"
                  />
                  <input
                    type="number"
                    value={quantity}
                    min={1}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="border px-3 py-2 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={addProduct}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    Add
                  </button>
                </div>

                {/* Products Table */}
                <table className="w-full bg-white rounded-lg overflow-hidden shadow-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Product
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Unit Price
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Total
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceItems.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-2">{item.product_name}</td>
                        <td className="px-4 py-2">৳{item.unit_price}</td>
                        <td className="px-4 py-2">{item.quantity}</td>
                        <td className="px-4 py-2">৳{item.total}</td>
                        <td className="px-4 py-2">
                          <button
                            className="text-red-600"
                            onClick={() => removeItem(idx)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals */}
                <div className="mt-4 flex justify-end space-y-2 flex-col w-full md:w-1/3">
                  <div className="flex justify-between p-2 bg-white rounded-lg">
                    <span>Subtotal:</span>
                    <span>৳{subtotal}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white rounded-lg">
                    <span>Tax (5%):</span>
                    <span>৳{tax}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-blue-100 rounded-lg border-2 border-blue-200 font-bold">
                    <span>Total Amount:</span>
                    <span>৳{totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Payment Method
                </h2>
                <div className="flex space-x-4">
                  {["online", "offline", "credit"].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => selectPaymentMethod(method)}
                      className={`border px-4 py-2 rounded-lg ${
                        paymentMethod === method
                          ? "bg-green-200 border-green-500"
                          : ""
                      }`}
                    >
                      {method.charAt(0).toUpperCase() + method.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="mb-8">
                <label className="block mb-2 font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  rows={3}
                  className="w-full border rounded-lg px-3 py-2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Create Invoice Button */}
              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={createInvoice}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg"
                >
                  Save as Draft
                </button>

                <button
                  type="button"
                  onClick={handleProceedPayment}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg"
                >
                  Proceed & Generate PDF
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
