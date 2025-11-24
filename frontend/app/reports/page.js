"use client";

import { useEffect, useState } from "react";
import QuickActionButtons from "../../components/QuickActionButtons";
import GenerateReportButton from "../../components/GenerateReportButton";
import axios from "axios";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function ReportPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token =
    localStorage.getItem("access") || localStorage.getItem("access_token");
  const API_URL = "http://127.0.0.1:8000/api/report/";

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReport(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  if (loading)
    return (
      <p className="p-6 text-center text-gray-500 font-medium">
        Loading report...
      </p>
    );
  if (error)
    return <p className="p-6 text-center text-red-500 font-medium">{error}</p>;

  return (
    <div className="p-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 shadow-lg rounded-lg mb-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Left: Title and Description */}
          <div>
            <h1 className="text-3xl font-bold">Reports</h1>
            <p className="text-blue-100 mt-1">
              Track all payments and manage outstanding invoices
            </p>
          </div>

          {/* Right: Generate Report Button */}
          <GenerateReportButton report={report} />
        </div>
      </div>

      {/* Summary Cards */}
      {report && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-shadow duration-200">
            <p className="text-gray-500 font-medium">Total Invoices</p>
            <p className="text-2xl font-bold">{report.total_invoices || 0}</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-shadow duration-200">
            <p className="text-gray-500 font-medium">Total Revenue (Tk)</p>
            <p className="text-2xl font-bold">{report.total_revenue || 0}</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-shadow duration-200">
            <p className="text-gray-500 font-medium">Total Customers</p>
            <p className="text-2xl font-bold">{report.total_customers || 0}</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-shadow duration-200">
            <p className="text-gray-500 font-medium">Total Payments (Tk)</p>
            <p className="text-2xl font-bold">{report.total_payments || 0}</p>
          </div>
        </div>
      )}

      {/* Charts */}
      {report && report.revenue_trend && report.invoice_status && (
        <div
          id="report-charts"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Revenue Trend */}
          <div className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-shadow duration-200 flex flex-col">
            <h2 className="text-xl font-semibold mb-2">Revenue Trend</h2>
            <div className="flex-1">
              <Line
                data={report.revenue_trend}
                options={{
                  responsive: true,
                  maintainAspectRatio: false, // ✅ Important
                  plugins: { legend: { position: "top" } },
                }}
                className="h-full w-full"
              />
            </div>
          </div>

          {/* Invoice Status */}
          <div className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-shadow duration-200 flex flex-col">
            <h2 className="text-xl font-semibold mb-2">Invoice Status</h2>
            <div className="flex-1">
              <Doughnut
                data={report.invoice_status}
                options={{
                  responsive: true,
                  maintainAspectRatio: false, // ✅ Important
                  plugins: { legend: { position: "top" } },
                }}
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      )}

      <div className="m-12">
        <QuickActionButtons />
      </div>
    </div>
  );
}
