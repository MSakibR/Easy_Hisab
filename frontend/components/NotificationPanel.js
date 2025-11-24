"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function NotificationPanel({ onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      console.error("No access token found!");
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:8000/api/notification/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setNotifications(res.data);
        const count = res.data.filter((n) => n.status === "unread").length;
        setUnreadCount(count);
      })
      .catch((err) => console.error("Error fetching notifications:", err))
      .finally(() => setLoading(false));
  }, []);

  const markAsRead = async (id) => {
    const token = localStorage.getItem("access");
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/notification/${id}/mark_as_read/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, status: "read" } : n))
      );
      setUnreadCount((prev) => prev - 1);
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const markAllAsRead = async () => {
    const token = localStorage.getItem("access");
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/notification/mark_all_read/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications((prev) => prev.map((n) => ({ ...n, status: "read" })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  return (
    <div className="fixed left-[18%] top-[40%] w-80 rounded-2xl border border-gray-300 shadow-lg z-50 overflow-hidden bg-white">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
        <h3 className="font-semibold text-lg flex items-center">
          Notifications
          {unreadCount > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </h3>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="hover:text-gray-200 text-white font-bold text-sm"
            >
              Mark All Read
            </button>
          )}
          <button
            onClick={onClose}
            className="hover:text-gray-200 text-white font-bold"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Notification List */}
      <div className="p-4 space-y-3 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {notifications.length > 0 ? (
          notifications.map((note) => (
            <div
              key={note.id}
              onClick={() => markAsRead(note.id)}
              className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                note.status === "unread"
                  ? "bg-yellow-100 hover:bg-green-200"
                  : "bg-gray-50 hover:bg-gray-200"
              } shadow-sm`}
            >
              <p className="text-gray-800 text-sm font-medium">
                {note.message}
              </p>
              <p className="text-gray-400 text-xs mt-1">
                {new Date(note.created_at).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm text-center">No notifications</p>
        )}
      </div>
    </div>
  );
}
