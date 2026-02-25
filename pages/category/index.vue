<template>
  <div class="page-container">
    <div class="page-title-section">
      <div class="page-header-text">
        <n-h1 class="page-title">إدارة التصنيفات</n-h1>
        <n-text class="page-subtitle">تنظيم المنتجات في مجموعات لتسهيل الوصول والبيع</n-text>
      </div>
      <n-flex v-if="!isMobile">
        <CategoryAddCategory />
      </n-flex>
    </div>

    <n-card class="main-content-card" :bordered="false">
      <n-flex justify="space-between" align="center">
        <n-input 
          v-model:value="searchTerm" 
          placeholder="البحث باسم التصنيف" 
          clearable
          :style="{ width: isMobile ? '100%' : '300px' }"
        >
          <template #prefix>
            <n-icon><SearchOutline /></n-icon>
          </template>
        </n-input>
        <CategoryAddCategory v-if="isMobile" style="margin-top: 12px; width: 100%;" />
      </n-flex>
    </n-card>

    <n-card class="main-content-card" :bordered="false">
      <CategoryCategoriestable :listOfCategories="filteredItems" />
    </n-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { SearchOutline } from '@vicons/ionicons5'
import { useScreen } from '@/composables/useScreen'
import { useCategory } from '@/composables/useCategory'

const { isMobile } = useScreen()
const searchTerm = ref('')
const { getCategories, getCategoriesFiltered } = useCategory()
const items = getCategories()

const filteredItems = computed(() => {
  return getCategoriesFiltered(searchTerm.value)
})
</script>

<style scoped>
</style>
