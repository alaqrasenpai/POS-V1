<template>
  <div class="installments-page">
    <div class="page-header">
      <div class="header-left">
        <n-h1 style="margin-bottom: 4px;">{{ t('installments.title') }}</n-h1>
        <n-text depth="3">{{ t('installments.subtitle') }}</n-text>
      </div>
      <n-tag type="info" size="large" round>
        {{ t('installments.totalDue') }}: {{ totalRemaining }} {{ currency }}
      </n-tag>
    </div>

    <n-card :bordered="false" class="main-card">
      <n-tabs type="line" animated size="large">
        <n-tab-pane name="list" :tab="t('installments.title')">
          <n-data-table :columns="columns" :data="installments" :pagination="pagination" :bordered="false" />
        </n-tab-pane>
        <n-tab-pane name="logs" :tab="t('installments.logs')">
          <n-data-table :columns="logColumns" :data="installmentLogs" :pagination="pagination" :bordered="false" />
        </n-tab-pane>
      </n-tabs>
    </n-card>

    <n-modal v-model:show="showPaymentModal" preset="card" style="width: 400px;"
      :title="t('installments.payInstallment')">
      <n-form-item :label="t('installments.amountPaid')">
        <n-input-number v-model:value="paymentAmount" :min="1" :max="selectedInstallment?.remainingAmount"
          style="width: 100%;" />
      </n-form-item>
      <template #footer>
        <n-button type="primary" block @click="confirmPayment">{{ t('installments.confirmPay') }}</n-button>
      </template>
    </n-modal>
  </div>
</template>

<script setup>
import { computed, ref, h } from 'vue'
import { NTag, NButton, NSpace, NProgress, useMessage } from 'naive-ui'
import { usePayments } from '@/composables/usePayments'
import { useSettings } from '@/composables/useSettings'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()
useHead({ title: t('installments.title') })

const { getInstallments, addInstallmentPayment, getPaymentLogs } = usePayments()
const { getCurrency } = useSettings()
const currency = getCurrency()
const message = useMessage()
const installments = computed(() => getInstallments())

const installmentLogs = computed(() => {
  return getPaymentLogs().filter(log => log.type === 'installment').sort((a, b) => new Date(b.date) - new Date(a.date))
})

const totalRemaining = computed(() => {
  return installments.value.reduce((sum, i) => sum + i.remainingAmount, 0)
})

const showPaymentModal = ref(false)
const paymentAmount = ref(0)
const selectedInstallment = ref(null)

const handlePayment = (row) => {
  selectedInstallment.value = row
  paymentAmount.value = row.remainingAmount > 100 ? 100 : row.remainingAmount
  showPaymentModal.value = true
}

const confirmPayment = () => {
  addInstallmentPayment(selectedInstallment.value.id, paymentAmount.value)
  let params = { amount: `${paymentAmount.value} ${currency}` }
  message.success(t('installments.paymentSuccess', params))
  showPaymentModal.value = false
}

const pagination = { pageSize: 10 }

const columns = computed(() => [
  { title: t('customers.customerName'), key: 'customerName' },
  { title: t('common.total'), key: 'totalAmount', render(row) { return `${row.totalAmount} ${currency}` } },
  { title: t('installments.paid'), key: 'paidAmount', render(row) { return `${row.paidAmount} ${currency}` } },
  { title: t('installments.remaining'), key: 'remainingAmount', render(row) { return `${row.remainingAmount} ${currency}` } },
  {
    title: t('installments.progress'),
    key: 'progress',
    render(row) {
      const percentage = Math.round((row.paidAmount / row.totalAmount) * 100)
      return h(NProgress, {
        type: 'line',
        percentage,
        status: percentage === 100 ? 'success' : 'default',
        indicatorPlacement: 'inside'
      })
    }
  },
  {
    title: t('common.actions'),
    key: 'actions',
    render(row) {
      if (row.remainingAmount <= 0) return h(NTag, { type: 'success' }, { default: () => t('installments.completed') })
      return h(NButton, {
        size: 'small',
        type: 'primary',
        onClick: () => handlePayment(row)
      }, { default: () => t('installments.payInstallment') })
    }
  }
])

const logColumns = computed(() => [
  { title: t('customers.customerName'), key: 'customerName' },
  { title: t('installments.amountPaid'), key: 'amount', render(row) { return `${row.amount} ${currency}` } },
  {
    title: t('installments.logDate'),
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
