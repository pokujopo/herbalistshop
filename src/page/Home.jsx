import { div } from "framer-motion/client";
import {Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

import Banner from '../componets/Banner.jsx'
import AdsCenter from '../componets/AdsCenter.jsx';
import Product from '../componets/Product.jsx'
import Category from '../componets/Category.jsx'
import TrustSection from '../componets/TrustSection.jsx'
import PromoOffer from "../componets/PromoOffer.jsx";
import WhyChooseUs from "../componets/WhyChooseUs.jsx";
import Newsletter from "../componets/NewsLetter.jsx";
import NewProduct from "../componets/NewProduct.jsx";
import FeaturedProduct from "../componets/FeaturedProduct.jsx";




import {Autoplay, Navigation, Pagination} from  "swiper/modules";

function Home(){
    return(

       <div className="max-w-screen-xl mt-12 mx-auto ">
        <Banner />
        <AdsCenter />
        <Category />
        <Product />
        <NewProduct />
        <FeaturedProduct />
        <TrustSection />
        <PromoOffer />
        <WhyChooseUs />
        <Newsletter />

       
        

       
       </div>
    )
}

export default Home;