<template>
    <n-button @click="isOpen = true">
        تعديل العميل
    </n-button>
    <n-modal v-model:show="isOpen" role="dialog" aria-modal="true">
        <n-card style="width: 600px" title="Edit Customer" :bordered="false" size="huge">
            <template #header-extra>
                <n-button ghost type="primary" icon="i-heroicons-x-mark-20-solid" @click="closeDialog">
                    Close
                </n-button>
            </template>
            <!-- CustomerForm component to handle Add/Edit functionality -->
            <CustomerForm :customerId="props.customerId" :close="closeDialog" :isAdd="false" />
        </n-card>
    </n-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import CustomerForm from '../customers/CustomerForm.vue' // Ensure correct import path

// State to manage the modal visibility
const isOpen = ref(false)

// Define props to receive the customer ID
const props = defineProps({
    customerId: {
        type: Number,
        required: true
    }
})

// Close the modal
const closeDialog = () => {
    isOpen.value = false
}
</script>
