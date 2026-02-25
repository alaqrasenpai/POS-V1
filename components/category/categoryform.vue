<template>
  <div class="category-form" style="padding-top: 10px;">
    <n-form :model="newCategory" label-placement="top">
      <n-form-item label="اسم التصنيف">
        <n-input 
          v-model:value="newCategory.name" 
          placeholder="مثال: مشروبات باردة، أجهزة منزلية..." 
          size="large"
        />
      </n-form-item>

      <n-flex justify="end" style="margin-top: 24px;">
        <n-button quaternary @click="props.close()">إلغاء</n-button>
        <n-button 
          type="primary" 
          size="large" 
          @click="handleSubmit"
          style="min-width: 120px;"
        >
          {{ isAdd ? 'إضافة التصنيف' : 'حفظ التغييرات' }}
        </n-button>
      </n-flex>
    </n-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import { useCategory } from '@/composables/useCategory'

const props = defineProps({
    categoryId: {
        type: Number,
        required: false
    },
    close: {
        type: Function,
        required: true
    },
    isAdd: {
        type: Boolean,
        default: true
    }
})

const { addCategory, editCategory, getCategoryById } = useCategory()
const message = useMessage()

const newCategory = ref({
    id: null,
    name: ""
})

onMounted(() => {
  if (!props.isAdd && props.categoryId) {
    const existing = getCategoryById(props.categoryId)
    if (existing) {
      newCategory.value = { ...existing }
    }
  }
})

const handleSubmit = () => {
    if (!newCategory.value.name) {
      message.error('يرجى إدخال اسم التصنيف')
      return
    }

    if (props.isAdd) {
        addCategory({ name: newCategory.value.name })
        message.success('تم إضافة التصنيف بنجاح')
    } else {
        editCategory(props.categoryId, { name: newCategory.value.name })
        message.success('تم تحديث البيانات بنجاح')
    }
    props.close()
}
</script>
