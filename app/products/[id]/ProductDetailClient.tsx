"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Layers, ShieldCheck, Truck } from "lucide-react";
import type { Product } from "@/hooks/use-products";
import { useCart } from "@/lib/cart-context";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatPrice(value: string | number): string {
  const n = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(n)) return "—";
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

// ── Header ────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Collections", href: "/#collections" },
  { label: "Craftsmanship", href: "/#craftsmanship" },
  { label: "About", href: "/#features" },
  { label: "Contact", href: "/#contact" },
];

function ProductHeader() {
  return (
    <header className="flex items-center justify-between w-full py-6 px-[120px] bg-white border-b border-[#EEEEEE]">
      {/* Logo */}
      <Link
        href="/"
        className="text-[28px] italic text-black"
        style={{ fontFamily: "Instrument Serif" }}
      >
        MILAN
      </Link>

      {/* Nav */}
      <nav className="flex items-center gap-12">
        {NAV_LINKS.map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className="text-[14px] text-[#666666] hover:text-black transition-colors"
            style={{ fontFamily: "Inter" }}
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Placeholder user area */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center flex-shrink-0">
          <span
            className="text-white text-sm font-medium leading-none"
            style={{ fontFamily: "Inter" }}
          >
            AT
          </span>
        </div>
        <span
          className="text-[14px] font-medium text-black"
          style={{ fontFamily: "Inter" }}
        >
          Milan
        </span>
      </div>
    </header>
  );
}

// ── Breadcrumb ────────────────────────────────────────────────────────────────

function Breadcrumb({
  category,
  productName,
}: {
  category: string;
  productName: string;
}) {
  return (
    <nav
      className="flex items-center gap-2 py-4 px-[120px]"
      aria-label="Breadcrumb"
    >
      <Link
        href="/"
        className="text-[12px] text-[#888888] hover:text-black transition-colors"
        style={{ fontFamily: "Inter" }}
      >
        Home
      </Link>
      <span className="text-[12px] text-[#CCCCCC]" style={{ fontFamily: "Inter" }}>
        /
      </span>
      <span className="text-[12px] text-[#888888]" style={{ fontFamily: "Inter" }}>
        {category}
      </span>
      <span className="text-[12px] text-[#CCCCCC]" style={{ fontFamily: "Inter" }}>
        /
      </span>
      <span
        className="text-[12px] text-black font-medium"
        style={{ fontFamily: "Inter" }}
      >
        {productName}
      </span>
    </nav>
  );
}

// ── Image Gallery ─────────────────────────────────────────────────────────────

interface GalleryProps {
  images: string[];
  productName: string;
  selectedIndex: number;
  onSelect: (index: number) => void;
}

function ImageGallery({
  images,
  productName,
  selectedIndex,
  onSelect,
}: GalleryProps) {
  const mainSrc = images[selectedIndex] ?? null;

  return (
    <div className="flex flex-col gap-4 flex-1 min-w-0">
      {/* Main image */}
      <div className="relative w-full h-[500px] bg-[#F5F5F5] overflow-hidden">
        {mainSrc ? (
          <Image
            src={mainSrc}
            alt={productName}
            fill
            sizes="(max-width: 1440px) 60vw, 800px"
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#CCCCCC"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-4">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(i)}
              className="relative flex-1 h-[120px] bg-[#F5F5F5] overflow-hidden focus:outline-none"
              style={{
                border: i === selectedIndex ? "2px solid #000000" : "2px solid transparent",
              }}
              aria-label={`View image ${i + 1}`}
              aria-pressed={i === selectedIndex}
            >
              <Image
                src={src}
                alt={`${productName} — view ${i + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Quantity Control ──────────────────────────────────────────────────────────

function QuantityControl({
  quantity,
  stock,
  onDecrement,
  onIncrement,
}: {
  quantity: number;
  stock: number;
  onDecrement: () => void;
  onIncrement: () => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span
        className="text-[14px] font-medium text-black"
        style={{ fontFamily: "Inter" }}
      >
        Quantity
      </span>
      <div className="flex items-center gap-0">
        <button
          type="button"
          onClick={onDecrement}
          disabled={quantity <= 1}
          aria-label="Decrease quantity"
          className="w-10 h-10 flex items-center justify-center border border-[#DDDDDD] text-black hover:bg-[#F5F5F5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          style={{ fontFamily: "Inter" }}
        >
          −
        </button>
        <div
          className="w-14 h-10 flex items-center justify-center border-t border-b border-[#DDDDDD] text-[14px] text-black"
          style={{ fontFamily: "Inter" }}
        >
          {quantity}
        </div>
        <button
          type="button"
          onClick={onIncrement}
          disabled={quantity >= stock}
          aria-label="Increase quantity"
          className="w-10 h-10 flex items-center justify-center border border-[#DDDDDD] text-black hover:bg-[#F5F5F5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          style={{ fontFamily: "Inter" }}
        >
          +
        </button>
      </div>
      {stock <= 10 && stock > 0 && (
        <span
          className="text-[12px] text-red-600"
          style={{ fontFamily: "Inter" }}
        >
          Only {stock} left
        </span>
      )}
    </div>
  );
}

// ── Spec Row ──────────────────────────────────────────────────────────────────

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#EEEEEE] last:border-b-0">
      <span
        className="text-[14px] text-[#888888]"
        style={{ fontFamily: "Inter" }}
      >
        {label}
      </span>
      <span
        className="text-[14px] text-black"
        style={{ fontFamily: "Inter" }}
      >
        {value}
      </span>
    </div>
  );
}

// ── Feature Card ──────────────────────────────────────────────────────────────

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col flex-1 gap-4">
      <div className="text-black">{icon}</div>
      <h3
        className="text-[16px] font-medium text-black"
        style={{ fontFamily: "Inter" }}
      >
        {title}
      </h3>
      <p
        className="text-[14px] text-[#666666] leading-[1.5]"
        style={{ fontFamily: "Inter" }}
      >
        {description}
      </p>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

interface Props {
  product: Product;
}

export function ProductDetailClient({ product }: Props) {
  const { addItem, openCart } = useCart();

  // Gallery state
  const galleryImages: string[] = (() => {
    if (product.images && product.images.length > 0) return product.images;
    if (product.thumbnail) return [product.thumbnail];
    return [];
  })();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Quantity state
  const [quantity, setQuantity] = useState(1);
  const maxQty = product.stock ?? 1;

  function decrement() {
    setQuantity((q) => Math.max(1, q - 1));
  }
  function increment() {
    setQuantity((q) => Math.min(maxQty, q + 1));
  }

  function handleAddToCart() {
    addItem(
      {
        id: product.id,
        productId: product.id,
        name: product.name,
        price: Number(product.price),
        discountPrice: product.discountPrice != null ? Number(product.discountPrice) : null,
        thumbnail: product.thumbnail ?? null,
        stock: product.stock ?? 1,
      },
      quantity,
    );
    openCart();
  }

  // Derived
  const categoryName = product.category?.name ?? "UNCATEGORIZED";
  const breadcrumbCategory = product.category?.name ?? "Products";

  const displayPrice = product.discountPrice ?? product.price;
  const hasDiscount =
    product.discountPrice != null &&
    Number(product.discountPrice) !== Number(product.price);

  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      {/* Header */}
      <ProductHeader />

      {/* Breadcrumb */}
      <Breadcrumb
        category={breadcrumbCategory}
        productName={product.name}
      />

      {/* Main product section */}
      <section className="flex gap-20 px-[120px] py-10">
        {/* Left — image gallery */}
        <ImageGallery
          images={galleryImages}
          productName={product.name}
          selectedIndex={selectedImageIndex}
          onSelect={setSelectedImageIndex}
        />

        {/* Right — product info */}
        <div className="flex flex-col gap-8 w-[500px] flex-shrink-0">
          {/* Category */}
          <span
            className="text-[11px] text-[#888888] uppercase tracking-[2px]"
            style={{ fontFamily: "Inter" }}
          >
            {categoryName}
          </span>

          {/* Title */}
          <h1
            className="text-[44px] italic text-black leading-[1.1] font-normal -mt-6"
            style={{ fontFamily: "Instrument Serif" }}
          >
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 -mt-4">
            <span
              className="text-[32px] font-medium text-black"
              style={{ fontFamily: "Inter" }}
            >
              {formatPrice(displayPrice)}
            </span>
            {hasDiscount && (
              <span
                className="text-[20px] text-[#888888] line-through"
                style={{ fontFamily: "Inter" }}
              >
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p
              className="text-[16px] text-[#666666] leading-[1.6] -mt-4"
              style={{ fontFamily: "Inter" }}
            >
              {product.description}
            </p>
          )}

          {/* Color section */}
          {product.color && (
            <div className="flex flex-col gap-2">
              <span
                className="text-[14px] font-medium text-black"
                style={{ fontFamily: "Inter" }}
              >
                Color
              </span>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full border-2 border-black"
                  style={{ backgroundColor: product.color }}
                  title={product.color}
                  aria-label={`Color: ${product.color}`}
                />
                <span
                  className="text-[14px] text-[#666666]"
                  style={{ fontFamily: "Inter" }}
                >
                  {product.color}
                </span>
              </div>
            </div>
          )}

          {/* Size / Dimensions section */}
          {product.dimensions && (
            <div className="flex flex-col gap-2">
              <span
                className="text-[14px] font-medium text-black"
                style={{ fontFamily: "Inter" }}
              >
                Size
              </span>
              <div>
                <button
                  type="button"
                  className="px-4 py-2 border-2 border-black text-[14px] text-black font-medium"
                  style={{ fontFamily: "Inter" }}
                  aria-pressed="true"
                >
                  {product.dimensions}
                </button>
              </div>
            </div>
          )}

          {/* Quantity */}
          <QuantityControl
            quantity={quantity}
            stock={maxQty}
            onDecrement={decrement}
            onIncrement={increment}
          />

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={maxQty === 0}
              className="w-full h-14 bg-black text-white text-[14px] font-medium hover:bg-[#111111] active:bg-[#333333] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              style={{ fontFamily: "Inter" }}
            >
              {maxQty === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={maxQty === 0}
              className="w-full h-14 bg-white text-black text-[14px] font-medium border-2 border-black hover:bg-[#F5F5F5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              style={{ fontFamily: "Inter" }}
            >
              Buy Now
            </button>
          </div>

          {/* Specifications */}
          <div className="flex flex-col gap-3">
            <span
              className="text-[14px] font-medium text-black"
              style={{ fontFamily: "Inter" }}
            >
              Specifications
            </span>
            <div className="flex flex-col">
              <SpecRow label="Material" value={product.material ?? "—"} />
              <SpecRow label="Dimensions" value={product.dimensions ?? "—"} />
              <SpecRow
                label="Weight"
                value={product.weight != null ? `${product.weight} kg` : "—"}
              />
              <SpecRow label="SKU" value={product.sku ?? "—"} />
              <SpecRow label="Stock" value={`${product.stock ?? 0} units`} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="flex flex-col gap-10 bg-[#F5F5F5] px-[120px] py-20">
        <h2
          className="text-[32px] italic text-black font-normal"
          style={{ fontFamily: "Instrument Serif" }}
        >
          Product Features
        </h2>
        <div className="flex gap-10">
          <FeatureCard
            icon={<Layers size={32} />}
            title="Premium Materials"
            description="Handpicked linen and solid oak construction"
          />
          <FeatureCard
            icon={<ShieldCheck size={32} />}
            title="Lifetime Warranty"
            description="Comprehensive coverage on all structural components"
          />
          <FeatureCard
            icon={<Truck size={32} />}
            title="White Glove Delivery"
            description="Professional setup and installation included"
          />
        </div>
      </section>
    </div>
  );
}
