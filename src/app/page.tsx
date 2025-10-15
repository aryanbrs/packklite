// src/app/page.tsx
import Hero from "@/components/Hero";
import CategoryPreviews from "@/components/CategoryPreviews";
import WhyChooseUs from "@/components/WhyChooseUs";
import CallToAction from "@/components/CallToAction"; // <-- IMPORT

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryPreviews />
      <WhyChooseUs />
      <CallToAction /> {/* <-- ADD COMPONENT HERE */}
    </>
  );
}