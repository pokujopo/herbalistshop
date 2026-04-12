import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";

function NewProduct() {
  const [datas, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        setLoading(true);

        const res = await api.get("/products?is_new=1");
        setData(res.data.data || []);
      } catch (error) {
        console.log("Error fetching new products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewProducts();
  }, []);

  return (
    <section className="bg-gray-50 w-full py-10">
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-2 mb-8">
        <h2 className="text-3xl font-bold text-gray-800">New Products</h2>
        <p className="text-gray-500 text-sm">
          Bidhaa mpya zilizoongezwa hivi karibuni
        </p>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="max-w-7xl mx-auto grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-5 px-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse"
            >
              <div className="aspect-square bg-gray-200"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* PRODUCTS GRID */}
          <div className="max-w-7xl mx-auto grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-5 px-4">

            {datas.map((item) => (
              <div
                key={item.id}
                className="group block bg-white rounded-2xl shadow-sm hover:shadow-2xl transition duration-300 overflow-hidden"
              >

                <div className="relative w-full aspect-square overflow-hidden">

                  {/* IMAGE */}
                  <img
                    src={`https://${item.thumbnail}`}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />

                  {/* BADGES */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">

                    {item.discount_percent && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-md">
                        -{item.discount_percent}%
                      </span>
                    )}

                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-md">
                      New
                    </span>

                  </div>

                  {/* FAVORITE */}
                  <button className="absolute top-2 right-2 bg-white/80 backdrop-blur p-2 rounded-full hover:bg-white">
                    ❤️
                  </button>

                  {/* OVERLAY */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300"></div>

                  {/* ACTIONS */}
                  <div className="absolute inset-0 flex flex-col justify-center items-center gap-2 opacity-0 group-hover:opacity-100 transition duration-300">

                    <button
                      onClick={() => navigate(`/product/${item.slug}`)}
                      className="bg-green-600 text-white px-5 py-2 rounded-full text-sm hover:bg-green-700"
                    >
                      Nunua Sasa
                    </button>

                    <button
                      onClick={() => navigate(`/product/${item.slug}`)}
                      className="bg-white text-black px-5 py-2 rounded-full text-sm hover:bg-gray-200"
                    >
                      View Details
                    </button>

                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-4 flex flex-col gap-1">

                  <Link to={`/product/${item.slug}`}>
                    <h3 className="font-semibold text-gray-800 line-clamp-1 hover:text-green-600">
                      Dawa ya Asili - {item.name}
                    </h3>
                  </Link>

                  <p className="text-sm text-gray-500 line-clamp-2">
                    {item.short_description || "Bidhaa mpya yenye ubora wa hali ya juu."}
                  </p>

                  {/* RATING */}
                  <div className="text-yellow-400 text-sm">
                    ⭐ {item.rating || 0}{" "}
                    <span className="text-gray-400">
                      ({item.reviews_count || 0})
                    </span>
                  </div>

                  {/* PRICE */}
                  <div className="flex items-center gap-2 mt-1 flex-wrap">

                    {item.discount_price ? (
                      <>
                        <span className="font-bold text-green-600">
                          TZS {Number(item.discount_price).toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          TZS {Number(item.price).toLocaleString()}
                        </span>
                      </>
                    ) : (
                      <span className="font-bold text-green-600">
                        TZS {Number(item.price).toLocaleString()}
                      </span>
                    )}

                  </div>

                </div>
              </div>
            ))}

          </div>

          {/* VIEW MORE */}
          <div className="flex justify-center mt-10">
            <Link
              to="/allproduct"
              className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition duration-300 shadow-md hover:shadow-xl"
            >
              View More Products →
            </Link>
          </div>
        </>
      )}

    </section>
  );
}

export default NewProduct;
