<template>
    <n-button type="primary" @click="isOpen = true">
        إضافة عميل جديد
    </n-button>
    <n-modal v-model:show="isOpen">
        <n-card 
            style="width: 600px" 
            title="إضافة عميل جديد" 
            :bordered="false" 
            size="huge" 
            role="dialog" 
            aria-modal="true" 
            class="main-content-card"
        >
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
