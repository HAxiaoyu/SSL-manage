import { defineStore } from 'pinia'
import { ref } from 'vue'
import { certificateService, type Certificate } from '@/services/certificate'

export const useCertificateStore = defineStore('certificate', () => {
  const certificates = ref<Certificate[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchCertificates = async (skip: number = 0, limit: number = 100) => {
    isLoading.value = true
    error.value = null
    try {
      certificates.value = await certificateService.list(skip, limit)
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to fetch certificates'
    } finally {
      isLoading.value = false
    }
  }

  const getCertificate = async (id: number) => {
    try {
      return await certificateService.get(id)
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to fetch certificate'
      throw err
    }
  }

  const deleteCertificate = async (id: number) => {
    try {
      await certificateService.delete(id)
      certificates.value = certificates.value.filter((c) => c.id !== id)
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to delete certificate'
      throw err
    }
  }

  return {
    certificates,
    isLoading,
    error,
    fetchCertificates,
    getCertificate,
    deleteCertificate,
  }
})