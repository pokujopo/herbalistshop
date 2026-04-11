function WhyChooseUs() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-screen-xl mx-auto px-4">

        {/* TITLE */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Kwa Nini Uchague Sisi?
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Tunajali afya yako kwa kutoa huduma bora na bidhaa zenye ubora
          </p>
        </div>

        {/* CONTENT */}
        <div className="grid md:grid-cols-2 gap-8 items-center">

          {/* LEFT IMAGE */}
          <div className="overflow-hidden rounded-2xl">
            <img
              src="../src/assets/1-7.jpg"
              alt="Why choose us"
              className="w-full h-full object-cover hover:scale-105 transition duration-500"
            />
          </div>

          {/* RIGHT TEXT */}
          <div className="space-y-6">

            {/* ITEM */}
            <div className="flex gap-4">
              <div className="text-2xl">🌿</div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  Bidhaa Halisi za Asili
                </h3>
                <p className="text-sm text-gray-500">
                  Tunatumia viambato vya asili vilivyo salama kwa afya yako
                </p>
              </div>
            </div>

            {/* ITEM */}
            <div className="flex gap-4">
              <div className="text-2xl">⚡</div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  Matokeo ya Haraka
                </h3>
                <p className="text-sm text-gray-500">
                  Wateja wengi wanaona matokeo ndani ya muda mfupi
                </p>
              </div>
            </div>

            {/* ITEM */}
            <div className="flex gap-4">
              <div className="text-2xl">💰</div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  Bei Nafuu
                </h3>
                <p className="text-sm text-gray-500">
                  Tunatoa ubora wa juu kwa bei rafiki kwa kila mtu
                </p>
              </div>
            </div>

            {/* ITEM */}
            <div className="flex gap-4">
              <div className="text-2xl">🤝</div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  Wateja Kwanza
                </h3>
                <p className="text-sm text-gray-500">
                  Tunatoa huduma bora na ushauri kwa kila mteja
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;