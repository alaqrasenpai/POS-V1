<template>
  <div class="checks-page">
    <div class="page-header">
      <div class="header-left">
        <n-h1 style="margin-bottom: 4px;">إدارة الشيكات</n-h1>
        <n-text depth="3">متابعة تحصيل الشيكات الآجلة وحالاتها</n-text>
      </div>
      <n-space>
        <n-tag type="warning" size="large" round>
          بانتظار التحصيل: {{ pendingTotal }} {{ currency }}
        </n-tag>
      </n-space>
    </div>

    <n-card :bordered="false" class="main-card">
      <n-data-table :columns="columns" :data="checks" :pagination="pagination" :bordered="false" />
    </n-card>
  </div>
</template>

<script setup>
import { computed, h } from 'vue'
useHead({ title: 'إدارة الشيكات' })
import { NTag, NButton, NSpace, NText, useMessage } from 'naive-ui'
import { usePayments } from '@/composables/usePayments'
import { useSettings } from '@/composables/useSettings'

const { getChecks, updateCheckStatus } = usePayments()
const { getCurrency } = useSettings()
const currency = getCurrency()
const message = useMessage()
const checks = computed(() => getChecks())

const pendingTotal = computed(() => {
  return checks.value
    .filter(c => c.status === 'pending')
    .reduce((sum, c) => sum + c.amount, 0)
})

const pagination = { pageSize: 10 }

const columns = [
  { title: 'رقم الشيك', key: 'checkNumber' },
  { title: 'اسم المشتري', key: 'customerName' },
  { title: 'المبلغ', key: 'amount', render(row) { return `${row.amount} ${currency}` } },
  { title: 'تاريخ الاستحقاق', key: 'dueDate' },
  {
    title: 'الحالة',
    key: 'status',
    render(row) {
      const typeMap = { pending: 'warning', cashed: 'success', returned: 'error' }
      const labelMap = { pending: 'بانتظار التحصيل', cashed: 'تم الصرف', returned: 'مرفوض/راجع' }
      return h(NTag, { type: typeMap[row.status], bordered: false }, { default: () => labelMap[row.status] })
    }
  },
  {
    title: 'الإجراءات',
    key: 'actions',
    render(row) {
      if (row.status !== 'pending') return '-'
      return h(NSpace, null, {
        default: () => [
          h(NButton, {
            size: 'small',
            type: 'success',
            onClick: () => {
              updateCheckStatus(row.id, 'cashed')
              message.success('تم تحديث حالة الشيك إلى: تم الصرف')
            }
          }, { default: () => 'صرف' }),
          h(NButton, {
            size: 'small',
            type: 'error',
            onClick: () => {
              updateCheckStatus(row.id, 'returned')
              message.error('تم تحديث حالة الشيك إلى: مرفوض')
            }
          }, { default: () => 'رفض' })
        ]
      })
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
</style>
