import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Ant from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Ant)

// Set global confirm function for Ant Design Modal
import { Modal } from 'ant-design-vue'
window.$confirm = Modal.confirm

app.mount('#app')
