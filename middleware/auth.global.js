// middleware/auth.global.js
export default defineNuxtRouteMiddleware((to, from) => {
  // السماح بصفحة تسجيل الدخول
  if (to.path === '/login') {
    return;
  }

  // التحقق من حالة تسجيل الدخول
  const isLoggedIn = localStorage.getItem('pos_demo_logged_in')
  
  // إذا لم يكن مسجل دخول، توجيه لصفحة تسجيل الدخول
  if (!isLoggedIn) {
    return navigateTo('/login')
  }
})