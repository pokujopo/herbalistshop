import { useState } from "react";

function AdminDashboard() {
  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      await fetch("http://127.0.0.1:8000/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
    } catch (error) {
      console.log("Logout error:", error);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/auth";
  };

  const [form, setForm] = useState({
    name: "",
    slug: "",
    short_description: "",
    description: "",
    price: "",
    discount_price: "",
    stock: "",
    category_id: "",
    is_featured: false,
    is_best_seller: false,
    is_new: true,
    is_active: true,
    sku: "",
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Session imeisha. Login tena.");
      window.location.href = "/auth";
      return;
    }

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (typeof value === "boolean") {
        formData.append(key, value ? "1" : "0");
      } else {
        formData.append(key, value);
      }
    });

    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    try {
      setLoading(true);

      const res = await fetch("http://127.0.0.1:8000/api/products", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      console.log("Response:", data);

      if (!res.ok) {
        alert(data.message || "Kuna tatizo.");
        return;
      }

      alert("Product created successfully 🔥");

      setForm({
        name: "",
        slug: "",
        short_description: "",
        description: "",
        price: "",
        discount_price: "",
        stock: "",
        category_id: "",
        is_featured: false,
        is_best_seller: false,
        is_new: true,
        is_active: true,
        sku: "",
      });

      setThumbnail(null);
      setPreview(null);
    } catch (error) {
      console.error(error);
      alert("Error ya network au server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="bg-gray-50 min-h-screen py-10 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold mb-6">Create Product</h2>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <input
              type="text"
              name="name"
              placeholder="Product name"
              value={form.name}
              onChange={handleChange}
              className="border rounded-lg p-3"
              required
            />

            <input
              type="text"
              name="slug"
              placeholder="product-slug"
              value={form.slug}
              onChange={handleChange}
              className="border rounded-lg p-3"
              required
            />

            <input
              type="text"
              name="sku"
              placeholder="SKU (optional)"
              value={form.sku}
              onChange={handleChange}
              className="border rounded-lg p-3"
            />

            <textarea
              name="short_description"
              placeholder="Short description"
              value={form.short_description}
              onChange={handleChange}
              className="border rounded-lg p-3"
              rows={2}
            />

            <textarea
              name="description"
              placeholder="Full description"
              value={form.description}
              onChange={handleChange}
              className="border rounded-lg p-3"
              rows={5}
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                className="border rounded-lg p-3"
                required
              />

              <input
                type="number"
                name="discount_price"
                placeholder="Discount price"
                value={form.discount_price}
                onChange={handleChange}
                className="border rounded-lg p-3"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                name="stock"
                placeholder="Stock"
                value={form.stock}
                onChange={handleChange}
                className="border rounded-lg p-3"
                required
              />

              <input
                type="number"
                name="category_id"
                placeholder="Category ID"
                value={form.category_id}
                onChange={handleChange}
                className="border rounded-lg p-3"
                required
              />
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="border rounded-lg p-3"
              required
            />

            {preview && (
              <div className="w-40 aspect-square overflow-hidden rounded-xl border">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={form.is_featured}
                  onChange={handleChange}
                />
                Featured
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_best_seller"
                  checked={form.is_best_seller}
                  onChange={handleChange}
                />
                Best Seller
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_new"
                  checked={form.is_new}
                  onChange={handleChange}
                />
                New
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleChange}
                />
                Active
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white rounded-xl py-3 font-semibold hover:bg-green-700 transition"
            >
              {loading ? "Uploading..." : "Create Product"}
            </button>
          </form>
        </div>
      </section>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}

export default AdminDashboard;