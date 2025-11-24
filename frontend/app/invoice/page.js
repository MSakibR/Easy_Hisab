"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function InvoicePage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [unpaidInvoices, setUnpaidInvoices] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const invoicesPerPage = 15;
  const [searchQuery, setSearchQuery] = useState("");

  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = invoices.slice(
    indexOfFirstInvoice,
    indexOfLastInvoice
  );
  const totalPages = Math.ceil(invoices.length / invoicesPerPage);


  const API_BASE = "http://127.0.0.1:8000/api";
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access") : null;

  // ✅ Fetch invoices
  useEffect(() => {
    if (!token) return;
    fetchInvoices();
    fetchUnpaidInvoices(); 
  }, [token]);

  async function fetchInvoices(searchQuery = "") {
    try {
      let url = `${API_BASE}/invoice/`;
      if (searchQuery) {
        url += `?search=${encodeURIComponent(searchQuery)}`;
      }

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setInvoices(data);
    } catch (err) {
      console.error("Error fetching invoices", err);
    } finally {
      setLoading(false);
    }
  }


  async function deleteInvoice(id) {
    if (!confirm("Are you sure you want to delete this invoice?")) return;
    await fetch(`${API_BASE}/invoice/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchInvoices();
  }

  async function viewInvoice(id) {
    try {
      const res = await fetch(`${API_BASE}/invoice/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSelectedInvoice(data);
    } catch (err) {
      console.error("Error fetching invoice details", err);
    }
  }

  async function fetchUnpaidInvoices() {
    try {
      const res = await fetch(`${API_BASE}/invoice/?status=unpaid`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUnpaidInvoices(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function markAsPaid(id) {
    try {
      const res = await fetch(`${API_BASE}/invoice/${id}/mark_paid/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to mark as paid");

      // Refresh data
      fetchInvoices();
      fetchUnpaidInvoices();
    } catch (err) {
      console.error(err);
    }
  }



  function closeModal() {
    setSelectedInvoice(null);
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "paid":
        return "status-paid";
      case "pending":
        return "status-pending";
      case "overdue":
        return "status-overdue";
      default:
        return "status-draft";
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* ✅ Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Invoice Management</h1>
            <p className="text-blue-100 mt-1 text-sm">
              Manage and track your invoices easily
            </p>
          </div>
          <div>
            <Link href="/invoice_create">
              <button className="bg-white text-blue-700 px-6 py-2 rounded-lg font-semibold shadow hover:shadow-md hover:bg-blue-50 transition-all duration-200">
                + New Invoice
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Unpaid invoices dropdown form */}
      <div className="flex flex-col md:flex-row md:items-start gap-4 mb-6">
        {/* Unpaid Invoices dropdown */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (selectedInvoiceId) markAsPaid(selectedInvoiceId);
          }}
          className="bg-yellow-50 p-6 rounded-xl shadow flex-1 flex flex-col gap-4"
        >
          <label className="font-semibold text-gray-700">
            Select Unpaid Invoice:
          </label>
          <select
            value={selectedInvoiceId}
            onChange={(e) => setSelectedInvoiceId(e.target.value)}
            className="border px-4 py-3 rounded w-full text-gray-800 text-sm"
          >
            <option value="">-- Select Invoice --</option>
            {unpaidInvoices.map((inv) => (
              <option key={inv.id} value={inv.id}>
                #{inv.invoice_number} | {inv.customer_info.company_name} |{" "}
                {inv.customer_info.contact_person} | ৳{inv.total_amount}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 w-full md:w-auto"
          >
            Mark as Paid
          </button>
        </form>

        {/* Search bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchInvoices(searchQuery);
          }}
          className="bg-yellow-50 p-6 rounded-xl shadow flex-1 flex flex-col gap-4"
        >
          <label className="font-semibold text-gray-700">
            Search Invoices:
          </label>

          <input
            type="text"
            placeholder="Search by invoice or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border px-4 py-3 rounded w-full text-gray-800 text-sm"
          />

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
            >
              Search
            </button>

            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                fetchInvoices("");
              }}
              className="flex-1 bg-gray-400 text-white px-6 py-3 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* ✅ Main content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <p className="p-6 text-gray-500 text-center">Loading invoices...</p>
          ) : invoices.length === 0 ? (
            <p className="p-6 text-gray-400 text-center">
              No invoices found. Click{" "}
              <span className="font-semibold">+ New Invoice</span> to create
              one.
            </p>
          ) : (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-blue-500 text-white">
                  <tr>
                    <th className="p-3 text-left">Invoice #</th>
                    <th className="p-3 text-left">Customer</th>
                    <th className="p-3 text-left">Issue Date</th>
                    <th className="p-3 text-left">Due Date</th>
                    <th className="p-3 text-left">Amount</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {currentInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-gray-50">
                      <td className="p-3 font-medium text-gray-800">
                        {inv.invoice_number}
                      </td>
                      <td className="p-3 text-gray-700">
                        {inv.customer_info.contact_person}
                      </td>
                      <td className="p-3 text-gray-600">{inv.invoice_date}</td>
                      <td className="p-3 text-gray-600">{inv.due_date}</td>
                      <td className="p-3 font-semibold text-blue-600">
                        ৳{inv.total_amount}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 font-bold text-xs rounded-full ${
                            inv.status === "paid"
                              ? "bg-green-500 text-white"
                              : inv.status === "unpaid"
                              ? "bg-red-500 text-white"
                              : "bg-gray-400 text-white"
                          }`}
                        >
                          {inv.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 flex gap-2">
                        <button
                          onClick={() => viewInvoice(inv.id)}
                          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                        >
                          View
                        </button>
                        <button
                          onClick={() => deleteInvoice(inv.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex justify-center mt-4 space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  Previous
                </button>

                <span className="px-4 py-2">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* ✅ Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 relative animate-fadeIn">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-lg"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Invoice #{selectedInvoice.invoice_number}
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
              <p>
                <strong>Customer:</strong> {selectedInvoice.customer}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusClass(
                    selectedInvoice.status
                  )}`}
                >
                  {selectedInvoice.status}
                </span>
              </p>
              <p>
                <strong>Issue Date:</strong> {selectedInvoice.invoice_date}
              </p>
              <p>
                <strong>Due Date:</strong> {selectedInvoice.due_date}
              </p>
              <p>
                <strong>Total:</strong> ৳{selectedInvoice.total_amount}
              </p>
            </div>

            <h4 className="mt-6 mb-2 text-lg font-semibold text-gray-800">
              Items
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase">
                      Product
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase">
                      Quantity
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase">
                      Unit Price
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {selectedInvoice.items.map((i) => (
                    <tr key={i.id}>
                      <td className="px-4 py-2">{i.product_name || "N/A"}</td>
                      <td className="px-4 py-2">{i.quantity}</td>
                      <td className="px-4 py-2">৳{i.unit_price}</td>
                      <td className="px-4 py-2 font-semibold">
                        ৳{selectedInvoice.total_amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
