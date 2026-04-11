import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import api from "../lib/api";


function ProductDetail() {
  const { slug } = useParams();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `http://127.0.0.1:8000/api/products/${slug}`
      );

      setProduct(res.data.product);
      setRelated(res.data.related_products);
      setMainImage(res.data.product.thumbnail);

    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

    const handleAddToCart = async () => {
      const token = localStorage.getItem("token");
  
      if (!token) {
        window.location.href = "/auth";
        return;
      }
  
      try {
        setAdding(true);
  
        const res = await api.post("/cart", {
          product_id: product.id,
          quantity: Number(qty),
        });
  
        alert(res.data.message || "Added to cart successfully");
      } catch (err) {
        console.log(err.response?.data || err);
        alert(err.response?.data?.message || "Failed to add to cart");
      } finally {
        setAdding(false);
      }
    };

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  if (loading) {
    return <p className="text-center py-10">Loading...</p>;
  }

  if (!product) {
    return <p className="text-center py-10">Product not found</p>;
  }

 // const [mainImage, setMainImage] = useState(images[0])
  //const [qty, setQty] = useState(1)

  return(  
    <section className="bg-gray-50 py-12 px-4">  

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10">  

        {/* IMAGE SECTION */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">

          <div className="aspect-square overflow-hidden rounded-xl">
            <img   
              src={mainImage}
              className="w-full h-full object-cover transition duration-500"
              alt=""
            />
          </div>  

          {/* thumbnails */}
          <div className="flex gap-3 mt-4">
            {[product.thumbnail, ...(product.images || []).map(i => i.url)]
              .filter(Boolean)
              .map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setMainImage(img)}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 
                ${mainImage === img ? "border-green-600" : "border-transparent hover:border-green-400"}`}
                />
              ))}
            
          </div>  
        </div>  

        {/* DETAILS SECTION */}
        <div className="flex flex-col gap-5 md:sticky top-24 h-fit">  
         {product.is_in_stock ?
          <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
            ✔ In Stock
          </div> : <div className="flex items-center gap-2 text-sm text-red-600 font-medium">
            x Finished
          </div>}

          <h1 className="text-3xl font-bold text-gray-800 leading-tight">  
            Dawa ya Asili - {product.name}  
          </h1>  

          {/* rating */}
          <div className="flex items-center gap-2 text-yellow-400 text-sm">
            ⭐ {product.rating || 0}{" "}
            <span className="text-gray-500 text-sm">
              ({product.reviews_count || 0} reviews)
            </span>
          {/*  <span className="text-gray-500">
              ({product.reviews_count} reviews)</span>*/}
          </div>  

          {/* price */}
          <div className="flex items-center gap-3">
            {product.discount_price ? (
              <>
                <span className="text-2xl font-bold text-green-600">
                  {product.discount_price} TZS
                </span>
                <span className="text-gray-400 line-through">
                  {product.price}
                </span>
                <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded">
                   Save {product.discount_percent}%
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-green-600">
                {product.price} TZS
              </span>
            )}
            
          </div>  

          {/* short desc */}
          <p className="text-gray-600 leading-relaxed">
          {product.description}
          </p>  

          {/* quantity */}
          <div className="flex items-center gap-4">

            <div className="flex items-center border rounded-lg overflow-hidden">
              <button 
                onClick={()=>setQty(qty > 1 ? qty - 1 : 1)}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
              >-</button>

              <span className="px-4">{qty}</span>

              <button 
                onClick={()=>setQty(qty + 1)}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
              >+</button>
            </div>

            <span className="text-sm text-gray-500">Available: {product.stock}</span>

          </div>  

          {/* buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-2">

            <button  onClick={handleAddToCart}
              disabled={adding}  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 shadow hover:shadow-lg transition">
               {adding ? "Adding..." : "Add to Cart"}
            </button>  

            <button className="flex-1 border px-6 py-3 rounded-xl hover:bg-gray-100">
              ❤️ Wishlist
            </button>  

          </div>  

          {/* delivery + trust */}
          <div className="bg-white border rounded-xl p-4 flex flex-col gap-2 text-sm text-gray-600">

            <span>🚚 Delivery ndani ya siku 1–3</span>
            <span>💳 Lipa ukipokea (Cash on Delivery)</span>
            <span>🌿 100% Natural & Safe</span>

          </div>

        </div>  
      </div>  

      {/* TABS SECTION
      <div className="max-w-7xl mx-auto mt-14">

        <div className="border-b flex gap-6 text-sm font-medium">
          <button className="border-b-2 border-green-600 pb-2 text-green-600">
            Description
          </button>
          <button className="pb-2 text-gray-500 hover:text-green-600">
            Reviews (120)
          </button>
        </div>

        <div className="mt-6 text-gray-600 leading-relaxed max-w-3xl">
          Bidhaa hii imetengenezwa kwa mimea asilia yenye virutubisho muhimu kwa mwili.
          Inasaidia kuboresha afya kwa ujumla, kuongeza nguvu na kinga ya mwili.
        </div>

      </div>  */}

    </section>  
  )  
}  

export default ProductDetail;