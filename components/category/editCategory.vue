<template>
    <n-button @click="isOpen = true">
        Edit Category
    </n-button>
    <n-modal v-model:show="isOpen">
        <n-card style="width: 600px" title="Modal" :bordered="false" size="huge" role="dialog" aria-modal="true">
            <template #header-extra>
                Category
            </template>
            <CategoryCategoryform :categoryId="props.categoryId" :close="closeDialog" :isAdd="false" />

        </n-card>
    </n-modal>
</template>

<script setup lang="ts">

import { defineComponent, ref } from 'vue'
const isOpen = ref(false)

const props = defineProps({
    categoryId: {
        type: Number,
        required: true
    }
})
const closeDialog = () => {
    console.log("closed")
    isOpen.value = false
}

</script>