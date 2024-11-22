<template>
    
    <n-data-table :columns="columns" :data="listOfItems" :pagination="false" :bordered="false" />
</template>

<script lang="ts" setup>
import { defineProps, h } from 'vue'
import EditItem from '../item/editItem.vue' // Ensure correct import path and case sensitivity
import type { DataTableColumns } from 'naive-ui'
import EditSupplier from './editSupplier.vue';

// Define props to receive the list of items
const props = defineProps({
    listOfItems: {
        type: Array,
        required: true
    }
})

// Define the columns configuration for the n-data-table
const columns: DataTableColumns<any> = [
    {
        title: 'Supplier Name',
        key: 'name', 
    },
    {
        title: 'Address',
        key: 'address', 
    },
    {
        title: 'Phone Number',
        key: 'phonenumber', 
    },
    {
        title: 'Edit',
        key: 'edit',
        render(row) {
            return h(EditSupplier, { supplierId: row.id }) // Render EditItem component with itemId
        }
    }
]
</script>
