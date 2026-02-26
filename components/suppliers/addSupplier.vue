<template>
    <n-button type="primary" @click="isOpen = true">
        {{ t('suppliers.addSupplier') }}
    </n-button>
    <n-modal v-model:show="isOpen">
        <n-card style="width: 600px" :title="t('suppliers.addSupplier')" :bordered="false" size="huge" role="dialog"
            aria-modal="true" class="main-content-card">
            <SuppliersSupplierform :close="closeDialog" :isAdd="true" />
        </n-card>
    </n-modal>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()
const isOpen = ref(false)

const closeDialog = () => {
    isOpen.value = false
}
</script>