"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import NotificationPanel from "../components/NotificationPanel";


export default function SidebarWrapper({ children }) {
  const [open, setOpen] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  

  return (
    <div className="flex flex-col min-h-screen">
      {/* Persistent Hamburger Toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center rounded-lg text-white shadow-lg focus:outline-none"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar
          open={open}
          setOpen={setOpen}
          onToggleNotifications={() => setNotifOpen(!notifOpen)}
        />

        {/* Notification Panel */}
        {notifOpen && <NotificationPanel onClose={() => setNotifOpen(false)} />}

        {/* Main Content */}
        <main
          className={`transition-all duration-300 p-6 ${
            open ? "ml-[18%] w-[82%]" : "ml-0 w-full"
          }`}
        >
          {children}
        </main>
      </div>

      {/* Page Footer */}
      <footer className="w-full bg-gray-900 text-gray-400 text-center py-1 border-t border-gray-700">
        © 2025 EasyHisab
      </footer>
    </div>
  );
}
