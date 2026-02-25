// middleware/auth.global.js
import { useAuth } from '@/composables/useAuth'

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuth()

  // التحقق من حالة تسجيل الدخول عبر الكوكي
  const isLoggedIn = useCookie('pos_demo_logged_in')
  const publicPages = ['/login', '/super-login']

  // 1. إذا لم يكن المستخدم مسجلاً دخوله ويحاول الوصول لصفحة محمية
  if (isLoggedIn.value !== 'true' && !publicPages.includes(to.path)) {
    return navigateTo('/login')
  }

  // 2. إذا كان المستخدم مسجلاً دخوله ويحاول الوصول لصفحة تسجيل الدخول
  if (isLoggedIn.value === 'true' && publicPages.includes(to.path)) {
    // منع المستخدم العادي من الوصول لصفحة الـ super-login والعكس لو أردت
    auth.checkAuth()
    const user = auth.currentUser.value

    if (user?.role === 'super_admin') {
      return navigateTo('/super-admin')
    }
    return navigateTo('/')
  }

  // 3. التحقق من صلاحيات الـ Super Admin
  if (isLoggedIn.value === 'true' && to.path.startsWith('/super-admin')) {
    auth.checkAuth()
    const user = auth.currentUser.value

    if (!user || user.role !== 'super_admin') {
      return navigateTo('/super-login')
    }
  }
})
