// src/components/Footer.tsx
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // We can hardcode these details for now and make them dynamic later if needed
  const companyName = "Ariv Packlite Pvt Ltd";
  const brandName = "Packlite";
  const slogan = "Packing Trust";
  const address = "C-5, Ram Vihar, Dhanwapur, Sector 104, Gurgaon - 122001, Gurugram, Haryana, India";
  const email = "aryanenterprises721@gmail.com";
  const phone = "+91 75035 42703";

  return (
    <footer className="bg-dark text-light-gray text-sm">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 py-10">
        {/* About Section */}
        <div className="footer-about">
          <div className="flex items-center gap-3 mb-3">
            <Image
              src="/images/logo.jpg"
              alt="Packlite Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <div>
              <h4 className="font-primary text-lg font-semibold text-white">{brandName}</h4>
              <p className="text-xs text-gray-400">{slogan}</p>
            </div>
          </div>
          <p className="text-sm">{companyName}</p>
        </div>

        {/* Quick Links Section */}
        <div className="footer-links">
          <h4 className="font-primary text-lg font-semibold text-white mb-3">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:text-white hover:underline">Home</Link></li>
            <li><Link href="/products" className="hover:text-white hover:underline">All Products</Link></li>
            <li><Link href="/customization" className="hover:text-white hover:underline">Get Quote</Link></li>
            <li><Link href="/about" className="hover:text-white hover:underline">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-white hover:underline">Contact Us</Link></li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="footer-contact">
          <h4 className="font-primary text-lg font-semibold text-white mb-3">Contact Us - {companyName}</h4>
          <p className="mb-2">{address}</p>
          <p className="mb-2">Email: <a href={`mailto:${email}`} className="hover:text-white hover:underline">{email}</a></p>
          <p>Phone: <a href={`tel:${phone}`} className="hover:text-white hover:underline">{phone}</a></p>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom border-t border-medium-gray mt-8 py-4">
        <p className="text-center text-xs">
          © {currentYear} {companyName}. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}