<template>
  <div class="category-form" style="padding-top: 10px;">
    <n-form :model="newCategory" label-placement="top">
      <n-form-item :label="t('categories.categoryName')">
        <n-input v-model:value="newCategory.name" placeholder="مثال: مشروبات باردة، أجهزة منزلية..." size="large" />
      </n-form-item>

      <n-flex justify="end" style="margin-top: 24px;">
        <n-button quaternary @click="props.close()">{{ t('common.cancel') }}</n-button>
        <n-button type="primary" size="large" @click="handleSubmit" style="min-width: 120px;">
          {{ isAdd ? t('categories.addCategory') : t('common.save') }}
        </n-button>
      </n-flex>
    </n-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import { useCategory } from '@/composables/useCategory'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()

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
    message.error(t('categories.enterNameError'))
    return
  }

  if (props.isAdd) {
    addCategory({ name: newCategory.value.name })
    message.success(t('categories.addSuccess'))
  } else {
    editCategory(props.categoryId, { name: newCategory.value.name })
    message.success(t('categories.updateSuccess'))
  }
  props.close()
}
</script>
