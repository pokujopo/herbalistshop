import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await api.get("/cart");
      setCart(res.data.cart);
    } catch (err) {
      console.log(err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const recalculateCart = (items, deliveryFee = 0) => {
    const subtotal = items.reduce((sum, item) => {
      return sum + Number(item.unit_price) * Number(item.quantity);
    }, 0);

    return {
      items,
      items_count: items.reduce((sum, item) => sum + Number(item.quantity), 0),
      subtotal,
      delivery_fee: Number(deliveryFee),
      total: subtotal + Number(deliveryFee),
    };
  };

  const updateQty = async (cartItemId, currentQty, type) => {
    const newQty = type === "inc" ? currentQty + 1 : currentQty - 1;
    if (newQty < 1 || !cart) return;

    const oldCart = { ...cart };

    const updatedItems = cart.items.map((item) =>
      item.id === cartItemId
        ? {
            ...item,
            quantity: newQty,
            subtotal: Number(item.unit_price) * newQty,
          }
        : item
    );

    const updatedCart = {
      ...cart,
      ...recalculateCart(updatedItems, cart.delivery_fee),
    };

    try {
      setBusyId(cartItemId);

      // optimistic update
      setCart(updatedCart);

      await api.put(`/cart/${cartItemId}`, {
        quantity: newQty,
      });
    } catch (err) {
      console.log(err.response?.data || err);
      setCart(oldCart);
      alert("Failed to update quantity");
    } finally {
      setBusyId(null);
    }
  };

  const removeItem = async (cartItemId) => {
    if (!cart) return;

    const oldCart = { ...cart };

    const updatedItems = cart.items.filter((item) => item.id !== cartItemId);

    const updatedCart = {
      ...cart,
      ...recalculateCart(updatedItems, cart.delivery_fee),
    };

    try {
      setBusyId(cartItemId);

      // optimistic update
      setCart(updatedCart);

      await api.delete(`/cart/${cartItemId}`);
    } catch (err) {
      console.log(err.response?.data || err);
      setCart(oldCart);
      alert("Failed to remove item");
    } finally {
      setBusyId(null);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) {
    return <p className="text-center py-10">Loading cart...</p>;
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <section className="bg-gray-50 py-10 mt-16 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-sm text-center">
          <h2 className="text-2xl font-bold text-gray-800">Your Cart is Empty</h2>
          <p className="text-gray-500 mt-2">Ongeza bidhaa kwanza kwenye kikapu.</p>

          <Link
            to="/allproduct"
            className="inline-block mt-5 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700"
          >
            Continue Shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-10 mt-16 px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-5">
          <h2 className="text-2xl font-bold text-gray-800">
            Your Cart ({cart.items_count})
          </h2>

          {cart.items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 shadow-sm flex gap-4 items-center"
            >
              <div className="w-28 aspect-square rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={item.product.thumbnail}
                  className="w-full h-full object-cover"
                  alt={item.product.name}
                />
              </div>

              <div className="flex-1 flex flex-col gap-2">
                <h3 className="font-semibold text-gray-800">
                  {item.product.name}
                </h3>

                <span className="text-green-600 font-bold">
                  TZS {Number(item.unit_price).toLocaleString()}
                </span>

                <div className="flex items-center gap-3">
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, item.quantity, "dec")}
                      disabled={busyId === item.id}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                    >
                      -
                    </button>

                    <span className="px-4">{item.quantity}</span>

                    <button
                      type="button"
                      onClick={() => updateQty(item.id, item.quantity, "inc")}
                      disabled={busyId === item.id}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    disabled={busyId === item.id}
                    className="text-red-500 text-sm hover:underline disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="font-bold text-gray-700">
                TZS {Number(item.subtotal).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm h-fit sticky top-24">
          <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

          <div className="flex justify-between text-sm mb-2">
            <span>Subtotal</span>
            <span>TZS {Number(cart.subtotal).toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-sm mb-2">
            <span>Delivery</span>
            <span className="text-green-600">
              {Number(cart.delivery_fee) === 0
                ? "Free"
                : `TZS ${Number(cart.delivery_fee).toLocaleString()}`}
            </span>
          </div>

          <div className="border-t my-3"></div>

          <div className="flex justify-between font-bold text-lg mb-4">
            <span>Total</span>
            <span className="text-green-600">
              TZS {Number(cart.total).toLocaleString()}
            </span>
          </div>

          <Link
            to="/checkout"
            className="block text-center w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition shadow hover:shadow-lg"
          >
            Proceed to Checkout
          </Link>

          <p className="text-xs text-gray-500 mt-3 text-center">
            Malipo wakati wa kupokea 🚚
          </p>
        </div>
      </div>
    </section>
  );
}

export default Cart;