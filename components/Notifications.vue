<template>
  <div class="notifications-wrapper">
    <CustomPopover :isRTL="isRTL" placement="bottom-end">
      <template #trigger>
        <n-badge :value="notifications.length" :show="notifications.length > 0" processing>
          <n-button quaternary circle size="large">
            <template #icon>
              <n-icon size="24">
                <NotificationsIcon />
              </n-icon>
            </template>
          </n-button>
        </n-badge>
      </template>

      <div class="popover-container">
        <div class="notifications-header">
          <n-text strong>التنبيهات ({{ notifications.length }})</n-text>
          <n-button quaternary size="tiny" @click="checkDueDates" type="primary">تحديث</n-button>
        </div>

        <div class="notifications-body" style="max-height: 400px; width: 350px; overflow-y: auto;">
          <div v-if="notifications.length === 0" class="empty-notifications">
            <n-empty description="لا توجد تنبيهات مستحقة حالياً" />
          </div>

          <n-list v-else hoverable clickable>
            <n-list-item v-for="notif in notifications" :key="notif.id" @click="handleNotifClick(notif)">
              <template #prefix>
                <n-icon :size="20" :color="notif.type === 'warning' ? '#f0a020' : '#18a058'">
                  <AlertIcon />
                </n-icon>
              </template>
              <n-thing :title="notif.title" :description="notif.message" />
              <template #suffix>
                <n-button quaternary circle size="small" @click.stop="clearNotification(notif.id)">
                  <template #icon><n-icon>
                      <CloseIcon />
                    </n-icon></template>
                </n-button>
              </template>
            </n-list-item>
          </n-list>
        </div>
      </div>
    </CustomPopover>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { NotificationsOutline as NotificationsIcon, AlertCircleOutline as AlertIcon, CloseOutline as CloseIcon } from '@vicons/ionicons5'
import { useNotifications } from '@/composables/useNotifications'
import { useRouter } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import CustomPopover from './CustomPopover.vue'

const { notifications, checkDueDates, clearNotification } = useNotifications()
const { isRTL } = useI18n()
const router = useRouter()

onMounted(() => {
  checkDueDates()
  // فحص تلقائي كل ساعة
  setInterval(checkDueDates, 3600000)
})

const handleNotifClick = (notif) => {
  if (notif.link) {
    router.push(notif.link)
  }
}
</script>

<style scoped>
.notifications-header {
  padding: 12px 16px;
  border-bottom: 1px solid var(--n-border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--n-action-color);
}

.empty-notifications {
  padding: 40px 20px;
  text-align: center;
}

:deep(.n-list-item) {
  padding: 12px 16px !important;
}
</style>
