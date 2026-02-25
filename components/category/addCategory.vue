<template>
  <div>
    <n-button type="primary" @click="showModal = true">
      <template #icon>
        <n-icon><AddIcon /></n-icon>
      </template>
      إضافة تصنيف جديد
    </n-button>
    
    <n-modal v-model:show="showModal" transform-origin="center">
      <n-card
        style="width: 500px; max-width: 95vw; border-radius: 16px;"
        title="إضافة تصنيف منتجات"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <template #header-extra>
          <n-button quaternary circle @click="showModal = false">
            <template #icon>
              <n-icon><CloseIcon /></n-icon>
            </template>
          </n-button>
        </template>
        
        <CategoryCategoryform :close="() => showModal = false" :isAdd="true" />
      </n-card>
    </n-modal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { AddOutline as AddIcon, CloseOutline as CloseIcon } from '@vicons/ionicons5'

const showModal = ref(false)
</script>