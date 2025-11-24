"use client";

import { useEffect, useState } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addStockQty, setAddStockQty] = useState(0);
  const [warning, setWarning] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    unit_price: "",
    stock_qty: 0,
    status: "in_stock",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const token = localStorage.getItem("access");
      const res = await fetch("http://127.0.0.1:8000/api/product/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  }

  async function saveProduct(e) {
    e.preventDefault();
    const token = localStorage.getItem("access");

    try {
      const url = isEditing
        ? `http://127.0.0.1:8000/api/product/${selectedProduct.id}/`
        : "http://127.0.0.1:8000/api/product/";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save product");

      fetchProducts();
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Error saving product");
    }
  }

  function openModal(product = null) {
    setModalOpen(true);
    if (product) {
      setIsEditing(true);
      setSelectedProduct(product);
      setFormData({
        name: product.name,
        category: product.category,
        unit_price: product.unit_price,
        stock_qty: product.stock_qty,
        status: product.status,
      });
    } else {
      setIsEditing(false);
      setFormData({
        name: "",
        category: "",
        unit_price: "",
        stock_qty: 0,
        status: "in_stock",
      });
    }
  }

  function closeModal() {
    setModalOpen(false);
    setIsEditing(false);
    setSelectedProduct(null);
    setWarning("");
  }

  function openViewModal(product) {
    setSelectedProduct(product);
    setViewModalOpen(true);
  }

  function closeViewModal() {
    setViewModalOpen(false);
    setSelectedProduct(null);
  }

  async function deleteProduct(id) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const token = localStorage.getItem("access");
      const res = await fetch(`http://127.0.0.1:8000/api/product/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete product");
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Error deleting product");
    }
  }

  async function increaseStock(e) {
    e.preventDefault();
    if (!selectedProduct) {
      setWarning("Please select a product");
      return;
    }
    if (addStockQty <= 0) {
      setWarning("Enter a valid quantity");
      return;
    }

    const newQty = Number(selectedProduct.stock_qty) + Number(addStockQty);

    try {
      const token = localStorage.getItem("access");
      const res = await fetch(
        `http://127.0.0.1:8000/api/product/${selectedProduct.id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ stock_qty: newQty }),
        }
      );
      if (!res.ok) throw new Error("Failed to update stock");

      setWarning("");
      setSelectedProduct(null);
      setAddStockQty(0);
      fetchProducts();
    } catch (err) {
      console.error(err);
      setWarning("Error updating stock");
    }
  }

  const getStatusBadge = (stockQty) => {
    if (stockQty === 0)
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
          OUT OF STOCK
        </span>
      );
    if (stockQty <= 5)
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
          LOW STOCK
        </span>
      );
    return (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
        IN STOCK
      </span>
    );
  };

  // ✅ Filtered products first
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.category &&
        p.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // ✅ Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <p className="p-6">Loading products...</p>;

  return (
    <div className="max-w-7xl mx-auto p-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-500 text-white p-6 shadow-lg mb-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-blue-100 mt-1">
              Manage your products, stock, and status
            </p>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search by name or category"
              className="border p-2 rounded text-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={() => openModal()}
              className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200"
            >
              + Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Warning */}
      {warning && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 font-semibold">
          {warning}
        </div>
      )}

      {/* Add stock form */}
      <form onSubmit={increaseStock} className="mb-6 flex gap-2 items-center">
        <select
          value={selectedProduct?.id || ""}
          onChange={(e) =>
            setSelectedProduct(
              products.find((p) => p.id === parseInt(e.target.value))
            )
          }
          className="border p-2 rounded"
        >
          <option value="">Select product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} (Stock: {p.stock_qty})
            </option>
          ))}
        </select>

        <input
          type="number"
          value={addStockQty}
          onChange={(e) => setAddStockQty(Number(e.target.value))}
          placeholder="Add Quantity"
          className="border p-2 rounded w-32"
          min={1}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Stock
        </button>
      </form>

      {/* Product table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-500">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">
                Price
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">
                Stock
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">
                Date Added
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedProducts.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-gray-100 transition-colors duration-200"
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-800">
                  {product.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {product.category || "-"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-800">
                  ৳{product.unit_price}
                </td>
                <td className="px-4 py-3 text-sm text-gray-800">
                  {product.stock_qty}
                </td>
                <td className="px-4 py-3">
                  {getStatusBadge(product.stock_qty)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {new Date(product.date_added).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button
                    onClick={() => openModal(product)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => openViewModal(product)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 py-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 transition"
          >
            Previous
          </button>

          <span className="text-gray-700 font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 transition"
          >
            Next
          </button>
        </div>
      </div>

      {/* ✅ Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg relative">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? "Edit Product" : "Add Product"}
            </h2>
            <form onSubmit={saveProduct} className="grid gap-4">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Unit Price"
                value={formData.unit_price}
                onChange={(e) =>
                  setFormData({ ...formData, unit_price: e.target.value })
                }
                className="border p-2 rounded"
                required
              />
              <input
                type="number"
                placeholder="Stock Quantity"
                value={formData.stock_qty}
                onChange={(e) =>
                  setFormData({ ...formData, stock_qty: e.target.value })
                }
                className="border p-2 rounded"
                required
              />
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="border p-2 rounded"
              >
                <option value="in_stock">In Stock</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="discontinued">Discontinued</option>
              </select>

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  {isEditing ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ View Product Modal */}
      {viewModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Product Details</h2>

            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {selectedProduct.name}
              </p>
              <p>
                <strong>Category:</strong> {selectedProduct.category || "-"}
              </p>
              <p>
                <strong>Price:</strong> ৳{selectedProduct.unit_price}
              </p>
              <p>
                <strong>Stock Quantity:</strong> {selectedProduct.stock_qty}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {getStatusBadge(selectedProduct.stock_qty)}
              </p>
              <p>
                <strong>Date Added:</strong>{" "}
                {new Date(selectedProduct.date_added).toLocaleDateString()}
              </p>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={closeViewModal}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
