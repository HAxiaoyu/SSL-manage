<template>
  <div>
    <a-page-header
      title="Dashboard"
      sub-title="Welcome to SSL Certificate Management System"
    />

    <a-row :gutter="16" style="margin-top: 24px">
      <a-col :xs="24" :sm="12" :md="6">
        <a-card>
          <template #title>
            <SafetyOutlined /> Total Certificates
          </template>
          <div style="font-size: 32px; font-weight: bold; color: #1890ff">
            {{ stats.total }}
          </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="12" :md="6">
        <a-card>
          <template #title>
            <CheckCircleOutlined /> Active
          </template>
          <div style="font-size: 32px; font-weight: bold; color: #52c41a">
            {{ stats.active }}
          </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="12" :md="6">
        <a-card>
          <template #title>
            <ExclamationCircleOutlined /> Expiring Soon
          </template>
          <div style="font-size: 32px; font-weight: bold; color: #faad14">
            {{ stats.expiringSoon }}
          </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="12" :md="6">
        <a-card>
          <template #title>
            <CloseCircleOutlined /> Expired
          </template>
          <div style="font-size: 32px; font-weight: bold; color: #f5222d">
            {{ stats.expired }}
          </div>
        </a-card>
      </a-col>
    </a-row>

    <a-card style="margin-top: 24px">
      <template #title>
        <SafetyOutlined /> Recent Certificates
      </template>
      <a-table
        :columns="columns"
        :data-source="recentCertificates"
        :loading="certificateStore.isLoading"
        :pagination="false"
        :scroll="{ x: 800 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="viewCertificate(record.id)">
                View
              </a-button>
              <a-button type="link" danger size="small" @click="deleteCertificate(record.id)">
                Delete
              </a-button>
            </a-space>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ record.status.toUpperCase() }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'expires_at'">
            {{ formatDate(record.expires_at) }}
          </template>
        </template>
      </a-table>
      <div style="margin-top: 16px; text-align: center">
        <router-link to="/certificates">
          <a-button type="primary">View All Certificates</a-button>
        </router-link>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCertificateStore } from '@/stores/certificate'
import { useAuthStore } from '@/stores/auth'
import {
  SafetyOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

const router = useRouter()
const certificateStore = useCertificateStore()
const authStore = useAuthStore()

const columns = [
  {
    title: 'Common Name',
    dataIndex: 'common_name',
    key: 'common_name',
    width: 200,
  },
  {
    title: 'Organization',
    dataIndex: 'organization',
    key: 'organization',
    width: 150,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 100,
  },
  {
    title: 'Expires At',
    dataIndex: 'expires_at',
    key: 'expires_at',
    width: 150,
  },
  {
    title: 'Action',
    key: 'action',
    width: 150,
  },
]

const stats = reactive({
  total: 0,
  active: 0,
  expiringSoon: 0,
  expired: 0,
})

const recentCertificates = computed(() => {
  return certificateStore.certificates.slice(0, 5)
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    active: 'green',
    expired: 'red',
    revoked: 'orange',
  }
  return colors[status] || 'default'
}

const viewCertificate = (id: number) => {
  router.push(`/certificates/${id}`)
}

const deleteCertificate = (id: number) => {
  const modal = window.$confirm?.({
    title: 'Delete Certificate',
    content: 'Are you sure you want to delete this certificate?',
    okText: 'Yes',
    cancelText: 'No',
    okType: 'danger',
    onOk() {
      certificateStore.deleteCertificate(id).then(() => {
        message.success('Certificate deleted successfully')
        certificateStore.fetchCertificates()
      })
    },
  })
}

const calculateStats = () => {
  const certs = certificateStore.certificates
  stats.total = certs.length
  stats.active = certs.filter((c) => c.status === 'active').length
  stats.expired = certs.filter((c) => c.status === 'expired').length

  const now = new Date()
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
  stats.expiringSoon = certs.filter((c) => {
    const expiresAt = new Date(c.expires_at)
    return c.status === 'active' && expiresAt <= thirtyDaysFromNow
  }).length
}

onMounted(() => {
  certificateStore.fetchCertificates().then(() => {
    calculateStats()
  })
})
</script>

<style scoped>
</style>