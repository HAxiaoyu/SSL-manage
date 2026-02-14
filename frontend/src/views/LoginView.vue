<template>
  <div class="login-container">
    <a-card style="width: 400px" :bordered="false">
      <template #title>
        <div style="text-align: center; font-size: 24px; font-weight: bold">
          SSL Manager
        </div>
      </template>

      <a-form
        :model="formState"
        layout="vertical"
        @finish="handleLogin"
        :loading="authStore.isLoading"
      >
        <a-form-item
          label="Email"
          name="email"
          :rules="[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Invalid email format!' },
          ]"
        >
          <a-input
            v-model:value="formState.email"
            placeholder="user@example.com"
            type="email"
          />
        </a-form-item>

        <a-form-item
          label="Password"
          name="password"
          :rules="[{ required: true, message: 'Please input your password!' }]"
        >
          <a-input-password v-model:value="formState.password" placeholder="Enter password" />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" style="width: 100%">
            Login
          </a-button>
        </a-form-item>

        <div style="text-align: center">
          <span>Don't have an account? </span>
          <router-link to="/register">Register here</router-link>
        </div>
      </a-form>

      <a-divider />

      <div v-if="authStore.error" style="margin-top: 16px">
        <a-alert
          :message="authStore.error"
          type="error"
          show-icon
          closable
          @close="authStore.error = null"
        />
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const formState = reactive({
  email: '',
  password: '',
})

const handleLogin = async () => {
  try {
    await authStore.login(formState.email, formState.password)
    router.push('/')
  } catch (error) {
    console.error('Login failed:', error)
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>