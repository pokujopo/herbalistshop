import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";

function PromoOffer() {
  const [product, setProduct] = useState(null);

  const fetchOffer = async () => {
    try {
      // chukua product yenye discount kubwa au featured
      const res = await api.get("/products?featured=1");

      const products = res.data.data || [];

      // chukua ya kwanza
      if (products.length > 0) {
        setProduct(products[0]);
      }
    } catch (error) {
      console.log("Promo error:", error);
    }
  };

  useEffect(() => {
    fetchOffer();
  }, []);

  return (
    <section className="py-10 px-4 bg-white">
      <div className="max-w-screen-xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-600 to-green-800 text-white p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">

          {/* LEFT CONTENT */}
          <div className="max-w-lg">
            <h2 className="text-2xl md:text-4xl font-bold leading-tight">
              🔥 Offer Maalum ya Wiki
            </h2>

            <p className="mt-3 text-sm md:text-base text-gray-200">
              {product ? (
                <>
                  Pata punguzo hadi{" "}
                  <span className="font-bold text-white">
                    {product.discount_percent || 50}%
                  </span>{" "}
                  kwa <span className="font-semibold">{product.name}</span>.  
                  Harakisha kabla offer haijaisha!
                </>
              ) : (
                <>
                  Pata punguzo hadi{" "}
                  <span className="font-bold text-white">50%</span> kwa dawa zetu za asili.
                </>
              )}
            </p>

            {/* BUTTON */}
            <div className="mt-5 flex gap-3">
              {product ? (
                <Link
                  to={`/product/${product.slug}`}
                  className="bg-white text-green-700 px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition"
                >
                  Shop Now
                </Link>
              ) : (
                <Link
                  to="/allproduct?featured=1"
                  className="bg-white text-green-700 px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition"
                >
                  Shop Now
                </Link>
              )}

              <Link
                to="/allproduct"
                className="border border-white px-6 py-2 rounded-full hover:bg-white hover:text-green-700 transition"
              >
                View Categories
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="mt-6 md:mt-0">
            <img
              src={
                product?.thumbnail ||
                "../src/assets/saumu.png"
              }
              alt="Offer"
              className="w-[140px] md:w-[200px] object-contain drop-shadow-lg"
            />
          </div>

          {/* DECOR */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}

export default PromoOffer;