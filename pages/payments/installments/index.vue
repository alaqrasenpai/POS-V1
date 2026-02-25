<template>
  <div class="installments-page">
    <div class="page-header">
      <div class="header-left">
        <n-h1 style="margin-bottom: 4px;">إدارة الأقساط</n-h1>
        <n-text depth="3">متابعة مبيعات التقسيط والمبالغ المتبقية</n-text>
      </div>
      <n-tag type="info" size="large" round>
        إجمالي المبالغ المستحقة: {{ totalRemaining }} {{ currency }}
      </n-tag>
    </div>

    <n-card :bordered="false" class="main-card">
      <n-data-table :columns="columns" :data="installments" :pagination="pagination" :bordered="false" />
    </n-card>

    <n-modal v-model:show="showPaymentModal" preset="card" style="width: 400px;" title="تسجيل دفعة قسط">
      <n-form-item label="المبلغ المدفوع">
        <n-input-number v-model:value="paymentAmount" :min="1" :max="selectedInstallment?.remainingAmount"
          style="width: 100%;" />
      </n-form-item>
      <template #footer>
        <n-button type="primary" block @click="confirmPayment">تأكيد الدفع</n-button>
      </template>
    </n-modal>
  </div>
</template>

<script setup>
import { computed, ref, h } from 'vue'
useHead({ title: 'إدارة الأقساط' })
import { NTag, NButton, NSpace, NProgress, useMessage } from 'naive-ui'
import { usePayments } from '@/composables/usePayments'
import { useSettings } from '@/composables/useSettings'

const { getInstallments, addInstallmentPayment } = usePayments()
const { getCurrency } = useSettings()
const currency = getCurrency()
const message = useMessage()
const installments = computed(() => getInstallments())

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
  message.success(`تم تسجيل دفعة بقيمة ${paymentAmount.value} ${currency}`)
  showPaymentModal.value = false
}

const pagination = { pageSize: 10 }

const columns = [
  { title: 'اسم المشتري', key: 'customerName' },
  { title: 'إجمالي المبلغ', key: 'totalAmount', render(row) { return `${row.totalAmount} ${currency}` } },
  { title: 'المدفوع', key: 'paidAmount', render(row) { return `${row.paidAmount} ${currency}` } },
  { title: 'المتبقي', key: 'remainingAmount', render(row) { return `${row.remainingAmount} ${currency}` } },
  {
    title: 'التقدم',
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
    title: 'الإجراءات',
    key: 'actions',
    render(row) {
      if (row.remainingAmount <= 0) return h(NTag, { type: 'success' }, { default: () => 'مكتمل' })
      return h(NButton, {
        size: 'small',
        type: 'primary',
        onClick: () => handlePayment(row)
      }, { default: () => 'دفع قسط' })
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
