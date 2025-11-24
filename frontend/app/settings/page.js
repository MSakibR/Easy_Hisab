"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import DashboardAndReportCards from "../../components/DashboardAndReportCards";
import QuickActionButtons from "../../components/QuickActionButtons";

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("access") : null;

  useEffect(() => {
    if (!token) return;

    axios
      .get("http://127.0.0.1:8000/api/settings/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data.user);
        setSettings(res.data.settings);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setSettings((prev) => ({ ...prev, [name]: checked }));
    } else if (
      [
        "first_name",
        "last_name",
        "email",
        "phone_number",
        "company_name",
        "address",
      ].includes(name)
    ) {
      setUser((prev) => ({ ...prev, [name]: value }));
    } else {
      setSettings((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    try {
      await axios.put(
        "http://127.0.0.1:8000/api/settings/",
        { ...user, ...settings },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Settings saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Loading settings...</p>
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-6 shadow-lg rounded-lg mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-blue-100 mt-1">
          Manage your account, preferences, and system settings
        </p>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* Left Column: User Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="First Name"
                name="first_name"
                value={user.first_name}
                onChange={handleChange}
              />
              <InputField
                label="Last Name"
                name="last_name"
                value={user.last_name}
                onChange={handleChange}
              />
              <InputField
                label="Email"
                name="email"
                value={user.email}
                onChange={handleChange}
              />
              <InputField
                label="Phone"
                name="phone_number"
                value={user.phone_number || ""}
                onChange={handleChange}
              />
              <InputField
                label="Company"
                name="company_name"
                value={user.company_name || ""}
                onChange={handleChange}
              />
              <InputField
                label="Address"
                name="address"
                value={user.address || ""}
                onChange={handleChange}
                full
              />
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              Notification Preferences
            </h2>
            <ToggleField
              label="Email Notifications"
              name="notification_email"
              checked={settings.notification_email}
              onChange={handleChange}
            />
            <ToggleField
              label="SMS Notifications"
              name="notification_sms"
              checked={settings.notification_sms}
              onChange={handleChange}
            />
          </div>

          {/* System Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">System Settings</h2>
            <ToggleField
              label="Dark Mode"
              name="dark_mode"
              checked={settings.dark_mode}
              onChange={handleChange}
            />
            <div className="mt-4">
              <label className="block mb-2 font-medium">
                Auto Backup Frequency
              </label>
              <select
                name="auto_backup_frequency"
                value={settings.auto_backup_frequency || "weekly"}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Actions / Info Cards */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
            <p className="text-gray-500 mb-4">Access Dashboard and Reports</p>
            <a
              href="/dashboard"
              className="block bg-green-500 text-white py-2 rounded-lg mb-2 hover:bg-green-600 transition"
            >
              Dashboard
            </a>
            <a
              href="/reports"
              className="block bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Reports
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Day to Day Summary</h3>
            <p className="text-gray-500 mb-4">
              View quick analytics of your account
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="max-w-7xl mx-auto mt-6 text-right">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      {/* Quick Actions */}
      <div className="my-6">
        <hr className="border-t-2 border-gray-300 mb-6" />
        <QuickActionButtons />
      </div>
    </div>
  );
}

// Input field component
function InputField({ label, name, value, onChange, full = false }) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
      <input
        type="text"
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

// Toggle field component
function ToggleField({ label, name, checked, onChange }) {
  return (
    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg mb-3">
      <span>{label}</span>
      <input
        type="checkbox"
        name={name}
        checked={checked || false}
        onChange={onChange}
        className="w-5 h-5 accent-blue-600"
      />
    </div>
  );
}
