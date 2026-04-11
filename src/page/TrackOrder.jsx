import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../lib/api";

function TrackOrder() {
  const { orderNumber } = useParams();
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);

  const steps = ["pending", "processing", "shipped", "delivered"];

  const fetchTracking = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/orders/${orderNumber}/track`);
      setTracking(res.data.tracking);
    } catch (err) {
      console.log(err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracking();
  }, [orderNumber]);

  if (loading) return <p className="text-center py-10">Loading tracking...</p>;
  if (!tracking) return <p className="text-center py-10">Tracking not found</p>;

  const currentStep = steps.indexOf(tracking.status);

  return (
    <section className="bg-gray-50 mt-16 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">
          Track Order #{tracking.order_number}
        </h2>

        <div className="flex justify-between items-center gap-2">
          {steps.map((step, i) => (
            <div key={step} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full ${
                  i <= currentStep ? "bg-green-600 text-white" : "bg-gray-200"
                }`}
              >
                {i + 1}
              </div>

              <p className="text-xs mt-2 capitalize">{step}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-sm text-gray-600 space-y-2">
          <p><strong>Payment Status:</strong> {tracking.payment_status}</p>
          <p><strong>Tracking Number:</strong> {tracking.tracking_number || "Not assigned yet"}</p>
        </div>
      </div>
    </section>
  );
}

export default TrackOrder;