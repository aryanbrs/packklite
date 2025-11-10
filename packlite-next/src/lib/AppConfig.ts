// src/lib/AppConfig.ts
import { Product } from './types';

interface Config {
  companyName: string;
  companyFullName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  //... add other config properties if needed
  products: Product[];
}

const AppConfig: Config = {
  companyName: "Packlite Packaging Solutions",
  companyFullName: "Ariv Packlite Pvt Ltd",
  tagline: "Packing Trust",
  contactEmail: "aryanenterprises721@gmail.com",
  contactPhone: "+91 75035 42703",
  // NOTE: This is a truncated version for brevity. 
  // PASTE YOUR ENTIRE 'AppConfig' OBJECT FROM 'js/data.js' HERE.
  // I will just add one product as an example.
  products: [
    // CATEGORY: Corrugated Boxes
    {
      id: "UB-BR-3P",
      category: "Corrugated Boxes",
      name: "Brown 3-Ply Universal Boxes",
      description:
        "Versatile 3-ply brown corrugated boxes for general packaging needs. Available in various sizes.",
      unifiedImage: "/images/universal_box_brown_default.jpg", // NOTE: Path updated for /public folder
      variants: [
        {
          sku: "UB-BR-3P-4x4x4",
          size: "4in x 4in x 4in",
          basePrice: 5.82,
        },
        {
          sku: "UB-BR-3P-4.5x4.5x2",
          size: "4.5in x 4.5in x 2in",
          basePrice: 6.25,
        },
      ],
    },
    // ... PASTE ALL OTHER PRODUCTS HERE
  ],
};

export default AppConfig;