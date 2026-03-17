import { getProducts } from "@/lib/api/products";
import type { Product } from "@/hooks/use-products";
import ProductCardClient from "./ProductCardClient";

// ── Main export ───────────────────────────────────────────────────────────────

export default async function ProductGrid() {
  let products: Product[] = [];

  try {
    const data = await getProducts(1, 9);
    products = data.items.filter((p) => p.isActive);
  } catch {
    // API unavailable — render nothing rather than crash the homepage
    return null;
  }

  if (products.length === 0) return null;

  return (
    <section id="products" className="flex flex-col w-full gap-14 bg-white px-[120px] py-[120px]">
      <div className="flex flex-col items-center w-full gap-4">
        <h2
          className="text-[44px] italic text-black font-normal"
          style={{ fontFamily: "Instrument Serif" }}
        >
          Featured Products
        </h2>
        <p
          className="text-[16px] text-[#888888] text-center leading-[1.6] w-[600px]"
          style={{ fontFamily: "Inter" }}
        >
          Discover our most-loved pieces, crafted for lasting beauty and comfort
        </p>
      </div>

      <div className="flex flex-wrap gap-8">
        {products.map((product) => (
          <ProductCardClient key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
