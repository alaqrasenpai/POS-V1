<template>
    <n-button @click="showModal = true">
        Add Category
    </n-button>
    <n-modal v-model:show="showModal">
        <n-card style="width: 600px" title="Modal" :bordered="false" size="huge" role="dialog" aria-modal="true">
            <template #header-extra>
                Category
            </template>
            <CategoryCategoryform :close="closeDialog" :isAdd="true" />

        </n-card>
    </n-modal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
    setup() {
        return {
            showModal: ref(false)
        }
    }
})
</script>