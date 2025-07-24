<template>
  <div class="sell-order-page">
    <n-layout style="height: 100vh">
      <!-- رأس الصفحة -->
      <n-layout-header style="height: 64px; padding: 16px 24px" bordered>
        <n-page-header>
          <n-h2 style="margin: 0;">شاشة البيع</n-h2>
        </n-page-header>
      </n-layout-header>

      <!-- المحتوى الرئيسي -->
      <n-layout position="absolute" style="top: 64px; bottom: 0" has-sider>
        <!-- لوحة السلة (الجانب الأيمن) -->
        <n-layout-sider 
          width="350" 
          content-style="padding: 16px;" 
          :native-scrollbar="false" 
          bordered
          show-trigger="bar"
        >
          <cart />
        </n-layout-sider>

        <!-- منطقة المنتجات (الجانب الأيسر) -->
        <n-layout content-style="padding: 16px;" :native-scrollbar="false">
          <!-- شريط الأدوات والبحث -->
          <n-card style="margin-bottom: 16px;">
            <n-flex justify="space-between" align="center">
              <!-- البحث -->
              <n-input 
                v-model:value="searchTerm" 
                placeholder="البحث باسم المنتج" 
                clearable
                style="width: 300px;"
              >
                <template #prefix>
                  <n-icon><SearchOutline /></n-icon>
                </template>
              </n-input>

              <!-- أزرار الإجراءات -->
              <n-flex>
                <ItemAddItem />
                <n-button @click="refreshItems">
                  <template #icon>
                    <n-icon><RefreshOutline /></n-icon>
                  </template>
                  تحديث
                </n-button>
              </n-flex>
            </n-flex>
          </n-card>

          <!-- فلاتر إضافية -->
          <n-card style="margin-bottom: 16px;">
            <n-flex align="center" size="small">
              <n-text strong>الفلاتر:</n-text>
              
              <!-- فلتر حسب التصنيف -->
              <n-select
                v-model:value="selectedCategory"
                :options="categoryOptions"
                placeholder="التصنيف"
                clearable
                style="width: 150px;"
                size="small"
              />
              
              <!-- عرض المنتجات المفضلة فقط -->
              <n-checkbox v-model:checked="showFavorites">
                المنتجات المفضلة فقط
              </n-checkbox>
            </n-flex>
          </n-card>

          <!-- جدول المنتجات -->
          <n-card title="المنتجات">
            <ItemItems :listOfItems="filteredAndSortedItems" />
          </n-card>
        </n-layout>
      </n-layout>
    </n-layout>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { SearchOutline, RefreshOutline } from '@vicons/ionicons5'
import { useInventory } from '@/composables/useInventory'

const searchTerm = ref('')
const selectedCategory = ref(null)
const showFavorites = ref(false)

const { getItems, getItemsFiltered } = useInventory()
const items = getItems()

// خيارات التصنيفات
const categoryOptions = computed(() => {
  const categories = [...new Set(items.map(item => item.category).filter(Boolean))]
  return categories.map(category => ({
    label: category,
    value: category
  }))
})

// الفلترة والترتيب
const filteredAndSortedItems = computed(() => {
  let result = [...items]
  
  // تطبيق البحث
  if (searchTerm.value) {
    result = getItemsFiltered(searchTerm.value)
  }
  
  // تطبيق فلتر التصنيف
  if (selectedCategory.value) {
    result = result.filter(item => item.category === selectedCategory.value)
  }
  
  // تطبيق فلتر المنتجات المفضلة
  if (showFavorites.value) {
    result = result.filter(item => item.isFav === true)
  }
  
  // ترتيب المنتجات: المفضلة أولاً، ثم حسب الاسم
  result.sort((a, b) => {
    if (a.isFav && !b.isFav) return -1
    if (!a.isFav && b.isFav) return 1
    return a.name.localeCompare(b.name)
  })
  
  return result
})

// تحديث المنتجات
const refreshItems = () => {
  // يمكن إضافة منطق لتحديث البيانات من الخادم هنا
  console.log('تحديث المنتجات')
}

// مراقبة التغييرات في الفلاتر
watch([searchTerm, selectedCategory, showFavorites], () => {
  // يمكن إضافة منطق إضافي عند تغيير الفلاتر
})
</script>

<style scoped>
.sell-order-page {
  height: 100vh;
}

:deep(.n-layout-header) {
  background-color: white;
}

:deep(.n-layout-sider) {
  background-color: #fafafa;
}

:deep(.n-card) {
  border-radius: 8px;
}
</style>