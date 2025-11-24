"use client";

import { useEffect, useState } from "react";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

 // Now calculate pagination
  const indexOfLastCustomer = currentPage * itemsPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - itemsPerPage;
  const currentCustomers = customers.slice(
   indexOfFirstCustomer,
   indexOfLastCustomer
  );

 // Total pages
  const totalPages = Math.ceil(customers.length / itemsPerPage);


  const [formData, setFormData] = useState({
    company_name: "",
    contact_person: "",
    email: "",
    phone: "",
    address: "",
    status: "active",
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch customers
  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers(query = "", page = 1) {
    setLoading(true);
    try {
      const token = localStorage.getItem("access");
      if (!token) return;

      const url = query
        ? `http://127.0.0.1:8000/api/customer/?search=${query}&page=${page}`
        : `http://127.0.0.1:8000/api/customer/?page=${page}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load customers", err);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }


  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCustomers(searchQuery);
  };

  async function addCustomer(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access");
      if (!token) return;

      const method = formData.id ? "PUT" : "POST";
      const url = formData.id
        ? `http://127.0.0.1:8000/api/customer/${formData.id}/`
        : "http://127.0.0.1:8000/api/customer/";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error response:", errorData);
        throw new Error("Failed to save customer");
      }

      setShowAddForm(false);
      setFormData({
        company_name: "",
        contact_person: "",
        email: "",
        phone: "",
        address: "",
        status: "active",
      });
      fetchCustomers();
    } catch (err) {
      console.error(err);
      alert("Error saving customer.");
    }
  }

  const deleteCustomer = async (id) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;
    try {
      const token = localStorage.getItem("access");
      const res = await fetch(`http://127.0.0.1:8000/api/customer/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchCustomers();
    } catch (err) {
      console.error(err);
    }
  };

  const editCustomer = (cust) => {
    setFormData({ ...cust });
    setShowAddForm(true);
  };

  const formatCurrency = (amount) =>
    "৳" + Number(amount || 0).toLocaleString("en-BD");

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: "status-active",
      inactive: "status-inactive",
      vip: "status-vip",
      pending: "status-pending",
    };
    const statusText = {
      active: "Active",
      inactive: "Inactive",
      vip: "VIP",
      pending: "Pending",
    };
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          statusClasses[status] || "status-pending"
        }`}
      >
        {statusText[status] || status}
      </span>
    );
  };

  const viewCustomer = async (id) => {
    try {
      const token = localStorage.getItem("access");
      const res = await fetch(`http://127.0.0.1:8000/api/customer/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSelectedCustomer(data);
    } catch (err) {
      console.error(err);
    }
  };

  const closeModal = () => setSelectedCustomer(null);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="gradient-bg text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Customer Management</h1>
            <p className="text-blue-100 mt-1">
              Manage customer information and status
            </p>
          </div>
          <button
            onClick={() => {
              setFormData({
                company_name: "",
                contact_person: "",
                email: "",
                phone: "",
                address: "",
                status: "active",
              });
              setShowAddForm(true);
            }}
            className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200"
          >
            + Add Customer
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-4">
        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="flex gap-3 items-center justify-between"
        >
          <input
            type="text"
            placeholder="Search by company or contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 p-3 border rounded shadow-sm"
          />

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
            >
              Search
            </button>

            <button
              type="button" // important: not "submit"
              onClick={() => {
                setSearchQuery(""); // clear input
                fetchCustomers(); // reset results (call your fetch function)
              }}
              className="bg-gray-400 text-white px-6 py-3 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Customer Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {loading ? (
              <p className="p-6 text-gray-600">Loading customers...</p>
            ) : (
              <table className="w-full">
                <thead className="bg-blue-500 text-white">
                  <tr>
                    <th className="p-3 text-left">#</th>
                    <th className="p-3 text-left">Company</th>
                    <th className="p-3 text-left">Contact</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Phone</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {currentCustomers.map((cust, index) => (
                    <tr key={cust.id} className="hover:bg-gray-50">
                      <td className="p-3 font-medium text-gray-800">
                        {index + 1}
                      </td>
                      <td className="p-3 font-medium text-gray-800">
                        {cust.company_name}
                      </td>
                      <td className="p-3 text-gray-700">
                        {cust.contact_person}
                      </td>
                      <td className="p-3 text-gray-700">{cust.email}</td>
                      <td className="p-3 text-gray-700">{cust.phone}</td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full font-bold text-xs ${
                            cust.status === "active"
                              ? "bg-green-100 text-green-700 shadow-sm"
                              : cust.status === "inactive"
                              ? "bg-red-100 text-red-700 shadow-sm"
                              : "bg-yellow-100 text-yellow-700 shadow-sm"
                          } transition-all duration-200 hover:scale-105`}
                        >
                          {cust.status.toUpperCase()}
                        </span>
                      </td>

                      <td className="p-3 flex gap-2">
                        <button
                          onClick={() => viewCustomer(cust.id)}
                          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                        >
                          View
                        </button>
                        <button
                          onClick={() => editCustomer(cust)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteCustomer(cust.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Pagination */}
            <div className="flex justify-center mt-4 space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Previous
              </button>

              <span className="px-4 py-2 text-gray-700">
                Page {currentPage} of {totalPages || 1}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedCustomer.company_name} - Details
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                ✖
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <p>
                <strong>Contact:</strong> {selectedCustomer.contact_person}
              </p>
              <p>
                <strong>Email:</strong> {selectedCustomer.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedCustomer.phone}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {getStatusBadge(selectedCustomer.status)}
              </p>
              <p className="col-span-2">
                <strong>Address:</strong> {selectedCustomer.address || "N/A"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Customer Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {formData.id ? "Edit Customer" : "Add Customer"}
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✖
              </button>
            </div>
            <form onSubmit={addCustomer} className="space-y-4">
              <input
                type="text"
                name="company_name"
                placeholder="Company Name"
                value={formData.company_name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="contact_person"
                placeholder="Contact Person"
                value={formData.contact_person}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
              <textarea
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="vip">VIP</option>
                <option value="pending">Pending</option>
              </select>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                {formData.id ? "Update Customer" : "Save Customer"}
              </button>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .gradient-bg {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .status-active {
          background-color: #dcfce7;
          color: #166534;
        }
        .status-inactive {
          background-color: #fee2e2;
          color: #991b1b;
        }
        .status-vip {
          background-color: #fef3c7;
          color: #92400e;
        }
        .status-pending {
          background-color: #f3f4f6;
          color: #374151;
        }
      `}</style>
    </div>
  );
}
