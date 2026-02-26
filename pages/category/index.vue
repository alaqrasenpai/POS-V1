<template>
  <div class="page-container">
    <div class="page-title-section">
      <div class="page-header-text">
        <n-h1 class="page-title">{{ t('categories.title') }}</n-h1>
        <n-text class="page-subtitle">{{ t('categories.subtitle') }}</n-text>
      </div>
      <n-flex v-if="!isMobile" :size="16">
        <CategoryAddCategory />
      </n-flex>
    </div>

    <n-card class="main-content-card" :bordered="false">
      <n-flex justify="space-between" align="center" :size="16">
        <n-input v-model:value="searchTerm" :placeholder="t('categories.searchPlaceholder')" clearable
          :style="{ width: isMobile ? '100%' : '320px' }">
          <template #prefix>
            <n-icon>
              <SearchOutline />
            </n-icon>
          </template>
        </n-input>
        <CategoryAddCategory v-if="isMobile" style="margin-top: 16px; width: 100%;" />
      </n-flex>
    </n-card>

    <div style="margin-top: 16px;">
      <n-card class="main-content-card" :bordered="false">
        <div style="padding: 8px 0;">
          <CategoryCategoriestable :listOfCategories="filteredItems" />
        </div>
      </n-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { SearchOutline } from '@vicons/ionicons5'
import { useScreen } from '@/composables/useScreen'
import { useCategory } from '@/composables/useCategory'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()
useHead({ title: t('categories.title') })

const { isMobile } = useScreen()
const searchTerm = ref('')
const { getCategories, getCategoriesFiltered } = useCategory()
const items = getCategories()

const filteredItems = computed(() => {
  return getCategoriesFiltered(searchTerm.value)
})
</script>

<style scoped></style>
