<template>
  <div class="login-background">
    <div class="login-card">
      <div class="login-header">
        <div class="app-icon">
          <n-icon size="40" color="#764ba2">
            <StoreIcon />
          </n-icon>
        </div>
        <h1>{{ t('login.title') }}</h1>
        <p>{{ isRTL ? 'يرجى إدخال بيانات متجرك وحسابك' : 'Please enter your shop and account details' }}</p>
      </div>

      <div class="login-form">
        <div class="form-group">
          <label for="phone">{{ isRTL ? 'رقم جوال المتجر المسجل' : 'Registered Shop Phone Number' }}</label>
          <n-input id="phone" v-model:value="phone" type="text" placeholder="01xxxxxxxxx" size="large">
            <template #prefix>
              <n-icon>
                <PhoneIcon />
              </n-icon>
            </template>
          </n-input>
        </div>

        <div class="form-group">
          <label for="username">{{ t('login.username') }}</label>
          <n-input id="username" v-model:value="username" type="text" :placeholder="t('login.username')" size="large">
            <template #prefix>
              <n-icon>
                <UserIcon />
              </n-icon>
            </template>
          </n-input>
        </div>

        <div class="form-group">
          <label for="password">{{ t('login.password') }}</label>
          <n-input id="password" v-model:value="password" type="password" show-password-on="mousedown"
            :placeholder="t('login.password')" size="large">
            <template #prefix>
              <n-icon>
                <LockIcon />
              </n-icon>
            </template>
          </n-input>
        </div>

        <n-button @click="handleLogin" type="primary" block size="large" :loading="loading" class="login-button">
          {{ t('login.loginBtn') }}
        </n-button>

        <div class="links-footer">
          <n-button text @click="router.push('/super-login')">
            {{ isRTL ? 'دخول إدارة المنصة (Super Admin)' : 'Central Platform Management (Super Admin)' }}
          </n-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { useI18n } from '@/composables/useI18n'
import {
  StorefrontOutline as StoreIcon,
  CallOutline as PhoneIcon,
  PersonOutline as UserIcon,
  LockClosedOutline as LockIcon
} from '@vicons/ionicons5'

const { t, isRTL } = useI18n()
useHead({ title: t('login.title') })

const router = useRouter()
const { login } = useAuth()
const message = useMessage()

// قيم افتراضية للتجربة
const phone = ref('0123456789')
const username = ref('admin')
const password = ref('admin123')
const loading = ref(false)

const handleLogin = () => {
  if (!phone.value || !username.value || !password.value) {
    message.warning(isRTL.value ? "يرجى إكمال جميع الحقول" : "Please complete all fields");
    return;
  }

  loading.value = true
  const result = login(phone.value, username.value, password.value)

  if (result.success) {
    message.success(isRTL.value ? `مرحباً بك في ${result.user.name}` : `Welcome to ${result.user.name}`)
    router.push('/')
  } else {
    message.error(result.message)
  }
  loading.value = false
}
</script>

<style scoped>
.login-background {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  background-image:
    radial-gradient(at 0% 0%, hsla(253, 16%, 7%, 1) 0, transparent 50%),
    radial-gradient(at 50% 0%, hsla(225, 39%, 30%, 1) 0, transparent 50%),
    radial-gradient(at 100% 0%, hsla(339, 49%, 30%, 1) 0, transparent 50%);
}

.login-card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  padding: 3rem 2rem;
  width: 100%;
  max-width: 440px;
}

.app-icon {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.login-header h1 {
  margin: 0 0 10px 0;
  color: #1e293b;
  font-size: 1.8rem;
  font-weight: 800;
}

.login-header p {
  margin: 0 0 30px 0;
  color: #64748b;
  font-size: 1rem;
}

.login-form {
  /* removed text-align: right to follow dir */
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #475569;
  font-weight: 600;
  font-size: 0.9rem;
}

.login-button {
  height: 50px;
  font-size: 1.1rem;
  font-weight: 700;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  border: none;
  margin-top: 10px;
}

.links-footer {
  margin-top: 24px;
  text-align: center;
  border-top: 1px solid #f1f5f9;
  padding-top: 20px;
}
</style>