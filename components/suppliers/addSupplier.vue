<template>
    <n-button type="primary" @click="isOpen = true">
        إضافة مورد جديد
    </n-button>
    <n-modal v-model:show="isOpen">
        <n-card 
            style="width: 600px" 
            title="إضافة مورد جديد" 
            :bordered="false" 
            size="huge" 
            role="dialog" 
            aria-modal="true"
            class="main-content-card"
        >
            <SuppliersSupplierform :close="closeDialog" :isAdd="true" />
        </n-card>
    </n-modal>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)

const closeDialog = () => {
    isOpen.value = false
}
</script>