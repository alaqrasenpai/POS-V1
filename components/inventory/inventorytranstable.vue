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
        title: 'Transaction Type',
        key: 'TransType', // Match the property in listOfItems for Color
    },
    {
        title: 'Supplier',
        key: 'supplier', // Match the property in listOfItems for Category
    }, {
        title: 'itemId',
        key: 'itemId', // Match the property in listOfItems for Category
    },
    {
        title: 'date',
        key: 'date', // Match the property in listOfItems for Price
    }
]

const searchTerm = ref('');
const { getItems, getItemsFiltered, getFavItems, getItemById } = useInventory();
const items = getItems();

const filteredItems = computed(() => {
    if (!searchTerm.value) {
        return items;
    }
    return getItemsFiltered(searchTerm.value)
});
</script>
