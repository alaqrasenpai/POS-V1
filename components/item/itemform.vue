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
                <n-form-item label="Price :">
                    <n-input placeholder="Price" v-model:value="newItem.price" id="price" type="number" required />
                </n-form-item>
            </div>
            <div>
                <n-form-item label="Buy Price :">
                    <n-input placeholder="Buy Price" v-model:value="newItem.buyprice" id="buyprice" type="number" required />
                </n-form-item>
            </div>
            <div>
                <n-form-item label="Color :">
                    <n-input placeholder="Color" v-model:value="newItem.color" id="color" />
                </n-form-item>
            </div>
            <div>
                <n-form-item label="Category :">
                    <n-input placeholder="Category" v-model:value="newItem.category" id="category" />
                </n-form-item>
            </div>
            <div>
                <n-form-item label="Quantity :">
                    <n-input placeholder="Quantity" v-model:value="newItem.quantity" id="quantity" type="number" />
                </n-form-item>
            </div>
            <div>
                <n-checkbox v-model:value="newItem.isFav" id="isFav" size="large" label="Is Favorite" />
            </div>
            <div>
                <n-checkbox v-model:value="newItem.deleted" size="large" label="Is Deleted" id="deleted" type="checkbox" />
            </div>
            <div>
                <n-form-item label="Barcode :">
                    <n-input placeholder="Barcode" v-model:value="newItem.barcode" id="barcode" />
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
const { getItemById, addItem, editItem } = useInventory()

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
    price: null,
    color: "",
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
