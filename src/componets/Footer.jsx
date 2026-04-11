import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";

function Footer() {
  const [categories, setCategories] = useState([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [siteSettings, setSiteSettings] = useState({
    store_name: "AdamHerbalCare",
    store_email: "info@herbalcare.co.tz",
    store_phone: "+255 700 000 000",
    store_address: "Dar es Salaam, Tanzania",
    facebook_url: "",
    instagram_url: "",
    twitter_url: "",
    logo: null,
  });

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchSettings = async () => {
    try {
      const res = await api.get("/settings");
      const setting = res.data.setting;

      if (setting) {
        setSiteSettings({
          store_name: setting.store_name || "AdamHerbalCare",
          store_email: setting.store_email || "info@herbalcare.co.tz",
          store_phone: setting.store_phone || "+255 700 000 000",
          store_address: setting.store_address || "Dar es Salaam, Tanzania",
          facebook_url: setting.facebook_url || "",
          instagram_url: setting.instagram_url || "",
          twitter_url: setting.twitter_url || "",
          logo: setting.logo || null,
        });
      }
    } catch (error) {
      console.log("Footer settings error:", error.response?.data || error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories((res.data.data || res.data.categories || []).slice(0, 4));
    } catch (error) {
      console.log("Footer categories error:", error);
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchCategories();
  }, []);

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

  const handleNewsletter = async (e) => {
    e.preventDefault();

    if (!email) return;

    try {
      setLoading(true);

      const res = await api.post("/newsletter/subscribe", { email });

      alert(res.data.message || "Umefanikiwa kujiunga");
      setEmail("");
    } catch (error) {
      console.log(error.response?.data || error);
      alert(
        error.response?.data?.message || "Imeshindikana kutuma email yako"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#0f172a] text-gray-300 mt-0">
      <div className="max-w-screen-xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {/* BRAND */}
        <div>
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer"
          >
            { /* siteSettings.logo ? (
              <img
                src={siteSettings.logo}
                alt={siteSettings.store_name}
                className="w-10 h-10 rounded-xl object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-green-600 text-white flex items-center justify-center font-bold text-sm">
                {siteSettings.store_name?.charAt(0) || "A"}
              </div>
            ) */}

            <h2 className="text-xl font-bold text-white">
              {siteSettings.store_name} 🌿
            </h2>
          </div>

          <p className="mt-3 text-sm text-gray-400">
            Tunatoa dawa za asili zenye ubora wa hali ya juu kwa afya bora ya mwili wako.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-white font-semibold mb-3">Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-white">Home</Link>
            </li>
            <li>
              <Link to="/allproduct" className="hover:text-white">Bidhaa</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white">Kuhusu Sisi</Link>
            </li>
            <li>
              <Link to={user ? "/account" : "/auth"} className="hover:text-white">
                {user ? "Akaunti Yangu" : "Ingia / Jisajili"}
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-white">Cart</Link>
            </li>
          </ul>
        </div>

        {/* CATEGORIES */}
        <div>
          <h3 className="text-white font-semibold mb-3">Categories</h3>
          <ul className="space-y-2 text-sm">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/allproduct?category=${cat.slug}`}
                    className="hover:text-white"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))
            ) : (
              <>
                <li><span className="text-gray-500">Kinga ya Mwili</span></li>
                <li><span className="text-gray-500">Nguvu za Kiume</span></li>
                <li><span className="text-gray-500">Afya ya Wanawake</span></li>
                <li><span className="text-gray-500">Virutubisho</span></li>
              </>
            )}
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-white font-semibold mb-3">Wasiliana</h3>
          <ul className="space-y-2 text-sm">
            <li>📍 {siteSettings.store_address}</li>
            <li>📞 {siteSettings.store_phone}</li>
            <li>📧 {siteSettings.store_email}</li>
          </ul>
        </div>

        {/* NEWSLETTER */}
        <div>
          <h3 className="text-white font-semibold mb-3">Jiunge Nasi</h3>
          <p className="text-sm mb-3 text-gray-400">
            Pata taarifa za ofa na bidhaa mpya.
          </p>

          <form onSubmit={handleNewsletter} className="flex">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email yako"
              className="w-full px-3 py-2 rounded-l-md text-black outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 px-4 py-2 rounded-r-md text-white hover:bg-green-700 disabled:opacity-60"
            >
              {loading ? "..." : "Tuma"}
            </button>
          </form>
        </div>
      </div>

      {/* SOCIAL + BOTTOM */}
      <div className="border-t border-gray-700">
        <div className="max-w-screen-xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* SOCIAL */}
          <div className="flex gap-4 text-lg items-center">
            {siteSettings.facebook_url ? (
              <a
                href={siteSettings.facebook_url}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white"
              >
                📘
              </a>
            ) : null}

            {siteSettings.instagram_url ? (
              <a
                href={siteSettings.instagram_url}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white"
              >
                📸
              </a>
            ) : null}

            {siteSettings.twitter_url ? (
              <a
                href={siteSettings.twitter_url}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white"
              >
                🐦
              </a>
            ) : null}

            {user && (
              <button
                hidden
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm"
              >
                Logout
              </button>
            )}
          </div>

          {/* COPYRIGHT */}
          <p className="text-sm text-gray-400 text-center">
            © {new Date().getFullYear()} {siteSettings.store_name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;