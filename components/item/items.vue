<template>
    <n-data-table :columns="columns" :data="listOfItems" :pagination="false" :bordered="false" />
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import { h } from 'vue'
import { NButton } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'

const { addItem } = useCart();
const { getItemById } = useInventory();

// Define props to receive the list of items
const props = defineProps({
    listOfItems: {
        type: Array,
        required: true
    }
})

function handleAddtoCart(row: any) {
    const itemInInventory = getItemById(row.id); // الحصول على العنصر من المخزون

    if (itemInInventory && itemInInventory.quantity > 0) {
        // التحقق من أن الكمية المضافة لا تتجاوز الكمية المتاحة
        if (1 <= itemInInventory.quantity) { // هنا نتحقق من أن الكمية المضافة (1) لا تتجاوز الكمية المتاحة
            var tempItem=row   // إنشاء نسخة مؤقتة من العنصر لتجنب تغيير القيمة الأصلية
            addItem(tempItem); // إضافة العنصر إلى السلة
            console.log(`Added ${row.name} to cart`);
        } else {
            alert(`الكمية المطلوبة (1) تتجاوز الكمية المتاحة في المخزون (${itemInInventory.quantity})!`);
        }
    } else {
        alert("الكمية غير متاحة في المخزون!");
    }
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