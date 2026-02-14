import { createRouter, createWebHistory, RouteRecordRaw, NavigationGuardNext } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresAuth: false, layout: false },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue'),
    meta: { requiresAuth: false, layout: false },
  },
  {
    path: '/',
    component: () => import('../components/Layout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('../views/DashboardView.vue'),
      },
      {
        path: 'certificates',
        name: 'certificates',
        component: () => import('../views/CertificateListView.vue'),
      },
      {
        path: 'certificates/create',
        name: 'create-certificate',
        component: () => import('../views/CertificateCreateView.vue'),
      },
      {
        path: 'certificates/:id',
        name: 'certificate-detail',
        component: () => import('../views/CertificateDetailView.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Navigation Guard
router.beforeEach((to, from, next: NavigationGuardNext) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth) {
    if (authStore.isAuthenticated) {
      next()
    } else {
      // Check if user token exists in localStorage
      const token = localStorage.getItem('access_token')
      if (token) {
        authStore.token = token
        next()
      } else {
        next('/login')
      }
    }
  } else {
    if (to.path === '/login' && authStore.isAuthenticated) {
      next('/')
    } else {
      next()
    }
  }
})

export default router
