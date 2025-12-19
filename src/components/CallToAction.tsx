// src/components/CallToAction.tsx
import Link from 'next/link';

export default function CallToAction() {
  return (
    <section className="bg-primary text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Need a Specific Packaging Solution?
        </h2>
        <p className="text-lg max-w-2xl mx-auto mb-8">
          Our team is ready to assist you. Contact us for bulk orders or custom requirements.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/products" 
            className="px-8 py-3 bg-white text-primary font-semibold rounded-md hover:bg-light-gray transition-colors"
          >
            Explore Products
          </Link>
          <Link 
            href="/contact" 
            className="px-8 py-3 border border-white text-white font-semibold rounded-md hover:bg-white/10 transition-colors"
          >
            Contact Our Team
          </Link>
        </div>
      </div>
    </section>
  );
}