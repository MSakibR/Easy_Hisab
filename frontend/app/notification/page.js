"use client";

import { useState } from "react";

export default function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);

  const notifications = [
    "New message from John",
    "Your invoice is ready",
    "Password changed successfully",
  ];

  return (
    <div>
      {/* Button to toggle panel */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Notifications
      </button>

      {/* Overlay Panel */}
      {isOpen && (
        <div className="fixed top-16 right-4 w-80 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h3 className="font-bold text-gray-800">Notifications</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((note, index) => (
                <div
                  key={index}
                  className="bg-gray-100 rounded-md p-2 text-gray-700"
                >
                  {note}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No notifications</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
