<template>
    <div>
        <!-- أزرار التحكم في الجدول -->
        <n-flex justify="space-between" style="margin-bottom: 16px;">
            <n-flex>
                <!-- زر تصدير البيانات -->
                <n-button @click="exportData">
                    <template #icon>
                        <n-icon><DownloadOutline /></n-icon>
                    </template>
                    تصدير البيانات
                </n-button>
                
                <!-- زر طباعة الجدول -->
                <n-button @click="printTable">
                    <template #icon>
                        <n-icon><PrintOutline /></n-icon>
                    </template>
                    طباعة
                </n-button>
            </n-flex>
        </n-flex>

        <!-- جدول المنتجات مع خاصية الفرز -->
        <n-data-table 
            :columns="columns" 
            :data="listOfItems" 
            :pagination="pagination"
            :bordered="true"
            :single-line="false"
            :scroll-x="1200"
            ref="tableRef"
        />
    </div>
</template>

<script lang="ts" setup>
import { defineProps, h, ref, computed } from 'vue'
import { NButton, NTag, useMessage } from 'naive-ui'
import type { DataTableColumns, DataTableInst } from 'naive-ui'
import EditItem from '../item/editItem.vue'
import { DownloadOutline, PrintOutline } from '@vicons/ionicons5'

// تعريف Props
const props = defineProps({
    listOfItems: {
        type: Array,
        required: true
    }
})

// المرجع إلى الجدول لاستخدام الوظائف
const tableRef = ref<DataTableInst | null>(null)
const message = useMessage()

// دالة للحصول على حالة المنتج
const getStatus = (quantity, deleted) => {
    if (deleted) {
        return { text: 'محذوف', color: 'error' }
    } else if (quantity > 0) {
        return { text: 'في المخزن', color: 'success' }
    } else {
        return { text: 'غير متوفر', color: 'warning' }
    }
}

// دالة لتصدير البيانات كملف CSV
const exportData = () => {
    try {
        // تحويل البيانات إلى CSV
        const headers = ['اسم المنتج', 'التصنيف', 'السعر', 'الكمية', 'الحالة']
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
        link.setAttribute('download', 'المنتجات.csv')
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        message.success('تم تصدير البيانات بنجاح')
    } catch (error) {
        message.error('حدث خطأ أثناء تصدير البيانات')
    }
}

// دالة لطباعة الجدول
const printTable = () => {
    try {
        window.print()
        message.success('جاري الطباعة...')
    } catch (error) {
        message.error('حدث خطأ أثناء الطباعة')
    }
}

// تكوين أعمدة الجدول مع خاصية الفرز
const columns: DataTableColumns<any> = [
    {
        title: 'اسم المنتج',
        key: 'name',
        sorter: 'default',
        width: 200,
        fixed: 'left'
    },
    {
        title: 'التصنيف',
        key: 'category',
        sorter: 'default',
        width: 150
    },
    {
        title: 'السعر',
        key: 'price',
        sorter: (row1, row2) => row1.price - row2.price,
        render(row) {
            return `${row.price}₪`
        },
        width: 120
    },
    {
        title: 'الكمية',
        key: 'quantity',
        sorter: 'default',
        width: 120
    },
    {
        title: 'الحالة',
        key: 'status',
        sorter: (row1, row2) => {
            const status1 = getStatus(row1.quantity, row1.deleted).text
            const status2 = getStatus(row2.quantity, row2.deleted).text
            return status1.localeCompare(status2)
        },
        render(row) {
            const status = getStatus(row.quantity, row.deleted)
            return h(NTag, {
                type: status.color,
                size: 'small'
            }, {
                default: () => status.text
            })
        },
        width: 150
    },
    {
        title: 'تعديل',
        key: 'edit',
        render(row) {
            return h(EditItem, { itemId: row.id })
        },
        width: 120,
        fixed: 'right'
    }
]

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
