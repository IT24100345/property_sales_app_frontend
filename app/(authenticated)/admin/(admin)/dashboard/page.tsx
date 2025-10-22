"use client"

import { useState, useEffect } from "react"
import { 
  Users, 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  MessageSquare, 
  AlertTriangle,
  Eye,
  UserCheck,
  Building,
  Calendar
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Mock data types
interface DashboardStats {
  totalUsers: number
  totalProperties: number
  totalRevenue: number
  activeListings: number
  pendingApprovals: number
  totalInquiries: number
  monthlyGrowth: number
  conversionRate: number
}

interface RecentActivity {
  id: string
  type: "user_registration" | "property_listing" | "inquiry" | "transaction"
  description: string
  timestamp: string
  status: "pending" | "completed" | "approved" | "rejected"
}

interface PendingApproval {
  id: string
  type: "property" | "user_verification"
  title: string
  submittedBy: string
  submittedAt: string
  priority: "high" | "medium" | "low"
}

// Mock data
const mockStats: DashboardStats = {
  totalUsers: 1247,
  totalProperties: 342,
  totalRevenue: 2450000,
  activeListings: 189,
  pendingApprovals: 23,
  totalInquiries: 156,
  monthlyGrowth: 12.5,
  conversionRate: 8.3
}

const mockRecentActivity: RecentActivity[] = [
  {
    id: "1",
    type: "user_registration",
    description: "New user registered: john.doe@email.com",
    timestamp: "2 minutes ago",
    status: "completed"
  },
  {
    id: "2",
    type: "property_listing",
    description: "New property listed: Beachfront Villa in Galle",
    timestamp: "15 minutes ago",
    status: "pending"
  },
  {
    id: "3",
    type: "inquiry",
    description: "Inquiry received for Commercial Land in Colombo",
    timestamp: "1 hour ago",
    status: "completed"
  },
  {
    id: "4",
    type: "transaction",
    description: "Property sale completed: $450,000",
    timestamp: "2 hours ago",
    status: "completed"
  },
  {
    id: "5",
    type: "user_registration",
    description: "User verification submitted: Sarah Williams",
    timestamp: "3 hours ago",
    status: "pending"
  }
]

const mockPendingApprovals: PendingApproval[] = [
  {
    id: "1",
    type: "property",
    title: "Luxury Hillside Property - Kandy",
    submittedBy: "Michael Chen",
    submittedAt: "2024-01-15",
    priority: "high"
  },
  {
    id: "2",
    type: "user_verification",
    title: "Business License Verification",
    submittedBy: "Lanka Properties Ltd",
    submittedAt: "2024-01-14",
    priority: "medium"
  },
  {
    id: "3",
    type: "property",
    title: "Agricultural Land - Matale",
    submittedBy: "Rajesh Kumar",
    submittedAt: "2024-01-13",
    priority: "low"
  }
]

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>(mockStats)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>(mockRecentActivity)
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>(mockPendingApprovals)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchPendingApprovals = async () => {
      setLoading(true)
      const response = await fetch('http://localhost:8080/api/admin/pending-approvals')
      const data = await response.json()
      setPendingApprovals(data)
      setLoading(false)
    }

    fetchPendingApprovals()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'user_registration':
        return <UserCheck className="h-4 w-4 text-blue-500" />
      case 'property_listing':
        return <Building className="h-4 w-4 text-green-500" />
      case 'inquiry':
        return <MessageSquare className="h-4 w-4 text-purple-500" />
      case 'transaction':
        return <DollarSign className="h-4 w-4 text-emerald-500" />
      default:
        return <Calendar className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: RecentActivity['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'approved':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Approved</Badge>
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getPriorityBadge = (priority: PendingApproval['priority']) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>
      case 'medium':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case 'low':
        return <Badge variant="outline">Low</Badge>
      default:
        return <Badge variant="outline">Normal</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here&apos;s what&apos;s happening with LandLink today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{stats.monthlyGrowth}%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProperties}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeListings} currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15.2%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2.1%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Pending Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{stats.pendingApprovals}</div>
            <p className="text-sm text-muted-foreground mt-1">Require immediate attention</p>
            <Button variant="outline" size="sm" className="mt-3">
              Review All
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              Active Inquiries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.totalInquiries}</div>
            <p className="text-sm text-muted-foreground mt-1">Customer inquiries this month</p>
            <Button variant="outline" size="sm" className="mt-3">
              View Inquiries
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="h-5 w-5 text-purple-500" />
              Platform Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>System Performance</span>
                  <span>98%</span>
                </div>
                <Progress value={98} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>User Satisfaction</span>
                  <span>94%</span>
                </div>
                <Progress value={94} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform activities and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="mt-0.5">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                  <div>
                    {getStatusBadge(activity.status)}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Activity
            </Button>
          </CardContent>
        </Card>

        {/* Pending Approvals Table */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>Items requiring admin review and approval</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Submitted By</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingApprovals.map((approval) => (
                  <TableRow key={approval.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{approval.title}</p>
                        <p className="text-xs text-muted-foreground capitalize">{approval.type}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{approval.submittedBy}</p>
                        <p className="text-xs text-muted-foreground">{approval.submittedAt}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getPriorityBadge(approval.priority)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Review</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button variant="outline" className="w-full mt-4">
              View All Pending
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}