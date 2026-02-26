<template>
  <div class="page-container">
    <div class="page-title-section">
      <div class="page-header-text">
        <n-h1 class="page-title">{{ t('tabs.title') }}</n-h1>
        <n-text class="page-subtitle">{{ t('tabs.subtitle') }}</n-text>
      </div>
    </div>

    <n-card class="main-content-card" :bordered="false">
      <n-tabs type="line" animated size="large" justify-content="start" style="padding: 12px 0;">
        <!-- تبويب طلبات البيع -->
        <n-tab-pane name="sell-orders" :tab="t('tabs.sellOrders')">
          <div style="padding: 24px 0">
            <n-flex justify="end" style="margin-bottom: 24px">
              <n-input v-model:value="searchTermOrders" :placeholder="t('common.search')" clearable
                :style="{ width: isMobile ? '100%' : '320px' }">
                <template #prefix>
                  <n-icon>
                    <SearchOutline />
                  </n-icon>
                </template>
              </n-input>
            </n-flex>
            <n-data-table :columns="ordersColumns" :data="filteredSellOrders" :pagination="ordersPagination"
              :bordered="false" :scroll-x="1200" :loading="loadingOrders" />
          </div>
        </n-tab-pane>

        <!-- تبويب تفاصيل الطلبات -->
        <n-tab-pane name="order-details" :tab="t('tabs.orderDetails')">
          <div style="padding: 24px 0">
            <n-flex justify="end" style="margin-bottom: 24px">
              <n-input v-model:value="searchTermDetails" :placeholder="t('common.search')" clearable
                :style="{ width: isMobile ? '100%' : '320px' }">
                <template #prefix>
                  <n-icon>
                    <SearchOutline />
                  </n-icon>
                </template>
              </n-input>
            </n-flex>
            <n-data-table :columns="detailsColumns" :data="filteredSellOrdersDtl" :pagination="detailsPagination"
              :bordered="false" :scroll-x="1000" :loading="loadingDetails" />
          </div>
        </n-tab-pane>

        <!-- تبويب المعاملات -->
        <n-tab-pane name="transactions" :tab="t('inventory.movements', 'Movements')">
          <div style="padding: 24px 0">
            <n-flex justify="end" style="margin-bottom: 24px">
              <n-input v-model:value="searchTermTransactions" :placeholder="t('common.search')" clearable
                :style="{ width: isMobile ? '100%' : '320px' }">
                <template #prefix>
                  <n-icon>
                    <SearchOutline />
                  </n-icon>
                </template>
              </n-input>
            </n-flex>
            <InventoryInventorytranstable :listOfItems="filteredTransactions" :searchTerm="searchTermTransactions" />
          </div>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, h } from 'vue'
import { SearchOutline } from '@vicons/ionicons5'
import { useCustomers } from '@/composables/useCustomers'
import { useSellOrder } from '@/composables/useSellOrder'
import { useSellOrderDtl } from '@/composables/useSellOrderDtl'
import { useInventoryTrans } from '@/composables/useInventoryTrans'
import { useSettings } from '@/composables/useSettings'
import { useScreen } from '@/composables/useScreen'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()
useHead({ title: t('tabs.title') })

const { isMobile } = useScreen()
const { settings } = useSettings()
const { getCustomerById } = useCustomers()
const { getAlldSellOrders } = useSellOrder()
const { getAllSellOrdeDtl } = useSellOrderDtl()
const { getItemsTrans } = useInventoryTrans()

const loadingOrders = ref(false)
const loadingDetails = ref(false)
const loadingTransactions = ref(false)

const searchTermOrders = ref('')
const searchTermDetails = ref('')
const searchTermTransactions = ref('')

const sellOrders = ref([])
const sellOrdersDtl = ref([])
const transactions = ref([])

const getCustomerNameById = (customerId) => {
  if (!customerId) return t('common.unknown')
  const customer = getCustomerById(customerId)
  return customer ? customer.name : t('common.unknown')
}

const ordersColumns = computed(() => [
  {
    title: t('common.id'),
    key: 'id',
    width: 100,
    sorter: 'default',
    fixed: 'left'
  },
  {
    title: t('invoicesReturns.serialNum'),
    key: 'serialnumber',
    width: 150,
    sorter: 'default'
  },
  {
    title: t('common.date'),
    key: 'selldate',
    width: 180,
    sorter: (row1, row2) => new Date(row1.selldate) - new Date(row2.selldate),
    render(row) {
      if (!row.selldate) return '-'
      const date = new Date(row.selldate)
      return date.toLocaleDateString()
    }
  },
  {
    title: t('customers.customerName'),
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
    title: t('cart.discount'),
    key: 'totalDisc',
    width: 120,
    sorter: 'default',
    render(row) {
      return `${row.totalDisc || 0} ${settings.value.currency}`
    }
  },
  {
    title: t('common.total'),
    key: 'totalPrice',
    width: 120,
    sorter: 'default',
    fixed: 'right',
    render(row) {
      return `${row.totalPrice || 0} ${settings.value.currency}`
    }
  }
])

const detailsColumns = computed(() => [
  {
    title: t('common.id'),
    key: 'orderId',
    width: 100,
    sorter: 'default',
    fixed: 'left'
  },
  {
    title: t('inventory.productName'),
    key: 'itemName',
    width: 200,
    sorter: 'default'
  },
  {
    title: t('common.quantity'),
    key: 'itemQuan',
    width: 100,
    sorter: 'default'
  },
  {
    title: t('common.price'),
    key: 'totalPrice',
    width: 120,
    sorter: (row1, row2) => row1.totalPrice - row2.totalPrice,
    render(row) {
      const unitPrice = row.totalPrice / row.itemQuan
      return `${unitPrice.toFixed(2)} ${settings.value.currency}`
    }
  },
  {
    title: t('common.total'),
    key: 'totalPrice',
    width: 120,
    sorter: 'default',
    fixed: 'right',
    render(row) {
      return `${row.totalPrice || 0} ${settings.value.currency}`
    }
  }
])

onMounted(async () => {
  loadingOrders.value = true
  loadingDetails.value = true
  loadingTransactions.value = true
  sellOrders.value = getAlldSellOrders()
  sellOrdersDtl.value = getAllSellOrdeDtl()
  transactions.value = getItemsTrans()
  loadingOrders.value = false
  loadingDetails.value = false
  loadingTransactions.value = false
})

const ordersPagination = computed(() => ({ pageSize: 10 }))
const detailsPagination = computed(() => ({ pageSize: 10 }))

const filteredSellOrders = computed(() => {
  if (!searchTermOrders.value) return sellOrders.value
  const term = searchTermOrders.value.toLowerCase()
  return sellOrders.value.filter(order =>
    String(order.id).includes(term) ||
    (order.serialnumber && order.serialnumber.includes(term)) ||
    getCustomerNameById(order.customerId).toLowerCase().includes(term)
  )
})

const filteredSellOrdersDtl = computed(() => {
  if (!searchTermDetails.value) return sellOrdersDtl.value
  const term = searchTermDetails.value.toLowerCase()
  return sellOrdersDtl.value.filter(detail =>
    String(detail.orderId).includes(term) ||
    (detail.itemName && detail.itemName.toLowerCase().includes(term))
  )
})

const filteredTransactions = computed(() => {
  if (!searchTermTransactions.value) return transactions.value
  const term = searchTermTransactions.value.toLowerCase()
  return transactions.value.filter(trans =>
    (trans.name && trans.name.toLowerCase().includes(term)) ||
    (trans.TransType && trans.TransType.toLowerCase().includes(term))
  )
})
</script>

<style scoped>
:deep(.n-data-table .n-data-table-th) {
  background-color: var(--n-th-color);
  font-weight: 700;
  color: var(--n-text-color-2);
}

:deep(.n-tabs-tab) {
  font-weight: 600;
}
</style>