<template>
  <div class="page-container">
    <div class="page-title-section">
      <div class="page-header-text">
        <n-h1 class="page-title">إعدادات النظام</n-h1>
        <n-text class="page-subtitle">تحكم في هوية المحل، المستخدمين، وسجلات النظام</n-text>
      </div>
    </div>

    <n-card :bordered="false" class="main-content-card">
      <n-tabs type="line" animated size="large" justify-content="start" style="padding: 12px 0;">
        <n-tab-pane name="store-profile" tab="بيانات المتجر">
          <template #tab>
            <n-space align="center" :size="8">
              <n-icon>
                <StoreIcon />
              </n-icon>
              <span>بيانات المتجر</span>
            </n-space>
          </template>
          <div style="padding: 24px 0">
            <StoreProfile />
          </div>
        </n-tab-pane>

        <n-tab-pane name="general" tab="الإعدادات المالية">
          <template #tab>
            <n-space align="center" :size="8">
              <n-icon>
                <SettingsIcon />
              </n-icon>
              <span>الإعدادات العامة</span>
            </n-space>
          </template>
          <div style="padding: 24px 0">
            <GeneralSettings />
          </div>
        </n-tab-pane>

        <n-tab-pane name="users" tab="إدارة المستخدمين">
          <template #tab>
            <n-space align="center" :size="8">
              <n-icon>
                <UsersIcon />
              </n-icon>
              <span>المستخدمين</span>
            </n-space>
          </template>
          <div style="padding: 24px 0">
            <UserManagement />
          </div>
        </n-tab-pane>

        <n-tab-pane name="activity" tab="سجل الأنشطة">
          <template #tab>
            <n-space align="center" :size="8">
              <n-icon>
                <LogIcon />
              </n-icon>
              <span>سجل الأنشطة</span>
            </n-space>
          </template>
          <div style="padding: 24px 0">
            <ActivityLogManagement />
          </div>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script setup>
useHead({ title: 'إعدادات النظام' })
import {
  SettingsOutline as SettingsIcon,
  PeopleOutline as UsersIcon,
  ListOutline as LogIcon,
  StorefrontOutline as StoreIcon
} from '@vicons/ionicons5'
import { useAuth } from '@/composables/useAuth'
import * as NaiveUI from 'naive-ui'
const { useMessage } = NaiveUI

// Explicit imports
import StoreProfile from '@/components/settings/StoreProfile.vue'
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
