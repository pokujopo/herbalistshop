import { useEffect, useState } from "react";

function AdminCreateProduct() {
  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      await fetch("https://adamherbalistapi-main-ihdtg6.free.laravel.cloud/api/logout", {
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

  const makeSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      if (name === "name") {
        updated.slug = makeSlug(value);
      }

      return updated;
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

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
      <section className="min-h-screen bg-[#f8fafc] px-4 py-8 md:px-6">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-6 rounded-3xl border border-gray-200 bg-white px-6 py-6 shadow-sm">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Create Product
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Ongeza bidhaa mpya kwenye store yako kwa muonekano wa kitaalamu.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-6">
            {/* Basic Information */}
            <div className="rounded-3xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-6 py-5">
                <h2 className="text-xl font-semibold text-gray-900">
                  Product Information
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Weka maelezo muhimu ya bidhaa yako.
                </p>
              </div>

              <div className="grid gap-5 px-6 py-6">
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Product Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Mfano: Mafuta ya Asili"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Slug
                    </label>
                    <input
                      type="text"
                      name="slug"
                      placeholder="product-slug"
                      value={form.slug}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                      required
                    />
                    <p className="mt-2 text-xs text-gray-400">
                      Hii inaandikwa automatic kutoka product name, lakini unaweza kuibadilisha.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    SKU
                  </label>
                  <input
                    type="text"
                    name="sku"
                    placeholder="SKU (optional)"
                    value={form.sku}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Short Description
                  </label>
                  <textarea
                    name="short_description"
                    placeholder="Maelezo mafupi ya bidhaa..."
                    value={form.short_description}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Full Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="Maelezo kamili ya bidhaa..."
                    value={form.description}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                    rows={6}
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="rounded-3xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-6 py-5">
                <h2 className="text-xl font-semibold text-gray-900">
                  Pricing & Inventory
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Pangilia bei, stock na category ya bidhaa.
                </p>
              </div>

              <div className="grid gap-5 px-6 py-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={form.price}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Discount Price
                  </label>
                  <input
                    type="number"
                    name="discount_price"
                    placeholder="Discount price"
                    value={form.discount_price}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    placeholder="Stock"
                    value={form.stock}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Category ID
                  </label>
                  <input
                    type="number"
                    name="category_id"
                    placeholder="Category ID"
                    value={form.category_id}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Product Image */}
            <div className="rounded-3xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-6 py-5">
                <h2 className="text-xl font-semibold text-gray-900">
                  Product Image
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Weka picha kuu ya bidhaa yako.
                </p>
              </div>

              <div className="grid gap-6 px-6 py-6 md:grid-cols-[1.2fr_0.8fr]">
                <div>
                  <label className="mb-3 block text-sm font-medium text-gray-700">
                    Upload Thumbnail
                  </label>

                  <label className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 text-center transition hover:border-green-500 hover:bg-green-50">
                    <span className="text-sm font-medium text-gray-700">
                      Click to upload image
                    </span>
                    <span className="mt-2 text-xs text-gray-400">
                      PNG, JPG, WEBP accepted
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      required
                    />
                  </label>
                </div>

                <div>
                  <p className="mb-3 text-sm font-medium text-gray-700">
                    Preview
                  </p>

                  <div className="flex min-h-[180px] items-center justify-center rounded-3xl border border-gray-200 bg-gray-50 p-4">
                    {preview ? (
                      <div className="h-48 w-full overflow-hidden rounded-2xl border bg-white">
                        <img
                          src={preview}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">No image selected</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Product Status */}
            <div className="rounded-3xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-6 py-5">
                <h2 className="text-xl font-semibold text-gray-900">
                  Product Status
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Chagua jinsi bidhaa itaonekana kwenye store.
                </p>
              </div>

              <div className="grid gap-4 px-6 py-6 md:grid-cols-2 xl:grid-cols-4">
                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 transition hover:border-green-500 hover:bg-green-50">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={form.is_featured}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Featured</p>
                    <p className="text-xs text-gray-500">Ionekane kama bidhaa maalum</p>
                  </div>
                </label>

                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 transition hover:border-green-500 hover:bg-green-50">
                  <input
                    type="checkbox"
                    name="is_best_seller"
                    checked={form.is_best_seller}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Best Seller</p>
                    <p className="text-xs text-gray-500">Ionyeshwe kwenye bidhaa maarufu</p>
                  </div>
                </label>

                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 transition hover:border-green-500 hover:bg-green-50">
                  <input
                    type="checkbox"
                    name="is_new"
                    checked={form.is_new}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">New</p>
                    <p className="text-xs text-gray-500">Ionekane kama bidhaa mpya</p>
                  </div>
                </label>

                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 transition hover:border-green-500 hover:bg-green-50">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={form.is_active}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Active</p>
                    <p className="text-xs text-gray-500">Bidhaa ionekane kwa wateja</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit */}
            <div className="flex flex-col gap-3 rounded-3xl border border-gray-200 bg-white px-6 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  Ready to publish?
                </h3>
                <p className="text-sm text-gray-500">
                  Hakikisha taarifa zote zimejazwa vizuri kabla ya kusave.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-2xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Uploading..." : "Create Product"}
              </button>
            </div>
          </form>
        </div>
      </section>

      <button
        onClick={handleLogout}
        className="hidden bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}

export default AdminCreateProduct;
