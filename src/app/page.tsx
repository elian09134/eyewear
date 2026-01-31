import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/layout/HeroSection';
import { AboutSection } from '@/components/layout/AboutSection';
import { EducationSection } from '@/components/layout/EducationSection';
import { GallerySection } from '@/components/layout/GallerySection';
import { Footer } from '@/components/layout/Footer';
import { ProductGrid } from '@/components/products/ProductGrid';
import { getProducts } from '@/lib/api';

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <EducationSection />
      <GallerySection />

      <section id="products" className="py-20 bg-black min-h-screen">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-display font-bold text-white mb-4">Featured Collection</h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              Discover our premium range of eyewear, crafted for those who see the world differently.
            </p>
          </div>

          <ProductGrid products={products} />
        </div>
      </section>
      <Footer />
    </main>
  );
}
