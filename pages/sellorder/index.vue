<template>
  <div class="sell-order-page">
    <!-- للجوال: استخدام التبويبات للتنقل بين المنتجات والسلة -->
    <n-tabs v-if="isMobile" type="line" animated justify-content="space-evenly" class="mobile-tabs">
      <n-tab-pane name="products" tab="الأصناف">
        <div class="products-section mobile">
          <n-input 
            v-model:value="searchTerm" 
            placeholder="البحث باسم المنتج..." 
            clearable
            class="mobile-search"
          >
            <template #prefix>
              <n-icon><SearchOutline /></n-icon>
            </template>
          </n-input>
          
          <n-flex align="center" style="margin-bottom: 12px; padding: 0 8px;">
            <n-select
              v-model:value="selectedCategory"
              :options="categoryOptions"
              placeholder="التصنيف"
              clearable
              size="small"
              style="flex: 1"
            />
            <n-button quaternary size="small" @click="showFavorites = !showFavorites" :type="showFavorites ? 'primary' : 'default'">
                <template #icon><n-icon><StarIcon /></n-icon></template>
            </n-button>
          </n-flex>
          
          <ItemItems :listOfItems="filteredAndSortedItems" />
        </div>
      </n-tab-pane>
      <n-tab-pane name="cart" tab="السلة">
        <div class="cart-section mobile">
          <cart />
        </div>
      </n-tab-pane>
    </n-tabs>

    <!-- لسطح المكتب -->
    <n-layout v-else has-sider style="height: calc(100vh - 84px); background: transparent;">
      <n-layout-sider 
        width="400" 
        content-style="padding: 0; background: white;" 
        :native-scrollbar="false" 
        bordered
      >
        <cart />
      </n-layout-sider>

      <n-layout-content content-style="padding: 24px; background: #f9fafb;" :native-scrollbar="false">
        <div class="page-title-section">
          <div class="page-header-text">
            <n-h1 class="page-title">شاشة البيع</n-h1>
            <n-text class="page-subtitle">اختر المنتجات لإتمام عملية البيع</n-text>
          </div>
          <n-flex align="center">
            <n-input 
              v-model:value="searchTerm" 
              placeholder="البحث باسم المنتج أو الباركود..." 
              clearable
              style="width: 300px;"
            >
              <template #prefix>
                <n-icon><SearchOutline /></n-icon>
              </template>
            </n-input>
            <ItemAddItem />
          </n-flex>
        </div>

        <!-- الفلاتر -->
        <n-card class="main-content-card" :bordered="false" style="margin-bottom: 20px;">
          <n-flex align="center" justify="space-between">
            <n-flex align="center">
              <n-text depth="3" strong>تصفية النتائج:</n-text>
              <n-select
                v-model:value="selectedCategory"
                :options="categoryOptions"
                placeholder="كل التصنيفات"
                clearable
                style="width: 200px;"
              />
              <n-checkbox v-model:checked="showFavorites">
                المفضلة فقط
              </n-checkbox>
            </n-flex>
            <n-text depth="3">إجمالي النتائج: {{ filteredAndSortedItems.length }}</n-text>
          </n-flex>
        </n-card>

        <ItemItems :listOfItems="filteredAndSortedItems" />
      </n-layout-content>
    </n-layout>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { SearchOutline, Star as StarIcon } from '@vicons/ionicons5'
import { useInventory } from '@/composables/useInventory'
import { useScreen } from '@/composables/useScreen'
import { useCategory } from '@/composables/useCategory'

const { isMobile } = useScreen()
const searchTerm = ref('')
const selectedCategory = ref(null)
const showFavorites = ref(false)

const { getItems, getItemsFiltered } = useInventory()
const { getCategories } = useCategory()
const items = getItems()

// خيارات التصنيفات من السورس الموحد
const categoryOptions = computed(() => {
  return getCategories().map(cat => ({
    label: cat.name,
    value: cat.name
  }))
})

const filteredAndSortedItems = computed(() => {
  let result = [...items]
  
  if (searchTerm.value) {
    // عند البحث: تظهر جميع المنتجات المتطابقة حتى لو كانت الكمية صفر
    result = getItemsFiltered(searchTerm.value)
  } else {
    // الحالة الافتراضية: تظهر فقط المنتجات المتوفرة في المخزن
    result = result.filter(item => item.quantity > 0)
  }
  
  if (selectedCategory.value) {
    result = result.filter(item => item.category === selectedCategory.value)
  }
  
  if (showFavorites.value) {
    result = result.filter(item => item.isFav === true)
  }
  
  result.sort((a, b) => {
    if (a.isFav && !b.isFav) return -1
    if (!a.isFav && b.isFav) return 1
    return a.name.localeCompare(b.name)
  })
  
  return result
})
</script>

<style scoped>
/* Page styles handled globally */

.mobile-tabs {
  background: white;
  height: 100%;
}

.mobile-search {
  margin-bottom: 8px;
  padding: 0 8px;
}

.products-section.mobile,
.cart-section.mobile {
  padding: 12px 4px;
  overflow-y: auto;
  height: calc(100vh - 145px);
}

:deep(.n-layout-sider) {
  background-color: white;
  z-index: 10;
}
</style>