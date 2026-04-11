import { useEffect, useMemo, useState } from "react";
import adminApi from "../services/adminApi";

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    is_active: true,
  });

  const [image, setImage] = useState(null);
  const [query, setQuery] = useState("");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get("/categories");
      setCategories(res.data.data || res.data.categories || []);
    } catch (error) {
      console.log(error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    if (!query.trim()) return categories;

    const q = query.toLowerCase();
    return categories.filter(
      (item) =>
        item.name?.toLowerCase().includes(q) ||
        item.slug?.toLowerCase().includes(q)
    );
  }, [categories, query]);

  const resetForm = () => {
    setForm({
      name: "",
      slug: "",
      description: "",
      is_active: true,
    });
    setImage(null);
    setPreview(null);
    setEditingId(null);
  };

  const generateSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name || "",
      slug: item.slug || "",
      description: item.description || "",
      is_active: !!item.is_active,
    });
    setPreview(item.image || null);
    setImage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("slug", form.slug);
    formData.append("description", form.description);
    formData.append("is_active", form.is_active ? "1" : "0");

    if (image) {
      formData.append("image", image);
    }

    try {
      setSaving(true);

      if (editingId) {
        await adminApi.post(`/admin/categories/${editingId}`, formData);
        alert("Category updated successfully");
      } else {
        await adminApi.post("/admin/categories", formData);
        alert("Category created successfully");
      }

      resetForm();
      fetchCategories();
    } catch (error) {
      console.log(error.response?.data || error);
      alert(error.response?.data?.message || "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Una uhakika unataka kufuta category hii?");
    if (!ok) return;

    try {
      await adminApi.delete(`/admin/categories/${id}`);
      setCategories((prev) => prev.filter((item) => item.id !== id));
      if (editingId === id) resetForm();
      alert("Category deleted successfully");
    } catch (error) {
      console.log(error.response?.data || error);
      alert(error.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <div className="space-y-6">
      {/* FORM SECTION */}
      <div className="rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-5">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingId ? "Edit Category" : "Create Category"}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Weka taarifa za category kwa muonekano wa kitaalamu.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 px-6 py-6">
          {/* BASIC INFO */}
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Category Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Mfano: Mafuta ya Asili"
                value={form.name}
                onChange={(e) => {
                  handleChange(e);
                  if (!editingId) {
                    setForm((prev) => ({
                      ...prev,
                      slug: generateSlug(e.target.value),
                    }));
                  }
                }}
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
                placeholder="category-slug"
                value={form.slug}
                onChange={handleChange}
                className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                required
              />
              <p className="mt-2 text-xs text-gray-400">
                Slug inaandikwa automatic kutoka category name, lakini unaweza kuibadilisha.
              </p>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Andika maelezo ya category..."
              value={form.description}
              onChange={handleChange}
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
              rows={5}
            />
          </div>

          {/* IMAGE */}
          <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
            <div>
              <label className="mb-3 block text-sm font-medium text-gray-700">
                Category Image
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
                />
              </label>
            </div>

            <div>
              <p className="mb-3 text-sm font-medium text-gray-700">Preview</p>

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

          {/* STATUS */}
          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700">
              Category Status
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
                <p className="text-xs text-gray-500">
                  Category hii itaonekana kwa wateja kwenye store.
                </p>
              </div>
            </label>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Ready to save?
              </h3>
              <p className="text-sm text-gray-500">
                Hakikisha taarifa zote zimejazwa vizuri kabla ya kuendelea.
              </p>
            </div>

            <div className="flex gap-3">
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-2xl bg-gray-200 px-6 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-300"
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                disabled={saving}
                className="rounded-2xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Category"
                  : "Create Category"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* LIST SECTION */}
      <div className="rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
              <p className="mt-1 text-sm text-gray-500">
                Simamia categories zote za store yako.
              </p>
            </div>

            <input
              type="text"
              placeholder="Search category..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100 md:w-80"
            />
          </div>
        </div>

        <div className="px-6 py-6">
          {loading ? (
            <p className="text-gray-500">Loading categories...</p>
          ) : filteredCategories.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 py-10 text-center">
              <p className="text-sm text-gray-400">
                Hakuna categories zilizopatikana.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredCategories.map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl border border-gray-200 bg-gray-50 p-4 transition hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-20 aspect-square rounded-2xl overflow-hidden bg-white border shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 truncate">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 truncate">
                        {item.slug}
                      </p>
                      <p className="mt-2 text-sm text-gray-400 line-clamp-2">
                        {item.description || "No description"}
                      </p>

                      <div className="mt-3">
                        {item.is_active ? (
                          <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-200">
                            Inactive
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex-1 rounded-2xl bg-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-800 transition hover:bg-gray-300"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex-1 rounded-2xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminCategories;