<template>
    <div>
        <button  label="Open" @click="isOpen = true" >add customer</button>

        <UModal v-model="isOpen">
            <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                <template #header>
                    <Placeholder  />
                    test
                </template>

                <Placeholder />
                <div>
                    lots of data
                </div>

                <template #footer>
                    <Placeholder  />
                </template>
            </UCard>
        </UModal>
    </div>
</template>
<script setup lang="ts">
const isOpen = ref(false)
</script>
