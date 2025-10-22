"use client"

import { useState, useEffect } from "react"
import { 
  Eye, 
  Check, 
  X, 
  Download, 
  ZoomIn,
  FileText,
  MapPin,
  Calendar,
  User,
  DollarSign,
  Ruler,
  AlertTriangle,
  ExternalLink
} from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

interface LegalDocument {
  id: string
  type: "title_deed" | "survey_plan" | "tax_certificate" | "clearance_certificate" | "other"
  filename: string
  url: string
  uploadedAt: string
}

interface PendingProperty {
  id: string
  title: string
  description: string
  price: number
  location: string
  landSize: number
  type: "residential" | "commercial" | "agricultural"
  images: string[]
  legalDocuments: LegalDocument[]
  submittedAt: string
  submittedBy: {
    id: string
    name: string
    email: string
    phone: string
  }
  priority: "high" | "medium" | "low"
  status: "pending" | "under_review" | "approved" | "rejected"
  coordinates?: {
    lat: number
    lng: number
  }
}

// Mock data
const mockPendingProperties: PendingProperty[] = [
  {
    id: "1",
    title: "Luxury Beachfront Property - Galle",
    description: "Prime beachfront land with 150m of pristine coastline. Perfect for luxury resort development or private estate. The property features gentle slopes leading to a white sandy beach with crystal clear waters. Includes mature coconut palms and has excellent road access. All utilities available including electricity, water, and telephone connections.",
    price: 2500000,
    location: "Galle, Southern Province, Sri Lanka",
    landSize: 5.2,
    type: "residential",
    images: ["/images/property-1-1.jpg", "/images/property-1-2.jpg", "/images/property-1-3.jpg"],
    legalDocuments: [
      {
        id: "doc1",
        type: "title_deed",
        filename: "title_deed_galle_property.pdf",
        url: "/documents/title_deed_1.pdf",
        uploadedAt: "2024-01-15T10:30:00Z"
      },
      {
        id: "doc2",
        type: "survey_plan",
        filename: "survey_plan_2024.pdf",
        url: "/documents/survey_plan_1.pdf",
        uploadedAt: "2024-01-15T10:35:00Z"
      },
      {
        id: "doc3",
        type: "tax_certificate",
        filename: "tax_clearance_2024.pdf",
        url: "/documents/tax_cert_1.pdf",
        uploadedAt: "2024-01-15T10:40:00Z"
      }
    ],
    submittedAt: "2024-01-15T09:00:00Z",
    submittedBy: {
      id: "user1",
      name: "Michael Fernando",
      email: "michael.fernando@email.com",
      phone: "+94 77 123 4567"
    },
    priority: "high",
    status: "pending",
    coordinates: {
      lat: 6.0329,
      lng: 80.2168
    }
  },
  {
    id: "2",
    title: "Commercial Land - Colombo 3",
    description: "Strategic commercial plot in the heart of Colombo's business district. Ideal for office complex, shopping mall, or mixed-use development. Excellent visibility from main road with high foot traffic. Close to public transportation and major commercial establishments.",
    price: 5000000,
    location: "Colombo 3, Western Province, Sri Lanka",
    landSize: 2.8,
    type: "commercial",
    images: ["/images/property-2-1.jpg", "/images/property-2-2.jpg"],
    legalDocuments: [
      {
        id: "doc4",
        type: "title_deed",
        filename: "commercial_title_deed.pdf",
        url: "/documents/title_deed_2.pdf",
        uploadedAt: "2024-01-14T14:20:00Z"
      },
      {
        id: "doc5",
        type: "clearance_certificate",
        filename: "urban_development_clearance.pdf",
        url: "/documents/clearance_2.pdf",
        uploadedAt: "2024-01-14T14:25:00Z"
      }
    ],
    submittedAt: "2024-01-14T13:00:00Z",
    submittedBy: {
      id: "user2",
      name: "Samantha Perera",
      email: "samantha.perera@email.com",
      phone: "+94 71 987 6543"
    },
    priority: "medium",
    status: "under_review",
    coordinates: {
      lat: 6.9271,
      lng: 79.8612
    }
  },
  {
    id: "3",
    title: "Agricultural Farm Land - Kandy",
    description: "Fertile agricultural land in the central highlands. Perfect for tea cultivation, vegetable farming, or organic agriculture. Good water sources available with year-round irrigation potential. Scenic mountain views and cool climate.",
    price: 800000,
    location: "Kandy, Central Province, Sri Lanka",
    landSize: 15.0,
    type: "agricultural",
    images: ["/images/property-3-1.jpg"],
    legalDocuments: [
      {
        id: "doc6",
        type: "title_deed",
        filename: "farm_land_title.pdf",
        url: "/documents/title_deed_3.pdf",
        uploadedAt: "2024-01-13T16:45:00Z"
      }
    ],
    submittedAt: "2024-01-13T15:30:00Z",
    submittedBy: {
      id: "user3",
      name: "Rajesh Kumar",
      email: "rajesh.kumar@email.com",
      phone: "+94 75 456 7890"
    },
    priority: "low",
    status: "pending"
  }
]

export default function PendingVerificationsPage() {
  const [properties, setProperties] = useState<PendingProperty[]>(mockPendingProperties)
  const [selectedProperty, setSelectedProperty] = useState<PendingProperty | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const filteredProperties = properties.filter(property => {
    if (filterStatus === "all") return true
    return property.status === filterStatus
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: PendingProperty['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'under_review':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Under Review</Badge>
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800">Approved</Badge>
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getPriorityBadge = (priority: PendingProperty['priority']) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High Priority</Badge>
      case 'medium':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Medium Priority</Badge>
      case 'low':
        return <Badge variant="outline">Low Priority</Badge>
      default:
        return <Badge variant="outline">Normal</Badge>
    }
  }

  const getDocumentTypeLabel = (type: LegalDocument['type']) => {
    switch (type) {
      case 'title_deed':
        return 'Title Deed'
      case 'survey_plan':
        return 'Survey Plan'
      case 'tax_certificate':
        return 'Tax Certificate'
      case 'clearance_certificate':
        return 'Clearance Certificate'
      case 'other':
        return 'Other Document'
      default:
        return 'Document'
    }
  }

  const handleApprove = (propertyId: string) => {
    setProperties(prev => 
      prev.map(prop => 
        prop.id === propertyId 
          ? { ...prop, status: 'approved' as const }
          : prop
      )
    )
    setSelectedProperty(null)
  }

  const handleReject = (propertyId: string, reason: string) => {
    setProperties(prev => 
      prev.map(prop => 
        prop.id === propertyId 
          ? { ...prop, status: 'rejected' as const }
          : prop
      )
    )
    setSelectedProperty(null)
    setRejectionReason("")
  }

  const handleSetUnderReview = (propertyId: string) => {
    setProperties(prev => 
      prev.map(prop => 
        prop.id === propertyId 
          ? { ...prop, status: 'under_review' as const }
          : prop
      )
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Pending Verifications</h1>
          <p className="text-muted-foreground">Review and approve property listings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setFilterStatus("all")}>
            All ({properties.length})
          </Button>
          <Button variant="outline" onClick={() => setFilterStatus("pending")}>
            Pending ({properties.filter(p => p.status === 'pending').length})
          </Button>
          <Button variant="outline" onClick={() => setFilterStatus("under_review")}>
            Under Review ({properties.filter(p => p.status === 'under_review').length})
          </Button>
        </div>
      </div>

      {/* Properties Table */}
      <Card>
        <CardHeader>
          <CardTitle>Property Submissions</CardTitle>
          <CardDescription>Properties waiting for admin verification and approval</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProperties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{property.title}</p>
                        <p className="text-sm text-muted-foreground">{property.location}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{property.type}</Badge>
                          <Badge variant="outline" className="text-xs">{property.landSize} acres</Badge>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{property.submittedBy.name}</p>
                      <p className="text-sm text-muted-foreground">{property.submittedBy.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-green-600">{formatPrice(property.price)}</span>
                  </TableCell>
                  <TableCell>
                    {getPriorityBadge(property.priority)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(property.status)}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{formatDate(property.submittedAt)}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 mx-auto">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedProperty(property)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-6xl max-h-[90vh]">
                          <DialogHeader>
                            <DialogTitle>Property Review - {selectedProperty?.title}</DialogTitle>
                            <DialogDescription>
                              Review all property details and documents before approval
                            </DialogDescription>
                          </DialogHeader>
                          
                          {selectedProperty && (
                            <PropertyReviewContent 
                              property={selectedProperty}
                              onApprove={() => handleApprove(selectedProperty.id)}
                              onReject={(reason) => handleReject(selectedProperty.id, reason)}
                              onSetUnderReview={() => handleSetUnderReview(selectedProperty.id)}
                              rejectionReason={rejectionReason}
                              setRejectionReason={setRejectionReason}
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredProperties.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No properties found</h3>
              <p className="text-muted-foreground">
                {filterStatus === "all" 
                  ? "No pending verifications at the moment." 
                  : `No properties with status "${filterStatus}".`
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Property Review Content Component
function PropertyReviewContent({
  property,
  onApprove,
  onReject,
  onSetUnderReview,
  rejectionReason,
  setRejectionReason
}: {
  property: PendingProperty
  onApprove: () => void
  onReject: (reason: string) => void
  onSetUnderReview: () => void
  rejectionReason: string
  setRejectionReason: (reason: string) => void
}) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedDocument, setSelectedDocument] = useState<LegalDocument | null>(null)

  return (
    <ScrollArea className="max-h-[70vh] pr-4">
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="details">Property Details</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="documents">Legal Documents</TabsTrigger>
          <TabsTrigger value="seller">Seller Info</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Property Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Title</Label>
                  <p className="text-sm mt-1">{property.title}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm mt-1 text-muted-foreground">{property.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Price</Label>
                    <p className="text-lg font-bold text-green-600 mt-1">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 0,
                      }).format(property.price)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Land Size</Label>
                    <p className="text-sm mt-1">{property.landSize} acres</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Location</Label>
                  <p className="text-sm mt-1">{property.location}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Property Type</Label>
                  <Badge className="mt-1 capitalize">{property.type}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Submission Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Submitted At</Label>
                  <p className="text-sm mt-1">{new Date(property.submittedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Priority</Label>
                  <div className="mt-1">
                    {property.priority === 'high' && <Badge variant="destructive">High Priority</Badge>}
                    {property.priority === 'medium' && <Badge variant="secondary" className="bg-orange-100 text-orange-800">Medium Priority</Badge>}
                    {property.priority === 'low' && <Badge variant="outline">Low Priority</Badge>}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Current Status</Label>
                  <div className="mt-1">
                    {property.status === 'pending' && <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending Review</Badge>}
                    {property.status === 'under_review' && <Badge variant="default" className="bg-blue-100 text-blue-800">Under Review</Badge>}
                    {property.status === 'approved' && <Badge variant="default" className="bg-green-100 text-green-800">Approved</Badge>}
                    {property.status === 'rejected' && <Badge variant="destructive">Rejected</Badge>}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Documents Count</Label>
                  <p className="text-sm mt-1">{property.legalDocuments.length} document(s) uploaded</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {property.images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
                     onClick={() => setSelectedImage(image)}>
                  <div className="text-center">
                    <Eye className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">Image {index + 1}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {property.images.length === 0 && (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Images Uploaded</h3>
              <p className="text-muted-foreground">This property listing has no images attached.</p>
            </div>
          )}

          {selectedImage && (
            <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Property Image</DialogTitle>
                </DialogHeader>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Image Preview: {selectedImage}</p>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <div className="grid gap-4">
            {property.legalDocuments.map((document) => (
              <Card key={document.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="font-medium">{getDocumentTypeLabel(document.type)}</p>
                      <p className="text-sm text-muted-foreground">{document.filename}</p>
                      <p className="text-xs text-muted-foreground">
                        Uploaded: {new Date(document.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {property.legalDocuments.length === 0 && (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Legal Documents</h3>
              <p className="text-muted-foreground">This property listing has no legal documents attached.</p>
              <p className="text-sm text-red-600 mt-2">⚠️ Legal documents are required for approval</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="seller" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Seller Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Full Name</Label>
                  <p className="text-sm mt-1">{property.submittedBy.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email Address</Label>
                  <p className="text-sm mt-1">{property.submittedBy.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Phone Number</Label>
                  <p className="text-sm mt-1">{property.submittedBy.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">User ID</Label>
                  <p className="text-sm mt-1 font-mono">{property.submittedBy.id}</p>
                </div>
              </div>
              <div className="pt-4">
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View Full Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        {property.status === 'pending' && (
          <Button
            variant="secondary"
            onClick={onSetUnderReview}
          >
            Mark Under Review
          </Button>
        )}
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <X className="h-4 w-4 mr-1" />
              Reject
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reject Property Listing</AlertDialogTitle>
              <AlertDialogDescription>
                Please provide a reason for rejecting this property listing. This will be sent to the seller.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <Label htmlFor="rejection-reason">Rejection Reason</Label>
              <Textarea
                id="rejection-reason"
                placeholder="Enter the reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="mt-2"
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onReject(rejectionReason)}
                disabled={!rejectionReason.trim()}
                className="bg-destructive hover:bg-destructive/90"
              >
                Reject Property
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button
          onClick={onApprove}
          disabled={property.legalDocuments.length === 0}
        >
          <Check className="h-4 w-4 mr-1" />
          Approve
        </Button>
      </div>
    </ScrollArea>
  )
}

function getDocumentTypeLabel(type: LegalDocument['type']) {
  switch (type) {
    case 'title_deed':
      return 'Title Deed'
    case 'survey_plan':
      return 'Survey Plan'
    case 'tax_certificate':
      return 'Tax Certificate'
    case 'clearance_certificate':
      return 'Clearance Certificate'
    case 'other':
      return 'Other Document'
    default:
      return 'Document'
  }
}