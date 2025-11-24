"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function InvoiceDetailPage() {
  const params = useParams();
  const invoiceId = params.id;
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showShare, setShowShare] = useState(false);


  const API_BASE = "http://127.0.0.1:8000/api";
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access") : null;

  useEffect(() => {
    if (!token) return;

    const fetchInvoice = async () => {
      try {
        const res = await fetch(`${API_BASE}/invoice/${invoiceId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch invoice");

        const data = await res.json();
        setInvoice(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceId, token]);

  if (loading) return <div className="p-6">Loading invoice...</div>;
  if (!invoice)
    return <div className="p-6 text-red-600">Invoice not found!</div>;

  return (
    <div className="bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl relative print-full">
        {/* PAID Watermark */}
        {invoice.status.toLowerCase() === "paid" && (
          <div className="paid-stamp absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-[-15deg] border-4 border-green-500 text-green-500 text-4xl font-bold bg-green-100/20 rounded-lg z-10">
            PAID
          </div>
        )}
        {invoice.status.toLowerCase() === "unpaid" && (
          <div className="unpaid-stamp absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-[-15deg] border-4 border-red-500 text-red-500 text-4xl font-bold bg-red-100/20 rounded-lg z-10">
            UNPAID
          </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-8">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {invoice.user?.username?.charAt(0).toUpperCase() || "Y"}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  {invoice.user_info.company_name && (
                    <p>{invoice.user_info.company_name}</p>
                  )}
                </h1>
                <p className="text-green-100 mt-1">{invoice.notes || ""}</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold">INVOICE</h2>
              {invoice.status.toLowerCase() === "paid" && (
                <div className="mt-2 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm">
                  ✓ PAID
                </div>
              )}
              {invoice.status.toLowerCase() === "unpaid" && (
                <div className="mt-2 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm">
                  ✗ UNPAID
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-8 relative z-0">
          {/* Company and Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* FROM - Logged-in user */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b-2 border-green-600 pb-1">
                FROM
              </h3>
              <div className="space-y-1 text-gray-700">
                <p className="font-semibold text-lg">
                  {invoice.user_info.username}
                </p>
                {invoice.user_info.company_name && (
                  <p>{invoice.user_info.company_name}</p>
                )}
                {invoice.user_info.email && <p>📧 {invoice.user_info.email}</p>}
                {invoice.user_info.phone_number && (
                  <p>📞 {invoice.user_info.phone_number}</p>
                )}
              </div>
            </div>

            {/* BILL TO - Customer */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b-2 border-green-600 pb-1">
                BILL TO
              </h3>
              <div className="space-y-1 text-gray-700">
                <p className="font-semibold text-lg">
                  {invoice.customer_info.contact_person}
                </p>
                {invoice.customer_info.company_name && (
                  <p>{invoice.customer_info.company_name}</p>
                )}
                {invoice.customer_info.address && (
                  <p>{invoice.customer_info.address}</p>
                )}
                {invoice.customer_info.email && (
                  <p>📧 {invoice.customer_info.email}</p>
                )}
                {invoice.customer_info.phone && (
                  <p>📞 {invoice.customer_info.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Invoice Meta */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Invoice Number
              </p>
              <p className="text-lg font-bold text-gray-900">
                {invoice.invoice_number}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Invoice Date</p>
              <p className="text-lg font-semibold text-gray-900">
                {invoice.invoice_date}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Due Date</p>
              <p className="text-lg font-semibold text-gray-900">
                {invoice.due_date}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Status</p>
              <p
                className={`text-lg font-bold ${
                  invoice.status.toLowerCase() === "paid"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {invoice.status.toUpperCase()}
              </p>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Invoice Items
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-green-600 text-white">
                    <th className="border border-green-700 px-4 py-3 text-left font-semibold">
                      Description
                    </th>
                    <th className="border border-green-700 px-4 py-3 text-center font-semibold">
                      Qty
                    </th>
                    <th className="border border-green-700 px-4 py-3 text-right font-semibold">
                      Unit Price
                    </th>
                    <th className="border border-green-700 px-4 py-3 text-right font-semibold">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-200 hover:bg-green-50"
                    >
                      <td className="border border-gray-300 px-4 py-3 font-semibold text-gray-900">
                        {item.product_name || item.product}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        {item.quantity}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-right">
                        ৳{item.unit_price}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-right font-semibold">
                        ৳{item.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-full md:w-1/2 lg:w-1/3 space-y-2">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="font-medium text-gray-700">Subtotal:</span>
                <span className="font-semibold text-gray-900">
                  ৳{invoice.subtotal}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="font-medium text-gray-700">Tax:</span>
                <span className="font-semibold text-gray-900">
                  ৳{invoice.tax}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 bg-green-600 text-white px-4 rounded-lg">
                <span className="font-bold text-lg">Total Amount:</span>
                <span className="font-bold text-xl">
                  ৳{invoice.total_amount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-green-800 text-white p-6 text-center">
          <p className="text-sm">
            This invoice has been {invoice.status.toUpperCase()}. Thank you for
            your business!
          </p>
          <p className="text-xs mt-2 text-green-200">
            Payment Confirmed: {invoice.payment_date || "N/A"} | Invoice #
            {invoice.invoice_number}
          </p>
        </div>
      </div>

      {/* Floating Share Button */}
      <div>
        {/* Floating Share Icon */}
        <button
          onClick={() => setShowShare(!showShare)}
          className="fixed bottom-6 right-6 bg-green-700 hover:bg-green-800 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-xl z-50 transition-all duration-300"
        >
          {/* System Share Icon (like macOS/iOS) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-7 h-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 10v8a2 2 0 002 2h6a2 2 0 002-2v-8m-5-6v10m0-10l-3 3m3-3l3 3"
            />
          </svg>
        </button>

        {/* Slide-in Share Sidebar (Center Right) */}
        <div
          className={`fixed right-4 top-1/2 transform -translate-y-1/2 flex flex-col items-center gap-6 transition-all duration-500 z-40 ${
            showShare ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
          }`}
        >
          {/* Close Button */}
          <button
            onClick={() => setShowShare(false)}
            className="absolute top-[-50px] left-0 bg-red-500 hover:bg-red-600 text-white text-xl rounded-full w-10 h-10 flex items-center justify-center shadow-md"
          >
            ✕
          </button>

          {/* WhatsApp */}
          <button
            onClick={() =>
              window.open(
                `https://wa.me/?text=${encodeURIComponent(
                  window.location.href
                )}`,
                "_blank"
              )
            }
            className="flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-full w-48 justify-center shadow-md"
          >
            <img
              src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/whatsapp.svg"
              alt="WhatsApp"
              className="w-6 h-6"
            />
            <span className="font-medium">WhatsApp</span>
          </button>

          {/* Email */}
          <button
            onClick={() =>
              (window.location.href = `mailto:?subject=Invoice&body=${encodeURIComponent(
                window.location.href
              )}`)
            }
            className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-full w-48 justify-center shadow-md"
          >
            <img
              src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/gmail.svg"
              alt="Email"
              className="w-6 h-6"
            />
            <span className="font-medium">Email</span>
          </button>

          {/* Copy Link */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Invoice link copied to clipboard!");
            }}
            className="flex items-center gap-3 bg-gray-700 hover:bg-gray-800 text-white px-5 py-3 rounded-full w-48 justify-center shadow-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 16h8M8 12h8m-5 8h5a2 2 0 002-2V8m-2-2H8a2 2 0 00-2 2v12a2 2 0 002 2h8"
              />
            </svg>
            <span className="font-medium">Copy Link</span>
          </button>
        </div>
      </div>
    </div>
  );
}
