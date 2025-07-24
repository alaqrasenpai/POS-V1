<template>
    <section class="">
        <div>
            <div>
                <h1>شاشة المنتجات</h1>
            </div>
            <div>
                <div>
                    <n-layout content-style="padding: 24px;" :native-scrollbar="false">
                        <n-flex vertical justify="space-between">
                            <!-- أشرطة الفلاتر -->
                            <n-flex justify="space-between" align="flex-end" wrap>
                                <!-- البحث النصي -->
                                <n-input 
                                    round 
                                    style="width: 20vh;" 
                                    v-model:value="searchTerm" 
                                    type="text"
                                    placeholder="البحث باسم المنتج" 
                                />
                                
                                <!-- فلتر التصنيف -->
                                <n-select
                                    v-model:value="selectedCategory"
                                    :options="categoryOptions"
                                    placeholder="اختر التصنيف"
                                    clearable
                                    style="width: 150px;"
                                    @update:value="handleCategoryFilter"
                                />
                                
                                <!-- فلتر الحالة -->
                                <n-select
                                    v-model:value="selectedStatus"
                                    :options="statusOptions"
                                    placeholder="اختر الحالة"
                                    clearable
                                    style="width: 150px;"
                                    @update:value="handleStatusFilter"
                                />
                                
                                <!-- فلتر السعر -->
                                <n-input-group style="width: 200px;">
                                    <n-input-number
                                        v-model:value="minPrice"
                                        placeholder="الحد الأدنى"
                                        style="width: 50%;"
                                        @update:value="handlePriceFilter"
                                    />
                                    <n-input-number
                                        v-model:value="maxPrice"
                                        placeholder="الحد الأقصى"
                                        style="width: 50%;"
                                        @update:value="handlePriceFilter"
                                    />
                                </n-input-group>
                                
                                <!-- أزرار الإجراءات -->
                                <div>
                                    <ItemAddItem />
                                    <InventoryAddTransToInventory />
                                </div>
                            </n-flex>
                            
                            <!-- جدول المنتجات -->
                            <InventoryInventorytable :listOfItems="filteredItems" />
                        </n-flex>
                    </n-layout>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useInventory } from '@/composables/useInventory'

const searchTerm = ref('')
const selectedCategory = ref(null)
const selectedStatus = ref(null)
const minPrice = ref(null)
const maxPrice = ref(null)

const { getItems, getItemsFiltered } = useInventory()
const items = getItems()

// إعداد خيارات التصنيفات
const categoryOptions = computed(() => {
    const categories = [...new Set(items.map(item => item.category))]
    return categories.map(category => ({
        label: category || 'غير محدد',
        value: category
    }))
})

// إعداد خيارات الحالات
const statusOptions = [
    { label: 'في المخزن', value: 'available' },
    { label: 'غير متوفر', value: 'unavailable' },
    { label: 'محذوف', value: 'deleted' }
]

// دالة للحصول على حالة المنتج
const getItemStatus = (quantity, deleted) => {
    if (deleted) return 'deleted'
    if (quantity > 0) return 'available'
    return 'unavailable'
}

// الفلترة المتقدمة
const filteredItems = computed(() => {
    let result = [...items]
    
    // الفلترة النصية
    if (searchTerm.value) {
        result = getItemsFiltered(searchTerm.value)
    }
    
    // فلتر التصنيف
    if (selectedCategory.value) {
        result = result.filter(item => item.category === selectedCategory.value)
    }
    
    // فلتر الحالة
    if (selectedStatus.value) {
        result = result.filter(item => {
            const status = getItemStatus(item.quantity, item.deleted)
            return status === selectedStatus.value
        })
    }
    
    // فلتر السعر
    if (minPrice.value !== null || maxPrice.value !== null) {
        result = result.filter(item => {
            const price = parseFloat(item.price)
            const min = minPrice.value !== null ? parseFloat(minPrice.value) : -Infinity
            const max = maxPrice.value !== null ? parseFloat(maxPrice.value) : Infinity
            return price >= min && price <= max
        })
    }
    
    return result
})

// دوال التعامل مع الفلاتر
const handleCategoryFilter = (value) => {
    selectedCategory.value = value
}

const handleStatusFilter = (value) => {
    selectedStatus.value = value
}

const handlePriceFilter = () => {
    // سيتم تحديث الفلتر تلقائياً من خلال computed property
}
</script>