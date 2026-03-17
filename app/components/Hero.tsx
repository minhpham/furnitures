export default function Hero() {
  return (
    <section className="flex flex-row items-center w-full gap-15 px-20 h-[680px] bg-[#FAF8F5] pt-20">
      {/* Left */}
      <div className="flex flex-col w-[520px] gap-7 justify-center h-full">
        <span className="font-inter text-[11px] tracking-[3px] text-[#C9A962] uppercase">
          NEW COLLECTION 2026
        </span>
        <h1
          className="font-cormorant text-[72px] font-semibold text-[#2C2420]"
          style={{ lineHeight: 1.05 }}
        >
          The Art of{"\n"}Living Well
        </h1>
        <p
          className="font-inter text-[15px] text-[#8A8078] w-[440px]"
          style={{ lineHeight: 1.7 }}
        >
          Discover our curated selection of handcrafted furniture, where
          timeless design meets unparalleled quality. Each piece is crafted
          by master artisans to transform your space.
        </p>
        <div className="flex items-center gap-4">
          <a
            href="#collections"
            className="font-inter text-[13px] font-medium text-white bg-[#2C2420] py-[14px] px-8 hover:bg-[#3D3530] transition-colors"
          >
            Shop Collection
          </a>
          <a
            href="#"
            className="font-inter text-[13px] font-medium text-[#2C2420] border border-[#2C2420] py-[14px] px-8 hover:bg-[#2C2420] hover:text-white transition-colors"
          >
            View Lookbook
          </a>
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 h-full rounded-xl overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1632120377007-c2adc3017b1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Luxury living room"
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  );
}
