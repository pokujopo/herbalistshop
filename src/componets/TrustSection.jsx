function TrustSection() {
  return (
    <section className="bg-gray-50 py-10">
      <div className="max-w-screen-xl mx-auto px-4">

        {/* TITLE */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Kwa Nini Uchague HerbalCare 🌿
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Tunakupa bidhaa bora za asili zenye ubora na uhakika
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

          {/* ITEM 1 */}
          <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition text-center group">
            <div className="text-3xl mb-3 group-hover:scale-110 transition">
              🌿
            </div>
            <h3 className="font-semibold text-gray-800 text-sm md:text-base">
              100% Asili
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Bidhaa zote ni za asili bila kemikali hatari
            </p>
          </div>

          {/* ITEM 2 */}
          <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition text-center group">
            <div className="text-3xl mb-3 group-hover:scale-110 transition">
              🚚
            </div>
            <h3 className="font-semibold text-gray-800 text-sm md:text-base">
              Delivery Haraka
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Tunasafirisha bidhaa kwa haraka kote nchini
            </p>
          </div>

          {/* ITEM 3 */}
          <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition text-center group">
            <div className="text-3xl mb-3 group-hover:scale-110 transition">
              💊
            </div>
            <h3 className="font-semibold text-gray-800 text-sm md:text-base">
              Imethibitishwa
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Ubora umehakikishwa na wataalamu wa afya
            </p>
          </div>

          {/* ITEM 4 */}
          <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition text-center group">
            <div className="text-3xl mb-3 group-hover:scale-110 transition">
              📞
            </div>
            <h3 className="font-semibold text-gray-800 text-sm md:text-base">
              Support 24/7
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Tuko tayari kukusaidia muda wowote
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

export default TrustSection;