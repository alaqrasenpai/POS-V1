<template>
    <n-data-table :columns="columns" :data="listOfItems" :pagination="false" :bordered="false" />
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import { h } from 'vue'
import { NButton } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'

const { addItem } = useCart();



// Define props to receive the list of items
const props = defineProps({
    listOfItems: {
        type: Array,
        required: true
    }
})

// Define a custom function to handle edit action
function handleAddtoCart(row: any) {
    console.log(`Add ${row.name}`)
    row.quantity = 1;
    addItem(row);
    // toast.add({ title: 'Added to cart!' })
    // You can add other edit logic here, like routing or opening a modal
}

// Define the columns configuration for the n-data-table
const columns: DataTableColumns<any> = [
    {
        title: 'Product name',
        key: 'name' // Adjust key to match the property in listOfItems
    },
    {
        title: 'Color',
        key: 'color' // Adjust key to match the property in listOfItems
    },
    {
        title: 'Category',
        key: 'category' // Adjust key to match the property in listOfItems
    },
    {
        title: 'Price',
        key: 'price' // Adjust key to match the property in listOfItems
    },
    {
        title: 'Add',
        key: 'add',
        render(row) {
            return h(
                NButton,
                {
                    strong: true,
                    tertiary: true,
                    size: 'small',
                    onClick: () => handleAddtoCart(row)
                },
                { default: () => 'Add' }
            )
        }
    }
]
</script>