<script setup>

const isOpen = ref(false)
const closeDialog = () => {
    console.log("closed")
    isOpen.value = false;
}
const props = defineProps({
    itemId: {
        type: Number,
        required: true,
    },
});
</script>

<template>
    <div>
        <button  @click="isOpen = true">تعديل منتج</button>

        <USlideover v-model="isOpen">
            <UCard 
                :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                <template #header>
                    <div >
                        <h3 >
                            Edit item
                        </h3>


                        <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" 
                            @click="isOpen = false" />
                    </div>
                </template>
                <ItemItemform :itemId="itemId" :close="closeDialog" :isAdd="false" />
                <Placeholder  />
            </UCard>
        </USlideover>
    </div>
</template>
