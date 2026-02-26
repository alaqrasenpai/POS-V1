<template>
  <div class="checks-page">
    <div class="page-header">
      <div class="header-left">
        <n-h1 style="margin-bottom: 4px;">{{ t('checks.title') }}</n-h1>
        <n-text depth="3">{{ t('checks.subtitle') }}</n-text>
      </div>
      <n-space>
        <n-tag type="warning" size="large" round>
          {{ t('checks.pendingTotal') }}: {{ pendingTotal }} {{ currency }}
        </n-tag>
      </n-space>
    </div>

    <n-card :bordered="false" class="main-card">
      <n-tabs type="line" animated size="large">
        <n-tab-pane name="list" :tab="t('checks.title')">
          <n-data-table :columns="columns" :data="checks" :pagination="pagination" :bordered="false" />
        </n-tab-pane>
        <n-tab-pane name="logs" :tab="t('checks.logs')">
          <n-data-table :columns="logColumns" :data="checkLogs" :pagination="pagination" :bordered="false" />
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script setup>
import { computed, h } from 'vue'
import { NTag, NButton, NSpace, NText, useMessage } from 'naive-ui'
import { usePayments } from '@/composables/usePayments'
import { useSettings } from '@/composables/useSettings'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()
useHead({ title: t('checks.title') })

const { getChecks, updateCheckStatus, getPaymentLogs } = usePayments()
const { getCurrency } = useSettings()
const currency = getCurrency()
const message = useMessage()
const checks = computed(() => getChecks())

const checkLogs = computed(() => {
  return getPaymentLogs().filter(log => log.type === 'check').sort((a, b) => new Date(b.date) - new Date(a.date))
})

const pendingTotal = computed(() => {
  return checks.value
    .filter(c => c.status === 'pending')
    .reduce((sum, c) => sum + c.amount, 0)
})

const pagination = { pageSize: 10 }

const columns = computed(() => [
  { title: t('cart.checkNumber'), key: 'checkNumber' },
  { title: t('customers.customerName'), key: 'customerName' },
  { title: t('common.total'), key: 'amount', render(row) { return `${row.amount} ${currency}` } },
  { title: t('cart.dueDate'), key: 'dueDate' },
  {
    title: t('common.status'),
    key: 'status',
    render(row) {
      const typeMap = { pending: 'warning', cashed: 'success', returned: 'error' }
      const labelMap = { pending: t('checks.pendingTotal'), cashed: t('checks.cashed'), returned: t('checks.returned') }
      return h(NTag, { type: typeMap[row.status], bordered: false }, { default: () => labelMap[row.status] })
    }
  },
  {
    title: t('common.actions'),
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
              message.success(t('checks.statusUpdateSuccess'))
            }
          }, { default: () => t('checks.cashBtn') }),
          h(NButton, {
            size: 'small',
            type: 'error',
            onClick: () => {
              updateCheckStatus(row.id, 'returned')
              message.error(t('checks.statusUpdateSuccess'))
            }
          }, { default: () => t('checks.rejectBtn') })
        ]
      })
    }
  }
])

const logColumns = computed(() => [
  { title: t('cart.checkNumber'), key: 'checkNumber' },
  { title: t('customers.customerName'), key: 'customerName' },
  { title: t('common.total'), key: 'amount', render(row) { return `${row.amount} ${currency}` } },
  {
    title: t('checks.logAction'),
    key: 'action',
    render(row) {
      const typeMap = { cashed: 'success', returned: 'error' }
      const labelMap = { cashed: t('checks.cashed'), returned: t('checks.returned') }
      return h(NTag, { type: typeMap[row.action] || 'default', bordered: false }, { default: () => labelMap[row.action] || row.action })
    }
  },
  {
    title: t('checks.logDate'),
    key: 'date',
    render(row) {
      return new Date(row.date).toLocaleString()
    }
  }
])
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
