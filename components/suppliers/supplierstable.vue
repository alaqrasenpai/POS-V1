<template>
    <n-data-table :columns="columns" :data="listOfItems" :pagination="pagination" :bordered="false" :single-line="false"
        class="premium-table" />
</template>

<script setup>
import { h, reactive, computed } from 'vue'
import EditSupplier from './editSupplier.vue'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()

const props = defineProps({
    listOfItems: {
        type: Array,
        required: true
    }
})

const pagination = reactive({
    pageSize: 10
})

const columns = computed(() => [
    {
        title: t('suppliers.supplierName'),
        key: 'name',
        sorter: 'default',
        render(row) {
            return h('span', { style: 'font-weight: 600;' }, row.name)
        }
    },
    {
        title: t('common.address'),
        key: 'address',
    },
    {
        title: t('common.phone'),
        key: 'phonenumber',
    },
    {
        title: t('common.actions'),
        key: 'actions',
        width: 100,
        align: 'center',
        render(row) {
            return h(EditSupplier, { supplierId: row.id })
        }
    }
])
</script>

<style scoped>
:deep(.n-data-table-th) {
    background-color: var(--n-th-color) !important;
    font-weight: 700 !important;
    color: var(--n-th-text-color) !important;
}
</style>
