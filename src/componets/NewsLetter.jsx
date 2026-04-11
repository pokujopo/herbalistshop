import { useState } from "react";
import api from "../lib/api";

function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    setMessage(null);
    setError(null);

    if (!email) {
      setError("Tafadhali weka email yako");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/newsletter/subscribe", {
        email: email,
      });

      setMessage(res.data.message || "Umefanikiwa kujiunga 🎉");
      setEmail("");
    } catch (err) {
      console.log(err.response?.data);

      setError(
        err.response?.data?.message ||
          "Imeshindikana ku-subscribe, jaribu tena"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 bg-gray-100">
      <div className="max-w-screen-xl mx-auto px-4 text-center">

        {/* TITLE */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Jiunge na AdamHerbalCare 🌿
        </h2>

        <p className="text-gray-500 mt-2 text-sm">
          Pata ofa maalum, tips za afya na bidhaa mpya moja kwa moja kwenye email yako
        </p>

        {/* FORM */}
        <form
          onSubmit={handleSubscribe}
          className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-3 max-w-xl mx-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Weka email yako..."
            className="w-full px-4 py-3 rounded-full border outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition disabled:opacity-60"
          >
            {loading ? "Inatuma..." : "Subscribe"}
          </button>
        </form>

        {/* SUCCESS MESSAGE */}
        {message && (
          <p className="text-green-600 mt-4 text-sm font-medium">
            {message}
          </p>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <p className="text-red-500 mt-4 text-sm font-medium">
            {error}
          </p>
        )}

        {/* NOTE */}
        <p className="text-xs text-gray-400 mt-3">
          Hatutashare email yako na mtu yeyote ❌
        </p>

      </div>
    </section>
  );
}

export default Newsletter;