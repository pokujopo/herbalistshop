
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";

function NavBar() {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const [siteSettings, setSiteSettings] = useState({
    store_name: "BinAdamCare",
    logo: null,
    facebook_url: "",
    instagram_url: "",
    twitter_url: "",
  });

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const navigate = useNavigate();
  const searchRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchSettings = async () => {
    try {
      const res = await api.get("/settings");
      const setting = res.data.setting;

      if (setting) {
        setSiteSettings({
          store_name: setting.store_name || "BinAdamCare",
          logo: setting.logo || null,
          facebook_url: setting.facebook_url || "",
          instagram_url: setting.instagram_url || "",
          twitter_url: setting.twitter_url || "",
        });
      }
    } catch (err) {
      console.log("Settings error:", err.response?.data || err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data.data || res.data.categories || []);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
      setCartCount(res.data.cart?.items_count || 0);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchCategories();

    if (localStorage.getItem("token")) {
      fetchCart();
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!search.trim()) {
        setResults([]);
        setSearchOpen(false);
        return;
      }

      try {
        setSearchLoading(true);
        const res = await api.get(
          `/products?search=${encodeURIComponent(search.trim())}`
        );

        const items = res.data.data || [];
        setResults(items.slice(0, 6));
        setSearchOpen(true);
      } catch (error) {
        console.log("Search error:", error);
      } finally {
        setSearchLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (!search.trim()) return;

    navigate(`/allproduct?search=${encodeURIComponent(search.trim())}`);
    setSearchOpen(false);
  };

  const handleSelectProduct = (slug) => {
    setSearch("");
    setSearchOpen(false);
    navigate(`/product/${slug}`);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
      <div className="max-w-screen-xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* LOGO / STORE NAME */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer shrink-0"
        >
          {siteSettings.logo ? (
            <img
              src={siteSettings.logo}
              alt={siteSettings.store_name}
              className="w-9 h-9 rounded-xl object-cover"
            />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-green-600 text-white flex items-center justify-center font-bold text-sm">
              {siteSettings.store_name?.charAt(0) || "B"}
            </div>
          )}

          <h1 className="text-xl font-bold text-green-600">
            {siteSettings.store_name} 🌿
          </h1>
        </div>

        {/* DESKTOP MENU */}
        <ul className="hidden md:flex gap-6 text-gray-700 font-medium">
          <li className="hover:text-green-600">
            <Link to="/">Home</Link>
          </li>

          <li className="relative group">
            <span className="cursor-pointer hover:text-green-600">
              Categories
            </span>

            <div className="absolute left-0 top-full w-[700px] bg-white shadow-xl rounded-xl p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transform group-hover:translate-y-0 translate-y-5 transition duration-300">
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 grid grid-cols-2 gap-6">
                  {categories.map((cat) => (
                    <div key={cat.id}>
                      <h3 className="font-semibold mb-3 text-green-600">
                        {cat.name}
                      </h3>

                      <ul className="space-y-2 text-sm">
                        <li
                          onClick={() => navigate(`/allproduct?category=${cat.slug}`)}
                          className="hover:text-green-600 cursor-pointer"
                        >
                          Angalia zote
                        </li>
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="overflow-hidden rounded-lg">
                  <img
                    src="/images/herbal-banner.jpg"
                    className="w-full h-full object-cover"
                    alt="Herbal"
                  />
                </div>
              </div>
            </div>
          </li>

          <li className="hover:text-green-600">
            <Link to="/allproduct">Bidhaa</Link>
          </li>

          <li className="hover:text-green-600">
            <Link to="/about">Kuhusu</Link>
          </li>
        </ul>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          {/* SEARCH */}
          <div className="hidden md:block relative w-72" ref={searchRef}>
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => results.length > 0 && setSearchOpen(true)}
                placeholder="Tafuta bidhaa..."
                className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-green-500"
              />
            </form>

            {searchOpen && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white border rounded-xl shadow-lg overflow-hidden z-50">
                {searchLoading ? (
                  <div className="p-3 text-sm text-gray-500">Inatafuta...</div>
                ) : results.length > 0 ? (
                  <>
                    {results.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectProduct(item.slug)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 text-left"
                      >
                        <div className="w-12 aspect-square rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          <img
                            src={item.thumbnail}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 line-clamp-1">
                            {item.name}
                          </p>
                          <p className="text-xs text-green-600">
                            {item.discount_price
                              ? `TZS ${Number(item.discount_price).toLocaleString()}`
                              : `TZS ${Number(item.price).toLocaleString()}`}
                          </p>
                        </div>
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="w-full p-3 text-sm font-medium text-green-600 border-t hover:bg-gray-50"
                    >
                      Angalia matokeo yote
                    </button>
                  </>
                ) : (
                  <div className="p-3 text-sm text-gray-500">
                    Hakuna bidhaa zilizopatikana
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ICONS */}
          <div className="flex gap-4 items-center text-lg">
            <span
              onClick={() => navigate(user ? "/account" : "/auth")}
              className="cursor-pointer"
            >
              👤
            </span>

            <div
              onClick={() => navigate("/cart")}
              className="relative cursor-pointer"
            >
              🛒
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs px-1.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </div>
          </div>

          {/* MOBILE BUTTON */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setOpen(!open)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden bg-white border-t transition-all duration-300 ${
          open ? "max-h-[500px] py-4" : "max-h-0 overflow-hidden"
        }`}
      >
        <div className="px-4 pb-4">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tafuta bidhaa..."
              className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-green-500"
            />
          </form>
        </div>

        <ul className="flex flex-col gap-4 px-4">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/allproduct">Bidhaa</Link></li>
          <li><Link to="/about">Kuhusu</Link></li>
          <li><Link to="/cart">Cart ({cartCount})</Link></li>
          <li>
            <Link to={user ? "/account" : "/auth"}>
              {user ? "Akaunti Yangu" : "Ingia / Jisajili"}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;