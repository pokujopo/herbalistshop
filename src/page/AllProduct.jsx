import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../lib/api";

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const page = Number(searchParams.get("page") || 1);
  const category = searchParams.get("category") || "All";
  const sort = searchParams.get("sort") || "default";
  const featured = searchParams.get("featured") || "";
  const isNew = searchParams.get("is_new") || "";
  const bestSeller = searchParams.get("best_seller") || "";

  const updateQuery = (key, value) => {
    const params = new URLSearchParams(searchParams);

    if (!value || value === "default" || value === "All") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    params.set("page", "1");
    setSearchParams(params);
  };

  const goToPage = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(newPage));
    setSearchParams(params);
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data.data || res.data.categories || []);
    } catch (error) {
      console.log("Error fetching categories:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      params.set("page", page);

      if (category !== "All") params.set("category", category);
      if (sort !== "default") params.set("sort", sort);
      if (featured) params.set("featured", featured);
      if (isNew) params.set("is_new", isNew);
      if (bestSeller) params.set("best_seller", bestSeller);

      const res = await api.get(`/products?${params.toString()}`);
      setProducts(res.data.data || []);
    } catch (error) {
      console.log("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  return (
    <section className="bg-gray-50 mt-16 min-h-screen">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold">Bidhaa Zote</h1>
        <p className="text-gray-500 text-sm">
          Jumla ya bidhaa: {products.length}
        </p>
      </div>

      {/* FILTER + SORT */}
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between gap-4 mb-6">
        {/* FILTER */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => updateQuery("category", "All")}
            className={`px-4 py-2 rounded-full text-sm border ${
              category === "All" ? "bg-green-600 text-white" : "bg-white"
            }`}
          >
            All
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateQuery("category", cat.slug)}
              className={`px-4 py-2 rounded-full text-sm border ${
                category === cat.slug ? "bg-green-600 text-white" : "bg-white"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* SORT */}
        <select
          value={sort}
          onChange={(e) => updateQuery("sort", e.target.value)}
          className="border px-4 py-2 rounded-xl"
        >
          <option value="default">Sort By</option>
          <option value="low">Bei: Ndogo → Kubwa</option>
          <option value="high">Bei: Kubwa → Ndogo</option>
          <option value="popular">Popular</option>
        </select>
      </div>

      {/* ACTIVE TAGS */}
      <div className="max-w-6xl mx-auto px-4 flex flex-wrap gap-2 mb-6">
        {featured === "1" && (
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
            Featured
          </span>
        )}
        {isNew === "1" && (
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
            New
          </span>
        )}
        {bestSeller === "1" && (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
            Best Seller
          </span>
        )}
      </div>

      {/* GRID */}
      <div className="max-w-6xl mx-auto px-4 pb-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          [1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
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
          ))
        ) : products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="group block bg-white rounded-2xl shadow-sm hover:shadow-2xl transition duration-300 overflow-hidden"
            >
              <Link to={`/product/${product.slug}`}>
                <div className="relative w-full aspect-square overflow-hidden">
                  <img
                    src={product.thumbnail}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />

                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.discount_percent && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-md">
                        -{product.discount_percent}%
                      </span>
                    )}

                    {product.is_best_seller && (
                      <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-md">
                        Best
                      </span>
                    )}

                    {product.is_new && (
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-md">
                        New
                      </span>
                    )}

                    {product.is_featured && (
                      <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-md">
                        Featured
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-white/80 backdrop-blur p-2 rounded-full hover:bg-white"
                  >
                    ❤️
                  </button>

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300"></div>

                  <div className="absolute inset-0 flex flex-col justify-center items-center gap-2 opacity-0 group-hover:opacity-100 transition duration-300">
                    <button
                      type="button"
                      className="bg-green-600 text-white px-5 py-2 rounded-full text-sm hover:bg-green-700"
                    >
                      Nunua Sasa
                    </button>

                    <button
                      type="button"
                      className="bg-white text-black px-5 py-2 rounded-full text-sm hover:bg-gray-200"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </Link>

              <div className="p-4 flex flex-col gap-1">
                <Link to={`/product/${product.slug}`}>
                  <h3 className="font-semibold text-gray-800 line-clamp-1 hover:text-green-600">
                    Dawa ya Asili - {product.name}
                  </h3>
                </Link>

                <p className="text-sm text-gray-500 line-clamp-2">
                  {product.short_description || "Bidhaa bora ya afya ya asili."}
                </p>

                <div className="text-yellow-400 text-sm">
                  ⭐ {product.rating || 0}{" "}
                  <span className="text-gray-400">
                    ({product.reviews_count || 0})
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {product.discount_price ? (
                    <>
                      <span className="font-bold text-green-600">
                        TZS {Number(product.discount_price).toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        TZS {Number(product.price).toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <span className="font-bold text-green-600">
                      TZS {Number(product.price).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-10">
            Hakuna bidhaa zilizopatikana.
          </div>
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-4 mt-2 pb-10">
        <button
          onClick={() => goToPage(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <button
          onClick={() => goToPage(page + 1)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>
    </section>
  );
}

export default ProductsPage;