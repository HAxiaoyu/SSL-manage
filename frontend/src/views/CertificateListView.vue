<template>
  <div>
    <a-page-header
      title="Certificates"
      sub-title="Manage your SSL certificates"
    >
      <template #extra>
        <router-link to="/certificates/create">
          <a-button type="primary">Create Certificate</a-button>
        </router-link>
      </template>
    </a-page-header>

    <a-card style="margin-top: 24px">
      <template #extra>
        <a-space>
          <a-select
            v-model:value="filterStatus"
            style="width: 150px"
            @change="handleFilterChange"
          >
            <a-select-option value="">All Status</a-select-option>
            <a-select-option value="active">Active</a-select-option>
            <a-select-option value="expired">Expired</a-select-option>
            <a-select-option value="revoked">Revoked</a-select-option>
          </a-select>
          <a-input-search
            v-model:value="searchText"
            placeholder="Search by CN or Organization"
            style="width: 200px"
            @search="handleSearch"
          />
        </a-space>
      </template>

      <a-table
        :columns="columns"
        :data-source="filteredCertificates"
        :loading="certificateStore.isLoading"
        :pagination="pagination"
        rowKey="id"
        :scroll="{ x: 1200 }"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ record.status.toUpperCase() }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'created_at'">
            {{ formatDate(record.created_at) }}
          </template>
          <template v-else-if="column.key === 'expires_at'">
            <span :style="{ color: isExpiringSoon(record.expires_at) ? '#faad14' : 'inherit' }">
              {{ formatDate(record.expires_at) }}
            </span>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="viewCertificate(record.id)">
                View
              </a-button>
              <a-button type="link" size="small">Download</a-button>
              <a-button type="link" danger size="small" @click="confirmDelete(record.id)">
                Delete
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCertificateStore } from '@/stores/certificate'
import { message } from 'ant-design-vue'

const router = useRouter()
const certificateStore = useCertificateStore()

const columns = [
  {
    title: 'Common Name',
    dataIndex: 'common_name',
    key: 'common_name',
    width: 200,
    sorter: (a: any, b: any) => a.common_name.localeCompare(b.common_name),
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
    title: 'Created',
    dataIndex: 'created_at',
    key: 'created_at',
    width: 150,
  },
  {
    title: 'Expires',
    dataIndex: 'expires_at',
    key: 'expires_at',
    width: 150,
    sorter: (a: any, b: any) => new Date(a.expires_at).getTime() - new Date(b.expires_at).getTime(),
  },
  {
    title: 'Action',
    key: 'action',
    width: 200,
    fixed: 'right' as const,
  },
]

const filterStatus = reactive('')
const searchText = reactive('')
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
})

const filteredCertificates = computed(() => {
  let result = certificateStore.certificates

  if (filterStatus) {
    result = result.filter((c) => c.status === filterStatus)
  }

  if (searchText) {
    const search = searchText.toLowerCase()
    result = result.filter(
      (c) =>
        c.common_name.toLowerCase().includes(search) ||
        (c.organization?.toLowerCase().includes(search) ?? false)
    )
  }

  pagination.total = result.length

  const start = (pagination.current - 1) * pagination.pageSize
  const end = start + pagination.pageSize
  return result.slice(start, end)
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

const isExpiringSoon = (date: string) => {
  const expiresAt = new Date(date)
  const now = new Date()
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
  return expiresAt <= thirtyDaysFromNow && expiresAt > now
}

const viewCertificate = (id: number) => {
  router.push(`/certificates/${id}`)
}

const confirmDelete = (id: number) => {
  window.$confirm?.({
    title: 'Delete Certificate',
    content: 'Are you sure you want to delete this certificate? This action cannot be undone.',
    okText: 'Yes',
    cancelText: 'No',
    okType: 'danger',
    onOk() {
      certificateStore.deleteCertificate(id).then(() => {
        message.success('Certificate deleted successfully')
      })
    },
  })
}

const handleFilterChange = () => {
  pagination.current = 1
}

const handleSearch = () => {
  pagination.current = 1
}

const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
}

onMounted(() => {
  certificateStore.fetchCertificates()
})
</script>

<style scoped>
</style>