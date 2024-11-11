<template>
    <n-button @click="isOpen = true">
        تعديل منتج
    </n-button>
    <n-modal v-model:show="isOpen" role="dialog" aria-modal="true">
        <n-card style="width: 600px" title="Edit Item" :bordered="false" size="huge">
            <template #header-extra>
                <n-button ghost type="primary" icon="i-heroicons-x-mark-20-solid" @click="closeDialog">
                    Close
                </n-button>
            </template>
            <ItemItemform :itemId="itemId" :close="closeDialog" :isAdd="false" />
        </n-card>
    </n-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const isOpen = ref(false)

// Define props to receive the item ID
const props = defineProps({
    itemId: {
        type: Number,
        required: true
    }
})

const closeDialog = () => {
    console.log("closed")
    isOpen.value = false
}
</script>
