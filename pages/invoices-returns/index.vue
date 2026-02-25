<template>
  <div class="page-container">
    <div class="page-title-section">
      <div class="page-header-text">
        <n-h1 class="page-title">الفواتير والمرتجعات</n-h1>
        <n-text class="page-subtitle">إدارة ومراجعة فواتير المبيعات وحالات الإرجاع</n-text>
      </div>
    </div>

    <n-card class="main-content-card" :bordered="false">
      <n-tabs type="line" animated size="large" justify-content="start" style="padding: 12px 0;">
        <!-- تبويب الفواتير -->
        <n-tab-pane name="invoices" tab="الفواتير">
          <div style="padding: 24px 0">
            <n-flex justify="space-between" align="center" style="margin-bottom: 24px">
              <n-h3 style="margin: 0;">قائمة الفواتير</n-h3>
              <n-input v-model:value="searchTermInvoices" placeholder="البحث في الفواتير..." clearable
                :style="{ width: isMobile ? '100%' : '320px' }">
                <template #prefix>
                  <n-icon>
                    <SearchOutline />
                  </n-icon>
                </template>
              </n-input>
            </n-flex>
            <n-data-table :columns="invoicesColumns" :data="filteredInvoices" :pagination="invoicesPagination"
              :bordered="false" :scroll-x="1200" :loading="loadingInvoices" />
          </div>
        </n-tab-pane>

        <!-- تبويب المرتجعات -->
        <n-tab-pane name="returns" tab="المرتجعات">
          <div style="padding: 24px 0">
            <n-flex justify="space-between" align="center" style="margin-bottom: 24px">
              <n-h3 style="margin: 0;">قائمة المرتجعات</n-h3>
              <n-input v-model:value="searchTermReturns" placeholder="البحث في المرتجعات..." clearable
                :style="{ width: isMobile ? '100%' : '320px' }">
                <template #prefix>
                  <n-icon>
                    <SearchOutline />
                  </n-icon>
                </template>
              </n-input>
            </n-flex>
            <n-data-table :columns="returnsColumns" :data="filteredReturns" :pagination="returnsPagination"
              :bordered="false" :scroll-x="1000" :loading="loadingReturns" />
          </div>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, h } from 'vue'
import { NButton, NTag } from 'naive-ui'
import { SearchOutline } from '@vicons/ionicons5'
import { useSellOrder } from '@/composables/useSellOrder'
import { useCustomers } from '@/composables/useCustomers'

// استخدام composables
const { getAlldSellOrders } = useSellOrder()
const { getCustomerById } = useCustomers()

// حالات التحميل
const loadingInvoices = ref(false)
const loadingReturns = ref(false)

// مصطلحات البحث
const searchTermInvoices = ref('')
const searchTermReturns = ref('')

// البيانات
const invoices = ref([])
const returns = ref([])

// دالة مساعدة للحصول على اسم العميل
const getCustomerNameById = (customerId) => {
  if (!customerId) return 'عميل مجهول'
  const customer = getCustomerById(customerId)
  return customer ? customer.name : 'عميل غير موجود'
}

// أعمدة جدول الفواتير
const invoicesColumns = [
  {
    title: 'رقم الفاتورة',
    key: 'id',
    width: 120,
    sorter: 'default',
    fixed: 'left'
  },
  {
    title: 'رقم المسلسل',
    key: 'serialnumber',
    width: 150,
    sorter: 'default'
  },
  {
    title: 'تاريخ الفاتورة',
    key: 'selldate',
    width: 180,
    sorter: (row1, row2) => new Date(row1.selldate) - new Date(row2.selldate),
    render(row) {
      if (!row.selldate) return '-'
      const date = new Date(row.selldate)
      return date.toLocaleDateString('ar-SA')
    }
  },
  {
    title: 'اسم العميل',
    key: 'customerId',
    width: 200,
    sorter: (row1, row2) => {
      const name1 = getCustomerNameById(row1.customerId)
      const name2 = getCustomerNameById(row2.customerId)
      return name1.localeCompare(name2)
    },
    render(row) {
      return getCustomerNameById(row.customerId)
    }
  },
  {
    title: 'الخصم الإجمالي',
    key: 'totalDisc',
    width: 120,
    sorter: 'default',
    render(row) {
      return `${row.totalDisc || 0}₪`
    }
  },
  {
    title: 'السعر الإجمالي',
    key: 'totalPrice',
    width: 120,
    sorter: 'default',
    fixed: 'right',
    render(row) {
      return `${row.totalPrice || 0}₪`
    }
  },
  {
    title: 'الإجراءات',
    key: 'actions',
    width: 150,
    fixed: 'right',
    render(row) {
      return h(NButton, {
        size: 'small',
        type: 'primary',
        onClick: () => handleViewInvoice(row)
      }, { default: () => 'عرض' })
    }
  }
]

// أعمدة جدول المرتجعات
const returnsColumns = [
  {
    title: 'رقم المرتجع',
    key: 'returnId',
    width: 120,
    sorter: 'default',
    fixed: 'left'
  },
  {
    title: 'رقم الفاتورة',
    key: 'invoiceId',
    width: 120,
    sorter: 'default'
  },
  {
    title: 'تاريخ المرتجع',
    key: 'returnDate',
    width: 180,
    sorter: (row1, row2) => new Date(row1.returnDate) - new Date(row2.returnDate),
    render(row) {
      if (!row.returnDate) return '-'
      const date = new Date(row.returnDate)
      return date.toLocaleDateString('ar-SA')
    }
  },
  {
    title: 'اسم العميل',
    key: 'customerId',
    width: 200,
    render(row) {
      return getCustomerNameById(row.customerId)
    }
  },
  {
    title: 'قيمة المرتجع',
    key: 'returnAmount',
    width: 120,
    sorter: 'default',
    render(row) {
      return `${row.returnAmount || 0}₪`
    }
  },
  {
    title: 'السبب',
    key: 'reason',
    width: 200
  },
  {
    title: 'الحالة',
    key: 'status',
    width: 120,
    render(row) {
      const statusMap = {
        'pending': { text: 'قيد الانتظار', color: 'warning' },
        'approved': { text: 'موافق عليه', color: 'success' },
        'rejected': { text: 'مرفوض', color: 'error' }
      }
      const status = statusMap[row.status] || { text: 'غير معروف', color: 'default' }
      return h(NTag, {
        type: status.color,
        size: 'small'
      }, { default: () => status.text })
    }
  }
]

// تحميل البيانات
onMounted(async () => {
  try {
    loadingInvoices.value = true
    loadingReturns.value = true

    // تحميل الفواتير (من طلبات البيع الموجودة)
    invoices.value = getAlldSellOrders()

    // تحميل المرتجعات (بيانات مثال)
    returns.value = [
      {
        returnId: 1,
        invoiceId: 101,
        returnDate: '2024-01-15',
        customerId: 1,
        returnAmount: 150,
        reason: 'منتج تالف',
        status: 'approved'
      },
      {
        returnId: 2,
        invoiceId: 102,
        returnDate: '2024-01-20',
        customerId: 2,
        returnAmount: 75,
        reason: 'غير مناسب',
        status: 'pending'
      },
      {
        returnId: 3,
        invoiceId: 103,
        returnDate: '2024-01-25',
        customerId: 3,
        returnAmount: 200,
        reason: 'خطأ في الطلب',
        status: 'rejected'
      }
    ]

  } catch (error) {
    console.error('خطأ في تحميل البيانات:', error)
  } finally {
    loadingInvoices.value = false
    loadingReturns.value = false
  }
})

// ترقيم الصفحات للفواتير
const invoicesPagination = computed(() => ({
  pageSize: 10
}))

// ترقيم الصفحات للمرتجعات
const returnsPagination = computed(() => ({
  pageSize: 10
}))

// تصفية الفواتير
const filteredInvoices = computed(() => {
  if (!searchTermInvoices.value) return invoices.value

  const term = searchTermInvoices.value.toLowerCase()
  return invoices.value.filter(invoice =>
    String(invoice.id).includes(term) ||
    (invoice.serialnumber && invoice.serialnumber.includes(term)) ||
    (invoice.selldate && new Date(invoice.selldate).toLocaleDateString().includes(term)) ||
    getCustomerNameById(invoice.customerId).toLowerCase().includes(term) ||
    String(invoice.totalDisc).includes(term) ||
    String(invoice.totalPrice).includes(term)
  )
})

// تصفية المرتجعات
const filteredReturns = computed(() => {
  if (!searchTermReturns.value) return returns.value

  const term = searchTermReturns.value.toLowerCase()
  return returns.value.filter(returnItem =>
    String(returnItem.returnId).includes(term) ||
    String(returnItem.invoiceId).includes(term) ||
    (returnItem.returnDate && returnItem.returnDate.includes(term)) ||
    getCustomerNameById(returnItem.customerId).toLowerCase().includes(term) ||
    String(returnItem.returnAmount).includes(term) ||
    (returnItem.reason && returnItem.reason.toLowerCase().includes(term)) ||
    (returnItem.status && returnItem.status.toLowerCase().includes(term))
  )
})

// دوال الإجراءات
const handleViewInvoice = (invoice) => {
  // يمكنك إضافة منطق لعرض تفاصيل الفاتورة هنا
  console.log('عرض الفاتورة:', invoice)
}

const handleViewReturn = (returnItem) => {
  // يمكنك إضافة منطق لعرض تفاصيل المرتجع هنا
  console.log('عرض المرتجع:', returnItem)
}
</script>

<style scoped>
:deep(.n-data-table .n-data-table-th) {
  background-color: #f8f9fa;
  font-weight: bold;
}
</style>