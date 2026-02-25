<template>
    <n-button quaternary circle type="info" @click="isOpen = true">
        <template #icon><n-icon><EditIcon /></n-icon></template>
    </n-button>
    <n-modal v-model:show="isOpen">
        <n-card 
            style="width: 600px" 
            title="تعديل بيانات المورد" 
            :bordered="false" 
            size="huge" 
            role="dialog" 
            aria-modal="true"
            class="main-content-card"
        >
            <SuppliersSupplierform :supplierId="props.supplierId" :close="closeDialog" :isAdd="false" />
        </n-card>
    </n-modal>
</template>

<script setup>
import { ref } from 'vue'
import { CreateOutline as EditIcon } from '@vicons/ionicons5'

const isOpen = ref(false)

const props = defineProps({
    supplierId: {
        type: Number,
        required: true
    }
})

const closeDialog = () => {
    isOpen.value = false
}
</script>
