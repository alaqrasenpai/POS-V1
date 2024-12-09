
<template>
    <n-button @click="isOpen = true">
        حركات الكميات
    </n-button>
    <n-modal v-model:show="isOpen">
        <n-card style="width: 600px" title="Modal" :bordered="false" size="huge" role="dialog" aria-modal="true">
            <template #header-extra>
                Adding Items !
            </template>
            <InventoryInventoryform :close="closeDialog" :isAdd="true" />

        </n-card>
    </n-modal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
    setup() {
        return {
            isOpen: ref(false)
        }
    }
})
const closeDialog = () => {
    console.log("closed")
    isOpen.value = false;
}

</script>