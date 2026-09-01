import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Auth() {
  const navigate = useNavigate();

  const API_BASE = "https://herbalistshop-api-production.up.railway.app//api";

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      const user = JSON.parse(savedUser);

      if (user.usertype === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setServerMessage("");
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    });
    setErrors({});
    setServerMessage("");
  };

  const handleModeChange = (mode) => {
    setIsLogin(mode === "login");
    resetForm();
  };

  const saveAuthAndRedirect = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    if (data.user.usertype === "admin") {
      navigate("/admin", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setErrors({});
    setServerMessage("");

    const endpoint = isLogin ? `${API_BASE}/login` : `${API_BASE}/register`;

    const payload = isLogin
      ? {
          email: form.email,
          password: form.password,
        }
      : {
          name: form.name,
          email: form.email,
          password: form.password,
          password_confirmation: form.password_confirmation,
        };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        }

        setServerMessage(data.message || "Something went wrong.");
        return;
      }

      saveAuthAndRedirect(data);
    } catch (error) {
      setServerMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-green-50 via-white to-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="hidden lg:flex relative min-h-[650px]">
          <img
            src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80"
            alt="Herbal care"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 via-green-700/60 to-black/50" />
          <div className="absolute inset-0 p-10 flex flex-col justify-between text-white">
            <div>
              <h1 className="text-3xl font-bold">HerbalCare 🌿</h1>
              <p className="mt-3 text-sm text-green-100 max-w-md leading-6">
                Dawa za asili zenye ubora, usalama, na huduma ya kuaminika kwa
                afya bora ya kila siku.
              </p>
            </div>

            <div>
              <h2 className="text-4xl font-bold leading-tight max-w-lg">
                Karibu kwenye mfumo wa kisasa wa afya na ununuzi wa dawa za asili.
              </h2>
              <p className="mt-4 text-sm text-green-100 max-w-md leading-6">
                Ingia au fungua akaunti yako ili kuagiza bidhaa, kufuatilia order
                zako, na kupata huduma ya haraka.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
                <p className="font-semibold">100% Asili</p>
                <p className="text-green-100 mt-1 text-xs">Bidhaa salama</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
                <p className="font-semibold">Fast Delivery</p>
                <p className="text-green-100 mt-1 text-xs">Nchi nzima</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
                <p className="font-semibold">Trusted Care</p>
                <p className="text-green-100 mt-1 text-xs">Huduma bora</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="p-6 sm:p-8 lg:p-10 flex items-center justify-center">
          <div className="w-full max-w-md">
            {/* SWITCHER */}
            <div className="bg-gray-100 rounded-2xl p-1 flex mb-6">
              <button
                type="button"
                onClick={() => handleModeChange("login")}
                className={`w-1/2 py-3 rounded-xl text-sm font-semibold transition ${
                  isLogin
                    ? "bg-white shadow text-green-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => handleModeChange("register")}
                className={`w-1/2 py-3 rounded-xl text-sm font-semibold transition ${
                  !isLogin
                    ? "bg-white shadow text-green-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Register
              </button>
            </div>

            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-800">
                {isLogin ? "Welcome back" : "Create your account"}
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                {isLogin
                  ? "Ingia kwenye akaunti yako kuendelea."
                  : "Jaza taarifa zako kuanza kutumia mfumo."}
              </p>
            </div>

            {serverMessage && (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {serverMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 pr-20 outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
                  >
                    {showPass ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password[0]}
                  </p>
                )}
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPass ? "text" : "password"}
                      name="password_confirmation"
                      value={form.password_confirmation}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className="w-full rounded-2xl border border-gray-300 px-4 py-3 pr-20 outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPass ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-green-600 text-white py-3.5 font-semibold hover:bg-green-700 transition disabled:opacity-70"
              >
                {loading
                  ? isLogin
                    ? "Logging in..."
                    : "Creating account..."
                  : isLogin
                  ? "Login"
                  : "Create Account"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              {isLogin ? "Huna akaunti?" : "Una akaunti tayari?"}
              <button
                type="button"
                onClick={() => handleModeChange(isLogin ? "register" : "login")}
                className="ml-2 text-green-600 font-semibold hover:text-green-700"
              >
                {isLogin ? "Register" : "Login"}
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 text-xs text-gray-400 text-center">
              By continuing, you agree to our secure account access policy.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Auth;
