export interface User {
    _id: string
    username: string
    fullName: string
    email: string
    profilePicture: string
    coverImage: string
    bio: string
    phone: string
    score: number
    roles: string[]
    createdAt: string
    updatedAt: string
  }
  
  export interface Pool {
    _id: string
    name: string
    description: {
      overview: string
      activities: string[]
      requirements: string
      additionalInfo: string
    }
    location: string
    coordinates: number[]
    date: string
    maxMembers: number
    creator: User
    members: User[]
    joinRequests: JoinRequest[]
    status: "open" | "closed" | "cancelled"
    tags: string[]
    coverImage: string
    createdAt: string
    updatedAt: string
  }
  
  export interface JoinRequest {
    user: User
    message: string
    requestedAt: string
  }
  
  export interface Message {
    _id: string
    poolId: string
    sender: User
    content: string
    isDeleted: boolean
    isEdited: boolean
    editedAt?: string
    replyTo?: Message
    seenBy: string[]
    createdAt: string
    updatedAt: string
  }
  
  export interface Comment {
    _id: string
    user: User
    content: string
    createdAt: string
    updatedAt: string
    likes: string[]
    replies?: Comment[]
  }
  
  export interface Post {
    _id: string
    user: User
    pool: Pool
    content: string
    media: string[]
    likes: string[]
    comments: Comment[]
    createdAt: string
    updatedAt: string
    isEdited: boolean
    editedAt?: string
  }
  
  export interface Review {
    _id: string
    reviewer: User
    reviewee: User
    pool: Pool
    rating: number
    comment: string
    createdAt: string
  }
  
  export interface ApiResponse<T> {
    statusCode: number
    data: T
    message: string
    success: boolean
  }
  