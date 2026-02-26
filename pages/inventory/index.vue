<template>
  <div class="page-container">
    <div class="page-title-section">
      <div class="page-header-text">
        <n-h1 class="page-title">{{ t('inventory.title') }}</n-h1>
        <n-text class="page-subtitle">{{ t('inventory.subtitle') }}</n-text>
      </div>
      <n-flex v-if="!isMobile" :size="16">
        <ItemAddItem />
        <InventoryAddTransToInventory />
      </n-flex>
    </div>

    <!-- الفلاتر -->
    <n-card class="main-content-card" :bordered="false">
      <n-grid :cols="isMobile ? 1 : isTablet ? 2 : 4" :x-gap="20" :y-gap="20">
        <n-gi>
          <n-input v-model:value="searchTerm" :placeholder="t('inventory.searchPlaceholder')" clearable>
            <template #prefix>
              <n-icon>
                <SearchOutline />
              </n-icon>
            </template>
          </n-input>
        </n-gi>
        <n-gi>
          <n-select v-model:value="selectedCategory" :options="categoryOptions" :placeholder="t('common.categories')"
            clearable />
        </n-gi>
        <n-gi>
          <n-select v-model:value="selectedStatus" :options="statusOptions" :placeholder="t('common.status')"
            clearable />
        </n-gi>
        <n-gi>
          <div style="display: flex; gap: 8px; width: 100%;">
            <n-input-number v-model:value="minPrice" :placeholder="t('common.price') + ' (-)'" style="flex: 1;" />
            <n-input-number v-model:value="maxPrice" :placeholder="t('common.price') + ' (+)'" style="flex: 1;" />
          </div>
        </n-gi>
      </n-grid>

      <!-- أزرار الإجراءات للموبايل -->
      <n-flex v-if="isMobile" style="margin-top: 24px" vertical :size="12">
        <ItemAddItem />
        <InventoryAddTransToInventory />
      </n-flex>
    </n-card>

    <!-- جدول المنتجات -->
    <div style="margin-top: 16px;">
      <n-card class="main-content-card" :bordered="false">
        <div style="padding: 8px 0;">
          <InventoryInventorytable :listOfItems="filteredItems" />
        </div>
      </n-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { SearchOutline } from '@vicons/ionicons5'
import { useInventory } from '@/composables/useInventory'
import { useScreen } from '@/composables/useScreen'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()
useHead({ title: t('inventory.title') })

const { isMobile, isTablet } = useScreen()
const searchTerm = ref('')
const selectedCategory = ref(null)
const selectedStatus = ref(null)
const minPrice = ref(null)
const maxPrice = ref(null)

const { getItems, getItemsFiltered } = useInventory()
const items = getItems()

const { getCategories } = useCategory()

// إعداد خيارات التصنيفات
const categoryOptions = computed(() => {
  return getCategories().map(cat => ({
    label: cat.name,
    value: cat.name
  }))
})

// إعداد خيارات الحالات
const statusOptions = computed(() => [
  { label: t('inventory.inStock'), value: 'available' },
  { label: t('inventory.notAvailable'), value: 'unavailable' },
  { label: t('inventory.deleted'), value: 'deleted' }
])

// دالة للحصول على حالة المنتج
const getItemStatus = (quantity, deleted) => {
  if (deleted) return 'deleted'
  if (quantity > 0) return 'available'
  return 'unavailable'
}

// الفلترة المتقدمة
const filteredItems = computed(() => {
  let result = [...items]

  // الفلترة النصية
  if (searchTerm.value) {
    result = getItemsFiltered(searchTerm.value)
  }

  // فلتر التصنيف
  if (selectedCategory.value) {
    result = result.filter(item => item.category === selectedCategory.value)
  }

  // فلتر الحالة
  if (selectedStatus.value) {
    result = result.filter(item => {
      const status = getItemStatus(item.quantity, item.deleted)
      return status === selectedStatus.value
    })
  }

  // فلتر السعر
  if (minPrice.value !== null || maxPrice.value !== null) {
    result = result.filter(item => {
      const price = parseFloat(item.price)
      const min = minPrice.value !== null ? parseFloat(minPrice.value) : -Infinity
      const max = maxPrice.value !== null ? parseFloat(maxPrice.value) : Infinity
      return price >= min && price <= max
    })
  }

  return result
})

// دوال التعامل مع الفلاتر
const handleCategoryFilter = (value) => {
  selectedCategory.value = value
}

const handleStatusFilter = (value) => {
  selectedStatus.value = value
}

const handlePriceFilter = () => {
  // سيتم تحديث الفلتر تلقائياً من خلال computed property
}
</script>

<style scoped>
.inventory-page {
  padding: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.filter-card {
  margin-bottom: 24px;
}

:deep(.n-card) {
  border-radius: 12px;
}
</style>