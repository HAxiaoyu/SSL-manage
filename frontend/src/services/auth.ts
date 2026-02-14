import apiClient from './api'

export interface LoginRequest {
  username: string
  password: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

export interface UserResponse {
  id: number
  email: string
  is_active: boolean
  created_at?: string
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<TokenResponse> => {
    const formData = new FormData()
    formData.append('username', credentials.username)
    formData.append('password', credentials.password)
    const response = await apiClient.post('/auth/token', formData)
    return response.data
  },

  getCurrentUser: async (): Promise<UserResponse> => {
    const response = await apiClient.get('/users/me')
    return response.data
  },

  register: async (email: string, password: string): Promise<UserResponse> => {
    const response = await apiClient.post('/users/', {
      email,
      password,
    })
    return response.data
  },

  logout: () => {
    localStorage.removeItem('access_token')
  },
}