"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, Ruler, DollarSign, Filter, SlidersHorizontal } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Link from "next/link"
/*
"id": 1,
    "landArea": 89,
    "views": 0,
    "inquiries": 0,
    "price": 89898.0,
    "title": "jfn",
    "description": "nnuu",
    "location": "8989jjjh",
    "contactPhone": "9856787867",
    "createdAt": "2025-10-22T08:42:33.57719",
    "images": [
      "c92ab01f-8ce6-4fa3-a092-8d8d2d321ff4_20251022_084233.jpeg"
    ],
    "features": [
      "River frontage",
      "Road access"
    ],
    "type": "RESIDENTIAL",
    "verificationStatus": "PENDING",
    "premiumPost": null*/
interface Property {
  id: string
  title: string
  description: string
  price: number
  location: string
  landArea: number // in acres
  images: string[]
  type: "RESIDENTIAL" | "COMMERCIAL" | "AGRICULTURAL"
  createdAt: string
  seller: {
    name: string
    contact: string
  }
}

// Mock property data
// const mockProperties: Property[] = [
//   {
//     id: "1",
//     title: "Beautiful Beachfront Land",
//     description: "Prime beachfront property with stunning ocean views. Perfect for resort development or private residence.",
//     price: 500000,
//     location: "Galle, Sri Lanka",
//     landSize: 2.5,
//     imageUrl: "/images/land-1.jpg",
//     type: "residential",
//     postedDate: "2024-01-15",
//     seller: {
//       name: "John Silva",
//       contact: "+94 77 123 4567"
//     }
//   },
//   {
//     id: "2",
//     title: "Commercial Land in Colombo",
//     description: "Strategic commercial plot in the heart of Colombo. Ideal for office buildings or retail development.",
//     price: 800000,
//     location: "Colombo 3, Sri Lanka",
//     landSize: 1.2,
//     imageUrl: "/images/land-2.jpg",
//     type: "commercial",
//     postedDate: "2024-01-10",
//     seller: {
//       name: "Maria Fernando",
//       contact: "+94 71 987 6543"
//     }
//   },
//   {
//     id: "3",
//     title: "Agricultural Farm Land",
//     description: "Fertile agricultural land with water access. Perfect for tea, rubber, or spice cultivation.",
//     price: 200000,
//     location: "Kandy, Sri Lanka",
//     landSize: 10.0,
//     imageUrl: "/images/land-3.jpg",
//     type: "agricultural",
//     postedDate: "2024-01-05",
//     seller: {
//       name: "Rajesh Patel",
//       contact: "+94 75 456 7890"
//     }
//   },
//   {
//     id: "4",
//     title: "Hillside Residential Plot",
//     description: "Scenic hillside plot with panoramic views. Great for building a luxury home.",
//     price: 350000,
//     location: "Nuwara Eliya, Sri Lanka",
//     landSize: 1.8,
//     imageUrl: "/images/land-4.jpg",
//     type: "residential",
//     postedDate: "2024-01-12",
//     seller: {
//       name: "Sarah Ahmed",
//       contact: "+94 76 234 5678"
//     }
//   }
// ]

export default function LandPage() {
  const [properties, setProperties] = useState<Property[]>()
  const [filteredProperties, setFilteredProperties] = useState<Property[]>()
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [priceRange, setPriceRange] = useState([0, 1000000])
  const [landSizeRange, setLandSizeRange] = useState([0, 1000000])

  const locations = [...new Set(properties?.map(p => p.location))]
  const propertyTypes = [...new Set(properties?.map(p => p.type))]

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("http://localhost:8080/api/posts/all")

      const data = await response.json()
      
      setProperties(data)
      setFilteredProperties(data)

    }
  
    fetchPosts()
  }, [])

  useEffect(() => {
    let filtered = properties

    // Search filter
    if (searchTerm) {
      filtered = filtered?.filter(property =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Location filter
    if (locationFilter && locationFilter !== "all") {
      filtered = filtered?.filter(property => property.location === locationFilter)
      // console.log("Filtered by location:", filtered)
    }

    // Type filter
    if (typeFilter && typeFilter !== "all") {
      filtered = filtered?.filter(property => property.type === typeFilter)
      // console.log("Filtered by type:", filtered)
    }

    // Price range filter
    filtered = filtered?.filter(property => 
      property.price >= priceRange[0] && property.price <= priceRange[1]
    )
    // console.log("Filtered by price:", filtered)

    // Land size filter
    filtered = filtered?.filter(property => 
      property.landArea >= landSizeRange[0] && property.landArea <= landSizeRange[1]
    )
    // console.log("Filtered by land size:", filtered)

    setFilteredProperties(filtered)
  }, [searchTerm, locationFilter, typeFilter, priceRange, landSizeRange, properties])

/*
"id": 1,
    "landArea": 89,
    "views": 0,
    "inquiries": 0,
    "price": 89898.0,
    "title": "jfn",
    "description": "nnuu",
    "location": "8989jjjh",
    "contactPhone": "9856787867",
    "createdAt": "2025-10-22T08:42:33.57719",
    "images": [
      "c92ab01f-8ce6-4fa3-a092-8d8d2d321ff4_20251022_084233.jpeg"
    ],
    "features": [
      "River frontage",
      "Road access"
    ],
    "type": "RESIDENTIAL",
    "verificationStatus": "PENDING",
    "premiumPost": null
*/


  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setLocationFilter("")
    setTypeFilter("")
    setPriceRange([0, 1000000])
    setLandSizeRange([0, 1000000])
  }

  const hasActiveFilters = searchTerm || locationFilter || typeFilter || 
    priceRange[0] > 0 || priceRange[1] < 1000000 || 
    landSizeRange[0] > 0 || landSizeRange[1] < 15

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Property Listings</h1>
        <p className="text-muted-foreground">Find your perfect piece of land</p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search properties by title, description, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
          
          {/* Mobile Filter Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden h-11 px-4">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    !
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Filter Properties</SheetTitle>
                <SheetDescription>
                  Narrow down your search results
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <MobileFilterControls
                  locations={locations}
                  propertyTypes={propertyTypes}
                  locationFilter={locationFilter}
                  setLocationFilter={setLocationFilter}
                  typeFilter={typeFilter}
                  setTypeFilter={setTypeFilter}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  landSizeRange={landSizeRange}
                  setLandSizeRange={setLandSizeRange}
                  clearFilters={clearFilters}
                  hasActiveFilters={!!hasActiveFilters}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Filters */}
        <Card className="hidden md:block">
          <CardContent className="pt-6">
            <DesktopFilterControls
              locations={locations}
              propertyTypes={propertyTypes}
              locationFilter={locationFilter}
              setLocationFilter={setLocationFilter}
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              landSizeRange={landSizeRange}
              setLandSizeRange={setLandSizeRange}
              clearFilters={clearFilters}
              hasActiveFilters={!!hasActiveFilters}
            />
          </CardContent>
        </Card>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {searchTerm && (
              <Badge variant="secondary" className="gap-1">
                Search: {searchTerm}
                <button onClick={() => setSearchTerm("")} className="ml-1 hover:bg-destructive/10 rounded-full">
                  ×
                </button>
              </Badge>
            )}
            {locationFilter && locationFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Location: {locationFilter}
                <button onClick={() => setLocationFilter("")} className="ml-1 hover:bg-destructive/10 rounded-full">
                  ×
                </button>
              </Badge>
            )}
            {typeFilter && typeFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Type: {typeFilter}
                <button onClick={() => setTypeFilter("")} className="ml-1 hover:bg-destructive/10 rounded-full">
                  ×
                </button>
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 px-2 text-xs">
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-muted-foreground">
          Showing <span className="font-medium text-foreground">{filteredProperties?.length}</span> of <span className="font-medium text-foreground">{properties?.length}</span> properties
        </p>
        <Select defaultValue="newest">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="size-small">Size: Small to Large</SelectItem>
            <SelectItem value="size-large">Size: Large to Small</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Property Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties?.map((property) => (
          <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
                <MapPin className="h-12 w-12 text-slate-400" />
              </div>
              {/* Uncomment when you have actual images */}
              <Image
                src={`http://localhost:8080/api/images/view/${property.images[0]}`}
                alt={property.title}
                fill
                className="object-cover"
              />
              <Badge className="absolute top-2 right-2 capitalize">
                {property.type}
              </Badge>
            </div>
            
            <CardHeader>
              <CardTitle className="text-lg">{property.title}</CardTitle>
              <CardDescription className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-1" />
                {property.location}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {property.description}
              </p>
              
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                  <span className="font-bold text-lg text-green-600">
                    {formatPrice(property.price)}
                  </span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Ruler className="h-4 w-4 mr-1" />
                  {property.landArea} acres
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground">
                Posted: {new Date(property.createdAt).toLocaleDateString()}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                Contact Seller
              </Button>
              <Link href={`/land/${property.id}`}>
              <Button size="sm" className="flex-1">
                View Details
              </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredProperties?.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <Search className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No properties found</h3>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">
            We couldn&apos;t find any properties matching your criteria. Try adjusting your search terms or filters.
          </p>
          <Button onClick={clearFilters} variant="outline">
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  )
}

// Desktop Filter Controls Component
function DesktopFilterControls({
  locations,
  propertyTypes,
  locationFilter,
  setLocationFilter,
  typeFilter,
  setTypeFilter,
  priceRange,
  setPriceRange,
  landSizeRange,
  setLandSizeRange,
  clearFilters,
  hasActiveFilters
}: {
  locations: string[]
  propertyTypes: string[]
  locationFilter: string
  setLocationFilter: (value: string) => void
  typeFilter: string
  setTypeFilter: (value: string) => void
  priceRange: number[]
  setPriceRange: (value: number[]) => void
  landSizeRange: number[]
  setLandSizeRange: (value: number[]) => void
  clearFilters: () => void
  hasActiveFilters: boolean
}) {
  return (
    <div className="space-y-6">
      {/* First Row - Dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Location</Label>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All locations</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Property Type</Label>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {propertyTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Price Range
          </Label>
          <div className="text-xs text-muted-foreground mb-2">
            ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
          </div>
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={1000000}
            min={0}
            step={10000}
            className="mt-2"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Land Size
          </Label>
          <div className="text-xs text-muted-foreground mb-2">
            {landSizeRange[0]} - {landSizeRange[1]} acres
          </div>
          <Slider
            value={landSizeRange}
            onValueChange={setLandSizeRange}
            max={15}
            min={0}
            step={0.1}
            className="mt-2"
          />
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  )
}

// Mobile Filter Controls Component
function MobileFilterControls({
  locations,
  propertyTypes,
  locationFilter,
  setLocationFilter,
  typeFilter,
  setTypeFilter,
  priceRange,
  setPriceRange,
  landSizeRange,
  setLandSizeRange,
  clearFilters,
  hasActiveFilters
}: {
  locations: string[]
  propertyTypes: string[]
  locationFilter: string
  setLocationFilter: (value: string) => void
  typeFilter: string
  setTypeFilter: (value: string) => void
  priceRange: number[]
  setPriceRange: (value: number[]) => void
  landSizeRange: number[]
  setLandSizeRange: (value: number[]) => void
  clearFilters: () => void
  hasActiveFilters: boolean
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Location</Label>
        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger>
            <SelectValue placeholder="All locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All locations</SelectItem>
            {locations.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Property Type</Label>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {propertyTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Price Range</Label>
        <div className="text-sm text-muted-foreground">
          ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
        </div>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={1000000}
          min={0}
          step={10000}
        />
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Land Size</Label>
        <div className="text-sm text-muted-foreground">
          {landSizeRange[0]} - {landSizeRange[1]} acres
        </div>
        <Slider
          value={landSizeRange}
          onValueChange={setLandSizeRange}
          max={1000000}
          min={0}
          step={0.1}
        />
      </div>

      {hasActiveFilters && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
          Clear All Filters
        </Button>
      )}
    </div>
  )
}