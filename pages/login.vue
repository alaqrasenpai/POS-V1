<template>
  <div class="login-background">
    <div class="login-card">
      <div class="login-header">
        <h1>نظام إدارة المبيعات</h1>
        <p>تسجيل دخول تجريبي</p>
      </div>
      
      <div class="login-form">
        <div class="form-group">
          <label for="username">اسم المستخدم</label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="admin"
            disabled
          />
        </div>
        
        <div class="form-group">
          <label for="password">كلمة المرور</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="admin123"
            disabled
          />
        </div>
        
        <button @click="handleLogin" class="login-button">
          تسجيل الدخول
        </button>
        
        <div class="info-message">
          تسجيل دخول تجريبي - سيتم التوجيه مباشرة
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('admin')
const password = ref('admin123')

const handleLogin = () => {
  // تسجيل الدخول التجريبي - لا نحتاج للتحقق
  localStorage.setItem('pos_demo_logged_in', 'true')
  router.push('/')
}
</script>

<style scoped>
.login-background {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  direction: rtl;
  font-family: 'Tajawal', sans-serif;
}

.login-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.login-header h1 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.5rem;
}

.login-header p {
  margin: 0 0 2rem 0;
  color: #666;
  font-size: 0.9rem;
}

.login-form {
  text-align: right;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
  background-color: #f5f5f5;
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s;
}

.login-button:hover {
  transform: translateY(-2px);
}

.info-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #e3f2fd;
  color: #1976d2;
  border-radius: 6px;
  font-size: 0.875rem;
}
</style>