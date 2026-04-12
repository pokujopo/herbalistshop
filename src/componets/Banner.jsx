import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import img1 from "../assets/natural-remedies-1315042436-1024x577.jpg"
import img2 from "../assets/fangasi-za-za-ukeni2.png"
import img3 from "../assets/1-7.jpg"
import { Autoplay, Navigation, Pagination } from "swiper/modules";

function Banner() {
  return (
    <Swiper
      modules={[Autoplay, Navigation, Pagination]}
      spaceBetween={0}
      slidesPerView={1}
      loop={true}
      autoplay={{
        delay: 4000,
        disableOnInteraction: false,
      }}
      navigation={true}
      pagination={{ clickable: true }}
      className="w-full h-[240px] md:h-[420px] lg:h-[520px]"
    >
      
      {/* SLIDE 1 */}
      <SwiperSlide>
        <div className="relative w-full h-full">
          <img
            className="w-full h-full object-cover"
            src={img3}
            alt="Dawa za asili"
          />

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

          {/* CONTENT */}
          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 text-white max-w-xl">
            <h2 className="text-2xl md:text-4xl font-bold leading-tight">
              Dawa za Asili Zenye Uhakika
            </h2>
            <p className="mt-2 text-sm md:text-base text-gray-200">
              Imarisha afya yako kwa tiba salama na za asili
            </p>

            {/* BUTTONS */}
            <div className="mt-4 flex gap-3">
              <a href="/shop" className="bg-green-600 px-5 py-2 rounded-full text-sm hover:bg-green-700 transition">
                Shop Now
              </a>
              <a href="/about" className="border border-white px-5 py-2 rounded-full text-sm hover:bg-white hover:text-black transition">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </SwiperSlide>

      {/* SLIDE 2 */}
      <SwiperSlide>
        <div className="relative w-full h-full">
          <img
            className="w-full h-full object-cover"
            src={img1}
            alt="Afya ya Mwili"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 text-white max-w-xl">
            <h2 className="text-2xl md:text-4xl font-bold">
              Linda Kinga Yako
            </h2>
            <p className="mt-2 text-sm md:text-base text-gray-200">
              Virutubisho bora kwa maisha yenye afya
            </p>

            <div className="mt-4">
              <a href="/shop" className="bg-green-600 px-5 py-2 rounded-full text-sm hover:bg-green-700 transition">
                Shop Now
              </a>
            </div>
          </div>
        </div>
      </SwiperSlide>

      {/* SLIDE 3 */}
      <SwiperSlide>
        <div className="relative w-full h-full">
          <img
            className="w-full h-full object-cover"
            src={img2}
            alt="Afya ya Wanawake"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 text-white max-w-xl">
            <h2 className="text-2xl md:text-4xl font-bold">
              Afya ya Wanawake
            </h2>
            <p className="mt-2 text-sm md:text-base text-gray-200">
              Tiba salama kwa matatizo ya wanawake
            </p>

            <div className="mt-4">
              <a href="/shop" className="bg-green-600 px-5 py-2 rounded-full text-sm hover:bg-green-700 transition">
                Explore
              </a>
            </div>
          </div>
        </div>
      </SwiperSlide>

      {/* SIMPLE IMAGE SLIDES 
      {[
        "../src/assets/thumb_1598_800_420_0_0_crop.jpg",
        "../src/assets/saumu.png",
      ].map((img, index) => (
        <SwiperSlide key={index}>
          <img className="w-full h-full object-cover" src={img} alt="banner" />
        </SwiperSlide>
      ))}
*/}
    </Swiper>
  );
}

export default Banner;
