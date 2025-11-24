"use client";
import jsPDF from "jspdf";

export default function GenerateReportButton({ report }) {
  const handleGenerate = () => {
    if (!report) return;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Reports Summary", 10, 10);

    doc.setFontSize(14);
    doc.text(`Total Invoices: ${report.total_invoices}`, 10, 30);
    doc.text(`Total Revenue (Tk): ${report.total_revenue}`, 10, 40);
    doc.text(`Total Customers: ${report.total_customers}`, 10, 50);
    doc.text(`Total Payments (Tk): ${report.total_payments}`, 10, 60);

    doc.save("report.pdf");
  };

  return (
    <button
      onClick={handleGenerate}
      className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200"
    >
      Generate Report
    </button>
  );
}
