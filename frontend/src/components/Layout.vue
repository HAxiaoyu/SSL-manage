<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo">
        <h2 style="color: white; margin: 0; padding: 16px">SSL Manager</h2>
      </div>
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item key="dashboard" @click="goTo('/')">
          <template #icon>
            <DashboardOutlined />
          </template>
          <span>Dashboard</span>
        </a-menu-item>
        <a-menu-item key="certificates" @click="goTo('/certificates')">
          <template #icon>
            <SafetyOutlined />
          </template>
          <span>Certificates</span>
        </a-menu-item>
        <a-menu-item key="create" @click="goTo('/certificates/create')">
          <template #icon>
            <FileAddOutlined />
          </template>
          <span>Create Certificate</span>
        </a-menu-item>
        <a-divider style="margin: 8px 0" />
        <a-menu-item key="logout" @click="handleLogout">
          <template #icon>
            <LogoutOutlined />
          </template>
          <span>Logout</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.08)">
        <div style="display: flex; justify-content: space-between; align-items: center">
          <MenuFoldOutlined
            v-if="collapsed"
            class="trigger"
            @click="collapsed = false"
          />
          <MenuUnfoldOutlined v-else class="trigger" @click="collapsed = true" />
          <div>
            <a-space>
              <a-avatar :size="32" style="background-color: #87d068">
                {{ userInitial }}
              </a-avatar>
              <span>{{ userEmail }}</span>
            </a-space>
          </div>
        </div>
      </a-layout-header>
      <a-layout-content style="margin: 24px 16px">
        <div style="background: #fff; padding: 24px; border-radius: 2px">
          <router-view />
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center; color: #666">
        SSL Certificate Management System © 2024
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  DashboardOutlined,
  SafetyOutlined,
  FileAddOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons-vue'

const router = useRouter()
const authStore = useAuthStore()
const collapsed = ref(false)
const selectedKeys = ref<string[]>(['dashboard'])

const userInitial = computed(() => {
  if (authStore.user?.email) {
    return authStore.user.email[0].toUpperCase()
  }
  return 'U'
})

const userEmail = computed(() => authStore.user?.email || 'User')

const goTo = (path: string) => {
  router.push(path)
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  const path = router.currentRoute.value.path
  if (path.includes('certificates')) {
    if (path.includes('create')) {
      selectedKeys.value = ['create']
    } else {
      selectedKeys.value = ['certificates']
    }
  } else {
    selectedKeys.value = ['dashboard']
  }
})
</script>

<style scoped>
.trigger {
  font-size: 18px;
  line-height: 64px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: #1890ff;
}

.logo {
  height: 64px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>