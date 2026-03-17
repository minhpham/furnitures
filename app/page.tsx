import Header from "./components/Header";
import Hero from "./components/Hero";
import TrustBar from "./components/TrustBar";
import Collections from "./components/Collections";
import Craftsmanship from "./components/Craftsmanship";
import ProductsSection from "./components/ProductsSection";
import Testimonials from "./components/Testimonials";
import InspirationSection from "./components/InspirationSection";
import NewsletterSection from "./components/NewsletterSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col w-full bg-[#FAF8F5]">
      <Header />
      <Hero />
      <TrustBar />
      <Collections />
      <Craftsmanship />
      <ProductsSection />
      <Testimonials />
      <InspirationSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
}
