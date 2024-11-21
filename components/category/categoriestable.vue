<template>
    <n-data-table :columns="columns" :data="listOfCategories" :pagination="false" :bordered="false" />
</template>

<script lang="ts" setup>
import { defineProps, h } from 'vue'
import EditCategory from '../category/editCategory.vue' // Ensure correct import path and case sensitivity
import type { DataTableColumns } from 'naive-ui'

// Define props to receive the list of categories
const props = defineProps({
    listOfCategories: {
        type: Array,
        required: true
    }
})

// Define the columns configuration for the n-data-table
const columns: DataTableColumns<any> = [
    {
        title: 'Id',
        key: 'id', // Match the property in listOfCategories for Id
    },
    {
        title: 'Category Name',
        key: 'name', // Match the property in listOfCategories for Category Name
    },
    {
        title: 'Edit',
        key: 'edit',
        render(row) {
            return h(EditCategory, { categoryId: row.id }) // Render EditItem component with itemId
        }
    }
]
</script>
