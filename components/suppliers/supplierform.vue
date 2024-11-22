<template>
    <div>
        <form @submit.prevent="handleSubmit">
            <!-- Form Fields -->
            <div>
                <n-form-item label="Name :">
                    <n-input placeholder="Name" v-model:value="newSupplier.name" id="name" required />
                </n-form-item>
            </div>
            <div>
                <n-form-item label="Address :">
                    <n-input placeholder="Address" v-model:value="newSupplier.address" id="address" required />
                </n-form-item>
            </div>
            <div>
                <n-form-item label="Phone Number :">
                    <n-input placeholder="Phone Number" v-model:value="newSupplier.phonenumber" id="phonenumber" type="number"
                        required />
                </n-form-item>
            </div>

            <!-- Submit Button -->
            <n-button type="primary" @click="handleSubmit">
                {{ props.isAdd ? 'Add Supplier' : 'Edit Supplier' }}
            </n-button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMessage } from 'naive-ui'

// Mocked functions from the inventory system
const { getSupplierById, addSupplier, editSupplier } = useSuppliers()

const props = defineProps({
    supplierId: {
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

let newSupplier = ref({
    id: null,
    name: "",
    phonenumber: null,
    address: "",

})

// If editing, load the existing item data
if (!props.isAdd) {
    newSupplier.value = getSupplierById(props.supplierId)
}

// Add item function
const addNewSupplier = () => {
    addSupplier(newSupplier.value)
    props.close() // Close the modal
    resetForm()
}

// Edit item function
const editMySupplier = () => {
    editSupplier(props.supplierId, newSupplier.value)
    props.close() // Close the modal
}

// Reset form function
const resetForm = () => {
    newSupplier.value = {
        id: null,
        name: "",
        phonenumber: null,
        address: "",

    }
}

// Handle form submission
const handleSubmit = () => {
    if (props.isAdd) {
        addNewSupplier()
    } else {
        editMySupplier()
    }
}
</script>
