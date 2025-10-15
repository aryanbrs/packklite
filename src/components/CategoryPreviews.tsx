// src/components/CategoryPreviews.tsx
import Link from 'next/link';
import Image from 'next/image'; // Using Next.js Image component for optimization

// Define category data in an array for easy management
const categories = [
  {
    name: "Corrugated Boxes",
    description: "All sizes for shipping and storage.",
    link: "/products#category-section-corrugated-boxes",
    image: "/images/category_corrugated_boxes.jpg", // Ensure this image exists in public/images
  },
  {
    name: "Protective Packaging",
    description: "Bubble wrap, foam, and fillers.",
    link: "/products#category-section-protective-packaging",
    image: "/images/category_protective.jpg", // Ensure this image exists
  },
  {
    name: "Tapes & Adhesives",
    description: "Secure sealing solutions.",
    link: "/products#category-section-tapes-adhesives",
    image: "/images/category_tapes.jpg", // Ensure this image exists
  },
  {
    name: "Thermocol & Foam",
    description: "Custom shapes and sheets.",
    link: "/products#category-section-thermocol-foam",
    image: "/images/category_thermocol_foam.jpg", // Ensure this image exists
  },
];

// Reusable Category Card component
const CategoryCard = ({ name, description, link, image }: { name: string, description: string, link: string, image: string }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col group transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
    <Link href={link} className="block">
      <div className="relative h-40 w-full overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    </Link>
    <div className="p-5 flex flex-col flex-grow">
      <h3 className="text-lg font-semibold text-dark mb-2">{name}</h3>
      <p className="text-sm text-medium-gray mb-4 flex-grow">{description}</p>
      <div className="mt-auto">
        <Link 
          href={link} 
          className="inline-block px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
        >
          View Range
        </Link>
      </div>
    </div>
  </div>
);

export default function CategoryPreviews() {
  return (
    <section className="bg-light py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-dark mb-4">
          Shop by Category
        </h2>
        <p className="text-center text-medium-gray max-w-2xl mx-auto mb-12">
          Quickly find what you need by browsing our main product categories.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <CategoryCard key={category.name} {...category} />
          ))}
        </div>
      </div>
    </section>
  );
}