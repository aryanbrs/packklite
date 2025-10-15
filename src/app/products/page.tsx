// src/app/products/page.tsx
import { Metadata } from 'next';
import ProductCard from '@/components/ProductCard';
import ProductNav from '@/components/ProductNav';
import { PrismaClient } from '@/generated/prisma';

export const metadata: Metadata = {
  title: 'Our Products - Packlite | Ariv Packlite Pvt Ltd',
  description: 'Browse our wide range of packaging materials. Corrugated boxes, mailer boxes, bubble wrap, tapes, and more.',
};

const prisma = new PrismaClient();

export default async function ProductsPage() {
  // Fetch products from database
  const products = await prisma.product.findMany({
    include: {
      variants: true,
    },
    orderBy: {
      category: 'asc',
    },
  });

  // Group products by category
  const productsByCategory: { [key: string]: typeof products } = {};
  products.forEach((product) => {
    if (!productsByCategory[product.category]) {
      productsByCategory[product.category] = [];
    }
    productsByCategory[product.category].push(product);
  });

  const categories = Object.keys(productsByCategory);

  return (
    <>
      <ProductNav categories={categories} />

      <main className="container mx-auto p-4">
        <div className="space-y-12">
          {Object.entries(productsByCategory).map(([category, categoryProducts]) => (
            <section key={category} id={`category-section-${category.replace(/\s+/g, '-').toLowerCase()}`} className="pt-16 -mt-16">
              <h2 className="text-3xl font-bold text-dark border-b-2 border-primary pb-2 mb-6">
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {categoryProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={{
                      id: product.productCode,
                      category: product.category,
                      name: product.name,
                      description: product.description,
                      unifiedImage: product.imageUrl,
                      variants: product.variants.map(v => ({
                        sku: v.sku,
                        size: v.size,
                        basePrice: v.basePrice,
                      })),
                      isCustomInquiryOnly: product.isCustomInquiry,
                    }} 
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}