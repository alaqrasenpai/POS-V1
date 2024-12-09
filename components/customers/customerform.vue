<template>
    <div>
        <form @submit.prevent="handleSubmit">
            <!-- Form Fields -->
            <div>
                <n-form-item label="Name :">
                    <n-input placeholder="Name" v-model:value="newCustomer.name" id="name" required />
                </n-form-item>
            </div>
            <div>
                <n-form-item label="Email :">
                    <n-input placeholder="Email" v-model:value="newCustomer.email" id="email" required />
                </n-form-item>
            </div>
            <div>
                <n-form-item label="Phone Number :">
                    <n-input placeholder="Phone Number" v-model:value="newCustomer.phoneNumber" id="phoneNumber" required />
                </n-form-item>
            </div>
            <div>
                <n-form-item label="Address :">
                    <n-input placeholder="Address" v-model:value="newCustomer.address" id="address" />
                </n-form-item>
            </div>


            <!-- Submit Button -->
            <n-button type="primary" @click="handleSubmit">
                {{ props.isAdd ? 'Add Customer' : 'Edit Customer' }}
            </n-button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMessage } from 'naive-ui'

// Mocked functions for customer management
const { getCustomerById, addCustomer, editCustomer } = useCustomers()

const props = defineProps({
    customerId: {
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

let newCustomer = ref({
    id: null,
    name: "",
    email: "",
    phoneNumber: "",
    address: "",

})

// If editing, load the existing customer data
if (!props.isAdd) {
    newCustomer.value = getCustomerById(props.customerId)
}

// Add customer function
const addNewCustomer = () => {
    addCustomer(newCustomer.value)
    props.close() // Close the modal
    resetForm()
}

// Edit customer function
const editMyCustomer = () => {
    editCustomer(props.customerId, newCustomer.value)
    props.close() // Close the modal
}

// Reset form function
const resetForm = () => {
    newCustomer.value = {
        id: null,
        name: "",
        email: "",
        phoneNumber: "",
        address: "",

    }
}

// Handle form submission
const handleSubmit = () => {
    if (props.isAdd) {
        addNewCustomer()
    } else {
        editMyCustomer()
    }
}
</script>
