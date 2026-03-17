import { ArrowRight } from "lucide-react";

const PRODUCTS = [
  {
    name: "Aria Lounge Chair",
    category: "Living Collection",
    price: "$2,490",
    image:
      "https://images.unsplash.com/photo-1573736860558-79527a353222?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
    badge: "New",
  },
  {
    name: "Lumière Side Table",
    category: "Accent Collection",
    price: "$1,290",
    image:
      "https://images.unsplash.com/photo-1601841448120-e913cf2c7267?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    name: "Soleil Dining Table",
    category: "Dining Collection",
    price: "$4,890",
    image:
      "https://images.unsplash.com/photo-1758977403865-f79e156415b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    name: "Nuit Bed Frame",
    category: "Bedroom Collection",
    price: "$3,690",
    image:
      "https://images.unsplash.com/photo-1759691337809-0ddaa66818de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

function ProductCard({
  name,
  category,
  price,
  image,
  badge,
}: (typeof PRODUCTS)[number]) {
  return (
    <div className="flex flex-col flex-1 gap-4 h-[480px]">
      <div className="relative h-[340px] rounded-xl overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover rounded-xl"
        />
        {badge && (
          <div className="absolute bottom-4 left-4">
            <span className="font-inter text-[11px] text-[#2C2420] bg-[#C9A962] px-3 py-1 rounded-full">
              {badge}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-cormorant text-[20px] text-[#2C2420] font-normal">
          {name}
        </h3>
        <span className="font-inter text-[12px] text-[#B5AFA7]">{category}</span>
        <span className="font-inter text-[14px] font-semibold text-[#2C2420] mt-1">
          {price}
        </span>
      </div>
    </div>
  );
}

export default function ProductsSection() {
  return (
    <section className="flex flex-col w-full gap-12 bg-[#FAF8F5] p-20">
      {/* Header */}
      <div className="flex flex-row items-end justify-between w-full">
        <div className="flex flex-col gap-2">
          <span className="font-inter text-[11px] tracking-[3px] text-[#C9A962] uppercase">
            BESTSELLERS
          </span>
          <h2 className="font-cormorant text-[42px] text-[#2C2420] font-normal">
            Most Loved Pieces
          </h2>
        </div>
        <a
          href="/products"
          className="flex items-center gap-2 font-inter text-[13px] text-[#C9A962] hover:opacity-80 transition-opacity mb-2"
        >
          View All Products
          <ArrowRight size={16} />
        </a>
      </div>

      {/* Grid */}
      <div className="flex w-full gap-6">
        {PRODUCTS.map((product) => (
          <ProductCard key={product.name} {...product} />
        ))}
      </div>
    </section>
  );
}
