<template>
    <n-button type="primary" @click="isOpen = true">
        {{ t('customers.addCustomer') }}
    </n-button>
    <n-modal v-model:show="isOpen">
        <n-card style="width: 600px" :title="t('customers.addCustomer')" :bordered="false" size="huge" role="dialog"
            aria-modal="true" class="main-content-card">
            <CustomersCustomerform :close="closeDialog" :isAdd="true" />
        </n-card>
    </n-modal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
// import CustomerForm from '../customers/CustomerForm.vue' // Ensure correct import path
import { CustomersCustomerform } from '#build/components';
import { useI18n } from '@/composables/useI18n'

export default defineComponent({
    setup() {
        const { t } = useI18n()
        const isOpen = ref(false)

        // Close the modal when done
        const closeDialog = () => {
            isOpen.value = false
        }

        return {
            isOpen,
            closeDialog,
            t
        }
    }
})
</script>
