<template>
  <div class="page-container">
    <div class="page-title-section">
      <div class="page-header-text">
        <n-h1 class="page-title">{{ t('customers.title') }}</n-h1>
        <n-text class="page-subtitle">{{ t('customers.subtitle') }}</n-text>
      </div>
      <n-flex v-if="!isMobile" :size="16">
        <CustomersAddcustomer />
      </n-flex>
    </div>

    <n-card class="main-content-card" :bordered="false">
      <n-flex justify="space-between" align="center" :size="16">
        <n-input v-model:value="searchTerm" :placeholder="t('customers.searchPlaceholder')" clearable
          :style="{ width: isMobile ? '100%' : '320px' }">
          <template #prefix>
            <n-icon>
              <SearchOutline />
            </n-icon>
          </template>
        </n-input>
        <CustomersAddcustomer v-if="isMobile" style="margin-top: 16px; width: 100%;" />
      </n-flex>
    </n-card>

    <div style="margin-top: 16px;">
      <n-card class="main-content-card" :bordered="false">
        <div style="padding: 8px 0;">
          <CustomersTable :listOfCustomers="filteredItems" />
        </div>
      </n-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
useHead({ title: 'إدارة العملاء' })
import { SearchOutline } from '@vicons/ionicons5'
import { useCustomers } from '@/composables/useCustomers'
import { useScreen } from '@/composables/useScreen'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()

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

<style scoped></style>
