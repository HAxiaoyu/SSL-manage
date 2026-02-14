<template>
  <div class="register-container">
    <a-card style="width: 400px" :bordered="false">
      <template #title>
        <div style="text-align: center; font-size: 24px; font-weight: bold">
          Create Account
        </div>
      </template>

      <a-form
        :model="formState"
        layout="vertical"
        @finish="handleRegister"
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
          :rules="[
            { required: true, message: 'Please input your password!' },
            { min: 6, message: 'Password must be at least 6 characters!' },
          ]"
        >
          <a-input-password v-model:value="formState.password" placeholder="Enter password" />
        </a-form-item>

        <a-form-item
          label="Confirm Password"
          name="confirmPassword"
          :rules="[
            { required: true, message: 'Please confirm your password!' },
            {
              validator: validatePasswordMatch,
              trigger: 'change',
            },
          ]"
        >
          <a-input-password v-model:value="formState.confirmPassword" placeholder="Confirm password" />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" style="width: 100%">
            Register
          </a-button>
        </a-form-item>

        <div style="text-align: center">
          <span>Already have an account? </span>
          <router-link to="/login">Login here</router-link>
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
import type { Rule } from 'ant-design-vue/es/form'

const router = useRouter()
const authStore = useAuthStore()

const formState = reactive({
  email: '',
  password: '',
  confirmPassword: '',
})

const validatePasswordMatch: Rule['validator'] = async (_, value) => {
  if (value && value !== formState.password) {
    return Promise.reject(new Error('Passwords do not match!'))
  }
  return Promise.resolve()
}

const handleRegister = async () => {
  try {
    await authStore.register(formState.email, formState.password)
    router.push('/login')
  } catch (error) {
    console.error('Registration failed:', error)
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>