<!-- app.vue -->
<template>
  <n-message-provider>
    <div v-if="!isLoggedIn">
      <!-- عرض صفحة تسجيل الدخول إذا لم يكن المستخدم مسجلاً -->
      <NuxtPage />
    </div>
    <n-space v-else vertical size="large">
      <n-layout has-sider>
        <sidebar />
        <n-layout-content content-style="padding: 24px;">
          <NuxtLayout>
            <NuxtPage />
          </NuxtLayout>
        </n-layout-content>
      </n-layout>
    </n-space>
  </n-message-provider>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const isLoggedIn = ref(false)
const route = useRoute()

onMounted(() => {
  // التحقق من حالة تسجيل الدخول عند تحميل التطبيق
  const loggedIn = localStorage.getItem('pos_demo_logged_in')
  isLoggedIn.value = !!loggedIn
  
  // إذا لم يكن المستخدم مسجلاً دخوله ولم يكن في صفحة تسجيل الدخول، نوجهه لصفحة تسجيل الدخول
  if (!loggedIn && route.path !== '/login') {
    useRouter().push('/login')
  }
  // إذا كان المستخدم مسجلاً دخوله وحاول الوصول لصفحة تسجيل الدخول، نوجهه للصفحة الرئيسية
  else if (loggedIn && route.path === '/login') {
    useRouter().push('/')
  }
})

// مراقبة تغيير المسار
const router = useRouter()
router.afterEach((to) => {
  // التحقق من حالة تسجيل الدخول
  const loggedIn = localStorage.getItem('pos_demo_logged_in')
  isLoggedIn.value = !!loggedIn
  
  if (!loggedIn && to.path !== '/login') {
    // إذا لم يكن مسجلاً دخول، نوجهه لصفحة تسجيل الدخول
    router.push('/login')
  } else if (loggedIn && to.path === '/login') {
    // إذا كان مسجلاً دخول وحاول الوصول لصفحة تسجيل الدخول، نوجهه للرئيسية
    router.push('/')
  }
})
</script>