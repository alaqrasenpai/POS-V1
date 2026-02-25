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
                    <n-select placeholder="Please Select Item" v-model:value="newItem.itemId" :options="itemsList"
                        placement="bottom-start" />
                </n-form-item>
            </div>

            <div>
                <n-form-item label="Suppliers :">
                    <n-select placeholder="Please Select Supplier" v-model:value="newItem.supplier"
                        :options="suppliersList" placement="bottom-start" />
                </n-form-item>
            </div>

            <div>
                <n-form-item label="Transaction Type :">
                    <n-select placeholder="Please Select Type" v-model:value="newItem.TransType" :options="options"
                        placement="bottom-start" />
                </n-form-item>
            </div>

            <div>
                <n-form-item label="Quantity :">
                    <n-input placeholder="Quantity" v-model:value="newItem.quantity" id="quantity" type="number"
                        required />
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
import { ref, defineProps, watch } from 'vue'
import { useMessage } from 'naive-ui'

// Mocked functions from the inventory system
const { getItemById, getItems, addItem, editItem } = useInventory()
const { addItemTrans } = useInventoryTrans()
const { getSuppliers } = useSuppliers()

const items = getItems();
const suppliers = getSuppliers();

const itemsList = items.map(item => ({
    label: item.name,
    value: item.id
}));

const suppliersList = suppliers.map(supplier => ({
    label: supplier.name,
    value: supplier.id
}));

const options = [
    { label: 'Add Quantity', value: 'add' },
    { label: 'Del Quantity', value: 'dell' }
];

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
    TransType: "",
    supplier: "",
    itemId: null,
    quantity: null,
    date: ""
})

// If editing, load the existing item data
if (!props.isAdd) {
    const item = getItemById(props.itemId)
    newItem.value = { ...item }
}

// Add item function
const addNewItem = () => {
    addItemTrans(newItem.value)
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
        TransType: "",
        supplier: "",
        itemId: null,
        quantity: null,
        date: ""
    }
}

// Handle form submission
const handleSubmit = () => {
    if (props.isAdd) {
        addNewItem()
        resetForm();
    } else {
        editMyItem()
    }
}
</script>
