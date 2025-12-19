// src/components/Navbar.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Menu, X, User, LogIn, UserPlus, LogOut, LayoutDashboard } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';

// Define the navigation links in an array for easy mapping
const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/get-quote', label: 'Get Quote' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [customerSession, setCustomerSession] = useState<any>(null);
  const { totalItems } = useCart();

  // Check if customer is logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/customer/session');
        if (response.ok) {
          const data = await response.json();
          setCustomerSession(data.customer);
        }
      } catch (error) {
        console.error('Session check error:', error);
      }
    };

    checkSession();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isUserMenuOpen) setIsUserMenuOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isUserMenuOpen]);

  const handleLogout = async () => {
    await fetch('/api/customer/logout', { method: 'POST' });
    setCustomerSession(null);
    setIsUserMenuOpen(false);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md h-[70px]">
      <div className="container mx-auto flex h-full items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo.jpg"
            alt="Packlite Logo"
            width={50}
            height={50}
            className="object-contain"
          />
          <span className="text-xl font-bold text-primary hidden sm:inline">Packlite</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex">
          <ul className="flex items-center space-x-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link 
                  href={link.href} 
                  className="relative font-medium text-dark after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:text-primary hover:after:w-full"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Header Actions */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* User Menu - Desktop */}
          <div className="hidden md:block relative">
            {customerSession ? (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsUserMenuOpen(!isUserMenuOpen);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                    {customerSession.email.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-dark">{customerSession.name}</span>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link
                      href="/customer/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/customer/login"
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-dark hover:text-primary transition-colors"
                >
                  <LogIn size={16} />
                  Login
                </Link>
                <Link
                  href="/customer/login"
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors"
                >
                  <UserPlus size={16} />
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Cart Icon */}
          <Link href="/cart" className="relative p-2">
            <ShoppingCart className="h-6 w-6 text-dark" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-white text-xs font-bold">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>
          
          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle navigation menu">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-[70px] left-0 w-full bg-white shadow-lg">
          <nav>
            <ul className="flex flex-col">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="block py-3 px-4 text-center font-medium hover:bg-light-gray hover:text-primary transition-colors border-b border-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              
              {/* Mobile User Menu */}
              <li className="border-t-2 border-gray-200 pt-2">
                {customerSession ? (
                  <>
                    <div className="px-4 py-3 bg-gray-50">
                      <p className="text-sm text-gray-600">Signed in as</p>
                      <p className="font-semibold text-dark">{customerSession.name}</p>
                      <p className="text-xs text-gray-500">{customerSession.email}</p>
                    </div>
                    <Link
                      href="/customer/dashboard"
                      className="flex items-center justify-center gap-2 py-3 px-4 font-medium hover:bg-light-gray hover:text-primary transition-colors border-b border-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LayoutDashboard size={18} />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/customer/login"
                      className="flex items-center justify-center gap-2 py-3 px-4 font-medium hover:bg-light-gray hover:text-primary transition-colors border-b border-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LogIn size={18} />
                      Login
                    </Link>
                    <Link
                      href="/customer/login"
                      className="flex items-center justify-center gap-2 py-3 px-4 font-medium bg-primary text-white hover:bg-primary-dark transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <UserPlus size={18} />
                      Sign Up
                    </Link>
                  </>
                )}
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}