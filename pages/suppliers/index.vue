<template>
  <div class="page-container">
    <div class="page-title-section">
      <div class="page-header-text">
        <n-h1 class="page-title">إدارة الموردين</n-h1>
        <n-text class="page-subtitle">إدارة جهات الاتصال، المشتريات، وفواتير التوريد</n-text>
      </div>
      <n-flex v-if="!isMobile" :size="16">
        <SuppliersAddSupplier />
      </n-flex>
    </div>

    <n-card class="main-content-card" :bordered="false">
      <n-flex justify="space-between" align="center" :size="16">
        <n-input v-model:value="searchTerm" placeholder="البحث باسم المورد أو الشركة" clearable
          :style="{ width: isMobile ? '100%' : '320px' }">
          <template #prefix>
            <n-icon>
              <SearchOutline />
            </n-icon>
          </template>
        </n-input>
        <SuppliersAddSupplier v-if="isMobile" style="margin-top: 16px; width: 100%;" />
      </n-flex>
    </n-card>

    <div style="margin-top: 16px;">
      <n-card class="main-content-card" :bordered="false">
        <div style="padding: 8px 0;">
          <SuppliersSupplierstable :listOfItems="filteredSuppliers" />
        </div>
      </n-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
useHead({ title: 'إدارة الموردين' })
import { SearchOutline } from '@vicons/ionicons5'
import { useSuppliers } from '@/composables/useSuppliers'
import { useScreen } from '@/composables/useScreen'

const { isMobile } = useScreen()
const searchTerm = ref('')
const { getSuppliers, getSuppliersFiltered } = useSuppliers()
const suppliers = getSuppliers()

const filteredSuppliers = computed(() => {
  if (!searchTerm.value) {
    return suppliers
  }
  return getSuppliersFiltered(searchTerm.value)
})
</script>

<style scoped></style>
