<template>
    <n-data-table :columns="columns" :data="listOfItems" :pagination="false" :bordered="false" />
</template>

<script lang="ts" setup>
import { defineProps, h } from 'vue'
import EditItem from '../item/editItem.vue' // Ensure correct import path and case sensitivity
import type { DataTableColumns } from 'naive-ui'

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
        title: 'Product name',
        key: 'name', // Match the property in listOfItems for Product name
    },
    {
        title: 'Color',
        key: 'color', // Match the property in listOfItems for Color
    },
    {
        title: 'Category',
        key: 'category', // Match the property in listOfItems for Category
    },{
        title: 'quantity',
        key: 'quantity', // Match the property in listOfItems for Category
    },
    {
        title: 'Price',
        key: 'price', // Match the property in listOfItems for Price
    },
    {
        title: 'Edit',
        key: 'edit',
        render(row) {
            return h(EditItem, { itemId: row.id }) // Render EditItem component with itemId
        }
    }
]
</script>
