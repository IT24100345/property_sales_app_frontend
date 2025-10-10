
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// import { API_URL } from '../config/apiConfig'
import User from '@/types/user'

export async function getServerUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value

  if (!token) {
    return null
  }

  try {
    // Verify and decode the JWT token
    const response = await fetch("/api/auth")

    if (!response.ok) {
      return null
    }

    const user = await response.json()
    return user
  } catch (error) {
    console.error('Error verifying token:', error)
    return null
  }
}

export async function requireAuth() {
  const user = await getServerUser()
  if (!user) {
    redirect('/login')
  }
  return user
}

export async function requireRole(requiredRoles: string[]) {
  const user = await requireAuth()
  
  const hasRole = user.roles?.some((role: string) => 
    requiredRoles.some(required => 
      role.includes(required) || required.includes(role)
    )
  )

  if (!hasRole) {
    redirect('/')
  }

  return user
}