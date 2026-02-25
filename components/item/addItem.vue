<template>
    <n-button type="primary" @click="isOpen = true">
        إضافة منتج جديد
    </n-button>
    <n-modal v-model:show="isOpen">
        <n-card 
            style="width: 700px" 
            title="إضافة منتج جديد للمخزون" 
            :bordered="false" 
            size="huge" 
            role="dialog" 
            aria-modal="true"
            class="main-content-card"
        >
            <ItemItemform :close="closeDialog" :isAdd="true" />
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