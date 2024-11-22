<template>
    <n-button @click="isOpen = true">
        تعديل الموزع
    </n-button>
    <n-modal v-model:show="isOpen" role="dialog" aria-modal="true">
        <n-card style="width: 600px" title="Edit Supplier" :bordered="false" size="huge">
            <template #header-extra>
                <n-button ghost type="primary" icon="i-heroicons-x-mark-20-solid" @click="closeDialog">
                    Close
                </n-button>
            </template>
            <SuppliersSupplierform :supplierId="supplierId" :close="closeDialog" :isAdd="false" />
        </n-card>
    </n-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const isOpen = ref(false)

const props = defineProps({
    supplierId: {
        type: Number,
        required: true
    }
})

const closeDialog = () => {
    console.log("closed")
    isOpen.value = false
}
</script>
