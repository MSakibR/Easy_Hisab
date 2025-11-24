"use client";

import { useEffect, useState } from "react";
import GenerateReportButton from "../../components/GenerateReportButton";

const API_BASE = "http://127.0.0.1:8000/api";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 15;

  const token =
    typeof window !== "undefined" ? localStorage.getItem("access") : null;

  const fetchPayments = async (query = "") => {
    if (!token) return;
    setLoading(true);
    try {
      const url = query
        ? `${API_BASE}/payment/?search=${query}`
        : `${API_BASE}/payment/`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch payments");

      const data = await res.json();
      setPayments(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [token]);

  if (loading) return <div className="p-6">Loading payments...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  // Pagination logic
  const totalPages = Math.ceil(payments.length / itemsPerPage);
  const indexOfLastPayment = currentPage * itemsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - itemsPerPage;
  const currentPayments = payments.slice(
    indexOfFirstPayment,
    indexOfLastPayment
  );

  const formatCurrency = (amount) => `৳${amount.toLocaleString()}`;

  const report = {
    total_invoices: payments.length,
    total_revenue: payments.reduce((acc, p) => acc + p.amount, 0),
    total_customers: new Set(payments.map((p) => p.customer.id)).size,
    total_payments: payments.reduce((acc, p) => acc + p.amount_paid, 0),
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              Payment History & Due Payments
            </h1>
            <p className="text-blue-100 mt-1">
              Track all payments and manage outstanding invoices
            </p>
          </div>
          <GenerateReportButton report={report} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Search bar */}
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Search by Invoice ID or Contact Person"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={() => {
              setCurrentPage(1);
              fetchPayments(searchQuery);
            }}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
          >
            Search
          </button>
          <button
            onClick={() => {
              setSearchQuery("");
              setCurrentPage(1);
              fetchPayments(); // fetch all payments
            }}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>

        {/* Payment Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issue Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-6 py-3">{payment.invoice_number}</td>
                    <td className="px-6 py-3">
                      {payment.customer_name || payment.customer_contact_person}
                    </td>
                    <td className="px-6 py-3">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-6 py-3">{payment.issue_date}</td>
                    <td className="px-6 py-3">{payment.due_date}</td>
                    <td
                      className={`px-6 py-3 rounded-lg font-semibold ${
                        payment.status === "paid"
                          ? "bg-green-100 text-green-600"
                          : payment.status === "pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : payment.status === "overdue"
                          ? "bg-red-100 text-red-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {payment.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
    </div>
  );
}
