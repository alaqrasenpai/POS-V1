<template>
  <div class="page-container">
    <div class="page-title-section">
      <div class="page-header-text">
        <n-h1 class="page-title">{{ t('activityLog.title') }}</n-h1>
        <n-text class="page-subtitle">{{ t('activityLog.subtitle') }}</n-text>
      </div>
      <n-button quaternary type="error" @click="handleClearLogs" v-if="hasPermission('all')">
        <template #icon>
          <n-icon>
            <TrashIcon />
          </n-icon>
        </template>
        {{ t('common.clearLog') }}
      </n-button>
    </div>

    <n-card :bordered="false" class="main-content-card">
      <div style="padding: 12px 0;">
        <n-data-table :columns="columns" :data="logs" :pagination="pagination" :bordered="false" scroll-x="900" />
      </div>
    </n-card>
  </div>
</template>

<script setup>
import { h, computed, onMounted } from 'vue'
useHead({ title: 'سجل الأنشطة' })
import { TrashOutline as TrashIcon, TimeOutline as TimeIcon } from '@vicons/ionicons5'
import { NTag, NText, NIcon, NSpace, useMessage } from 'naive-ui'
import { useActivityLog } from '@/composables/useActivityLog'
import { useAuth } from '@/composables/useAuth'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()
const { getLogs, clearLogs } = useActivityLog()
const { hasPermission } = useAuth()
const message = useMessage()

// حماية الصفحة
onMounted(() => {
  if (!hasPermission('view_reports') && !hasPermission('all')) {
    message.error(t('common.error')) // Using a general error or specific i18n key for permission
    navigateTo('/')
  }
})

const logs = computed(() => getLogs())

const pagination = {
  pageSize: 15
}

const handleClearLogs = () => {
  clearLogs()
  message.success(t('activityLog.clearSuccess'))
}

const columns = computed(() => [
  {
    title: t('common.date'),
    key: 'timestamp',
    width: 200,
    render(row) {
      return h(NSpace, { align: 'center', size: 'small' }, {
        default: () => [
          h(NIcon, { component: TimeIcon, depth: 3 }),
          h(NText, { depth: 2 }, { default: () => row.timestamp })
        ]
      })
    }
  },
  {
    title: t('activityLog.user'),
    key: 'user',
    width: 150,
    render(row) {
      return h(NText, { strong: true }, { default: () => row.user })
    }
  },
  {
    title: t('activityLog.action'),
    key: 'action',
    width: 150,
    render(row) {
      const typeMap = {
        success: 'success',
        error: 'error',
        warning: 'warning',
        info: 'info'
      }
      return h(NTag, { type: typeMap[row.type] || 'info', bordered: false, round: true }, { default: () => row.action })
    }
  },
  {
    title: t('activityLog.details'),
    key: 'details',
    render(row) {
      return h(NText, { depth: 2 }, { default: () => row.details })
    }
  }
])
</script>

<style scoped>
:deep(.n-data-table .n-data-table-th) {
  background-color: var(--n-th-color);
}
</style>
