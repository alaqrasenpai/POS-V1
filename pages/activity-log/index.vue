<template>
  <div class="activity-log-page">
    <div class="page-header">
      <div class="header-left">
        <n-h1 style="margin-bottom: 4px;">سجل أنشطة النظام</n-h1>
        <n-text depth="3">مراقبة جميع العمليات والحركات التي تمت على النظام</n-text>
      </div>
      <n-button quaternary type="error" @click="handleClearLogs" v-if="hasPermission('all')">
        <template #icon>
          <n-icon><TrashIcon /></n-icon>
        </template>
        مسح السجل
      </n-button>
    </div>

    <n-card :bordered="false" class="main-card">
      <n-data-table
        :columns="columns"
        :data="logs"
        :pagination="pagination"
        :bordered="false"
        scroll-x="900"
      />
    </n-card>
  </div>
</template>

<script setup>
import { h, computed, onMounted } from 'vue'
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
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.main-card {
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}
:deep(.n-data-table .n-data-table-th) {
  background-color: #f9fafb;
}
</style>
