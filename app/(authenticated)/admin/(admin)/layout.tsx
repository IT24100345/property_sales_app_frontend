"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ShieldAlert, Crown } from "lucide-react"

import { useAuth } from "@/lib/auth/AuthContext"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function AdminOnlyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuthorization = async () => {
      setIsChecking(true)

      // Wait for auth to finish loading
      if (loading) {
        return
      }

      // If no user is logged in, redirect to login
      if (!user) {
        //router.push("/login")
        return
      }

      // Check if user has ROLE_ADMIN only (no moderators allowed)
      const hasAdminRole = user.roles?.includes("ROLE_ADMIN")

                          console.log("User roles:", user.roles)
      if (!hasAdminRole) {
        setIsAuthorized(false)
        setIsChecking(false)
        return
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
          <p className="text-muted-foreground">Verifying administrator privileges...</p>
        </div>
      </div>
    )
  }

  // Show unauthorized message if user doesn't have admin role
  if (!isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <ShieldAlert className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-xl">Administrator Access Required</CardTitle>
            <CardDescription>
              You don&apos;t have administrator privileges to access this area
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              This section is exclusively for system administrators. 
              Only users with ROLE_ADMIN can access these features.
            </p>
            <div className="flex flex-col gap-2">
              <Button onClick={() => router.push("/")} className="w-full">
                Go to Home
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push("/admin")} 
                className="w-full"
              >
                Back to Admin Panel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render children if authorized with admin-only header
  return (
    <div className="min-h-screen w-full">
      {/* Admin-Only Header */}
      <div className="border-b bg-gradient-to-r from-red-900 to-red-800 text-white">
        <div className="container py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center px-4 space-x-2">
                <Crown className="h-5 w-5 text-yellow-400" />
                <span className="font-semibold">Administrator Dashboard</span>
              </div>
              <div className="h-4 w-px bg-red-600"></div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-red-100">ADMIN ONLY</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-red-100">
                Administrator: {user?.username}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/admin")}
                className="border-red-600 text-red-100 hover:bg-red-800"
              >
                Back to Admin Panel
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Admin-Only Navigation */}
      <div className="border-b bg-red-50">
        <div className="container py-2">
          <nav className="flex space-x-6">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.push("/admin/admin/dashboard")}
              className="text-sm"
            >
              Admin Dashboard
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.push("/admin/admin/system")}
              className="text-sm"
            >
              System Settings
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.push("/admin/admin/permissions")}
              className="text-sm"
            >
              Permissions
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.push("/admin/admin/audit")}
              className="text-sm"
            >
              Audit Logs
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.push("/admin/admin/backup")}
              className="text-sm"
            >
              Backup & Recovery
            </Button>
          </nav>
        </div>
      </div>
      
      {/* Warning Banner */}
      <div className="bg-yellow-50 border-b border-yellow-200">
        <div className="container py-2">
          <div className="flex items-center justify-center space-x-2 text-yellow-800">
            <ShieldAlert className="h-4 w-4" />
            <span className="text-sm font-medium">
              ADMINISTRATOR AREA - Changes made here affect the entire system
            </span>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="container py-6">
        {children}
      </main>
    </div>
  )
}