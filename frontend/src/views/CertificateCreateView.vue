<template>
  <div>
    <a-page-header title="Create Certificate" @back="goBack" />

    <a-card style="margin-top: 24px">
      <a-form
        :model="formState"
        layout="vertical"
        @finish="handleCreateCertificate"
        :loading="isSubmitting"
      >
        <!-- Basic Information -->
        <a-divider>Basic Information</a-divider>

        <a-row :gutter="16">
          <a-col :xs="24" :md="12">
            <a-form-item
              label="Common Name (CN)"
              name="common_name"
              :rules="[{ required: true, message: 'Please input Common Name!' }]"
            >
              <a-input
                v-model:value="formState.common_name"
                placeholder="example.com"
              />
            </a-form-item>
          </a-col>

          <a-col :xs="24" :md="12">
            <a-form-item
              label="Organization"
              name="organization"
            >
              <a-input
                v-model:value="formState.organization"
                placeholder="Your Company Inc."
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :xs="24" :md="12">
            <a-form-item
              label="Organizational Unit"
              name="organizational_unit"
            >
              <a-input
                v-model:value="formState.organizational_unit"
                placeholder="IT Department"
              />
            </a-form-item>
          </a-col>

          <a-col :xs="24" :md="12">
            <a-form-item
              label="Email"
              name="email"
            >
              <a-input
                v-model:value="formState.email"
                type="email"
                placeholder="admin@example.com"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- Location Information -->
        <a-divider>Location Information</a-divider>

        <a-row :gutter="16">
          <a-col :xs="24" :md="12">
            <a-form-item
              label="Locality (City)"
              name="locality"
            >
              <a-input
                v-model:value="formState.locality"
                placeholder="San Francisco"
              />
            </a-form-item>
          </a-col>

          <a-col :xs="24" :md="12">
            <a-form-item
              label="State/Province"
              name="state_province"
            >
              <a-input
                v-model:value="formState.state_province"
                placeholder="California"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :xs="24" :md="12">
            <a-form-item
              label="Country (Code)"
              name="country"
            >
              <a-input
                v-model:value="formState.country"
                placeholder="US"
                maxlength="2"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- Certificate Settings -->
        <a-divider>Certificate Settings</a-divider>

        <a-row :gutter="16">
          <a-col :xs="24" :md="12">
            <a-form-item
              label="Validity (Days)"
              name="valid_days"
              :rules="[
                { required: true, message: 'Please select validity period!' },
              ]"
            >
              <a-select v-model:value="formState.valid_days">
                <a-select-option :value="365">1 Year (365 days)</a-select-option>
                <a-select-option :value="730">2 Years (730 days)</a-select-option>
                <a-select-option :value="1095">3 Years (1095 days)</a-select-option>
                <a-select-option :value="1825">5 Years (1825 days)</a-select-option>
                <a-select-option :value="3650">10 Years (3650 days)</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :xs="24" :md="12">
            <a-form-item
              label="Key Size (Bits)"
              name="key_size"
              :rules="[
                { required: true, message: 'Please select key size!' },
              ]"
            >
              <a-select v-model:value="formState.key_size">
                <a-select-option :value="2048">2048 bits (Default)</a-select-option>
                <a-select-option :value="3072">3072 bits</a-select-option>
                <a-select-option :value="4096">4096 bits (High Security)</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <!-- Subject Alternative Names -->
        <a-divider>Subject Alternative Names (Optional)</a-divider>

        <a-form-item label="DNS SANs">
          <a-select
            v-model:value="formState.san_dns"
            mode="tags"
            placeholder="Add DNS names (e.g., *.example.com, api.example.com)"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item label="IP SANs">
          <a-select
            v-model:value="formState.san_ip"
            mode="tags"
            placeholder="Add IP addresses (e.g., 192.168.1.1)"
            style="width: 100%"
          />
        </a-form-item>

        <!-- Form Actions -->
        <a-form-item>
          <a-space>
            <a-button type="primary" html-type="submit" :loading="isSubmitting">
              Create Certificate
            </a-button>
            <a-button @click="goBack">Cancel</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'

const router = useRouter()
const isSubmitting = ref(false)

const formState = reactive({
  common_name: '',
  organization: '',
  organizational_unit: '',
  locality: '',
  state_province: '',
  country: '',
  email: '',
  valid_days: 365,
  key_size: 2048,
  san_dns: [] as string[],
  san_ip: [] as string[],
})

const handleCreateCertificate = async () => {
  isSubmitting.value = true
  try {
    // TODO: Implement certificate creation API call
    // await certificateService.create(formState)
    message.success('Certificate created successfully')
    router.push('/certificates')
  } catch (error) {
    message.error('Failed to create certificate')
    console.error('Error:', error)
  } finally {
    isSubmitting.value = false
  }
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
</style>