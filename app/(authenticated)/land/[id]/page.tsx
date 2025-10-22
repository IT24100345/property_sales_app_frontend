"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Heart,
  MapPin,
  Ruler,
  DollarSign,
  Phone,
  Mail,
  MessageCircle,
  Share2,
  ArrowLeft,
  Calendar,
  User,
  CheckCircle,
  Camera,
} from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  landArea: number;
  images: string[];
  type: "RESIDENTIAL" | "COMMERCIAL" | "AGRICULTURAL";
  createdAt: string;
  features: string[];
  seller: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    joinedDate: string;
    totalListings: number;
  };
}

// Mock property data
// const mockProperty: Property = {
//   id: "1",
//   title: "Beautiful Beachfront Land with Ocean Views",
//   description: "This stunning beachfront property offers unparalleled ocean views and direct beach access. The land is perfect for building a luxury resort, private residence, or vacation rental property. Located in one of Sri Lanka's most sought-after coastal areas, this property combines natural beauty with excellent investment potential. The gentle slope of the land provides multiple building opportunities while maintaining the spectacular sea views. Access to utilities including electricity and water is readily available.",
//   price: 500000,
//   location: "Galle, Sri Lanka",
//   landSize: 2.5,
//   images: [
//     "/images/property-1.jpg",
//     "/images/property-2.jpg",
//     "/images/property-3.jpg",
//     "/images/property-4.jpg"
//   ],
//   type: "residential",
//   postedDate: "2024-01-15",
//   features: [
//     "Ocean frontage",
//     "Direct beach access",
//     "Electricity available",
//     "Water connection nearby",
//     "Clear title deed",
//     "Scenic mountain backdrop",
//     "Tourist zone location",
//     "Investment potential"
//   ],
//   seller: {
//     id: "seller-1",
//     name: "John Silva",
//     email: "john.silva@email.com",
//     phone: "+94 77 123 4567",
//     avatar: "/images/avatar-1.jpg",
//     joinedDate: "2022-05-15",
//     totalListings: 12
//   }
// }

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    // Simulate API call to fetch property details
    const fetchProperty = async () => {
      setIsLoading(true);
      try {
        // In real app, fetch from API using params.id
        const res = await fetch(`http://localhost:8080/api/posts/${params.id}`);

        if (!res.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await res.json();

        data.seller.name = "Seller Name";
        data.seller.email = "seller@example.com";
        data.seller.phone = "+94 77 123 4567";
        data.seller.joinedDate = "2022-05-15";
        data.seller.totalListings = 8;

        setProperty(data);

      } catch (error) {

        console.error("Failed to fetch property:", error);

        toast.error("Error", {
          description: "Failed to load property details",
        });

      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [params.id]);

  const handleFavoriteToggle = () => {
    setIsFavorited(!isFavorited);
    toast.message(
      isFavorited ? "Removed from favorites" : "Added to favorites",
      {
        description: isFavorited
          ? "Property removed from your favorites"
          : "Property saved to your favorites",
      }
    );
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle inquiry submission
    toast.message("Inquiry sent!", {
      description: "Your inquiry has been sent to the property owner.",
    });
    setInquiryForm({ name: "", email: "", phone: "", message: "" });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="container py-8 mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="h-96 bg-gray-200 rounded-lg"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container py-8 text-center mx-auto">
        <h1 className="text-2xl font-bold mb-4">Property not found</h1>
        <Button onClick={() => router.push("/land")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Properties
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/land")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Properties
        </Button>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
            <div className="flex items-center text-muted-foreground mb-4">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{property.location}</span>
              <Badge className="ml-4 capitalize">{property.type}</Badge>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleFavoriteToggle}
            >
              <Heart
                className={`h-4 w-4 ${
                  isFavorited ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images and Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Carousel */}
          <Card>
            <CardContent className="p-0">
              <Carousel className="w-full">
                <CarouselContent>
                  {property.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative h-96">
                        <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
                          <Camera className="h-12 w-12 text-slate-400" />
                          <span className="ml-2 text-slate-500">
                            Property Image {index + 1}
                          </span>
                        </div>
                        {/* Uncomment when you have actual images */}
                        {/* <Image
                          src={image}
                          alt={`${property.title} - Image ${index + 1}`}
                          fill
                          className="object-cover rounded-lg"
                        /> */}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
            </CardContent>
          </Card>

          {/* Property Details */}
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <div className="font-bold text-2xl text-green-600">
                    {formatPrice(property.price)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Price
                  </div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <Ruler className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="font-bold text-2xl">{property.landArea}</div>
                  <div className="text-sm text-muted-foreground">Acres</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <div className="font-bold text-lg">
                    {new Date(property.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Posted Date
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {property.description}
              </p>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Property Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {property.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Seller Info and Actions */}
        <div className="space-y-6">
          {/* Seller Information */}
          <Card>
            <CardHeader>
              <CardTitle>Property Owner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={property.seller.avatar}
                    alt={property.seller.name}
                  />
                  <AvatarFallback>
                    {property.seller.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">
                    {property.seller.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Member since{" "}
                    {new Date(property.seller.joinedDate).getFullYear()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {property.seller.totalListings} properties listed
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{property.seller.phone}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{property.seller.email}</span>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <Button className="w-full" size="lg">
                  <Phone className="mr-2 h-4 w-4" />
                  Call Now
                </Button>

                <Button variant="outline" className="w-full">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Start Chat
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Mail className="mr-2 h-4 w-4" />
                      Send Inquiry
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Send Inquiry</DialogTitle>
                      <DialogDescription>
                        Send a message to the property owner about this listing.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleInquirySubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Your Name</Label>
                        <Input
                          id="name"
                          value={inquiryForm.name}
                          onChange={(e) =>
                            setInquiryForm({
                              ...inquiryForm,
                              name: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={inquiryForm.email}
                          onChange={(e) =>
                            setInquiryForm({
                              ...inquiryForm,
                              email: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={inquiryForm.phone}
                          onChange={(e) =>
                            setInquiryForm({
                              ...inquiryForm,
                              phone: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="I'm interested in this property..."
                          value={inquiryForm.message}
                          onChange={(e) =>
                            setInquiryForm({
                              ...inquiryForm,
                              message: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Send Inquiry
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Property ID:</span>
                <span className="font-mono">{property.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span className="capitalize">{property.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price per acre:</span>
                <span>{formatPrice(property.price / property.landArea)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
