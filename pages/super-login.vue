<template>
  <div class="login-background">
    <div class="login-card">
      <div class="login-header">
        <div class="app-icon">
          <n-icon size="40" color="#d03050">
            <ShieldIcon />
          </n-icon>
        </div>
        <h1>{{ t('superLogin.title') }}</h1>
        <p>{{ t('superLogin.subtitle') }}</p>
      </div>

      <div class="login-form">
        <div class="form-group">
          <label for="username">{{ t('superLogin.adminUser') }}</label>
          <n-input id="username" v-model:value="username" type="text" placeholder="super" size="large">
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

        <n-button @click="handleSuperLogin" type="error" block size="large" :loading="loading" class="login-button">
          {{ t('superLogin.loginBtn') }}
        </n-button>

        <div class="links-footer">
          <n-button text @click="router.push('/login')">
            {{ t('superLogin.backBtn') }}
          </n-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
useHead({ title: 'بوابة المدير العام' })
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useMessage } from 'naive-ui'
import {
  ShieldCheckmarkOutline as ShieldIcon,
  PersonOutline as UserIcon,
  LockClosedOutline as LockIcon
} from '@vicons/ionicons5'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()

const router = useRouter()
const { superLogin } = useAuth()
const message = useMessage()

const username = ref('super')
const password = ref('super123')
const loading = ref(false)

const handleSuperLogin = () => {
  if (!username.value || !password.value) {
    message.warning(t('common.warning'));
    return;
  }

  loading.value = true
  const result = superLogin(username.value, password.value)

  if (result.success) {
    message.success(t('superLogin.welcome'))
    router.push('/super-admin')
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
  background: #0f172a;
  /* لون داكن مهيب للمدير العام */
}

.login-card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 0 40px rgba(208, 48, 80, 0.2);
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

.login-form {}

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
  margin-top: 10px;
}

.links-footer {
  margin-top: 24px;
  text-align: center;
  border-top: 1px solid #f1f5f9;
  padding-top: 20px;
}
</style>
