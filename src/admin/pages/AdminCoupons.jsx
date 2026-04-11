import { useEffect, useState } from "react";
import adminApi from "../services/adminApi";
import {
  Card, Badge, Button, Input, Select, Spinner,
  PageHeader, EmptyState, Label, Modal, toast,
} from "../components/ui";

function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({
    code: "", discount_percent: "", is_active: true, expires_at: "",
  });

  const fetchCoupons = async () => {
    try {
      const res = await adminApi.get("/admin/coupons");
      setCoupons(res.data.data?.data || []);
    } catch (err) {
      toast.error("Failed to load coupons");
    }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const resetForm = () => {
    setForm({ code: "", discount_percent: "", is_active: true, expires_at: "" });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingId) {
        await adminApi.post(`/admin/coupons/${editingId}`, { ...form, is_active: !!form.is_active });
        toast.success("Coupon updated successfully");
      } else {
        await adminApi.post("/admin/coupons", { ...form, is_active: !!form.is_active });
        toast.success("Coupon created successfully");
      }
      resetForm();
      fetchCoupons();
    } catch (err) {
      toast.error("Failed to save coupon");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      code: item.code || "",
      discount_percent: item.discount_percent || "",
      is_active: !!item.is_active,
      expires_at: item.expires_at ? item.expires_at.slice(0, 10) : "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await adminApi.delete(`/admin/coupons/${deleteTarget.id}`);
      toast.success("Coupon deleted");
      setDeleteTarget(null);
      fetchCoupons();
    } catch (err) {
      toast.error("Failed to delete coupon");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Form */}
      <Card className="p-5">
        <PageHeader
          title={editingId ? "Edit Coupon" : "Create Coupon"}
          subtitle="Manage discount codes for your store"
        />

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Coupon Code</Label>
              <Input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="e.g. SAVE20"
                required
                className="font-mono"
              />
            </div>
            <div>
              <Label>Discount Percent (%)</Label>
              <Input
                type="number"
                min={1}
                max={100}
                value={form.discount_percent}
                onChange={(e) => setForm({ ...form, discount_percent: e.target.value })}
                placeholder="e.g. 15"
                required
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Expires At (optional)</Label>
              <Input
                type="date"
                value={form.expires_at}
                onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={form.is_active ? "active" : "inactive"}
                onChange={(e) => setForm({ ...form, is_active: e.target.value === "active" })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <Button type="submit" disabled={saving}>
              {saving && <Spinner size="sm" />}
              {saving ? "Saving..." : editingId ? "Update Coupon" : "Create Coupon"}
            </Button>
            {editingId && (
              <Button type="button" variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      {/* Coupons List */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-bold text-gray-900">All Coupons</h2>
          <span className="text-xs text-gray-400">{coupons.length} total</span>
        </div>

        {coupons.length === 0 ? (
          <EmptyState
            icon={
              <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M17 17h.01M7 17h.01M17 7h.01" />
              </svg>
            }
            title="No coupons yet"
            description="Create your first coupon above."
          />
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {coupons.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-xl ring-1 ring-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Coupon icon */}
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M17 17h.01M7 17h.01M17 7h.01M3 8l6-5 2 4 2-2 2 2 2-4 4 5v8l-4 5-2-4-2 2-2-2-2 4-4-5V8z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold font-mono text-gray-900 truncate">{item.code}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-500 font-semibold">{item.discount_percent}% off</span>
                      {item.expires_at && (
                        <span className="text-[10px] text-gray-400">
                          Expires {new Date(item.expires_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <Badge variant={item.is_active ? "success" : "gray"}>
                    {item.is_active ? "Active" : "Off"}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => setDeleteTarget(item)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Delete Confirm */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Coupon">
        <p className="text-sm text-gray-600 mb-6">
          Delete coupon <span className="font-bold font-mono text-gray-900">"{deleteTarget?.code}"</span>? This cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting && <Spinner size="sm" />}
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default AdminCoupons;
