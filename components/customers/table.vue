<template>
    <n-data-table :columns="columns" :data="listOfCustomers" :pagination="false" :bordered="false" />
</template>

<script lang="ts" setup>
import { defineProps, h } from 'vue'
import EditCustomer from '../customers/EditCustomer.vue'  // Ensure correct import path and case sensitivity
import type { DataTableColumns } from 'naive-ui'

// Define props to receive the list of customers
const props = defineProps({
    listOfCustomers: {
        type: Array,
        required: true
    }
})

// Define the columns configuration for the n-data-table
const columns: DataTableColumns<any> = [
    {
        title: 'اسم العميل',
        key: 'name', // Match the property in listOfCustomers for Customer name
    },
    {
        title: 'البريد الإلكتروني',
        key: 'email', // Match the property in listOfCustomers for Email
    },
    {
        title: 'العنوان',
        key: 'address', // Match the property in listOfCustomers for Address
    },
    {
        title: 'رقم الهاتف',
        key: 'phoneNumber', // Match the property in listOfCustomers for Phone number
    },
    {
        title: 'إجراءات',
        key: 'edit',
        render(row) {
            return h(EditCustomer, { customerId: row.id }) // Render EditCustomer component with customerId
        }
    }
]
</script>
