// components/QuickActionButtons.js
import Link from "next/link";

const QuickActionButtons = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        EasyHisab - Quick Actions
      </h1>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/help">
          <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition transform hover:scale-105">
            Help
          </button>
        </Link>

        <Link href="/invoice_create">
          <button className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md transition transform hover:scale-105">
            Create Invoice
          </button>
        </Link>

        <Link href="/profile">
          <button className="px-5 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow-md transition transform hover:scale-105">
            Profile
          </button>
        </Link>

        <Link href="/dashboard">
          <button className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md transition transform hover:scale-105">
            Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
};

export default QuickActionButtons;
