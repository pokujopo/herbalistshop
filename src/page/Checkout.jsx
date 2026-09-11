import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loadingCart, setLoadingCart] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [modal, setModal] = useState({
    open: false,
    type: "loading",
    title: "",
    message: "",
  });

  // Prevent duplicate submit even if React state has not updated yet.
  const submitLock = useRef(false);

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    region: "",
    city: "",
    street_address: "",
    notes: "",
    payment_method: "cash",
  });

  /*
   * ================================
   * FETCH CART
   * ================================
   */
  const fetchCart = async () => {
    try {
      setLoadingCart(true);

      const res = await api.get("/cart");

      setCart(res.data.cart);
    } catch (err) {
      console.error(
        "Cart error:",
        err.response?.data || err
      );
    } finally {
      setLoadingCart(false);
    }
  };

  /*
   * ================================
   * FETCH USER
   * ================================
   */
  const fetchMe = async () => {
    try {
      const res = await api.get("/me");

      const user = res.data.user || res.data;

      setForm((prev) => ({
        ...prev,
        full_name: user?.name || "",
        phone: user?.phone || "",
      }));
    } catch (err) {
      console.error(
        "Me error:",
        err.response?.data || err
      );
    }
  };

  /*
   * ================================
   * INITIAL LOAD
   * ================================
   */
  useEffect(() => {
    fetchCart();
    fetchMe();
  }, []);

  /*
   * ================================
   * HANDLE INPUT
   * ================================
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /*
   * ================================
   * SHOW MODAL
   * ================================
   */
  const showLoadingModal = () => {
    setModal({
      open: true,
      type: "loading",
      title:
        form.payment_method === "cash"
          ? "Processing Order"
          : "Processing Payment",
      message:
        form.payment_method === "cash"
          ? "Tafadhali subiri, tunaandaa oda yako..."
          : "Tafadhali subiri, tunatuma ombi la malipo kwenye simu yako...",
    });
  };

  /*
   * ================================
   * SHOW ERROR MODAL
   * ================================
   */
  const showErrorModal = (message) => {
    setModal({
      open: true,
      type: "error",
      title: "Checkout Failed",
      message,
    });
  };

  /*
   * ================================
   * CLOSE MODAL
   * ================================
   */
  const closeModal = () => {
    setModal((prev) => ({
      ...prev,
      open: false,
    }));
  };

  /*
   * ================================
   * SUBMIT CHECKOUT
   * ================================
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    /*
     * HARD FRONTEND LOCK
     *
     * This prevents duplicate requests even if
     * the user clicks very quickly before React
     * finishes updating `submitting`.
     */
    if (submitLock.current || submitting) {
      return;
    }

    /*
     * ================================
     * VALIDATE CART
     * ================================
     */
    if (
      !cart ||
      !cart.items ||
      cart.items.length === 0
    ) {
      showErrorModal(
        "Cart yako ipo tupu. Ongeza bidhaa kwanza kabla ya kuendelea."
      );

      return;
    }

    /*
     * ================================
     * LOCK SUBMIT
     * ================================
     */
    submitLock.current = true;
    setSubmitting(true);

    /*
     * Show custom loading popup immediately.
     */
    showLoadingModal();

    try {
      /*
       * ================================
       * CREATE ORDER / PAYMENT
       * ================================
       */
      const res = await api.post(
        "/checkout/pay",
        form
      );

      const data = res.data;

      console.log(
        "Checkout response:",
        data
      );

      /*
       * ================================
       * PAYMENT INITIATED
       * ================================
       *
       * Current PalmPesa flow does NOT use
       * hosted checkout_url.
       *
       * Backend sends mobile-money push
       * directly to customer's phone.
       */

      if (
        form.payment_method === "mpesa" ||
        form.payment_method === "mixx"
      ) {
        /*
         * If backend successfully created
         * the payment request, go to order
         * tracking page.
         */
        if (data.order_number) {
          navigate(
            `/track-order/${data.order_number}`,
            {
              replace: true,
            }
          );

          return;
        }

        /*
         * Fallback in case backend response
         * does not contain order_number.
         */
        setModal({
          open: true,
          type: "error",
          title: "Payment Started",
          message:
            data.message ||
            "Ombi la malipo limetumwa. Tafadhali angalia simu yako.",
        });

        return;
      }

      /*
       * ================================
       * CASH ORDER
       * ================================
       */
      if (data.order_number) {
        navigate(
          `/track-order/${data.order_number}`,
          {
            replace: true,
          }
        );

        return;
      }

      /*
       * ================================
       * FALLBACK SUCCESS
       * ================================
       */
      setModal({
        open: true,
        type: "success",
        title: "Order Successful",
        message:
          data.message ||
          "Order yako imepokelewa successfully.",
      });
    } catch (err) {
      console.error(
        "Checkout error:",
        err.response?.data || err
      );

      /*
       * ================================
       * ERROR MESSAGE
       * ================================
       */
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Checkout failed. Tafadhali jaribu tena.";

      showErrorModal(message);
    } finally {
      /*
       * IMPORTANT:
       *
       * Do not unlock immediately after successful
       * navigation because navigation is replacing
       * the current page.
       *
       * For errors/fallbacks, unlock the form.
       */
      if (!window.location.pathname.includes("/track-order/")) {
        submitLock.current = false;
        setSubmitting(false);
      }
    }
  };

  /*
   * ================================
   * LOADING CART
   * ================================
   */
  if (loadingCart) {
    return (
      <p className="text-center py-10 mt-20">
        Loading checkout...
      </p>
    );
  }

  /*
   * ================================
   * EMPTY CART
   * ================================
   */
  if (
    !cart ||
    !cart.items ||
    cart.items.length === 0
  ) {
    return (
      <section className="bg-gray-50 min-h-screen pt-24 px-4 pb-10">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-sm text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            No items for checkout
          </h2>

          <p className="text-gray-500 mt-2">
            Ongeza bidhaa kwanza kwenye cart.
          </p>

          <button
            onClick={() =>
              navigate("/allproduct")
            }
            className="inline-block mt-5 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700"
          >
            Continue Shopping
          </button>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-gray-50 min-h-screen pt-24 px-4 pb-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-100">
                <h1 className="text-2xl font-bold text-gray-900">
                  Checkout
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  Jaza taarifa zako kisha kamilisha oda.
                </p>
              </div>

              {/* Delivery info */}
              <div className="px-6 py-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Delivery Information
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="full_name"
                      value={form.full_name}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500"
                      placeholder="Jina kamili"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>

                    <input
                      type="text"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500"
                      placeholder="07XXXXXXXX"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Region
                    </label>

                    <input
                      type="text"
                      name="region"
                      value={form.region}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500"
                      placeholder="Mfano: Dar es Salaam"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City / District
                    </label>

                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500"
                      placeholder="Mfano: Ilala"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>

                    <input
                      type="text"
                      name="street_address"
                      value={form.street_address}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500"
                      placeholder="Mtaa, nyumba, landmark"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>

                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      rows={4}
                      className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500"
                      placeholder="Maelezo ya ziada kwa delivery"
                    />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="px-6 py-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Payment Method
                </h2>

                <div className="grid gap-3 md:grid-cols-3">
                  <label
                    className={`rounded-2xl border p-4 cursor-pointer transition ${
                      form.payment_method === "mpesa"
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="mpesa"
                      checked={
                        form.payment_method === "mpesa"
                      }
                      onChange={handleChange}
                      className="hidden"
                    />

                    <p className="font-semibold text-gray-800">
                      M-Pesa
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Lipa kupitia simu yako
                    </p>
                  </label>

                  <label
                    className={`rounded-2xl border p-4 cursor-pointer transition ${
                      form.payment_method === "mixx"
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="mixx"
                      checked={
                        form.payment_method === "mixx"
                      }
                      onChange={handleChange}
                      className="hidden"
                    />

                    <p className="font-semibold text-gray-800">
                      Mixx
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Mobile money payment
                    </p>
                  </label>

                  <label
                    className={`rounded-2xl border p-4 cursor-pointer transition ${
                      form.payment_method === "cash"
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="cash"
                      checked={
                        form.payment_method === "cash"
                      }
                      onChange={handleChange}
                      className="hidden"
                    />

                    <p className="font-semibold text-gray-800">
                      Cash
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Malipo wakati wa kupokea
                    </p>
                  </label>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={submitting}
                    aria-busy={submitting}
                    className="w-full md:w-auto bg-green-600 text-white px-8 py-3 rounded-2xl font-semibold hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting
                      ? "Processing..."
                      : "Confirm Order"}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* RIGHT */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 h-fit sticky top-24">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">
              Order Summary
            </h3>

            <div className="space-y-4 mb-5">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 items-center"
                >
                  <div className="w-16 aspect-square rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={item.product.thumbnail}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 line-clamp-1">
                      {item.product.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <div className="text-sm font-semibold text-gray-800">
                    TZS{" "}
                    {Number(
                      item.subtotal
                    ).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  Subtotal
                </span>

                <span className="font-medium">
                  TZS{" "}
                  {Number(
                    cart.subtotal
                  ).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  Delivery
                </span>

                <span className="font-medium text-green-600">
                  {Number(cart.delivery_fee) === 0
                    ? "Free"
                    : `TZS ${Number(
                        cart.delivery_fee
                      ).toLocaleString()}`}
                </span>
              </div>

              <div className="flex justify-between text-lg font-bold pt-3 border-t mt-3">
                <span>Total</span>

                <span className="text-green-600">
                  TZS{" "}
                  {Number(
                    cart.total
                  ).toLocaleString()}
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-4 text-center">
              Baada ya kuthibitisha oda utaelekezwa
              kuona status ya malipo na order.
            </p>
          </div>
        </div>
      </section>

      {/* ==================================================
          CUSTOM CHECKOUT MODAL
          ================================================== */}

      {modal.open && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Modal */}
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-7">
            {modal.type === "loading" && (
              <div className="text-center">
                {/* Spinner */}
                <div className="mx-auto w-16 h-16 rounded-full border-4 border-green-100 border-t-green-600 animate-spin" />

                <h2 className="mt-6 text-xl sm:text-2xl font-bold text-gray-900">
                  {modal.title}
                </h2>

                <p className="mt-3 text-sm sm:text-base text-gray-500 leading-6">
                  {modal.message}
                </p>

                {form.payment_method !== "cash" && (
                  <div className="mt-5 rounded-2xl bg-green-50 border border-green-100 px-4 py-3">
                    <p className="text-sm text-green-700">
                      Angalia simu yako. Ikiwa umetumiwa
                      payment prompt, ingiza PIN yako
                      kuthibitisha malipo.
                    </p>
                  </div>
                )}

                {/* Prevent accidental interaction */}
                <p className="mt-5 text-xs text-gray-400">
                  Tafadhali usifunge ukurasa wala kutuma
                  request nyingine.
                </p>
              </div>
            )}

            {modal.type === "error" && (
              <div className="text-center">
                {/* Error icon */}
                <div className="mx-auto w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-red-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>

                <h2 className="mt-5 text-xl sm:text-2xl font-bold text-gray-900">
                  {modal.title}
                </h2>

                <p className="mt-3 text-sm sm:text-base text-gray-500 leading-6">
                  {modal.message}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    closeModal();

                    submitLock.current = false;
                    setSubmitting(false);
                  }}
                  className="mt-6 w-full bg-green-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-green-700 transition"
                >
                  Try Again
                </button>
              </div>
            )}

            {modal.type === "success" && (
              <div className="text-center">
                {/* Success icon */}
                <div className="mx-auto w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-green-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <h2 className="mt-5 text-xl sm:text-2xl font-bold text-gray-900">
                  {modal.title}
                </h2>

                <p className="mt-3 text-sm sm:text-base text-gray-500 leading-6">
                  {modal.message}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    closeModal();

                    submitLock.current = false;
                    setSubmitting(false);
                  }}
                  className="mt-6 w-full bg-green-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-green-700 transition"
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Checkout;
