"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function DashboardAndReportCards() {
  const [dashboard, setDashboard] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token =
      localStorage.getItem("access") || localStorage.getItem("access_token");
    if (!token) {
      console.error("No access token found!");
      setLoading(false);
      return;
    }

    // Fetch dashboard + report in parallel
    Promise.all([
      axios.get("http://127.0.0.1:8000/api/dashboard/", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get("http://127.0.0.1:8000/api/report/", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])
      .then(([dashboardRes, reportRes]) => {
        setDashboard(dashboardRes.data);
        setReport(reportRes.data);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <p className="text-center text-gray-500 mt-10">Loading data...</p>;

  if (!dashboard && !report)
    return <p className="text-center text-red-500 mt-10">No data available.</p>;

  return (
    <div className="flex flex-col items-center gap-12 p-4">
      {/* ==== DASHBOARD SECTION ==== */}
      {dashboard && (
        <div className="w-full max-w-7xl">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
            Day to Day Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <DashboardCard
              title="Today's Revenue"
              value={`৳${dashboard.today_revenue}`}
              color="bg-gradient-to-r from-green-400 to-green-600"
            />
            <DashboardCard
              title="Today's Profit/Loss"
              value={`৳${dashboard.today_pl}`}
              color="bg-gradient-to-r from-yellow-400 to-yellow-600"
            />
            <DashboardCard
              title="GST Collected"
              value={`৳${dashboard.gst_collected}`}
              color="bg-gradient-to-r from-pink-400 to-pink-600"
            />
            <DashboardCard
              title="Items Sold"
              value={dashboard.items_sold_today}
              color="bg-gradient-to-r from-blue-400 to-blue-600"
            />
          </div>

          <div className="flex justify-center gap-6 flex-wrap mt-8">
            <div className="w-full sm:w-1/2 lg:w-1/4">
              <DashboardCard
                title="Unpaid Invoices"
                value={`৳${dashboard.unpaid_invoices}`}
                color="bg-gradient-to-r from-red-400 to-red-600"
              />
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/4">
              <DashboardCard
                title="New Customers"
                value={dashboard.new_customers}
                color="bg-gradient-to-r from-purple-400 to-purple-600"
              />
            </div>
          </div>
        </div>
      )}

      {/* ==== REPORT SECTION ==== */}
      {report && (
        <div className="w-full max-w-7xl">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
            Reports Summary
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ReportCard label="Total Invoices" value={report.total_invoices} />
            <ReportCard
              label="Total Revenue (Tk)"
              value={report.total_revenue}
            />
            <ReportCard
              label="Total Customers"
              value={report.total_customers}
            />
            <ReportCard
              label="Total Payments (Tk)"
              value={report.total_payments}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ==== Small Reusable Cards ==== */
function DashboardCard({ title, value, color }) {
  return (
    <div
      className={`${color} shadow-lg p-6 rounded-2xl transform transition-all hover:scale-105 hover:shadow-2xl text-white`}
    >
      <p className="text-sm mb-2 opacity-80">{title}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
    </div>
  );
}

function ReportCard({ label, value }) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-shadow duration-200">
      <p className="text-gray-500 font-medium">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value || 0}</p>
    </div>
  );
}
