import { useEffect, useState } from "react";
import adminApi from "../services/adminApi";
import { Card, Button, Input, Spinner, Label, PageHeader, toast } from "../components/ui";

function SectionCard({ title, subtitle, children }) {
  return (
    <Card className="p-6">
      <div className="mb-5 pb-4 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </Card>
  );
}

function AdminSettings() {
  const [form, setForm] = useState({
    store_name: "", store_email: "", store_phone: "", store_address: "",
    facebook_url: "", instagram_url: "", twitter_url: "",
  });
  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await adminApi.get("/admin/settings");
        if (res.data.setting) {
          setForm({
            store_name: res.data.setting.store_name || "",
            store_email: res.data.setting.store_email || "",
            store_phone: res.data.setting.store_phone || "",
            store_address: res.data.setting.store_address || "",
            facebook_url: res.data.setting.facebook_url || "",
            instagram_url: res.data.setting.instagram_url || "",
            twitter_url: res.data.setting.twitter_url || "",
          });
          setPreview(res.data.setting.logo || null);
        }
      } catch (err) {
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setLogo(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    if (logo) formData.append("logo", logo);
    try {
      setSaving(true);
      await adminApi.post("/admin/settings", formData);
      toast.success("Settings saved successfully");
    } catch (err) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-5">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-4 bg-gray-100 rounded w-32 mb-5" />
            <div className="grid sm:grid-cols-2 gap-4">
              {[1, 2].map((j) => (
                <div key={j}>
                  <div className="h-3 bg-gray-100 rounded w-20 mb-2" />
                  <div className="h-10 bg-gray-100 rounded-xl" />
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PageHeader title="Store Settings" subtitle="Manage your store information and preferences" />

      {/* Store Info */}
      <SectionCard title="Store Information" subtitle="Basic details about your store">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Store Name</Label>
            <Input
              name="store_name"
              value={form.store_name}
              onChange={handleChange}
              placeholder="My Awesome Store"
            />
          </div>
          <div>
            <Label>Store Email</Label>
            <Input
              name="store_email"
              type="email"
              value={form.store_email}
              onChange={handleChange}
              placeholder="store@example.com"
            />
          </div>
          <div>
            <Label>Phone Number</Label>
            <Input
              name="store_phone"
              value={form.store_phone}
              onChange={handleChange}
              placeholder="+255 700 000 000"
            />
          </div>
          <div>
            <Label>Store Address</Label>
            <Input
              name="store_address"
              value={form.store_address}
              onChange={handleChange}
              placeholder="Dar es Salaam, Tanzania"
            />
          </div>
        </div>
      </SectionCard>

      {/* Social Media */}
      <SectionCard title="Social Media" subtitle="Links to your social media profiles">
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <Label>Facebook URL</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </span>
              <Input
                name="facebook_url"
                value={form.facebook_url}
                onChange={handleChange}
                placeholder="https://facebook.com/..."
                className="pl-9"
              />
            </div>
          </div>
          <div>
            <Label>Instagram URL</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">
                <svg className="w-4 h-4 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path strokeLinecap="round" d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                  <circle cx="17.5" cy="6.5" r=".5" fill="currentColor" />
                </svg>
              </span>
              <Input
                name="instagram_url"
                value={form.instagram_url}
                onChange={handleChange}
                placeholder="https://instagram.com/..."
                className="pl-9"
              />
            </div>
          </div>
          <div>
            <Label>Twitter / X URL</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">
                <svg className="w-4 h-4 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </span>
              <Input
                name="twitter_url"
                value={form.twitter_url}
                onChange={handleChange}
                placeholder="https://x.com/..."
                className="pl-9"
              />
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Logo */}
      <SectionCard title="Store Logo" subtitle="Upload your store logo (PNG, JPG recommended)">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {/* Preview */}
          <div className="shrink-0">
            {preview ? (
              <div className="w-24 h-24 rounded-2xl overflow-hidden ring-2 ring-gray-100 shadow-sm">
                <img src={preview} alt="Store logo" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gray-50 ring-2 ring-dashed ring-gray-200 flex flex-col items-center justify-center text-gray-300 gap-1">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-[9px] font-medium">No logo</span>
              </div>
            )}
          </div>

          {/* Upload */}
          <div className="flex-1">
            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-all group">
              <svg className="w-6 h-6 text-gray-300 group-hover:text-emerald-500 transition-colors mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span className="text-xs text-gray-400 group-hover:text-emerald-600 font-medium">
                {logo ? logo.name : "Click to upload logo"}
              </span>
              <span className="text-[10px] text-gray-300 mt-0.5">PNG, JPG up to 10MB</span>
              <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
            </label>
          </div>
        </div>
      </SectionCard>

      {/* Save */}
      <div className="flex justify-end">
        <Button type="submit" disabled={saving} size="lg">
          {saving && <Spinner size="sm" />}
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </form>
  );
}

export default AdminSettings;
