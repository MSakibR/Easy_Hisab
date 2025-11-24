"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import DashboardAndReportCards from "../../components/DashboardAndReportCards";
import QuickActionButtons from "../../components/QuickActionButtons";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    company_name: "",
    profile_picture: null, // <-- add this
  });

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("access");
      const res = await axios.get("http://localhost:8000/api/me/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setFormData({ ...res.data, profile_picture: null });
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("access");

      const formPayload = new FormData();
      for (const key in formData) {
        if (formData[key] !== null) {
          formPayload.append(key, formData[key]);
        }
      }

      await axios.put("http://localhost:8000/api/me/update/", formPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Refresh user
      fetchUser();
      setShowEdit(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update profile");
    }
  };


  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!user) return <p className="text-center mt-10">No user data</p>;

  const initials =
    (user.first_name ? user.first_name[0] : "") +
    (user.last_name ? user.last_name[0] : "");

  return (
    <div className="bg-gray-50 min-h-screen p-0">
      {/* ===== Header ===== */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-6 shadow-lg rounded-lg mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Profile</h1>
          <p className="text-blue-100 mt-1">
            Manage your account settings and preferences
          </p>
        </div>
        <button
          onClick={() => setShowEdit(true)}
          className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors shadow-lg"
        >
          Edit Profile
        </button>
      </div>

      {/* ===== Layout Grid ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto items-stretch">
        {/* ===== Left: Profile Card with Personal Info ===== */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition flex flex-col items-center justify-between h-full">
            {/* Avatar */}
            <div>
              <div
                className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden flex items-center justify-center text-white text-4xl font-bold"
                style={{
                  background:
                    formData.profile_picture || user.profile_picture
                      ? "transparent"
                      : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              >
                {formData.profile_picture ? (
                  <img
                    src={URL.createObjectURL(formData.profile_picture)}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : user.profile_picture ? (
                  <img
                    src={`http://localhost:8000${user.profile_picture}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {user.company_name || "No Company Name"}
              </h2>
              <p className="text-gray-600 mb-2">{user.email}</p>

              <div className="flex justify-center gap-2 mb-6">
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  Active
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  Verified
                </span>
              </div>
            </div>

            {/* Personal Info (moved inside) */}
            <div className="w-full max-w-2xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center border-t pt-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <InfoField label="First Name" value={user.first_name} />
                <InfoField label="Last Name" value={user.last_name} />
                <InfoField label="Email" value={user.email} />
                <InfoField label="Phone" value={user.phone_number || "N/A"} />
                <InfoField
                  label="Company"
                  value={user.company_name || "N/A"}
                  full
                />
              </div>
            </div>
          </div>
        </div>

        {/* ===== Right: Dashboard & Report Cards (centered vertically) ===== */}
        <div className="flex flex-col justify-center items-stretch space-y-6">
          <RightCard
            title="Dashboard"
            description="View business insights and analytics."
            link="/dashboard"
            color="from-green-400 to-green-600"
          />
          <RightCard
            title="Reports"
            description="Track all payments and invoices."
            link="/reports"
            color="from-blue-400 to-blue-600"
          />
        </div>
      </div>

      {/* ===== Edit Overlay ===== */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Edit Profile
            </h2>
            <div className="space-y-4">
              {Object.keys(formData).map((key) => {
                // Skip profile_picture for now, we'll add it separately
                if (key === "profile_picture") return null;

                return (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-600 mb-1 capitalize">
                      {key.replace("_", " ")}
                    </label>
                    <input
                      type="text"
                      value={formData[key] || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, [key]: e.target.value })
                      }
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                );
              })}

              {/* ===== Profile Picture Upload ===== */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      profile_picture: e.target.files[0],
                    })
                  }
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEdit(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="m-5">
        <DashboardAndReportCards />

        {/* Horizontal line */}
        <div className="my-6">
          <hr className="border-t-2 border-gray-300" />
        </div>

        <QuickActionButtons />
      </div>
    </div>
  );
}

/* ===== Info Field Component ===== */
function InfoField({ label, value, full = false }) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className="text-lg font-semibold text-gray-900">{value}</p>
    </div>
  );
}

/* ===== Right Card Component ===== */
function RightCard({ title, description, link, color }) {
  return (
    <a
      href={link}
      className={`block bg-gradient-to-r ${color} text-white p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition`}
    >
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm opacity-90">{description}</p>
    </a>
  );
}
