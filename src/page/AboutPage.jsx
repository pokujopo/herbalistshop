import { FaLeaf, FaShieldAlt, FaShippingFast, FaUserMd } from "react-icons/fa"

function AboutPage(){
  return(
    <section className="bg-white text-gray-800">

      {/* HERO */}
      <div className="relative h-[60vh] w-full">
        <img 
          src="https://images.unsplash.com/photo-1580281657521-3d598c6c6f89"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Kuhusu Sisi 🌿
          </h1>
          <p className="text-gray-200 mt-3 max-w-xl">
            Tunaleta dawa za asili zilizo salama, bora na zenye matokeo ya kweli
          </p>
        </div>
      </div>

      {/* STORY */}
      <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">

        <div>
          <h2 className="text-3xl font-bold mb-4">Hadithi Yetu</h2>
          <p className="text-gray-600 leading-relaxed">
            Tulianza safari yetu kwa lengo moja — kusaidia jamii kupata tiba za asili
            bila gharama kubwa na bila madhara. Bidhaa zetu zinachaguliwa kwa uangalifu,
            zikithibitishwa ubora wake na wataalamu wa afya.
          </p>

          <p className="text-gray-600 mt-4">
            Leo, tunahudumia maelfu ya wateja nchini kote kwa huduma ya haraka na
            uhakika wa ubora.
          </p>
        </div>

        <div className="h-[350px] w-full overflow-hidden rounded-2xl">
          <img 
            src="https://images.unsplash.com/photo-1607613009820-a29f7bb81c04"
            className="w-full h-full object-cover"
          />
        </div>

      </div>

      {/* WHY CHOOSE US */}
      <div className="bg-green-50 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">

          <h2 className="text-3xl font-bold mb-10">Kwa Nini Utuchague?</h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">

            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
              <FaLeaf className="text-green-600 text-3xl mb-3 mx-auto"/>
              <h3 className="font-semibold">Asili Halisi</h3>
              <p className="text-sm text-gray-500 mt-2">
                Bidhaa safi zisizo na kemikali hatari
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
              <FaShieldAlt className="text-green-600 text-3xl mb-3 mx-auto"/>
              <h3 className="font-semibold">Salama</h3>
              <p className="text-sm text-gray-500 mt-2">
                Imethibitishwa na wataalamu wa afya
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
              <FaShippingFast className="text-green-600 text-3xl mb-3 mx-auto"/>
              <h3 className="font-semibold">Usafirishaji Haraka</h3>
              <p className="text-sm text-gray-500 mt-2">
                Delivery nchi nzima ndani ya muda mfupi
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
              <FaUserMd className="text-green-600 text-3xl mb-3 mx-auto"/>
              <h3 className="font-semibold">Ushauri Bure</h3>
              <p className="text-sm text-gray-500 mt-2">
                Pata ushauri wa afya kabla ya kununua
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* STATS */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-4 gap-6 text-center">

          <div>
            <h3 className="text-3xl font-bold text-green-600">10K+</h3>
            <p className="text-gray-500">Wateja</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-green-600">50+</h3>
            <p className="text-gray-500">Bidhaa</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-green-600">5+</h3>
            <p className="text-gray-500">Miaka ya Uzoefu</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-green-600">99%</h3>
            <p className="text-gray-500">Wateja Walioridhika</p>
          </div>

        </div>
      </div>

      {/* TEAM */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">

          <h2 className="text-3xl font-bold mb-10">Timu Yetu</h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">

            <div className="bg-white p-6 rounded-2xl shadow">
              <img src="https://randomuser.me/api/portraits/men/32.jpg"
                className="w-24 h-24 mx-auto rounded-full object-cover"/>
              <h3 className="mt-4 font-semibold">Dr. Musa</h3>
              <p className="text-sm text-gray-500">Mtaalamu wa Tiba Asili</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <img src="https://randomuser.me/api/portraits/women/44.jpg"
                className="w-24 h-24 mx-auto rounded-full object-cover"/>
              <h3 className="mt-4 font-semibold">Aisha</h3>
              <p className="text-sm text-gray-500">Customer Support</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <img src="https://randomuser.me/api/portraits/men/12.jpg"
                className="w-24 h-24 mx-auto rounded-full object-cover"/>
              <h3 className="mt-4 font-semibold">Juma</h3>
              <p className="text-sm text-gray-500">Delivery Manager</p>
            </div>

          </div>

        </div>
      </div>

      {/* CTA */}
      <div className="bg-green-600 py-14 text-center text-white">
        <h2 className="text-3xl font-bold mb-3">
          Jiunge na Maelfu ya Wateja Leo
        </h2>
        <p className="text-green-100 mb-5">
          Anza safari yako ya afya bora kwa kutumia dawa za asili
        </p>

        <button className="bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition">
          Nunua Sasa
        </button>
      </div>

    </section>
  )
}

export default AboutPage