<template>
    <n-data-table :columns="columns" :data="listOfCustomers" :pagination="false" :bordered="false" />
</template>

<script lang="ts" setup>
import { h, computed } from 'vue'
import EditCustomer from './editcustomer.vue'  // Corrected case sensitivity for Linux/GitHub Actions
import type { DataTableColumns } from 'naive-ui'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()

// Define props to receive the list of customers
const props = defineProps({
    listOfCustomers: {
        type: Array,
        required: true
    }
})

// Define the columns configuration for the n-data-table
const columns = computed<DataTableColumns<any>>(() => [
    {
        title: t('customers.customerName'),
        key: 'name', // Match the property in listOfCustomers for Customer name
    },
    {
        title: t('common.email'),
        key: 'email', // Match the property in listOfCustomers for Email
    },
    {
        title: t('common.address'),
        key: 'address', // Match the property in listOfCustomers for Address
    },
    {
        title: t('common.phone'),
        key: 'phoneNumber', // Match the property in listOfCustomers for Phone number
    },
    {
        title: t('common.actions'),
        key: 'edit',
        render(row) {
            return h(EditCustomer, { customerId: row.id }) // Render EditCustomer component with customerId
        }
    }
])
</script>
