import apiClient from './api'

export interface Certificate {
  id: number
  common_name: string
  organization?: string
  created_at: string
  expires_at: string
  status: 'active' | 'expired' | 'revoked'
  fingerprint: string
  serial_number: string
}

export interface CertificateCreate {
  common_name: string
  organization?: string
  organizational_unit?: string
  locality?: string
  state_province?: string
  country?: string
  email?: string
  valid_days: number
  key_size: number
  san_dns?: string[]
  san_ip?: string[]
}

export const certificateService = {
  list: async (skip: number = 0, limit: number = 100): Promise<Certificate[]> => {
    const response = await apiClient.get('/certificates/', {
      params: { skip, limit },
    })
    return response.data
  },

  get: async (id: number): Promise<Certificate> => {
    const response = await apiClient.get(`/certificates/${id}`)
    return response.data
  },

  create: async (data: CertificateCreate): Promise<Certificate> => {
    const response = await apiClient.post('/certificates/', data)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/certificates/${id}`)
  },

  download: async (id: number): Promise<Blob> => {
    const response = await apiClient.get(`/certificates/${id}/download`, {
      responseType: 'blob',
    })
    return response.data
  },
}