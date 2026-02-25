<template>
  <div class="page-container">
    <div class="page-title-section">
      <div class="page-header-text">
        <n-h1 class="page-title">إدارة العملاء</n-h1>
        <n-text class="page-subtitle">بيانات العملاء، سجلات الشراء، والمستحقات</n-text>
      </div>
      <n-flex v-if="!isMobile">
        <CustomersAddcustomer />
      </n-flex>
    </div>

    <n-card class="main-content-card" :bordered="false">
      <n-flex justify="space-between" align="center">
        <n-input 
          v-model:value="searchTerm" 
          placeholder="البحث باسم العميل أو رقم الهاتف" 
          clearable
          :style="{ width: isMobile ? '100%' : '300px' }"
        >
          <template #prefix>
            <n-icon><SearchOutline /></n-icon>
          </template>
        </n-input>
        <CustomersAddcustomer v-if="isMobile" style="margin-top: 12px; width: 100%;" />
      </n-flex>
    </n-card>

    <n-card class="main-content-card" :bordered="false">
      <CustomersTable :listOfCustomers="filteredItems" />
    </n-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { SearchOutline } from '@vicons/ionicons5'
import { useCustomers } from '@/composables/useCustomers'
import { useScreen } from '@/composables/useScreen'

const { isMobile } = useScreen()
const searchTerm = ref('')
const { getCustomers, getCustomersFiltered } = useCustomers()
const items = getCustomers()

const filteredItems = computed(() => {
  if (!searchTerm.value) {
    return items
  }
  return getCustomersFiltered(searchTerm.value)
})
</script>

<style scoped>
</style>
