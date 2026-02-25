<template>
  <div class="category-table-wrapper">
    <n-data-table 
      :columns="columns" 
      :data="listOfCategories" 
      :pagination="pagination" 
      :bordered="false"
      class="custom-table"
      scroll-x="400"
    />
  </div>
</template>

<script setup>
import { h } from 'vue'
import { NTag, NSpace } from 'naive-ui'
import CategoryEditCategory from './editCategory.vue'

const props = defineProps({
    listOfCategories: {
        type: Array,
        required: true
    }
})

const pagination = {
  pageSize: 10
}

const columns = [
    {
        title: 'المعرف',
        key: 'id',
        width: 80,
        align: 'center'
    },
    {
        title: 'اسم التصنيف',
        key: 'name',
        render(row) {
            return h(
                NTag,
                {
                    type: 'success',
                    bordered: false,
                    style: { fontWeight: 'bold' }
                },
                { default: () => row.name }
            )
        }
    },
    {
        title: 'الإجراءات',
        key: 'actions',
        width: 120,
        align: 'center',
        render(row) {
            return h(
              NSpace,
              { justify: 'center' },
              { default: () => h(CategoryEditCategory, { categoryId: row.id }) }
            )
        }
    }
]
</script>

<style scoped>
.category-table-wrapper {
  background: var(--n-card-color);
}

:deep(.n-data-table-th) {
  background-color: var(--n-th-color) !important;
  font-weight: bold !important;
  color: var(--n-th-text-color) !important;
}

:deep(.n-data-table-td) {
  padding: 12px 16px !important;
}
</style>
