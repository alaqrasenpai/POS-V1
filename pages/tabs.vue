<template>
  <div class="sales-orders-page">
    <n-card title="إدارة الطلبات" style="margin-bottom: 20px;">
      <n-tabs type="line" animated>
        <!-- تبويب طلبات البيع -->
        <n-tab-pane name="sell-orders" tab="طلبات البيع">
          <n-card>
            <template #header>
              <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <n-h3 style="margin: 0;">قائمة طلبات البيع</n-h3>
                <n-input 
                  v-model:value="searchTermOrders" 
                  placeholder="البحث في الطلبات..." 
                  clearable
                  style="width: 300px;"
                >
                  <template #prefix>
                    <n-icon><SearchOutline /></n-icon>
                  </template>
                </n-input>
              </div>
            </template>
            <n-data-table 
              :columns="ordersColumns" 
              :data="filteredSellOrders" 
              :pagination="ordersPagination"
              :bordered="true"
              :single-line="false"
              :scroll-x="1200"
              :loading="loadingOrders"
            />
          </n-card>
        </n-tab-pane>

        <!-- تبويب تفاصيل الطلبات -->
        <n-tab-pane name="order-details" tab="تفاصيل الطلبات">
          <n-card>
            <template #header>
              <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <n-h3 style="margin: 0;">تفاصيل الطلبات</n-h3>
                <n-input 
                  v-model:value="searchTermDetails" 
                  placeholder="البحث في التفاصيل..." 
                  clearable
                  style="width: 300px;"
                >
                  <template #prefix>
                    <n-icon><SearchOutline /></n-icon>
                  </template>
                </n-input>
              </div>
            </template>
            <n-data-table 
              :columns="detailsColumns" 
              :data="filteredSellOrdersDtl" 
              :pagination="detailsPagination"
              :bordered="true"
              :single-line="false"
              :scroll-x="1000"
              :loading="loadingDetails"
            />
          </n-card>
        </n-tab-pane>

        <!-- تبويب المعاملات -->
        <n-tab-pane name="transactions" tab="المعاملات">
          <n-card>
            <template #header>
              <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <n-h3 style="margin: 0;">سجل المعاملات</n-h3>
                <n-flex>
                  <n-input 
                    v-model:value="searchTermTransactions" 
                    placeholder="البحث في المعاملات..." 
                    clearable
                    style="width: 300px;"
                  >
                    <template #prefix>
                      <n-icon><SearchOutline /></n-icon>
                    </template>
                  </n-input>
                </n-flex>
              </div>
            </template>
            <InventoryInventorytranstable 
              :listOfItems="filteredTransactions" 
              :searchTerm="searchTermTransactions"
            />
          </n-card>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { SearchOutline } from '@vicons/ionicons5'
import { useCustomers } from '@/composables/useCustomers'
import { useSellOrder } from '@/composables/useSellOrder'
import { useSellOrderDtl } from '@/composables/useSellOrderDtl'
import { useInventoryTrans } from '@/composables/useInventoryTrans'

// استخدام composables
const { getCustomerById } = useCustomers()
const { getAlldSellOrders } = useSellOrder()
const { getAllSellOrdeDtl } = useSellOrderDtl()
const { getItemsTrans } = useInventoryTrans()

// حالات التحميل
const loadingOrders = ref(false)
const loadingDetails = ref(false)
const loadingTransactions = ref(false)

// مصطلحات البحث
const searchTermOrders = ref('')
const searchTermDetails = ref('')
const searchTermTransactions = ref('')

// البيانات
const sellOrders = ref([])
const sellOrdersDtl = ref([])
const transactions = ref([])

// دالة مساعدة للحصول على اسم العميل
const getCustomerNameById = (customerId) => {
  if (!customerId) return 'عميل مجهول'
  const customer = getCustomerById(customerId)
  return customer ? customer.name : 'عميل غير موجود'
}

// أعمدة طلبات البيع
const ordersColumns = [
  {
    title: 'رقم الطلب',
    key: 'id',
    width: 100,
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
    title: 'تاريخ البيع',
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
  }
]

// أعمدة تفاصيل الطلبات
const detailsColumns = [
  {
    title: 'رقم الطلب',
    key: 'orderId',
    width: 100,
    sorter: 'default',
    fixed: 'left'
  },
  {
    title: 'اسم المنتج',
    key: 'itemName',
    width: 200,
    sorter: 'default'
  },
  {
    title: 'الكمية',
    key: 'itemQuan',
    width: 100,
    sorter: 'default'
  },
  {
    title: 'السعر للوحدة',
    key: 'totalPrice',
    width: 120,
    sorter: (row1, row2) => row1.totalPrice - row2.totalPrice,
    render(row) {
      const unitPrice = row.totalPrice / row.itemQuan
      return `${unitPrice.toFixed(2)}₪`
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
  }
]

// تحميل البيانات
onMounted(async () => {
  try {
    loadingOrders.value = true
    loadingDetails.value = true
    loadingTransactions.value = true
    
    // تحميل طلبات البيع
    sellOrders.value = getAlldSellOrders()
    
    // تحميل تفاصيل الطلبات
    sellOrdersDtl.value = getAllSellOrdeDtl()
    
    // تحميل المعاملات
    transactions.value = getItemsTrans()
    
  } catch (error) {
    console.error('خطأ في تحميل البيانات:', error)
  } finally {
    loadingOrders.value = false
    loadingDetails.value = false
    loadingTransactions.value = false
  }
})

// ترقيم الصفحات لطلبات البيع
const ordersPagination = computed(() => ({
  pageSize: 10
}))

// ترقيم الصفحات لتفاصيل الطلبات
const detailsPagination = computed(() => ({
  pageSize: 10
}))

// تصفية طلبات البيع
const filteredSellOrders = computed(() => {
  if (!searchTermOrders.value) return sellOrders.value
  
  const term = searchTermOrders.value.toLowerCase()
  return sellOrders.value.filter(order => 
    String(order.id).includes(term) ||
    (order.serialnumber && order.serialnumber.includes(term)) ||
    (order.selldate && new Date(order.selldate).toLocaleDateString().includes(term)) ||
    getCustomerNameById(order.customerId).toLowerCase().includes(term) ||
    String(order.totalDisc).includes(term) ||
    String(order.totalPrice).includes(term)
  )
})

// تصفية تفاصيل الطلبات
const filteredSellOrdersDtl = computed(() => {
  if (!searchTermDetails.value) return sellOrdersDtl.value
  
  const term = searchTermDetails.value.toLowerCase()
  return sellOrdersDtl.value.filter(detail => 
    String(detail.orderId).includes(term) ||
    (detail.itemName && detail.itemName.toLowerCase().includes(term)) ||
    String(detail.itemQuan).includes(term) ||
    String(detail.totalPrice).includes(term)
  )
})

// تصفية المعاملات (يتم التعامل معها في المكون الخاص بها)
const filteredTransactions = computed(() => {
  if (!searchTermTransactions.value) return transactions.value
  
  const term = searchTermTransactions.value.toLowerCase()
  return transactions.value.filter(trans => 
    (trans.name && trans.name.toLowerCase().includes(term)) ||
    (trans.TransType && trans.TransType.toLowerCase().includes(term)) ||
    (trans.supplier && trans.supplier.toLowerCase().includes(term)) ||
    String(trans.itemId).includes(term) ||
    (trans.date && trans.date.toLowerCase().includes(term))
  )
})
</script>

<style scoped>
.sales-orders-page {
  padding: 20px;
}

:deep(.n-data-table .n-data-table-th) {
  background-color: #f8f9fa;
  font-weight: bold;
}

:deep(.n-data-table .n-data-table-td) {
  vertical-align: middle;
}

:deep(.n-tabs .n-tabs-nav-scroll-content) {
  background-color: white;
  padding: 0 20px;
  border-radius: 8px 8px 0 0;
}
</style>