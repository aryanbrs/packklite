// src/app/about/page.tsx
import { Metadata } from 'next';
import { CheckCircle, Users, Handshake, Leaf } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us - Packlite | Ariv Packlite Pvt Ltd',
  description: 'Learn more about Packlite by Ariv Packlite Pvt Ltd, your trusted partner for quality packaging materials and custom solutions.',
};

const values = [
  {
    icon: <CheckCircle className="h-10 w-10 text-primary mb-3" />,
    title: "Quality First",
    description: "We are committed to sourcing and supplying only high-grade materials that ensure product integrity.",
  },
  {
    icon: <Users className="h-10 w-10 text-primary mb-3" />,
    title: "Customer Focus",
    description: "Our clients are at the heart of everything we do. We strive to understand and meet their unique needs.",
  },
  {
    icon: <Handshake className="h-10 w-10 text-primary mb-3" />,
    title: "Integrity & Trust",
    description: "We operate with transparency and honesty, building long-lasting relationships based on trust.",
  },
  {
    icon: <Leaf className="h-10 w-10 text-primary mb-3" />,
    title: "Sustainability",
    description: "We are mindful of our environmental impact and aim to promote sustainable packaging options where possible.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Page Header */}
      <header className="bg-light border-b border-light-gray py-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-dark">
            About Ariv Packlite Pvt Ltd
          </h1>
          <p className="text-lg text-medium-gray mt-2">Packlite - Packing Trust</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          
          {/* Our Story Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-dark mb-4">Our Story</h2>
            <div className="space-y-4 text-medium-gray leading-relaxed">
              <p>
                Welcome to <strong>Packlite</strong>, a flagship brand by <strong>Ariv Packlite Pvt Ltd</strong>. Founded
                with a vision to simplify and enhance the packaging experience
                for businesses of all sizes, we have grown to become a trusted
                name in Gurugram, Haryana, and across the NCR region for quality packaging materials.
              </p>
              <p>
                Our journey began with a simple goal: to provide durable,
                reliable, and cost-effective packaging solutions that meet the
                diverse needs of our clients. We understand that packaging is
                more than just a container; it's a crucial part of your
                product's presentation, protection, and brand identity.
              </p>
            </div>
          </div>

          {/* Mission Section */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-dark mb-4">Our Mission</h3>
            <p className="text-medium-gray leading-relaxed">
              To be the leading provider of innovative and sustainable
              packaging solutions, delivering exceptional value and service to
              our customers, while fostering growth and opportunities for our
              community.
            </p>
          </div>

          {/* Values Section */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-dark mb-6 text-center">Our Values</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value) => (
                <div key={value.title} className="text-center p-6 bg-light rounded-lg">
                  {value.icon}
                  <h4 className="text-lg font-semibold text-dark mb-2">{value.title}</h4>
                  <p className="text-sm text-medium-gray">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Leadership Section */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-dark mb-8 text-center">Meet Our Leadership</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Director */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl shadow-lg">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    VK
                  </div>
                  <h4 className="text-xl font-semibold text-dark">Vivek Kumar</h4>
                  <p className="text-primary italic mb-3">Director & Founder</p>
                  <p className="text-medium-gray text-sm">
                    With a passion for service and a deep understanding of the
                    packaging industry, Vivek Kumar leads Ariv Packlite Pvt Ltd with
                    a commitment to excellence and customer satisfaction.
                  </p>
                </div>
              </div>
              
              {/* CTO */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-xl shadow-lg">
                <div className="text-center">
                  <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    AY
                  </div>
                  <h4 className="text-xl font-semibold text-dark">Aryan</h4>
                  <p className="text-purple-600 italic mb-3">CTO & Co-Founder</p>
                  <p className="text-medium-gray text-sm mb-3">
                    Leading our technology initiatives and digital transformation,
                    Aryan brings innovation and technical excellence to our operations,
                    ensuring seamless customer experience through cutting-edge solutions.
                  </p>
                  <a href="mailto:aryannnyadavvv@gmail.com" className="text-sm text-purple-600 hover:text-purple-800">
                    aryannnyadavvv@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}