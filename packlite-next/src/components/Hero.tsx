// src/components/Hero.tsx
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative flex items-center justify-center h-[50vh] min-h-[300px] bg-cover bg-center text-white" style={{ backgroundImage: "url('/images/hero-background.jpg')" }}>
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,50,100,0.7)] to-[rgba(0,30,70,0.7)]"></div>
      
      <div className="relative z-10 text-center px-4">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          Quality Packaging, Delivered Fast.
        </h1>
        <p className="text-base md:text-xl max-w-2xl mx-auto mb-6">
          Your one-stop solution for standard and custom packaging. Explore our range and order today!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/products" 
            className="px-8 py-3 bg-secondary text-white font-semibold rounded-md hover:bg-green-700 transition-colors"
          >
            See Product Categories
          </Link>
          <Link 
            href="/customization" 
            className="px-8 py-3 bg-white/10 border border-white text-white font-semibold rounded-md hover:bg-white/20 transition-colors"
          >
            Get Custom Quote
          </Link>
        </div>
      </div>
    </section>
  );
}