<!-- <script setup>
const isOpen = ref(false)
const closeDialog = () => {
    console.log("closed")
    isOpen.value = false;
}
</script>

<template>
    <div>
        <button  @click="isOpen = true">اضافة تصنيف</button>

        <USlideover  v-model="isOpen">
            <UCard 
                :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                <template #header>
                    <div >
                        <h3 >
                            Adding Categories
                        </h3>


                        <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" 
                            @click="isOpen = false" />
                    </div>
                </template>
                <Placeholder />
            </UCard>
        </USlideover>
    </div>
</template> -->

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