"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  ImagePlus, 
  X, 
  MapPin, 
  DollarSign, 
  Ruler, 
  FileText, 
  Camera,
  Upload,
  AlertCircle,
  Loader2
} from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
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
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { toast } from "sonner"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/auth/AuthContext"
// import { property } from "zod"

interface PropertyForm {
  title: string
  description: string
  price: string
  location: string
  landSize: string
  type: "RESIDENTIAL" | "COMMERCIAL" | "AGRICULTURAL" | ""
  features: string[]
  contactPhone: string
  contactEmail: string
  images: File[]
}

interface ImageUploadResponse {
  fileName: string
  fileUrl: string
  fileSize: number
  uploadedAt: string
}

interface PropertySubmissionData {
  title: string
  description: string
  price: number
  location: string
  landArea: number
  type: string
  features: string[]
  contactPhone: string
  contactEmail: string
  images: string[]
}

const propertyFeatures = [
  "Clear title deed",
  "Electricity available",
  "Water connection nearby",
  "Road access",
  "Mountain view",
  "Ocean view",
  "River frontage",
  "Tourist zone",
  "Investment potential",
  "Flat terrain",
  "Sloped terrain",
  "Fertile soil",
  "Planning permission",
  "Subdivision potential"
]

// Spring Boot API endpoint
const SPRING_API_URL = "http://localhost:8080/api"

export default function CreatePostPage() {
  const router = useRouter()

  const { jwt, user } = useAuth()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [formData, setFormData] = useState<PropertyForm>({
    title: "",
    description: "",
    price: "",
    location: "",
    landSize: "",
    type: "",
    features: [],
    contactPhone: "",
    contactEmail: "",
    images: []
  })

  const handleInputChange = (field: keyof PropertyForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + formData.images.length > 8) {
      toast.error("Too many images", {
        description: "You can upload a maximum of 8 images",
      })
      return
    }

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error("Invalid file type", {
          description: `${file.name} is not an image file`,
        })
        return false
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error("File too large", {
          description: `${file.name} exceeds 10MB limit`,
        })
        return false
      }
      return true
    })

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...validFiles]
    }))
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const uploadImageToServer = async (file: File): Promise<ImageUploadResponse> => {
    const formData = new FormData()
    formData.append('image', file)
    
    try {
      const response = await fetch(`${SPRING_API_URL}/images/upload`, {
        method: 'POST',
        body: formData,
        // Add authorization header if needed
        headers: {
          'Authorization': jwt ?? ""
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || `Upload failed: ${response.statusText}`)
      }

      const data: ImageUploadResponse = await response.json()
      return data
    } catch (error) {
      console.error('Image upload error:', error)
      throw new Error(`Failed to upload ${file.name}`)
    }
  }

  const uploadAllImages = async (images: File[]): Promise<string[]> => {
    setUploadingImages(true)
    setUploadProgress(0)

    const uploadedFileNames: string[] = []
    const totalImages = images.length

    try {
      for (let i = 0; i < images.length; i++) {
        const file = images[i]
        toast.info(`Uploading image ${i + 1} of ${totalImages}`, {
          description: file.name,
          duration: 2000,
        })

        const uploadResponse = await uploadImageToServer(file)
        uploadedFileNames.push(uploadResponse.fileName)

        // Update progress
        const progress = ((i + 1) / totalImages) * 100
        setUploadProgress(progress)
      }

      return uploadedFileNames
    } catch (error) {
      console.error('Image upload failed:', error)
      throw error
    } finally {
      setUploadingImages(false)
      setUploadProgress(0)
    }
  }

  const submitPropertyToServer = async (propertyData: PropertySubmissionData) => {
    try {
      const response = await fetch(`${SPRING_API_URL}/posts/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': jwt ?? ""
        },
        body: JSON.stringify(propertyData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || `Server error: ${response.statusText}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Property submission error:', error)
      throw error
    }
  }

  const validateForm = () => {
    const required = ['title', 'description', 'price', 'location', 'landSize', 'type', 'contactPhone']
    const missing = required.filter(field => !formData[field as keyof PropertyForm])
    
    if (missing.length > 0) {
      toast.error("Missing required fields", {
        description: `Please fill in: ${missing.join(', ')}`,
      })
      return false
    }

    if (formData.images.length === 0) {
      toast.error("Images required", {
        description: "Please upload at least one image of your property"
      })
      return false
    }

    // Validate price and land size are numbers
    if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      toast.error("Invalid price", {
        description: "Please enter a valid price"
      })
      return false
    }

    if (isNaN(Number(formData.landSize)) || Number(formData.landSize) <= 0) {
      toast.error("Invalid land size", {
        description: "Please enter a valid land size"
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Step 1: Upload images to Spring server
      toast.info("Uploading images...", {
        description: "Please wait while we upload your property images",
      })

      const imageFileNames = await uploadAllImages(formData.images)

      // Step 2: Prepare property data with image file names
      const propertyData: PropertySubmissionData = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        location: formData.location,
        landArea: Number(formData.landSize),
        type: formData.type,
        features: formData.features,
        contactPhone: formData.contactPhone,
        contactEmail: formData.contactEmail,
        images: imageFileNames,
      }

      // Step 3: Submit property data to Spring server
      toast.info("Creating property listing...", {
        description: "Submitting your property details to the server",
      })

      const result = await submitPropertyToServer(propertyData)

      toast.success("Property listed successfully!", {
        description: result,
      })

      // Redirect to seller's property list
      router.push("/post")
    } catch (error) {
      console.error("Failed to create property listing:", error)

      toast.error("Error creating listing", {
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create Property Listing</h1>
        <p className="text-muted-foreground">
          List your property for sale and reach potential buyers
        </p>
      </div>

      {/* Upload Progress */}
      {uploadingImages && (
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3 mb-2">
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                Uploading images to server...
              </span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-xs text-blue-700 mt-1">
              {Math.round(uploadProgress)}% complete
            </p>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Provide the main details about your property
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Property Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Beautiful Beachfront Land with Ocean Views"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="mt-1"
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.title.length}/100 characters
              </p>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your property, its features, location benefits, and investment potential..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="mt-1 min-h-[120px]"
                maxLength={1000}
              />
              <p className="text-sm text-muted-foreground mt-1">
                {formData.description.length}/1000 characters
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Property Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RESIDENTIAL">Residential</SelectItem>
                    <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                    <SelectItem value="AGRICULTURAL">Agricultural</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="landSize">Land Size (acres) *</Label>
                <Input
                  id="landSize"
                  type="number"
                  step="0.1"
                  min="0.1"
                  placeholder="e.g., 2.5"
                  value={formData.landSize}
                  onChange={(e) => handleInputChange('landSize', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location and Price */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Location & Pricing
            </CardTitle>
            <CardDescription>
              Specify the location and price details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="e.g., Galle, Sri Lanka or Colombo 3, Sri Lanka"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="price">Price (USD) *</Label>
              <div className="relative mt-1">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="price"
                  type="number"
                  min="1"
                  placeholder="500000"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property Features */}
        <Card>
          <CardHeader>
            <CardTitle>Property Features</CardTitle>
            <CardDescription>
              Select all features that apply to your property
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {propertyFeatures.map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    id={feature}
                    checked={formData.features.includes(feature)}
                    onCheckedChange={() => handleFeatureToggle(feature)}
                  />
                  <Label
                    htmlFor={feature}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {feature}
                  </Label>
                </div>
              ))}
            </div>
            
            {formData.features.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Selected features:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature) => (
                    <Badge key={feature} variant="secondary">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Property Images */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Camera className="mr-2 h-5 w-5" />
              Property Images *
            </CardTitle>
            <CardDescription>
              Upload high-quality images of your property (Maximum 8 images, 10MB each)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.images.map((file, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={URL.createObjectURL(file)}
                      width={500}
                      height={500}
                      alt={`Property image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                    disabled={uploadingImages}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-xs bg-black/50 text-white px-2 py-1 rounded truncate">
                      {file.name}
                    </p>
                  </div>
                </div>
              ))}
              
              {formData.images.length < 8 && (
                <label className={`aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors cursor-pointer flex flex-col items-center justify-center ${uploadingImages ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground text-center px-2">
                    Add Image
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    Max 10MB
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImages}
                  />
                </label>
              )}
            </div>

            {formData.images.length === 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Images Required</AlertTitle>
                <AlertDescription>
                  Please upload at least one image to showcase your property. High-quality images help attract more buyers.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              How buyers can reach you for inquiries
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactPhone">Contact Phone *</Label>
                <Input
                  id="contactPhone"
                  placeholder="+94 77 123 4567"
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="sm:w-auto w-full"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || uploadingImages}
            className="sm:w-auto w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {uploadingImages ? 'Uploading Images...' : 'Creating Listing...'}
              </>
            ) : (
              <>
                <ImagePlus className="mr-2 h-4 w-4" />
                Create Listing
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}