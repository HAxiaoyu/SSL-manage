export interface Certificate {
  id: number
  common_name: string
  organization?: string
  created_at: string
  expires_at: string
  status: 'active' | 'expired' | 'revoked'
}

export interface User {
  id: number
  email: string
  is_active: boolean
}