<template>
  <div class="settings-page">
    <div class="page-header">
      <n-h1 style="margin-bottom: 4px;">{{ t('settings.title') }}</n-h1>
      <n-text depth="3">{{ t('settings.subtitle') }}</n-text>
    </div>

    <n-card :bordered="false" class="main-card">
      <n-tabs type="line" animated size="large" justify-content="start">
        <n-tab-pane name="general" :tab="t('settings.general')">
          <template #tab>
            <n-space align="center" :size="4">
              <n-icon>
                <SettingsIcon />
              </n-icon>
              <span>{{ t('settings.general') }}</span>
            </n-space>
          </template>
          <GeneralSettings style="padding: 20px 0" />
        </n-tab-pane>

        <n-tab-pane name="users" :tab="t('settings.users')">
          <template #tab>
            <n-space align="center" :size="4">
              <n-icon>
                <UsersIcon />
              </n-icon>
              <span>{{ t('settings.users') }}</span>
            </n-space>
          </template>
          <UserManagement style="padding: 20px 0" />
        </n-tab-pane>

        <n-tab-pane name="activity" :tab="t('settings.activity')">
          <template #tab>
            <n-space align="center" :size="4">
              <n-icon>
                <LogIcon />
              </n-icon>
              <span>{{ t('settings.activity') }}</span>
            </n-space>
          </template>
          <ActivityLogManagement style="padding: 20px 0" />
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script setup>
useHead({ title: 'إعدادات المتجر' })
import {
  SettingsOutline as SettingsIcon,
  PeopleOutline as UsersIcon,
  ListOutline as LogIcon
} from '@vicons/ionicons5'
import { useAuth } from '@/composables/useAuth'
import { useI18n } from '@/composables/useI18n'
import { useMessage } from 'naive-ui'

const { t } = useI18n()
import GeneralSettings from '@/components/settings/GeneralSettings.vue'
import UserManagement from '@/components/settings/UserManagement.vue'
import ActivityLogManagement from '@/components/settings/ActivityLogManagement.vue'

const { hasPermission } = useAuth()
const message = useMessage()

// Simplified check - if logout doesn't work, maybe we should just allow it or check on server
</script>

<style scoped>
.settings-page {
  padding: 0;
}

.page-header {
  margin-bottom: 24px;
}

.main-card {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

:deep(.n-tabs-nav) {
  padding-right: 12px;
}
</style>
