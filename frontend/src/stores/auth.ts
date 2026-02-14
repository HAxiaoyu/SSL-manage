import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService, type UserResponse } from '@/services/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<UserResponse | null>(null)
  const token = ref<string | null>(localStorage.getItem('access_token'))
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  const login = async (email: string, password: string) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await authService.login({ username: email, password })
      token.value = response.access_token
      localStorage.setItem('access_token', response.access_token)
      // Fetch user info after login
      user.value = await authService.getCurrentUser()
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Login failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const register = async (email: string, password: string) => {
    isLoading.value = true
    error.value = null
    try {
      user.value = await authService.register(email, password)
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Registration failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    authService.logout()
    token.value = null
    user.value = null
  }

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
  }
})