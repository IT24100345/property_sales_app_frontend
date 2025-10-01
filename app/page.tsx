import Link from "next/link";
import Image from "next/image";
import { Search, Home as Hc, MapPin, TrendingUp, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FeaturedProperty {
  id: string;
  title: string;
  location: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  size: string;
  imageUrl: string;
}

// Mock featured properties data
const featuredProperties: FeaturedProperty[] = [
  {
    id: "prop-1",
    title: "Modern Villa with Pool",
    location: "Colombo 7, Sri Lanka",
    price: "$350,000",
    bedrooms: 4,
    bathrooms: 3,
    size: "2,500 sq ft",
    imageUrl: "/images/property-1.jpg",
  },
  {
    id: "prop-2",
    title: "Luxury Apartment",
    location: "Colombo 3, Sri Lanka",
    price: "$220,000",
    bedrooms: 3,
    bathrooms: 2,
    size: "1,800 sq ft",
    imageUrl: "/images/property-2.jpg",
  },
  {
    id: "prop-3",
    title: "Beachfront House",
    location: "Galle, Sri Lanka",
    price: "$450,000",
    bedrooms: 5,
    bathrooms: 4,
    size: "3,200 sq ft",
    imageUrl: "/images/property-3.jpg",
  },
];

export default async function Home() {
  return (
    <div className="font-sans min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: "url('/images/hero.jpg')",
          }}
        />
        <div className="container relative z-20 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Find Your Dream Property
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Discover the perfect land or home in Sri Lanka with LandLink's
            extensive property listings
          </p>

          {/* Search Bar */}
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <Input
                  type="text"
                  placeholder="Location, property type, or keyword"
                  className="w-full h-12"
                />
              </div>
              <div className="w-full md:w-1/4">
                <select
                  className="w-full h-12 rounded-md border border-input bg-background px-3 py-2"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Property Type
                  </option>
                  <option value="land">Land</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
              <Button className="h-12 px-8">
                <Search className="mr-2 h-4 w-4" /> Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-slate-50">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Featured Properties
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-64">
                  <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
                    <Hc className="h-12 w-12 text-slate-400" />
                  </div>
                  {/* Uncomment when you have actual images */}
                  <Image
                    src={property.imageUrl}
                    fill
                    alt={property.title}
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{property.title}</h3>
                    <span className="font-bold text-primary">
                      {property.price}
                    </span>
                  </div>
                  <div className="flex items-center text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t pt-4">
                    <span>{property.bedrooms} Bedrooms</span>
                    <span>{property.bathrooms} Bathrooms</span>
                    <span>{property.size}</span>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link href="/properties">View All Properties</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose LandLink
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Extensive Listings
              </h3>
              <p className="text-muted-foreground">
                Access thousands of verified property listings across Sri Lanka,
                from beachfront lands to urban apartments.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Secure Transactions
              </h3>
              <p className="text-muted-foreground">
                Our platform ensures secure property transactions with verified
                sellers and comprehensive legal support.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Market Insights</h3>
              <p className="text-muted-foreground">
                Make informed decisions with our up-to-date market analysis and
                property valuation tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container px-4 text-center mx-auto">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Find Your Perfect Property?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their dream property
            through LandLink
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" asChild>
              <Link href="/properties">Browse Properties</Link>
            </Button>
            <Button
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-white/10"
              size="lg"
              asChild
            >
              <Link href="/signup">Register Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-slate-50">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Clients Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((testimonial) => (
              <div key={testimonial} className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-slate-200 mr-4 flex items-center justify-center">
                    <span className="font-bold text-slate-500">JD</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">John Doe</h4>
                    <p className="text-sm text-muted-foreground">
                      Property Buyer
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">
                  "I found my dream home through LandLink. The process was
                  seamless, and the team was incredibly helpful throughout my
                  property search."
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
