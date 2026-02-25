<template>
  <div class="activity-log-section">
    <n-flex justify="space-between" align="center" style="margin-bottom: 24px;">
      <n-text depth="3">مراقبة جميع العمليات والحركات التي تمت على النظام</n-text>
      <n-button quaternary type="error" @click="handleClearLogs">
        <template #icon>
          <n-icon><TrashIcon /></n-icon>
        </template>
        مسح السجل بالكامل
      </n-button>
    </n-flex>

    <n-data-table
      :columns="columns"
      :data="logs"
      :pagination="pagination"
      :bordered="false"
      scroll-x="900"
    />
  </div>
</template>

<script setup>
import { h, computed } from 'vue'
import { TrashOutline as TrashIcon, TimeOutline as TimeIcon } from '@vicons/ionicons5'
import { NTag, NText, NIcon, NSpace, useMessage } from 'naive-ui'
import { useActivityLog } from '@/composables/useActivityLog'

const { getLogs, clearLogs } = useActivityLog()
const message = useMessage()

const logs = computed(() => getLogs())

const pagination = { pageSize: 15 }

const handleClearLogs = () => {
  clearLogs()
  message.success('تم مسح سجل الأنشطة بنجاح')
}

const columns = [
  {
    title: 'الوقت والتاريخ',
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
    title: 'المستخدم',
    key: 'user',
    width: 150,
    render(row) {
      return h(NText, { strong: true }, { default: () => row.user })
    }
  },
  {
    title: 'العملية',
    key: 'action',
    width: 150,
    render(row) {
      const typeMap = { success: 'success', error: 'error', warning: 'warning', info: 'info' }
      return h(NTag, { type: typeMap[row.type] || 'info', bordered: false, round: true }, { default: () => row.action })
    }
  },
  {
    title: 'التفاصيل',
    key: 'details',
    render(row) {
      return h(NText, { depth: 2 }, { default: () => row.details })
    }
  }
]
</script>
