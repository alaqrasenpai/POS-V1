<template>
    <div>
        <!-- أزرار التحكم في الجدول -->
        <n-flex justify="space-between" style="margin-bottom: 16px;">
            <n-flex>
                <!-- زر تصدير البيانات -->
                <n-button @click="exportData">
                    <template #icon>
                        <n-icon>
                            <DownloadOutline />
                        </n-icon>
                    </template>
                    {{ t('common.export') }}
                </n-button>

                <!-- زر طباعة الجدول -->
                <n-button @click="printTable">
                    <template #icon>
                        <n-icon>
                            <PrintOutline />
                        </n-icon>
                    </template>
                    {{ t('common.print') }}
                </n-button>
            </n-flex>
        </n-flex>

        <!-- جدول المنتجات مع خاصية الفرز -->
        <n-data-table :columns="columns" :data="listOfItems" :pagination="pagination" :bordered="true"
            :single-line="false" :scroll-x="1200" ref="tableRef" />
    </div>
</template>

<script lang="ts" setup>
import { h, ref, computed } from 'vue'
import { NButton, NTag, useMessage } from 'naive-ui'
import type { DataTableColumns, DataTableInst } from 'naive-ui'
import EditItem from '../item/editItem.vue'
import { DownloadOutline, PrintOutline } from '@vicons/ionicons5'
import { useSettings } from '@/composables/useSettings'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()
const { getCurrency } = useSettings()
const currency = getCurrency()

interface InventoryItem {
    id: number;
    name: string;
    category: string;
    price: number;
    quantity: number;
    deleted: boolean;
    images?: string[];
}

// تعريف Props
const props = defineProps<{
    listOfItems: InventoryItem[]
}>()

// المرجع إلى الجدول لاستخدام الوظائف
const tableRef = ref<DataTableInst | null>(null)
const message = useMessage()

// دالة للحصول على حالة المنتج
const getStatus = (quantity: number, deleted: boolean) => {
    if (deleted) {
        return { text: t('inventory.deleted'), color: 'error' }
    } else if (quantity > 0) {
        return { text: t('inventory.inStock'), color: 'success' }
    } else {
        return { text: t('inventory.notAvailable'), color: 'warning' }
    }
}

// دالة لتصدير البيانات كملف CSV
const exportData = () => {
    try {
        // تحويل البيانات إلى CSV
        const headers = [t('inventory.productName'), t('common.categories'), t('common.price'), t('common.quantity'), t('common.status')]
        const rows = props.listOfItems.map(item => [
            item.name,
            item.category,
            item.price,
            item.quantity,
            getStatus(item.quantity, item.deleted).text
        ])

        let csvContent = headers.join(',') + '\n'
        rows.forEach(row => {
            csvContent += row.join(',') + '\n'
        })

        // إنشاء ملف وتحميله
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.setAttribute('href', url)
        link.setAttribute('download', `${t('inventory.title')}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        message.success(t('inventory.exportSuccess'))
    } catch (error) {
        message.error(t('inventory.exportError'))
    }
}

// دالة لطباعة الجدول
const printTable = () => {
    try {
        window.print()
        message.success(t('inventory.printSuccess'))
    } catch (error) {
        message.error(t('inventory.printError'))
    }
}

// تكوين أعمدة الجدول مع خاصية الفرز
const columns = computed<DataTableColumns<any>>(() => [
    {
        title: t('inventory.productImage'),
        key: 'image',
        width: 80,
        render(row) {
            if (row.images && row.images.length > 0) {
                return h('img', { src: row.images[0], style: 'width: 40px; height: 40px; border-radius: 6px; object-fit: cover;' })
            }
            return h('div', { style: 'width: 40px; height: 40px; border-radius: 6px; background: var(--n-action-color); display: flex; align-items: center; justify-content: center; font-size: 10px; color: var(--n-text-color-3);' }, t('inventory.none'))
        }
    },
    {
        title: t('inventory.productName'),
        key: 'name',
        sorter: 'default',
        width: 200,
        fixed: 'left'
    },
    {
        title: t('common.categories'),
        key: 'category',
        sorter: 'default',
        width: 150
    },
    {
        title: t('common.price'),
        key: 'price',
        sorter: (row1, row2) => row1.price - row2.price,
        render(row) {
            return `${row.price} ${currency}`
        },
        width: 120
    },
    {
        title: t('common.quantity'),
        key: 'quantity',
        sorter: 'default',
        width: 120
    },
    {
        title: t('common.status'),
        key: 'status',
        sorter: (row1, row2) => {
            const status1 = getStatus(row1.quantity, row1.deleted).text
            const status2 = getStatus(row2.quantity, row2.deleted).text
            return status1.localeCompare(status2)
        },
        render(row) {
            const status = getStatus(row.quantity, row.deleted)
            return h(NTag, {
                type: status.color as 'default' | 'error' | 'success' | 'warning' | 'primary' | 'info',
                size: 'small'
            }, {
                default: () => status.text
            })
        },
        width: 150
    },
    {
        title: t('common.edit'),
        key: 'edit',
        render(row) {
            return h(EditItem, { itemId: row.id })
        },
        width: 120,
        fixed: 'right'
    }
])

// تكوين ترقيم الصفحات
const pagination = computed(() => ({
    pageSize: 10
}))
</script>

<style scoped>
/* تغيير لون الصفوف حسب الحالة */
:deep(.n-data-table .n-data-table-tr) {
    &[data-row-key] {
        /* يمكن إضافة أنماط إضافية هنا إذا لزم */
    }
}

/* تنسيق خاص لطباعة الجدول */
@media print {
    body * {
        visibility: hidden;
    }

    .n-data-table,
    .n-data-table * {
        visibility: visible;
    }

    .n-data-table {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
    }
}
</style>
