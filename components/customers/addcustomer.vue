<template>
    <n-button @click="isOpen = true">
        اضافة عميل
    </n-button>
    <n-modal v-model:show="isOpen">
        <n-card style="width: 600px" title="Add Customer" :bordered="false" size="huge" role="dialog" aria-modal="true">
            <template #header-extra>
                Adding Customer!
            </template>
            <!-- CustomerForm component to handle Add functionality -->
            <CustomersCustomerform :close="closeDialog" :isAdd="true" />
        </n-card>
    </n-modal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
// import CustomerForm from '../customers/CustomerForm.vue' // Ensure correct import path
import { CustomersCustomerform } from '#build/components';

export default defineComponent({
    setup() {
        const isOpen = ref(false)

        // Close the modal when done
        const closeDialog = () => {
            isOpen.value = false
        }

        return {
            isOpen,
            closeDialog
        }
    }
})
</script>
