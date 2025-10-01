"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { BadgeCheck, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/AuthContext"
import { updateUser } from "@/lib/authService"


interface UserProfile {
  id: string
  username: string
  email: string
  fullName: string
  bio: string
  role: string
  avatarUrl?: string
  phoneNumber?: string
  location?: string
  joinedDate: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  
  // Edit fields state
  const [editableFields, setEditableFields] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    location: "",
    bio: "",
  })

  const router = useRouter()
  const { user: authUser, setUser: setAuthUser, jwt } = useAuth()

  useEffect(() => {
    // Fetch user profile data from API
    const fetchUserProfile = async () => {
      setIsLoading(true)
      try {
        // This would be replaced with an actual API call
        // const response = await fetch(`/api/users/profile`)
        // const data = await response.json()
        
        // For now, simulate API response with mock data

        console.log("authUser", authUser)
        
        const mockUser: UserProfile = {
          id: authUser?.id || "1",
          username: authUser?.username || "Movindu Lochana",
          email: authUser?.email || "movindu@example.com",
          fullName: authUser?.username || "Movindu Lochana",
          bio: "Property enthusiast and investor looking for new opportunities.",
          role: authUser?.roles[0] || "buyer",
          phoneNumber: "+94 (077) 123-4567",
          location: "Colombo, Sri Lanka",
          joinedDate: "January 2023",
        }
        
        setUser(mockUser)
        setEditableFields({
          fullName: mockUser.fullName,
          email: mockUser.email,
          phoneNumber: mockUser.phoneNumber || "",
          location: mockUser.location || "",
          bio: mockUser.bio,
        })
      } catch (error) {
        console.error("Failed to fetch profile:", error)
        toast.error("Failed to load profile information")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchUserProfile()
  }, [toast, authUser])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditableFields(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {      
      // Update local user state with edited fields
      setUser(prev => prev ? {
        ...prev,
        ...editableFields
      } : null)


      const c = await updateUser({
        id: authUser?.id || "",
        username: editableFields.fullName || "",
        email: editableFields.email || "",
        roles: authUser?.roles || [],
      })

      console.log("updateUser", c)

      toast.info("Your profile information has been updated successfully")
    } catch (error) {
      console.error("Failed to update profile:", error)
      toast.error("Failed to update profile information")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center">
        <h1 className="text-2xl font-semibold">Profile not found</h1>
        <p className="text-muted-foreground">Unable to load profile information</p>
        <Button 
          className="mt-4" 
          onClick={() => router.push("/")}
        >
          Go to Home
        </Button>
      </div>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="container max-w-4xl py-10 px-20 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">My Profile</h1>
      
      <div className="mb-8 flex flex-col items-center sm:flex-row sm:items-start">
        <Avatar className="h-24 w-24">
          <AvatarImage src={user.avatarUrl} alt={user.fullName} />
          <AvatarFallback className="text-lg">{getInitials(user.fullName)}</AvatarFallback>
        </Avatar>
        
        <div className="mt-4 text-center sm:ml-6 sm:mt-0 sm:text-left">
          <h2 className="text-2xl font-semibold">{user.fullName}</h2>
          <p className="text-muted-foreground">{user.username}</p>
          <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
            <div className="flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
              <BadgeCheck className="mr-1 h-3.5 w-3.5" />
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </div>
            <div className="rounded-full bg-muted px-3 py-1 text-xs">
              Member since {user.joinedDate}
            </div>
          </div>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Profile Details</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                View and edit your personal information
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="Your full name"
                      value={editableFields.fullName}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Your email address"
                      value={editableFields.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      placeholder="Your phone number"
                      value={editableFields.phoneNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="Your location"
                      value={editableFields.location}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    name="bio"
                    className="h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    placeholder="Tell us about yourself"
                    value={editableFields.bio}
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSaving ? "Saving Changes..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="currentPassword">Current Password</Label>
                </div>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Enter your current password"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                />
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <h3 className="mb-3 font-medium">Two-Factor Authentication</h3>
                <Button variant="outline">Enable 2FA</Button>
                <p className="mt-2 text-sm text-muted-foreground">
                  Add an extra layer of security to your account by requiring a verification code.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Update Password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}