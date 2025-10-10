"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ShieldAlert, Shield } from "lucide-react"

import { useAuth } from "@/lib/auth/AuthContext"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    const checkAuthorization = async () => {
      setIsChecking(true)

      // Wait for auth to finish loading
      if (loading) {
        return
      }

      // If no user is logged in, redirect to login
      if (!user) {
        router.push("/login")
        return
      }

      // Check if user has ROLE_ADMIN or ROLE_MODERATOR
      const hasAdminRole = user.roles?.includes("ROLE_ADMIN") || 
                          user.roles?.includes("ADMIN") ||
                          user.roles?.includes("admin")

      const hasModeratorRole = user.roles?.includes("ROLE_MODERATOR") || 
                              user.roles?.includes("MODERATOR") ||
                              user.roles?.includes("moderator")

      if (!hasAdminRole && !hasModeratorRole) {
        setIsAuthorized(false)
        setIsChecking(false)
        return
      }

      // Set the user role for display purposes
      if (hasAdminRole) {
        setUserRole("Admin")
      } else if (hasModeratorRole) {
        setUserRole("Moderator")
      }

      setIsAuthorized(true)
      setIsChecking(false)
    }

    checkAuthorization()
  }, [user, loading, router])

  // Show loading spinner while checking authentication
  if (loading || isChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  // Show unauthorized message if user doesn't have admin or moderator role
  if (!isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <ShieldAlert className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-xl">Admin Access Required</CardTitle>
            <CardDescription>
              You don&apos;t have permission to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              This section is only available to administrators and moderators. 
              Please contact support if you believe this is an error.
            </p>
            <div className="flex flex-col gap-2">
              <Button onClick={() => router.push("/")} className="w-full">
                Go to Home
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push("/profile")} 
                className="w-full"
              >
                View Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render children if authorized with admin header
  return (
    <div className="min-h-screen">
      {/* Admin Header */}
      <div className="border-b bg-slate-900 text-white">
        <div className="container py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-400" />
                <span className="font-semibold">Admin Panel</span>
              </div>
              <div className="h-4 w-px bg-slate-600"></div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-300">{userRole} Access</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-slate-300">
                Welcome, {user?.username}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/")}
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                Exit Admin
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Navigation */}
      <div className="border-b bg-muted/30">
        <div className="container py-2">
          <nav className="flex space-x-6">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.push("/admin")}
              className="text-sm"
            >
              Dashboard
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.push("/admin/users")}
              className="text-sm"
            >
              Users
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.push("/admin/properties")}
              className="text-sm"
            >
              Properties
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.push("/admin/reports")}
              className="text-sm"
            >
              Reports
            </Button>
            {userRole === "Admin" && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push("/admin/settings")}
                className="text-sm"
              >
                Settings
              </Button>
            )}
          </nav>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="container py-6">
        {children}
      </main>
    </div>
  )
}