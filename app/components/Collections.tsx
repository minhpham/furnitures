const CARDS = [
  {
    title: "Living Room",
    count: "48 pieces",
    image:
      "https://images.unsplash.com/photo-1631510390389-c1e4fb20ff31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
    alt: "Living Room",
  },
  {
    title: "Dining Room",
    count: "36 pieces",
    image:
      "https://images.unsplash.com/photo-1759238136854-a43787126db7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
    alt: "Dining Room",
  },
  {
    title: "Bedroom",
    count: "52 pieces",
    image:
      "https://images.unsplash.com/photo-1644057501622-dfa7dd26dbfb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
    alt: "Bedroom",
  },
];

function CollectionCard({
  title,
  count,
  image,
  alt,
}: (typeof CARDS)[number]) {
  return (
    <div className="flex flex-col flex-1 rounded-xl overflow-hidden h-[480px]">
      <img
        src={image}
        alt={alt}
        className="w-full h-[360px] object-cover rounded-t-xl"
      />
      <div className="flex flex-col gap-1 bg-white rounded-b-xl px-6 py-5">
        <h3 className="font-cormorant text-[22px] text-[#2C2420] font-normal">
          {title}
        </h3>
        <span className="font-inter text-[12px] text-[#B5AFA7]">{count}</span>
      </div>
    </div>
  );
}

export default function Collections() {
  return (
    <section id="collections" className="flex flex-col w-full gap-12 bg-[#FAF8F5] p-20">
      {/* Header */}
      <div className="flex flex-col items-center w-full gap-4">
        <span className="font-inter text-[11px] tracking-[3px] text-[#C9A962] uppercase">
          CURATED FOR YOU
        </span>
        <h2 className="font-cormorant text-[48px] text-[#2C2420] font-normal text-center">
          Featured Collections
        </h2>
        <p className="font-inter text-[14px] text-[#8A8078] text-center w-[520px]" style={{ lineHeight: 1.7 }}>
          Each collection is thoughtfully curated to bring harmony, beauty, and
          function to every room in your home.
        </p>
      </div>

      {/* Grid */}
      <div className="flex w-full gap-6">
        {CARDS.map((card) => (
          <CollectionCard key={card.title} {...card} />
        ))}
      </div>
    </section>
  );
}
