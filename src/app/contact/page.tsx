// src/app/contact/page.tsx
'use client'; // This entire page will be a Client Component because of the form

import { useState } from 'react';
import { Metadata } from 'next';
import { MapPin, Phone, Mail, Building, Send } from 'lucide-react';

// NOTE: Metadata in Client Components is not supported this way.
// We will handle the title/description in a different step if needed.
// For now, we focus on the UI.

export default function ContactPage() {
  // We'll add form state handling logic here later
  const [formState, setFormState] = useState('idle'); // 'idle', 'submitting', 'success', 'error'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a future step, we'll connect this to a Next.js API route.
    // For now, we'll just simulate a submission.
    setFormState('submitting');
    setTimeout(() => {
      setFormState('success');
    }, 2000); // Simulate a 2-second delay
  };

  return (
    <main className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-dark">Contact Us</h1>
          <p className="mt-2 text-lg text-medium-gray max-w-2xl mx-auto">
            Have a question or need assistance? We're here to help. Fill out the form below or reach out directly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
          {/* Contact Form Section */}
          <div className="md:col-span-2">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-dark mb-6">Send us a Message</h3>
              
              {formState === 'success' ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md text-center">
                  <strong className="font-bold">Message Sent!</strong>
                  <span className="block sm:inline"> We'll get back to you soon.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Form fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input type="text" id="fullName" name="fullName" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                      <input type="email" id="email" name="email" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
                    <input type="tel" id="phone" name="phone" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                    <input type="text" id="subject" name="subject" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Message *</label>
                    <textarea id="message" name="message" rows={5} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary resize-y"></textarea>
                  </div>
                  <div>
                    <button type="submit" disabled={formState === 'submitting'} className="w-full flex justify-center items-center px-6 py-3 bg-primary text-white font-semibold rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed">
                      {formState === 'submitting' ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5 mr-2" /> Send Message
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Contact Info Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white p-8 rounded-lg shadow-md space-y-6">
              <h3 className="text-2xl font-semibold text-dark mb-4">Our Information</h3>
              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <p className="ml-4 text-medium-gray">C-5, Ram Vihar, Dhanwapur, Sector 104, Gurgaon - 122001, Gurugram, Haryana, India</p>
              </div>
              <div className="flex items-center">
                <Phone className="h-6 w-6 text-primary flex-shrink-0" />
                <a href="tel:+917503542703" className="ml-4 text-medium-gray hover:text-primary">+91 75035 42703</a>
              </div>
              <div className="flex items-center">
                <Mail className="h-6 w-6 text-primary flex-shrink-0" />
                <a href="mailto:aryanenterprises721@gmail.com" className="ml-4 text-medium-gray hover:text-primary">aryanenterprises721@gmail.com</a>
              </div>
              <div className="flex items-start pt-6 border-t border-light-gray">
                <Building className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div className="ml-4">
                  <p className="font-semibold text-dark">Ariv Packlite Pvt Ltd</p>
                  <p className="text-sm text-medium-gray">GST No: 06DVHPK8768L1ZQ</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}