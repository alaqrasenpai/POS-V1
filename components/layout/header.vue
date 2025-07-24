<template>
  <n-layout-header bordered style="height: 64px; padding: 0 24px; display: flex; align-items: center; justify-content: space-between;">
    <div>
      <h2 style="margin: 0;">نظام إدارة المبيعات</h2>
    </div>
    <div v-if="isAuthenticated" style="display: flex; align-items: center; gap: 16px;">
      <span>مرحباً، {{ currentUser?.name }}</span>
      <n-button @click="handleLogout" type="error" size="small">
        <template #icon>
          <n-icon><LogOutIcon /></n-icon>
        </template>
        تسجيل الخروج
      </n-button>
    </div>
  </n-layout-header>
</template>

<script setup>
import { LogOutIcon } from '@vicons/ionicons5'
import { computed } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { currentUser, isAuthenticated, logout } = useAuth()

const handleLogout = () => {
  logout()
}
</script>