<template>
  <div class="page-container">
    <div class="page-title-section">
      <div class="page-header-text">
        <n-h1 class="page-title">سجل أنشطة النظام</n-h1>
        <n-text class="page-subtitle">مراقبة جميع العمليات والحركات التي تمت على النظام</n-text>
      </div>
      <n-button quaternary type="error" @click="handleClearLogs" v-if="hasPermission('all')">
        <template #icon>
          <n-icon>
            <TrashIcon />
          </n-icon>
        </template>
        مسح السجل
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

const { getLogs, clearLogs } = useActivityLog()
const { hasPermission } = useAuth()
const message = useMessage()

// حماية الصفحة
onMounted(() => {
  if (!hasPermission('view_reports') && !hasPermission('all')) {
    message.error('ليس لديك صلاحية لمشاهدة سجل الأنشطة')
    navigateTo('/')
  }
})

const logs = computed(() => getLogs())

const pagination = {
  pageSize: 15
}

const handleClearLogs = () => {
  clearLogs()
  message.success('تم مسح سجل الأنشطة')
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
    title: 'التفاصيل',
    key: 'details',
    render(row) {
      return h(NText, { depth: 2 }, { default: () => row.details })
    }
  }
]
</script>

<style scoped>
:deep(.n-data-table .n-data-table-th) {
  background-color: var(--n-th-color);
}
</style>
