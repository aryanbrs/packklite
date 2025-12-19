// src/components/WhyChooseUs.tsx
import { CheckCircle, Cog, Truck, Tags } from 'lucide-react';

// Define the feature data in an array
const features = [
  {
    icon: <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" strokeWidth={1.5} />,
    title: "Premium Quality",
    description: "High-grade materials for maximum durability and product protection.",
  },
  {
    icon: <Cog className="h-12 w-12 text-primary mx-auto mb-4" strokeWidth={1.5} />,
    title: "Custom Solutions",
    description: "Tailored packaging to meet your specific branding and functional needs.",
  },
  {
    icon: <Truck className="h-12 w-12 text-primary mx-auto mb-4" strokeWidth={1.5} />,
    title: "Reliable & Fast",
    description: "Prompt delivery across Gurugram and surrounding areas.",
  },
  {
    icon: <Tags className="h-12 w-12 text-primary mx-auto mb-4" strokeWidth={1.5} />,
    title: "Competitive Pricing",
    description: "Fair prices and quantity-based discounts for the best value.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-dark mb-4">
          Why Partner with Ariv Packlite Pvt Ltd?
        </h2>
        <p className="text-center text-medium-gray max-w-2xl mx-auto mb-12">
          Your satisfaction is our priority. We deliver quality packaging with reliability you can count on.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {features.map((feature) => (
            <div key={feature.title}>
              {feature.icon}
              <h4 className="text-xl font-semibold text-dark mb-2">{feature.title}</h4>
              <p className="text-medium-gray">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}