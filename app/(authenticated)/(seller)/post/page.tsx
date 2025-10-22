"use client"

import { useEffect, useState } from "react"
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  MapPin, 
  Calendar, 
  Star,
  TrendingUp,
  Crown,
  Zap
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
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth/AuthContext"
import { toast } from "sonner"

interface SellerPost {
  id: string
  title: string
  description: string
  price: number
  location: string
  landSize: number
  type: "RESIDENTIAL" | "COMMERCIAL" | "AGRICULTURAL"
  images: string[]
  verificationStatus: "PENDING" | "VERIFIED" | "REJECTED" 
  createdAt: string
  updatedAt: string
  views: number
  inquiries: number
  premiumPost: boolean
  premiumExpiry?: string
  rejectionReason?: string
}

interface SellerPlan {
  type: "free" | "premium"
  postsLimit: number
  currentPosts: number
  premiumFeatures: boolean
  premiumExpiry?: string
}

// Mock data
const mockSellerPlan: SellerPlan = {
  type: "free",
  postsLimit: 3,
  currentPosts: 2,
  premiumFeatures: false
}

// const mockPosts: SellerPost[] = [
//   {
//     id: "1",
//     title: "Beautiful Beachfront Property - Galle",
//     description: "Prime beachfront land with stunning ocean views. Perfect for resort development or private residence with 150m of pristine coastline.",
//     price: 2500000,
//     location: "Galle, Southern Province",
//     landSize: 5.2,
//     type: "residential",
//     images: ["/images/property-1.jpg", "/images/property-1-2.jpg"],
//     verificationStatus: "approved",
//     createdAt: "2024-01-15T10:00:00Z",
//     updatedAt: "2024-01-16T14:30:00Z",
//     views: 245,
//     inquiries: 12,
//     isPremium: false
//   },
//   {
//     id: "2",
//     title: "Commercial Land - Colombo",
//     description: "Strategic commercial plot in the heart of Colombo's business district. Ideal for office complex or mixed-use development.",
//     price: 5000000,
//     location: "Colombo 3, Western Province",
//     landSize: 2.8,
//     type: "commercial",
//     images: ["/images/property-2.jpg"],
//     verificationStatus: "pending",
//     createdAt: "2024-01-14T15:20:00Z",
//     updatedAt: "2024-01-14T15:20:00Z",
//     views: 89,
//     inquiries: 5,
//     isPremium: true,
//     premiumExpiry: "2024-02-14T15:20:00Z"
//   },
//   {
//     id: "3",
//     title: "Agricultural Farm Land - Kandy",
//     description: "Fertile agricultural land perfect for tea cultivation or organic farming with excellent water access.",
//     price: 800000,
//     location: "Kandy, Central Province",
//     landSize: 15.0,
//     type: "agricultural",
//     images: ["/images/property-3.jpg"],
//     verificationStatus: "rejected",
//     createdAt: "2024-01-10T09:15:00Z",
//     updatedAt: "2024-01-12T11:45:00Z",
//     views: 34,
//     inquiries: 1,
//     isPremium: false,
//     rejectionReason: "Missing legal documentation. Please provide title deed and survey plan."
//   },
//   {
//     id: "4",
//     title: "Luxury Hillside Plot - Nuwara Eliya",
//     description: "Premium hillside location with panoramic mountain views. Perfect for luxury villa development.",
//     price: 1200000,
//     location: "Nuwara Eliya, Central Province",
//     landSize: 3.5,
//     type: "residential",
//     images: [],
//     verificationStatus: "draft",
//     createdAt: "2024-01-20T16:30:00Z",
//     updatedAt: "2024-01-20T16:30:00Z",
//     views: 0,
//     inquiries: 0,
//     isPremium: false
//   }
// ]

export default function SellerPostsPage() {
  const [posts, setPosts] = useState<SellerPost[]>()
  const [sellerPlan, setSellerPlan] = useState<SellerPlan>(mockSellerPlan)
  const [selectedPost, setSelectedPost] = useState<string | null>(null)

  const { jwt } = useAuth()

  useEffect(() => {
    console.log("Fetching posts with JWT:", jwt)
    const fetchPosts = async () => {
      const response = await fetch('http://localhost:8080/api/posts', {
        method: 'GET',
        headers: {
          "Authorization": jwt ?? ""
        }
      })
      const data = await response.json()
      setPosts(data)
    }
    fetchPosts()
  }, [jwt])

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
      day: 'numeric'
    })
  }

  const getverificationStatusBadge = (verificationStatus: SellerPost['verificationStatus']) => {
    switch (verificationStatus) {

      case 'PENDING':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending Review</Badge>
      case 'VERIFIED':
        return <Badge variant="default" className="bg-green-100 text-green-800">Live</Badge>
      case 'REJECTED':
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const handleMakePremium = async (postId: string) => {
    const response = await fetch(`http://localhost:8080/api/posts/${postId}/make-premium`, {
      method: 'POST',
      headers: {
        "Authorization": jwt ?? ""
      }
    })

    if (response.ok) {
      setPosts(prev => 
        prev?.map(post => 
          post.id === postId
            ? { ...post, premiumPost: true, premiumExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() }
            : post
        )
      )
      console.log(await response.json())
      toast.success("Post upgraded to premium successfully!")
    }
    
  }

  const handleDeletePost = (postId: string) => {
    setPosts(prev => prev?.filter(post => post.id !== postId))
    setSelectedPost(null)
  }

  const handleUpgradeToPremium = (postId: string) => {
    setPosts(prev => 
      prev?.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isPremium: true, 
              premiumExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            }
          : post
      )
    )
  }

  const canCreateNewPost = sellerPlan.currentPosts < sellerPlan.postsLimit

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Property Listings</h1>
          <p className="text-muted-foreground">Manage your property advertisements and track their performance</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button disabled={!canCreateNewPost} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Create New Post
          </Button>
        </div>
      </div>

      {/* Plan Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Plan verificationStatus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant={sellerPlan.type === "premium" ? "default" : "outline"} className="capitalize">
                {sellerPlan.type} Plan
              </Badge>
              {sellerPlan.type === "premium" && (
                <Crown className="h-4 w-4 text-yellow-500" />
              )}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Posts Used</span>
                <span>{sellerPlan.currentPosts}/{sellerPlan.postsLimit}</span>
              </div>
              <Progress 
                value={(sellerPlan.currentPosts / sellerPlan.postsLimit) * 100} 
                className="h-2" 
              />
            </div>
            {!canCreateNewPost && (
              <p className="text-xs text-red-600 mt-2">
                ⚠️ Post limit reached. Upgrade to create more listings.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="h-5 w-5 text-green-500" />
              Total Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {posts?.reduce((sum, post) => sum + post.views, 0).toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Across all listings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="h-5 w-5 text-purple-500" />
              Total Inquiries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {posts?.reduce((sum, post) => sum + post.inquiries, 0)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Customer inquiries
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Premium Upgrade CTA */}
      {sellerPlan.type === "free" && (
        <Card className="border-2 border-dashed border-purple-300 bg-gradient-to-r from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-full w-fit">
                  <Crown className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-900">Upgrade to Premium</h3>
                  <p className="text-purple-700 text-sm">
                    Get unlimited posts, priority placement, and advanced analytics
                  </p>
                </div>
              </div>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 w-full sm:w-auto">
                <Zap className="h-4 w-4 mr-2" />
                Upgrade Now
              </Button>
            </div>
            <Separator className="my-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2 text-purple-700">
                <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                Unlimited Posts
              </div>
              <div className="flex items-center gap-2 text-purple-700">
                <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                Priority Placement
              </div>
              <div className="flex items-center gap-2 text-purple-700">
                <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                Advanced Analytics
              </div>
              <div className="flex items-center gap-2 text-purple-700">
                <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                Premium Support
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Property Listings</CardTitle>
          <CardDescription>
            Manage and track the performance of your property advertisements
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[300px]">Property</TableHead>
                  <TableHead className="min-w-[120px]">Price</TableHead>
                  <TableHead className="min-w-[100px]">verificationStatus</TableHead>
                  <TableHead className="min-w-[80px]">Views</TableHead>
                  <TableHead className="min-w-[80px]">Inquiries</TableHead>
                  <TableHead className="min-w-[100px]">Created</TableHead>
                  <TableHead className="min-w-[200px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts?.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center relative flex-shrink-0">
                          {post.premiumPost && (
                            <Crown className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500" />
                          )}
                          <MapPin className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium truncate">{post.title}</p>
                            {post.premiumPost && (
                              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs flex-shrink-0">
                                Premium
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{post.location}</span>
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="text-xs capitalize">
                              {post.type}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {post.landSize} acres
                            </Badge>
                          </div>
                          {post.verificationStatus === 'REJECTED' && post.rejectionReason && (
                            <p className="text-xs text-red-600 mt-2">
                              Rejected: {post.rejectionReason}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-4">
                      <span className="font-medium text-green-600">
                        {formatPrice(post.price)}
                      </span>
                    </TableCell>
                    <TableCell className="p-4">
                      {getverificationStatusBadge(post.verificationStatus)}
                    </TableCell>
                    <TableCell className="p-4">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span>{post.views.toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell className="p-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-muted-foreground" />
                        <span>{post.inquiries}</span>
                      </div>
                    </TableCell>
                    <TableCell className="p-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{formatDate(post.createdAt)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {!post.premiumPost && post.verificationStatus === 'VERIFIED' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleUpgradeToPremium(post.id)}
                            className="bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-purple-200"
                          >
                            <Crown className="h-3 w-3 mr-1 text-purple-500" />
                            <span className="text-purple-700">Upgrade</span>
                          </Button>
                        )}
                        
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>

                        <Button size="sm" variant="outline" onClick={() => handleMakePremium(post.id)}>
                          <Crown className="h-3 w-3 mr-1" />
                          Make Premium
                        </Button>

                        {(post.verificationStatus === 'REJECTED') && (
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        )}
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setSelectedPost(post.id)}
                            >
                              <Trash2 className="h-3 w-3 mr-1 text-red-500" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Property Listing</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete &quot;{post.title}&quot;? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeletePost(post.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {posts?.length === 0 && (
            <div className="text-center py-12 px-4">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first property listing to start attracting buyers.
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Listing
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}