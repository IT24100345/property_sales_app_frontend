"use client"

import { useState, useEffect } from "react"
import { 
  DollarSign, 
  Eye, 
  MessageCircle, 
  TrendingUp, 
  Users, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  Clock
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface StatsOverview {
  currentIncome: number
  monthlyIncome: number
  incomeChange: number
  totalInquiries: number
  newInquiries: number
  inquiryChange: number
  totalViews: number
  monthlyViews: number
  viewsChange: number
  totalProperties: number
  activeProperties: number
}

interface Inquiry {
  id: string
  buyerName: string
  buyerEmail: string
  buyerPhone: string
  buyerAvatar?: string
  propertyTitle: string
  propertyLocation: string
  message: string
  timestamp: Date
  status: "new" | "replied" | "interested" | "closed"
  priority: "high" | "medium" | "low"
}

interface PropertyStats {
  id: string
  title: string
  location: string
  price: number
  views: number
  inquiries: number
  favorites: number
  daysListed: number
  status: "active" | "sold" | "draft"
}

// Mock data
const mockStats: StatsOverview = {
  currentIncome: 125000,
  monthlyIncome: 45000,
  incomeChange: 12.5,
  totalInquiries: 89,
  newInquiries: 23,
  inquiryChange: -5.2,
  totalViews: 15420,
  monthlyViews: 4680,
  viewsChange: 18.7,
  totalProperties: 8,
  activeProperties: 6
}

const mockInquiries: Inquiry[] = [
  {
    id: "inq-1",
    buyerName: "Sarah Ahmed",
    buyerEmail: "sarah@example.com",
    buyerPhone: "+94 76 234 5678",
    buyerAvatar: "/images/buyer-1.jpg",
    propertyTitle: "Beautiful Beachfront Land",
    propertyLocation: "Galle, Sri Lanka",
    message: "I'm very interested in this beachfront property. Could we arrange a site visit this weekend?",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: "new",
    priority: "high"
  },
  {
    id: "inq-2",
    buyerName: "Michael Chen",
    buyerEmail: "michael@example.com",
    buyerPhone: "+94 77 345 6789",
    propertyTitle: "Commercial Land in Colombo",
    propertyLocation: "Colombo 3, Sri Lanka",
    message: "What are the zoning regulations for this commercial plot? I'm planning a retail development.",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    status: "replied",
    priority: "medium"
  },
  {
    id: "inq-3",
    buyerName: "Emma Wilson",
    buyerEmail: "emma@example.com",
    buyerPhone: "+94 75 456 7890",
    propertyTitle: "Hillside Residential Plot",
    propertyLocation: "Nuwara Eliya, Sri Lanka",
    message: "Is financing available for this property? Also, what utilities are connected?",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    status: "interested",
    priority: "medium"
  }
]

const mockPropertyStats: PropertyStats[] = [
  {
    id: "prop-1",
    title: "Beautiful Beachfront Land",
    location: "Galle, Sri Lanka",
    price: 500000,
    views: 2450,
    inquiries: 18,
    favorites: 34,
    daysListed: 15,
    status: "active"
  },
  {
    id: "prop-2",
    title: "Commercial Land in Colombo",
    location: "Colombo 3, Sri Lanka",
    price: 800000,
    views: 1890,
    inquiries: 12,
    favorites: 28,
    daysListed: 22,
    status: "active"
  },
  {
    id: "prop-3",
    title: "Agricultural Farm Land",
    location: "Kandy, Sri Lanka",
    price: 200000,
    views: 980,
    inquiries: 8,
    favorites: 15,
    daysListed: 8,
    status: "active"
  }
]

export default function SellerStatsPage() {
  const [stats, setStats] = useState<StatsOverview>(mockStats)
  const [inquiries, setInquiries] = useState<Inquiry[]>(mockInquiries)
  const [propertyStats, setPropertyStats] = useState<PropertyStats[]>(mockPropertyStats)
  const [selectedPeriod, setSelectedPeriod] = useState("30")
  const [isLoading, setIsLoading] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "Just now"
    if (diffInHours === 1) return "1 hour ago"
    if (diffInHours < 24) return `${diffInHours} hours ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return "1 day ago"
    return `${diffInDays} days ago`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-500"
      case "replied": return "bg-green-500"
      case "interested": return "bg-yellow-500"
      case "closed": return "bg-gray-500"
      default: return "bg-gray-500"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive"
      case "medium": return "default"
      case "low": return "secondary"
      default: return "default"
    }
  }

  return (
    <div className="container py-8 mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Seller Dashboard</h1>
          <p className="text-muted-foreground">
            Track your property listings, inquiries, and earnings
          </p>
        </div>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 3 months</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Income</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.currentIncome)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="mr-1">Monthly:</span>
              <span className="font-medium">{formatPrice(stats.monthlyIncome)}</span>
              {stats.incomeChange > 0 ? (
                <ArrowUpRight className="ml-1 h-3 w-3 text-green-500" />
              ) : (
                <ArrowDownRight className="ml-1 h-3 w-3 text-red-500" />
              )}
              <span className={`ml-1 ${stats.incomeChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {Math.abs(stats.incomeChange)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInquiries}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="mr-1">New:</span>
              <span className="font-medium text-blue-600">{stats.newInquiries}</span>
              {stats.inquiryChange > 0 ? (
                <ArrowUpRight className="ml-1 h-3 w-3 text-green-500" />
              ) : (
                <ArrowDownRight className="ml-1 h-3 w-3 text-red-500" />
              )}
              <span className={`ml-1 ${stats.inquiryChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {Math.abs(stats.inquiryChange)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="mr-1">Monthly:</span>
              <span className="font-medium">{stats.monthlyViews.toLocaleString()}</span>
              <ArrowUpRight className="ml-1 h-3 w-3 text-green-500" />
              <span className="ml-1 text-green-500">+{stats.viewsChange}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Properties</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProperties}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="mr-1">Total:</span>
              <span className="font-medium">{stats.totalProperties}</span>
              <div className="ml-auto">
                <Progress 
                  value={(stats.activeProperties / stats.totalProperties) * 100} 
                  className="w-12 h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Inquiries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Inquiries
              <Badge variant="outline">{inquiries.length} total</Badge>
            </CardTitle>
            <CardDescription>
              Latest inquiries from potential buyers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inquiries.map((inquiry) => (
                <div key={inquiry.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={inquiry.buyerAvatar} alt={inquiry.buyerName} />
                    <AvatarFallback>
                      {inquiry.buyerName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-sm">{inquiry.buyerName}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getPriorityColor(inquiry.priority)} className="text-xs">
                          {inquiry.priority}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Phone className="mr-2 h-4 w-4" />
                              Call Buyer
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MessageCircle className="mr-2 h-4 w-4" />
                              Reply to Chat
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-xs text-muted-foreground mb-2">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="font-medium">{inquiry.propertyTitle}</span>
                      <span className="mx-1">•</span>
                      <span>{inquiry.propertyLocation}</span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {inquiry.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(inquiry.status)}`}></div>
                        <span className="text-xs text-muted-foreground capitalize">{inquiry.status}</span>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTimeAgo(inquiry.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full mt-4">
              View All Inquiries
            </Button>
          </CardContent>
        </Card>

        {/* Top Performing Properties */}
        <Card>
          <CardHeader>
            <CardTitle>Property Performance</CardTitle>
            <CardDescription>
              Your top performing property listings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {propertyStats.map((property) => (
                <div key={property.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-sm">{property.title}</h4>
                      <p className="text-xs text-muted-foreground">{property.location}</p>
                      <p className="text-sm font-medium text-green-600">{formatPrice(property.price)}</p>
                    </div>
                    <Badge variant={property.status === "active" ? "default" : "secondary"}>
                      {property.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold">{property.views}</div>
                      <div className="text-xs text-muted-foreground">Views</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">{property.inquiries}</div>
                      <div className="text-xs text-muted-foreground">Inquiries</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">{property.favorites}</div>
                      <div className="text-xs text-muted-foreground">Favorites</div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Listed {property.daysListed} days ago</span>
                      <span>CVR: {((property.inquiries / property.views) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full mt-4">
              View All Properties
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}