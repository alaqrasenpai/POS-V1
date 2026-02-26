<template>
  <div class="activity-log-section">
    <n-flex justify="space-between" align="center" style="margin-bottom: 24px;">
      <n-text depth="3">{{ t('activityLog.subtitle') }}</n-text>
      <n-button quaternary type="error" @click="handleClearLogs">
        <template #icon>
          <n-icon>
            <TrashIcon />
          </n-icon>
        </template>
        {{ t('common.clearLog') }}
      </n-button>
    </n-flex>

    <n-data-table :columns="columns" :data="logs" :pagination="pagination" :bordered="false" scroll-x="900" />
  </div>
</template>

<script setup>
import { h, computed } from 'vue'
import { TrashOutline as TrashIcon, TimeOutline as TimeIcon } from '@vicons/ionicons5'
import { NTag, NText, NIcon, NSpace, useMessage } from 'naive-ui'
import { useActivityLog } from '@/composables/useActivityLog'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()
const { getLogs, clearLogs } = useActivityLog()
const message = useMessage()

const logs = computed(() => getLogs())

const pagination = { pageSize: 15 }

const handleClearLogs = () => {
  clearLogs()
  message.success(t('activityLog.clearSuccess', 'Logs cleared'))
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
      const typeMap = { success: 'success', error: 'error', warning: 'warning', info: 'info' }
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
