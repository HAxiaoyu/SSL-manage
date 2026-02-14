<template>
  <div v-if="loading" style="text-align: center; padding: 50px">
    <a-spin size="large" />
  </div>
  <div v-else>
    <a-page-header
      :title="`Certificate: ${certificate?.common_name || ''}`"
      @back="goBack"
    >
      <template #extra>
        <a-space>
          <a-button @click="downloadCertificate">Download</a-button>
          <a-button type="primary" danger @click="confirmDelete">Delete</a-button>
        </a-space>
      </template>
    </a-page-header>

    <a-row :gutter="16" style="margin-top: 24px">
      <a-col :xs="24" :md="12">
        <a-card title="Basic Information">
          <a-descriptions :column="1">
            <a-descriptions-item label="Common Name">
              {{ certificate?.common_name }}
            </a-descriptions-item>
            <a-descriptions-item label="Organization">
              {{ certificate?.organization || '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="Organizational Unit">
              {{ certificate?.organizational_unit || '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="Locality">
              {{ certificate?.locality || '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="State/Province">
              {{ certificate?.state_province || '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="Country">
              {{ certificate?.country || '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="Email">
              {{ certificate?.email || '-' }}
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
      </a-col>

      <a-col :xs="24" :md="12">
        <a-card title="Certificate Details">
          <a-descriptions :column="1">
            <a-descriptions-item label="Status">
              <a-tag :color="getStatusColor(certificate?.status)">
                {{ certificate?.status?.toUpperCase() }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="Serial Number">
              <code>{{ certificate?.serial_number }}</code>
            </a-descriptions-item>
            <a-descriptions-item label="Fingerprint (SHA1)">
              <code style="word-break: break-all">{{ certificate?.fingerprint }}</code>
            </a-descriptions-item>
            <a-descriptions-item label="Created At">
              {{ formatDateTime(certificate?.created_at) }}
            </a-descriptions-item>
            <a-descriptions-item label="Expires At">
              <span :style="{ color: isExpired ? '#f5222d' : 'inherit' }">
                {{ formatDateTime(certificate?.expires_at) }}
              </span>
            </a-descriptions-item>
            <a-descriptions-item label="Days Until Expiration">
              <span
                :style="{
                  color: daysUntilExpiration < 0 ? '#f5222d' : daysUntilExpiration < 30 ? '#faad14' : 'inherit',
                }"
              >
                {{ daysUntilExpiration < 0 ? 'Expired' : daysUntilExpiration + ' days' }}
              </span>
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
      </a-col>
    </a-row>

    <a-card title="Certificate Content" style="margin-top: 16px">
      <a-tabs>
        <a-tab-pane key="cert" tab="Certificate (PEM)">
          <a-input-text-area
            v-model:value="certificate?.certificate_pem"
            :rows="10"
            readonly
          />
        </a-tab-pane>
        <a-tab-pane key="pubkey" tab="Public Key (PEM)">
          <a-input-text-area
            v-model:value="certificate?.public_key_pem"
            :rows="10"
            readonly
          />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCertificateStore } from '@/stores/certificate'
import { message } from 'ant-design-vue'

const router = useRouter()
const route = useRoute()
const certificateStore = useCertificateStore()

const loading = ref(true)
const certificate = ref<any>(null)

const certificateId = computed(() => parseInt(route.params.id as string))

const isExpired = computed(() => {
  if (!certificate.value?.expires_at) return false
  return new Date(certificate.value.expires_at) < new Date()
})

const daysUntilExpiration = computed(() => {
  if (!certificate.value?.expires_at) return 0
  const now = new Date()
  const expires = new Date(certificate.value.expires_at)
  const diff = expires.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const formatDateTime = (date: string) => {
  return new Date(date).toLocaleString()
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    active: 'green',
    expired: 'red',
    revoked: 'orange',
  }
  return colors[status] || 'default'
}

const downloadCertificate = () => {
  if (certificate.value) {
    const element = document.createElement('a')
    const file = new Blob([certificate.value.certificate_pem], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `${certificate.value.common_name}.pem`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }
}

const confirmDelete = () => {
  window.$confirm?.({
    title: 'Delete Certificate',
    content: 'Are you sure you want to delete this certificate? This action cannot be undone.',
    okText: 'Yes',
    cancelText: 'No',
    okType: 'danger',
    onOk() {
      certificateStore.deleteCertificate(certificateId.value).then(() => {
        message.success('Certificate deleted successfully')
        router.push('/certificates')
      })
    },
  })
}

const goBack = () => {
  router.back()
}

onMounted(async () => {
  try {
    const cert = await certificateStore.getCertificate(certificateId.value)
    certificate.value = cert
  } catch (error) {
    message.error('Failed to load certificate')
    router.push('/certificates')
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
</style>