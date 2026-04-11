import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

function Category() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fallbackImages = [
    "../src/assets/MIU_Blog-COVER_HomeRemediesforED.jpg",
    "../src/assets/dr-eyes-scaled.jpg",
    "../src/assets/img_20220429_063425_869.jpg",
    "../src/assets/MIU_Blog-COVER_HomeRemediesforED.jpg",
    "../src/assets/MIU_Blog-COVER_HomeRemediesforED.jpg",
  ];

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get("/categories");
      setCategories(res.data.data || res.data.categories || []);
    } catch (err) {
      console.log(err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="bg-white w-full py-8">
        <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className={`rounded-2xl bg-gray-100 animate-pulse ${
                item === 1 ? "col-span-2 row-span-2 min-h-[300px]" : "min-h-[150px]"
              }`}
            />
          ))}
        </div>
      </section>
    );
  }

  if (!categories.length) {
    return null;
  }

  const bigCategory = categories[0];
  const smallCategories = categories.slice(1, 5);

  return (
    <section className="bg-white w-full py-8">
      <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

        {/* BIG CARD */}
        <div
          onClick={() => navigate(`/allproduct?category=${bigCategory.slug}`)}
          className="relative col-span-2 row-span-2 rounded-2xl overflow-hidden group cursor-pointer"
        >
          <img
            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
            src={bigCategory.image || fallbackImages[0]}
            alt={bigCategory.name}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

          <div className="absolute bottom-4 left-4 text-white">
            <h2 className="text-xl font-bold">{bigCategory.name}</h2>
            <p className="text-sm">
              {bigCategory.description || "Linda afya yako kila siku"}
            </p>
          </div>
        </div>

        {/* SMALL CARDS */}
        {smallCategories.map((item, index) => (
          <div
            key={item.id}
            onClick={() => navigate(`/allproduct?category=${item.slug}`)}
            className="relative rounded-2xl overflow-hidden group cursor-pointer"
          >
            <img
              className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              src={item.image || fallbackImages[index + 1] || fallbackImages[0]}
              alt={item.name}
            />

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition"></div>

            <div className="absolute bottom-3 left-3 text-white">
              <h3 className="text-sm font-semibold">{item.name}</h3>
            </div>

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <button
                type="button"
                className="bg-green-600 text-white px-4 py-2 rounded-full text-sm hover:bg-green-700"
              >
                Explore
              </button>
            </div>
          </div>
        ))}

      </div>
    </section>
  );
}

export default Category;