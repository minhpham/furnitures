const COLUMNS = [
  {
    images: [
      {
        src: "https://images.unsplash.com/photo-1761570392021-d8a2d93004df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
        alt: "Inspiration 1",
        tall: true,
      },
      {
        src: "https://images.unsplash.com/photo-1595515106886-43b1443a2e8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
        alt: "Inspiration 2",
        tall: false,
      },
    ],
  },
  {
    images: [
      {
        src: "https://images.unsplash.com/photo-1551909386-707ddce67573?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
        alt: "Inspiration 3",
        tall: false,
      },
      {
        src: "https://images.unsplash.com/photo-1737724853887-3dbcb7bdd0a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
        alt: "Inspiration 4",
        tall: true,
      },
    ],
  },
  {
    images: [
      {
        src: "https://images.unsplash.com/photo-1767021916245-53815bb14623?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
        alt: "Inspiration 5",
        tall: true,
      },
      {
        src: "https://images.unsplash.com/photo-1767706508376-84ab4d8ca165?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
        alt: "Inspiration 6",
        tall: false,
      },
    ],
  },
];

export default function InspirationSection() {
  return (
    <section className="flex flex-col w-full gap-12 bg-[#FAF8F5] p-20">
      {/* Header */}
      <div className="flex flex-col items-center w-full gap-4">
        <span className="font-inter text-[11px] tracking-[3px] text-[#C9A962] uppercase">
          INTERIOR INSPIRATION
        </span>
        <h2 className="font-cormorant text-[42px] text-[#2C2420] font-normal text-center">
          Rooms We Love
        </h2>
        <p className="font-inter text-[14px] text-[#8A8078] text-center" style={{ lineHeight: 1.7 }}>
          A curated gallery of interiors designed with Maison pieces.
        </p>
      </div>

      {/* Grid */}
      <div className="flex flex-row w-full gap-5 h-[440px]">
        {COLUMNS.map((col, colIdx) => (
          <div key={colIdx} className="flex flex-col flex-1 gap-5 h-full">
            {col.images.map((img) =>
              img.tall ? (
                <div key={img.alt} className="flex-1 rounded-xl overflow-hidden min-h-0">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              ) : (
                <div
                  key={img.alt}
                  className="rounded-xl overflow-hidden flex-shrink-0"
                  style={{ height: 180 }}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              )
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
