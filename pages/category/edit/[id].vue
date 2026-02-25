<template>
  <div class="edit-category-page">
    <div class="page-header">
      <n-button quaternary circle @click="router.back()">
        <template #icon>
          <n-icon><BackIcon /></n-icon>
        </template>
      </n-button>
      <n-h1 style="margin: 0">تعديل التصنيف</n-h1>
    </div>

    <n-card class="form-card" v-if="categoryId">
      <CategoryCategoryform 
        :isAdd="false" 
        :categoryId="categoryId" 
        :close="handleSuccess" 
      />
    </n-card>
    <n-alert v-else type="error" title="خطأ">
      لم يتم العثور على معرف التصنيف
    </n-alert>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowForwardOutline as BackIcon } from '@vicons/ionicons5'

const route = useRoute()
const router = useRouter()

const categoryId = computed(() => {
  return route.params.id ? parseInt(route.params.id) : null
})

const handleSuccess = () => {
  router.push('/category')
}
</script>

<style scoped>
.edit-category-page {
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.form-card {
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
</style>
