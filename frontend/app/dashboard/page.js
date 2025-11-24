"use client";

import { useEffect, useState } from "react";
import QuickActionButtons from "../../components/QuickActionButtons";
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

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      console.error("No access token found!");
      setLoading(false);
      return;
    }

    axios
      .get("http://127.0.0.1:8000/api/dashboard/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setDashboard(res.data);
      })
      .catch((err) => {
        console.error("Error fetching dashboard data:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <p className="text-center text-gray-500 mt-20">Loading dashboard...</p>
    );
  if (!dashboard)
    return <p className="text-center text-red-500 mt-20">No data available.</p>;

  return (
    <div className="p-8 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
        📊 Business Dashboard
        <span className="animate-pulse text-indigo-500">•</span>
      </h1>

      {/* ==== CARDS SECTION ==== */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
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
      {/* ==== LAST TWO CARDS CENTERED ==== */}
      <div className="flex justify-center gap-6 mb-10 flex-wrap">
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

      {/* ==== CHARTS SECTION ==== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard
          title="Best Selling Products"
          chart={
            <Bar
              data={{
                labels: dashboard.best_selling_products.labels,
                datasets: [
                  {
                    label: "Units Sold",
                    data: dashboard.best_selling_products.data,
                    backgroundColor: [
                      "#6366F1",
                      "#EC4899",
                      "#FACC15",
                      "#34D399",
                      "#F87171",
                    ],
                    borderRadius: 8,
                  },
                ],
              }}
              options={{
                plugins: { legend: { display: false } },
                responsive: true,
              }}
            />
          }
        />

        <ChartCard
          title="Monthly Revenue"
          chart={
            <Line
              data={{
                labels: dashboard.monthly_revenue.labels,
                datasets: [
                  {
                    label: "Revenue (৳)",
                    data: dashboard.monthly_revenue.data,
                    borderColor: "#6366F1",
                    backgroundColor: "rgba(99,102,241,0.2)",
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: "#6366F1",
                    pointBorderColor: "#fff",
                    pointHoverRadius: 6,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
              }}
            />
          }
        />

        <ChartCard
          title="Daily Sales Volume"
          chart={
            <Line
              data={{
                labels: dashboard.daily_sales_volume.labels,
                datasets: [
                  {
                    label: "Sales (৳)",
                    data: dashboard.daily_sales_volume.data,
                    borderColor: "#EC4899",
                    backgroundColor: "rgba(236,72,153,0.2)",
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: "#EC4899",
                    pointBorderColor: "#fff",
                    pointHoverRadius: 6,
                  },
                ],
              }}
              options={{ responsive: true }}
            />
          }
        />

        <ChartCard
          title="Customer Growth"
          chart={
            <Doughnut
              data={{
                labels: dashboard.customer_growth.labels,
                datasets: [
                  {
                    label: "Customers",
                    data: dashboard.customer_growth.data,
                    backgroundColor: [
                      "#6366F1",
                      "#EC4899",
                      "#FACC15",
                      "#34D399",
                      "#F87171",
                    ],
                    hoverOffset: 10,
                  },
                ],
              }}
              options={{ responsive: true }}
            />
          }
        />
      </div>

      <p className="text-right text-gray-500 text-sm mt-6">
        Last Updated: {new Date(dashboard.last_updated).toLocaleString()}
      </p>
      <QuickActionButtons />
    </div>
  );

  // ==== Reusable Components ====
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

  function ChartCard({ title, chart }) {
    return (
      <div className="bg-white p-5 rounded-2xl shadow-lg hover:shadow-2xl transition-all border-t-4 border-indigo-500">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">{title}</h3>
        {chart}
      </div>
    );
  }
  
}