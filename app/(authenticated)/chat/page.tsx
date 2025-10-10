"use client"

import { useState, useEffect } from "react"
import { Search, MoreVertical, Send, Phone, Video, Info, ArrowLeft, MessageCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"

interface Property {
  id: string
  title: string
  location: string
  price: number
}

interface Seller {
  id: string
  name: string
  avatar?: string
  isOnline: boolean
}

interface Message {
  id: string
  senderId: string
  content: string
  timestamp: Date
  type: "text" | "inquiry" | "system"
  isRead: boolean
}

interface Chat {
  id: string
  seller: Seller
  property: Property
  lastMessage: Message
  unreadCount: number
  messages: Message[]
  status: "active" | "inquiry" | "archived"
}

// Mock chat data
const mockChats: Chat[] = [
  {
    id: "chat-1",
    seller: {
      id: "seller-1",
      name: "John Silva",
      avatar: "/images/avatar-1.jpg",
      isOnline: true
    },
    property: {
      id: "prop-1",
      title: "Beautiful Beachfront Land",
      location: "Galle, Sri Lanka",
      price: 500000
    },
    lastMessage: {
      id: "msg-1",
      senderId: "seller-1",
      content: "Thank you for your interest! I'd be happy to arrange a site visit this weekend.",
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      type: "text",
      isRead: false
    },
    unreadCount: 2,
    status: "active",
    messages: [
      {
        id: "msg-inquiry-1",
        senderId: "user",
        content: "Hi, I'm interested in your beachfront property. Could you provide more details about the soil conditions and accessibility?",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        type: "inquiry",
        isRead: true
      },
      {
        id: "msg-2",
        senderId: "seller-1",
        content: "Hello! Thanks for reaching out. The soil is primarily sandy with good drainage, perfect for construction. The property has direct road access.",
        timestamp: new Date(Date.now() - 90 * 60 * 1000),
        type: "text",
        isRead: true
      },
      {
        id: "msg-3",
        senderId: "user",
        content: "That sounds great! When would be a good time to visit the site?",
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        type: "text",
        isRead: true
      },
      {
        id: "msg-1",
        senderId: "seller-1",
        content: "Thank you for your interest! I'd be happy to arrange a site visit this weekend.",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        type: "text",
        isRead: false
      }
    ]
  },
  {
    id: "chat-2",
    seller: {
      id: "seller-2",
      name: "Maria Fernando",
      avatar: "/images/avatar-2.jpg",
      isOnline: false
    },
    property: {
      id: "prop-2",
      title: "Commercial Land in Colombo",
      location: "Colombo 3, Sri Lanka",
      price: 800000
    },
    lastMessage: {
      id: "msg-4",
      senderId: "user",
      content: "What are the zoning restrictions for this commercial plot?",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      type: "inquiry",
      isRead: true
    },
    unreadCount: 0,
    status: "inquiry",
    messages: [
      {
        id: "msg-4",
        senderId: "user",
        content: "What are the zoning restrictions for this commercial plot?",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        type: "inquiry",
        isRead: true
      }
    ]
  },
  {
    id: "chat-3",
    seller: {
      id: "seller-3",
      name: "Rajesh Patel",
      avatar: "/images/avatar-3.jpg",
      isOnline: true
    },
    property: {
      id: "prop-3",
      title: "Agricultural Farm Land",
      location: "Kandy, Sri Lanka",
      price: 200000
    },
    lastMessage: {
      id: "msg-5",
      senderId: "seller-3",
      content: "The water rights are included with the property. Let me know if you need any other information.",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      type: "text",
      isRead: true
    },
    unreadCount: 0,
    status: "active",
    messages: [
      {
        id: "msg-inquiry-3",
        senderId: "user",
        content: "I'm interested in the agricultural land. Does it include water rights?",
        timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000),
        type: "inquiry",
        isRead: true
      },
      {
        id: "msg-5",
        senderId: "seller-3",
        content: "The water rights are included with the property. Let me know if you need any other information.",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        type: "text",
        isRead: true
      }
    ]
  }
]

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>(mockChats)
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [filter, setFilter] = useState<"all" | "active" | "inquiry">("all")

  useEffect(() => {
    // Auto-select first chat on desktop
    if (chats.length > 0 && !selectedChat && window.innerWidth >= 768) {
      setSelectedChat(chats[0])
    }
  }, [chats, selectedChat])

  const filteredChats = chats.filter(chat => {
    const matchesSearch = chat.seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chat.property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chat.property.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filter === "all" || chat.status === filter
    
    return matchesSearch && matchesFilter
  })

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedChat) return

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: "user",
      content: newMessage.trim(),
      timestamp: new Date(),
      type: "text",
      isRead: true
    }

    setChats(prev => prev.map(chat => 
      chat.id === selectedChat.id 
        ? {
            ...chat,
            messages: [...chat.messages, message],
            lastMessage: message
          }
        : chat
    ))

    setNewMessage("")
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="container py-8 mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Messages</h1>
        <p className="text-muted-foreground">Manage your conversations with property sellers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Chat List Sidebar */}
        <div className={`md:col-span-1  ${selectedChat ? 'hidden md:block' : 'block'}`}>
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-4">
              <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filter Tabs */}
                <div className="flex space-x-1 bg-muted p-1 rounded-lg">
                  {[
                    { value: "all", label: "All" },
                    { value: "active", label: "Active" },
                    { value: "inquiry", label: "Inquiries" }
                  ].map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => setFilter(tab.value as "all" | "active" | "inquiry")}
                      className={`flex-1 py-2 px-3 text-sm rounded-md transition-colors ${
                        filter === tab.value 
                          ? "bg-background text-foreground shadow-sm" 
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-full">
                <div className="space-y-2 p-4">
                  {filteredChats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => setSelectedChat(chat)}
                      className={`p-4 max-w-md mx-auto rounded-lg cursor-pointer transition-colors border ${
                        selectedChat?.id === chat.id 
                          ? "border-transparent bg-primary/5" 
                          : "border-transparent hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={chat.seller.avatar} alt={chat.seller.name} />
                            <AvatarFallback>
                              {chat.seller.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          {chat.seller.isOnline && (
                            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-background"></div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-sm truncate">{chat.seller.name}</h4>
                            <div className="flex items-center space-x-2">
                              {chat.unreadCount > 0 && (
                                <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                                  {chat.unreadCount}
                                </Badge>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(chat.lastMessage.timestamp, { addSuffix: true })}
                              </span>
                            </div>
                          </div>

                          <div className="mb-2">
                            <p className="text-xs text-primary font-medium truncate">{chat.property.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{chat.property.location} • {formatPrice(chat.property.price)}</p>
                          </div>

                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground truncate flex-1">
                              {chat.lastMessage.type === "inquiry" && "📩 "}
                              {chat.lastMessage.senderId === "user" ? "You: " : ""}
                              {chat.lastMessage.content}
                            </p>
                            <Badge 
                              variant={chat.status === "active" ? "default" : chat.status === "inquiry" ? "secondary" : "outline"} 
                              className="ml-2 text-xs"
                            >
                              {chat.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredChats.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No conversations found</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className={`md:col-span-2 ${selectedChat ? 'block' : 'hidden md:block'}`}>
          {selectedChat ? (
            <Card className="h-full flex flex-col">
              {/* Chat Header */}
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="md:hidden"
                      onClick={() => setSelectedChat(null)}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={selectedChat.seller.avatar} alt={selectedChat.seller.name} />
                        <AvatarFallback>
                          {selectedChat.seller.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {selectedChat.seller.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></div>
                      )}
                    </div>

                    <div>
                      <h3 className="font-semibold">{selectedChat.seller.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedChat.seller.isOnline ? "Online" : "Offline"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Video className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Property</DropdownMenuItem>
                        <DropdownMenuItem>Block User</DropdownMenuItem>
                        <DropdownMenuItem>Archive Chat</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Property Info Bar */}
                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{selectedChat.property.title}</p>
                      <p className="text-xs text-muted-foreground">{selectedChat.property.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{formatPrice(selectedChat.property.price)}</p>
                      <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-full">
                  <div className="p-4 space-y-4">
                    {selectedChat.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.senderId === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          } ${
                            message.type === "inquiry" 
                              ? "border-l-4 border-blue-500 bg-blue-50 text-blue-900" 
                              : ""
                          }`}
                        >
                          {message.type === "inquiry" && (
                            <div className="flex items-center mb-2">
                              <Info className="h-3 w-3 mr-1" />
                              <span className="text-xs font-medium">Initial Inquiry</span>
                            </div>
                          )}
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.senderId === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>

              {/* Message Input */}
              <div className="border-t p-4">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="min-h-[44px] max-h-32 resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage(e)
                      }
                    }}
                  />
                  <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">Select a conversation</h3>
                <p className="text-muted-foreground">Choose a chat from the sidebar to start messaging</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}