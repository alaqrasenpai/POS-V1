// composables/useAuth.js
import { reactive, computed } from 'vue'
import { useStores } from '@/composables/useStores'

const state = reactive({
  user: null,
  isAuthenticated: false,
  isSuperAdmin: false
})

export const useAuth = () => {
  const router = useRouter()
  const authCookie = useCookie('pos_user_data')
  const loggedInCookie = useCookie('pos_demo_logged_in')

  // تهيئة الحالة الأولية إذا كان الكوكي موجوداً
  if (loggedInCookie.value === 'true' && !state.isAuthenticated) {
    state.isAuthenticated = true
  }

  const { getUsers } = useUsers()
  const { getStores } = useStores()

  // تسجيل دخول للمدير العام (Super Admin)
  const superLogin = (username, password) => {
    const allUsers = getUsers()
    const user = allUsers.find(u => u.username === username && u.password === password && u.role === 'super_admin');

    if (user) {
      const userCopy = JSON.parse(JSON.stringify(user))
      state.user = userCopy
      state.isAuthenticated = true
      state.isSuperAdmin = true

      authCookie.value = JSON.stringify(userCopy)
      loggedInCookie.value = 'true'

      return { success: true, user: userCopy }
    }
    return { success: false, message: 'بيانات دخول المدير العام غير صحيحة' }
  }

  // تسجيل دخول لأصحاب المتاجر والموظفين
  const login = (phone, username, password) => {
    if (!phone || !username || !password) {
      return { success: false, message: 'يرجى ملء جميع الحقول المطلوبة' }
    }

    // 1. العثور على المتجر من خلال رقم الجوال المسجل
    const allStores = getStores()
    const store = allStores.find(s => s.registeredPhone === phone)

    if (!store) {
      return { success: false, message: 'لا يوجد متجر مسجل بهذا الرقم' }
    }

    if (!store.active) {
      return { success: false, message: 'هذا المتجر موقوف حالياً، يرجى مراجعة إدارة المنصة' }
    }

    // 2. العثور على المستخدم داخل هذا المتجر حصراً
    const allUsers = getUsers()
    const user = allUsers.find(u =>
      u.username === username &&
      u.password === password &&
      u.storeId === store.id
    )

    if (user) {
      if (!user.active) {
        return { success: false, message: 'حسابك معطل حالياً، اتصل بمدير المتجر' }
      }

      const userCopy = JSON.parse(JSON.stringify(user))
      state.user = userCopy
      state.isAuthenticated = true
      state.isSuperAdmin = false

      authCookie.value = JSON.stringify(userCopy)
      loggedInCookie.value = 'true'

      return { success: true, user: userCopy }
    } else {
      return { success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة' }
    }
  }

  const logout = () => {
    state.user = null
    state.isAuthenticated = false
    state.isSuperAdmin = false
    authCookie.value = null
    loggedInCookie.value = null
    router.push('/login')
  }

  const checkAuth = () => {
    if (authCookie.value && loggedInCookie.value === 'true') {
      try {
        const userData = typeof authCookie.value === 'string' ? JSON.parse(authCookie.value) : authCookie.value
        const allUsers = getUsers()
        const liveUser = allUsers.find(u => u.id === userData.id)

        if (liveUser && liveUser.active) {
          state.user = JSON.parse(JSON.stringify(liveUser))
          state.isAuthenticated = true
          state.isSuperAdmin = liveUser.role === 'super_admin'
        } else {
          logout()
        }
      } catch (e) {
        logout()
      }
    }
  }

  const hasPermission = (permission) => {
    if (!state.user) return false
    if (state.user.role === 'super_admin') return true
    if (permission === 'super_admin') return false

    if (state.user.permissions && (state.user.permissions.includes('all') || state.user.role === 'admin')) return true
    return state.user.permissions && state.user.permissions.includes(permission)
  }

  const currentUser = computed(() => state.user)
  const isAuthenticated = computed(() => state.isAuthenticated)

  return {
    login,
    superLogin,
    logout,
    hasPermission,
    checkAuth,
    currentUser,
    isAuthenticated
  }
}