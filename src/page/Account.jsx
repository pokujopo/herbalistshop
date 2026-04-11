import { useEffect, useState } from "react";
import api from "../lib/api";

function Account() {
  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));


  const [profileLoading, setProfileLoading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

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

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const res = await api.get("/orders");
      setOrders(res.data.data || []);
    } catch (err) {
      console.log(err.response?.data || err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      const res = await api.get("/me");

      setForm({
        name: res.data.user?.name || "",
        email: res.data.user?.email || "",
        phone: res.data.user?.phone || "",
      });
    } catch (err) {
      console.log(err.response?.data || err);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (tab === "profile") {
      fetchProfile();
    }
  }, [tab]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    try {
      setSavingProfile(true);

      const res = await api.put("/me", {
        name: form.name,
        email: form.email,
        phone: form.phone,
      });

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      alert(res.data.message || "Profile updated successfully");
    } catch (err) {
      console.log(err.response?.data || err);
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <section className="bg-gray-50  mt-16 py-10 px-4">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-6">

        {/* SIDEBAR */}
        <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-4 h-fit">
          <h2 className="font-bold text-lg">My Account</h2>

          <button
            onClick={() => setTab("orders")}
            className={`text-left ${tab === "orders" ? "text-green-600 font-semibold" : ""}`}
          >
            Orders
          </button>

          <button
            onClick={() => setTab("profile")}
            className={`text-left ${tab === "profile" ? "text-green-600 font-semibold" : ""}`}
          >
            Profile
          </button>

          {user && (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm"
              >
                Logout
              </button>
            )}
        </div>

        {/* CONTENT */}
        <div className="md:col-span-3">

          {/* ORDERS TAB */}
          {tab === "orders" && (
            <div className="flex flex-col gap-5">
              <h2 className="text-2xl font-bold">Order History</h2>

              {ordersLoading ? (
                <p>Loading orders...</p>
              ) : orders.length === 0 ? (
                <div className="bg-white rounded-2xl p-6 shadow-sm text-center text-gray-500">
                  Huna orders bado.
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-2xl p-5 shadow-sm">

                    <div className="flex justify-between flex-wrap gap-2 mb-4">
                      <div>
                        <p className="font-semibold">Order #{order.order_number}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      <span
                        className={`text-sm px-3 py-1 rounded-full
                        ${order.order_status === "delivered" ? "bg-green-100 text-green-600" : ""}
                        ${order.order_status === "shipped" ? "bg-blue-100 text-blue-600" : ""}
                        ${order.order_status === "pending" ? "bg-yellow-100 text-yellow-600" : ""}
                        ${order.order_status === "processing" ? "bg-purple-100 text-purple-600" : ""}
                      `}
                      >
                        {order.order_status}
                      </span>
                    </div>

                    <div className="flex flex-col gap-3">
                      {order.items?.map((item) => (
                        <div key={item.id} className="flex gap-3 items-center">
                          <div className="w-16 aspect-square rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={item.product?.thumbnail || item.product_image_url || item.product_image || "/placeholder.png"}
                              className="w-full h-full object-cover"
                              alt={item.product?.name || item.product_name || "product"}
                            />
                          </div>

                          <div>
                            <p className="text-sm font-medium">
                              {item.product?.name || item.product_name || "Product"}
                            </p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center mt-4 flex-wrap gap-2">
                      <span className="font-bold text-green-600">
                        TZS {Number(order.total).toLocaleString()}
                      </span>

                      <a
                        href={`/track-order/${order.order_number}`}
                        className="text-sm text-green-600 hover:underline"
                      >
                        Track Order →
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* PROFILE TAB */}
          {tab === "profile" && (
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Profile Info</h2>

              {profileLoading ? (
                <p>Loading profile...</p>
              ) : (
                <form onSubmit={handleProfileUpdate} className="grid md:grid-cols-2 gap-4">
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="border rounded-xl px-4 py-3"
                    placeholder="Full Name"
                    required
                  />

                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="border rounded-xl px-4 py-3"
                    placeholder="Phone Number"
                  />

                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="border rounded-xl px-4 py-3 md:col-span-2"
                    placeholder="Email Address"
                    required
                  />

                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 disabled:opacity-60"
                    >
                      {savingProfile ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Account;
