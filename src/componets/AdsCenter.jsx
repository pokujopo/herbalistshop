import {Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import {Autoplay, Navigation, Pagination} from  "swiper/modules";


function AdsCenter(){
    return(
         <section className="p-5 bg-white w-full  flex items-center justify-center">

        
         <Swiper 
           modules={[Autoplay, Navigation, Pagination]}
           spaceBetween={0}
           slidesPerView={1}
           loop={true}
           autoplay={{
            delay: 3000,
            disableOnInteraction: false,
           }}
           className="w-full"
         
         >
          <SwiperSlide>
           <div className=" text-gray-400 aspect-w-1 aspect-h-1 flex items-center justify-center font-semibold">
          <p className="border-gray-400 border-2  px-4  rounded-2xl">free deliverl</p>
           </div>
          </SwiperSlide>
           <SwiperSlide>
           <div className=" text-gray-400 aspect-w-1 aspect-h-1  flex items-center justify-center font-semibold">
          <p className="border-gray-400 border-2  px-4  rounded-2xl">Friday offer</p>
           </div>
          </SwiperSlide>
          </Swiper>
          </section>
    )
}
export default  AdsCenter;