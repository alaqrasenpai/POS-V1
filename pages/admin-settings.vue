<template>
  <div class="page-container">
    <div class="page-title-section">
      <div class="page-header-text">
        <n-h1 class="page-title">إعدادات النظام</n-h1>
        <n-text class="page-subtitle">تحكم في هوية المحل، المستخدمين، وسجلات النظام</n-text>
      </div>
    </div>

    <n-card :bordered="false" class="main-content-card">
      <n-tabs type="line" animated size="large" justify-content="start">
        <n-tab-pane name="general" tab="الإعدادات العامة">
          <template #tab>
            <n-space align="center" :size="4">
              <n-icon><SettingsIcon /></n-icon>
              <span>الإعدادات العامة</span>
            </n-space>
          </template>
          <div style="padding: 16px 0">
            <GeneralSettings />
          </div>
        </n-tab-pane>

        <n-tab-pane name="users" tab="إدارة المستخدمين">
          <template #tab>
            <n-space align="center" :size="4">
              <n-icon><UsersIcon /></n-icon>
              <span>المستخدمين</span>
            </n-space>
          </template>
          <div style="padding: 16px 0">
            <UserManagement />
          </div>
        </n-tab-pane>

        <n-tab-pane name="activity" tab="سجل الأنشطة">
          <template #tab>
            <n-space align="center" :size="4">
              <n-icon><LogIcon /></n-icon>
              <span>سجل الأنشطة</span>
            </n-space>
          </template>
          <div style="padding: 16px 0">
            <ActivityLogManagement />
          </div>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script setup>
import { 
  SettingsOutline as SettingsIcon, 
  PeopleOutline as UsersIcon, 
  ListOutline as LogIcon 
} from '@vicons/ionicons5'
import { useAuth } from '@/composables/useAuth'
import { useMessage } from 'naive-ui'

// Explicit imports
import GeneralSettings from '@/components/settings/GeneralSettings.vue'
import UserManagement from '@/components/settings/UserManagement.vue'
import ActivityLogManagement from '@/components/settings/ActivityLogManagement.vue'

const { hasPermission } = useAuth()
const message = useMessage()
</script>

<style scoped>
:deep(.n-tabs-nav) {
  padding-right: 12px;
}
</style>
