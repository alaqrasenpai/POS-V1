// composables/useAuth.js
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

const state = reactive({
  user: null,
  isAuthenticated: false,
  token: null
})

export const useAuth = () => {
  const router = useRouter()

  // المستخدمون الافتراضيون (للتجربة - يجب استبدالهم بقاعدة بيانات حقيقية)
  const mockUsers = [
    {
      id: 1,
      username: 'admin',
      password: 'admin123',
      name: 'مدير النظام',
      role: 'admin',
      permissions: ['all']
    },
    {
      id: 2,
      username: 'cashier',
      password: 'cashier123',
      name: 'كاشير',
      role: 'cashier',
      permissions: ['view_products', 'sell_orders', 'view_customers']
    },
    {
      id: 3,
      username: 'manager',
      password: 'manager123',
      name: 'مدير المبيعات',
      role: 'manager',
      permissions: ['view_products', 'sell_orders', 'view_customers', 'view_reports']
    }
  ]

  // تسجيل الدخول
  const login = (username, password) => {
    try {
      // التحقق من صحة البيانات المدخلة
      if (!username || !password) {
        return { success: false, message: 'يرجى ملء جميع الحقول' }
      }

      // البحث عن المستخدم
      const user = mockUsers.find(u => 
        u.username === username && u.password === password
      )
      
      if (user) {
        // نسخ المستخدم لتجنب مشاكل المرجعية
        const userCopy = JSON.parse(JSON.stringify(user))
        
        state.user = userCopy
        state.isAuthenticated = true
        state.token = btoa(JSON.stringify(userCopy)) // تشفير بسيط للبيانات (للاختبار فقط)
        
        // تخزين في localStorage
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('auth_token', state.token)
          localStorage.setItem('user', JSON.stringify(userCopy))
        }
        
        // إعادة توجيه تلقائي بعد تسجيل الدخول الناجح
        setTimeout(() => {
          router.push('/')
        }, 100)
        
        return { success: true, user: userCopy }
      } else {
        return { success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة' }
      }
    } catch (error) {
      console.error('خطأ في تسجيل الدخول:', error)
      return { success: false, message: 'حدث خطأ غير متوقع، يرجى المحاولة لاحقاً' }
    }
  }

  // تسجيل الخروج
  const logout = () => {
    try {
      state.user = null
      state.isAuthenticated = false
      state.token = null
      
      // مسح من localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
      }
      
      router.push('/login')
    } catch (error) {
      console.error('خطأ في تسجيل الخروج:', error)
    }
  }

  // التحقق من الصلاحية
  const hasPermission = (permission) => {
    if (!state.user) return false
    if (state.user.role === 'admin') return true // المدير له جميع الصلاحيات
    return state.user.permissions && state.user.permissions.includes(permission)
  }

  // التحقق من الدور
  const hasRole = (role) => {
    if (!state.user) return false
    return state.user.role === role
  }

  // تحميل حالة المستخدم من localStorage
  const loadUserFromStorage = () => {
    try {
      if (typeof localStorage !== 'undefined') {
        const token = localStorage.getItem('auth_token')
        const user = localStorage.getItem('user')
        
        if (token && user) {
          state.token = token
          state.user = JSON.parse(user)
          state.isAuthenticated = true
        }
      }
    } catch (error) {
      console.error('خطأ في تحميل بيانات المستخدم:', error)
      // مسح البيانات التالفة
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
      }
    }
  }

  // الحصول على معلومات المستخدم الحالي
  const currentUser = computed(() => state.user)
  const isAuthenticated = computed(() => state.isAuthenticated)

  return {
    login,
    logout,
    hasPermission,
    hasRole,
    loadUserFromStorage,
    currentUser,
    isAuthenticated
  }
}