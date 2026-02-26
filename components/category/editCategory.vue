<template>
  <div>
    <n-button quaternary circle type="warning" @click="isOpen = true">
      <template #icon>
        <n-icon>
          <EditIcon />
        </n-icon>
      </template>
    </n-button>

    <n-modal v-model:show="isOpen" transform-origin="center">
      <n-card style="width: 500px; max-width: 95vw; border-radius: 16px;" :title="t('categories.editCategory')"
        :bordered="false" size="huge" role="dialog" aria-modal="true">
        <template #header-extra>
          <n-button quaternary circle @click="isOpen = false">
            <template #icon>
              <n-icon>
                <CloseIcon />
              </n-icon>
            </template>
          </n-button>
        </template>

        <CategoryCategoryform :categoryId="props.categoryId" :close="() => isOpen = false" :isAdd="false" />
      </n-card>
    </n-modal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { CreateOutline as EditIcon, CloseOutline as CloseIcon } from '@vicons/ionicons5'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()
const isOpen = ref(false)
const props = defineProps({
  categoryId: {
    type: Number,
    required: true
  }
})
</script>