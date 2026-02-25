<template>
    <n-button quaternary circle type="info" @click="isOpen = true">
        <template #icon><n-icon><EditIcon /></n-icon></template>
    </n-button>
    <n-modal v-model:show="isOpen">
        <n-card 
            style="width: 700px" 
            title="تعديل بيانات المنتج" 
            :bordered="false" 
            size="huge" 
            role="dialog" 
            aria-modal="true"
            class="main-content-card"
        >
            <ItemItemform :itemId="props.itemId" :close="closeDialog" :isAdd="false" />
        </n-card>
    </n-modal>
</template>

<script setup>
import { ref } from 'vue'
import { CreateOutline as EditIcon } from '@vicons/ionicons5'

const isOpen = ref(false)

const props = defineProps({
    itemId: {
        type: Number,
        required: true
    }
})

const closeDialog = () => {
    isOpen.value = false
}
</script>
