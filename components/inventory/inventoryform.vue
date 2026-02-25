<template>
    <div>
        <form @submit.prevent="handleSubmit">
            <!-- Form Fields -->
            <div>
                <n-form-item label="Name :">
                    <n-input placeholder="Name" v-model:value="newItem.name" id="name" required />
                </n-form-item>
            </div>
            <div>
                <n-form-item label="Items :">
                    <n-select placeholder="Please Select Item" :options="itemsList" @update:value="handleUpdateValue"
                        placement="bottom-start" />
                </n-form-item>
            </div>

            <div>
                <n-form-item label="Suppliers :">
                    <n-select placeholder="Please Select Supplier" :options="suppliersList"
                        @update:value="handleUpdateValue" placement="bottom-start" />
                </n-form-item>
            </div>
            <div>
                <n-form-item label="Transaction Type :">
                    <n-select placeholder="Please Select Type" :options="options" @update:value="handleUpdateValue"
                        placement="bottom-start" />
                </n-form-item>
            </div>
            <div>
                <n-form-item label="Quantity :">
                    <n-input placeholder="Quantity" v-model:value="newItem.price" id="price" type="number" required />
                </n-form-item>
            </div>

            <!-- Submit Button -->
            <n-button type="primary" @click="handleSubmit">
                {{ props.isAdd ? 'Add Item' : 'Edit Item' }}
            </n-button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMessage } from 'naive-ui'

// Mocked functions from the inventory system
const { getItemById, getItems, addItem, editItem } = useInventory()
const { addItemTrans } = useInventoryTrans()
const { getSuppliers } = useSuppliers()
const items = getItems();
const suppliers = getSuppliers();
// console.log(items[0].name)
const itemsList = items.map(item => ({
    label: item.name,
    value: item.id
}));
const suppliersList = suppliers.map(supplier => ({
    label: supplier.name,
    value: supplier.id
}));
const options = [
    {
        label: 'Add Quantity',
        value: '1',
    },
    {
        label: 'Del Quantity',
        value: '0'
    }];
console.log(itemsList)
const props = defineProps({
    itemId: {
        type: Number,
        required: false
    },
    close: {
        type: Function,
        required: true
    },
    isAdd: {
        type: Boolean,
        required: false
    }
})

let newItem = ref({
    id: null,
    name: "",
    category: "",
    buyprice: null,
    quantity: 0,
    isFav: 0,
    barcode: "",
    deleted: false
})

// If editing, load the existing item data
if (!props.isAdd) {
    newItem.value = getItemById(props.itemId)
}

// Add item function
const addNewItem = () => {
    addItem(newItem.value)
    props.close() // Close the modal
    resetForm()
}

// Edit item function
const editMyItem = () => {
    editItem(props.itemId, newItem.value)
    props.close() // Close the modal
}

// Reset form function
const resetForm = () => {
    newItem.value = {
        id: null,
        name: "",
        price: null,
        color: "",
        category: "",
        buyprice: null,
        quantity: 0,
        isFav: 0,
        barcode: "",
        deleted: false
    }
}

// Handle form submission
const handleSubmit = () => {
    if (props.isAdd) {
        addNewItem()
    } else {
        editMyItem()
    }
}
</script>
