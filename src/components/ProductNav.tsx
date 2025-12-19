// src/components/ProductNav.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// We receive the categories as a prop
export default function ProductNav({ categories }: { categories: string[] }) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show when scrolling up, hide when scrolling down
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);
  
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // For now, we'll just log the search.
    // In a future step, we could implement a client-side filter or API call.
    const formData = new FormData(e.currentTarget);
    const length = formData.get('length');
    const width = formData.get('width');
    const height = formData.get('height');
    alert(`Searching for dimensions: L=${length}", W=${width}", H=${height}"`);
  };

  return (
    <nav className={`sticky top-[70px] bg-white shadow-md z-40 py-3 mb-8 transition-transform duration-300 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className="container mx-auto px-4">
        {/* Category Links */}
        <div className="flex overflow-x-auto space-x-6 pb-2 mb-4 scrollbar-hide">
          {categories.map((category) => {
            const categoryId = `category-section-${category.replace(/\s+/g, '-').toLowerCase()}`;
            return (
              <a 
                key={category}
                href={`#${categoryId}`}
                className="flex-shrink-0 px-4 py-2 text-sm font-semibold text-gray-600 rounded-full bg-gray-100 hover:bg-primary hover:text-white transition-colors"
              >
                {category}
              </a>
            );
          })}
        </div>

        {/* Dimension Search */}
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 flex-shrink-0">
            Find Your Box Size (in):
          </h3>
          <div className="grid grid-cols-3 md:flex-row gap-2 w-full">
            <input
              type="number"
              name="length"
              placeholder="Length"
              className="pl-3 pr-2 py-2 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
            />
            <input
              type="number"
              name="width"
              placeholder="Width"
              className="pl-3 pr-2 py-2 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
            />
            <input
              type="number"
              name="height"
              placeholder="Height"
              className="pl-3 pr-2 py-2 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full md:w-auto bg-primary hover:bg-blue-700 text-white px-5 py-2 text-sm font-medium rounded-lg shadow-md transition-colors"
          >
            Search
          </button>
        </form>
      </div>
    </nav>
  );
}