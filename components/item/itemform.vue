<template>
    <div style="padding-top: 10px;">
        <n-form :model="newItem" label-placement="top">
            <n-grid :cols="2" :x-gap="16">
                <n-form-item-gi label="اسم المنتج">
                    <n-input placeholder="أدخل اسم المنتج" v-model:value="newItem.name" />
                </n-form-item-gi>
                <n-form-item-gi label="الباركود">
                    <n-input placeholder="رقم الباركود" v-model:value="newItem.barcode" />
                </n-form-item-gi>

                <n-form-item-gi label="سعر البيع">
                    <n-input-number placeholder="سعر البيع" v-model:value="newItem.price" :min="0"
                        style="width: 100%" />
                </n-form-item-gi>
                <n-form-item-gi label="سعر الشراء">
                    <n-input-number placeholder="سعر التكلفة" v-model:value="newItem.buyprice" :min="0"
                        style="width: 100%" />
                </n-form-item-gi>

                <n-form-item-gi label="التصنيف">
                    <n-select v-model:value="newItem.category" :options="categoryOptions" placeholder="اختر التصنيف"
                        filterable clearable />
                </n-form-item-gi>
                <n-form-item-gi label="الكمية">
                    <n-input-number placeholder="الكمية المتوفرة" v-model:value="newItem.quantity" :min="0"
                        style="width: 100%" />
                </n-form-item-gi>

                <n-form-item-gi label="اللون (اختياري)">
                    <n-input placeholder="لون المنتج" v-model:value="newItem.color" />
                </n-form-item-gi>

                <n-form-item-gi>
                    <n-space vertical>
                        <n-checkbox v-model:checked="newItem.isFav">إضافة للمفضلة</n-checkbox>
                        <n-checkbox v-model:checked="newItem.deleted" v-if="!props.isAdd">تحويل المنتج
                            لمحذوف</n-checkbox>
                    </n-space>
                </n-form-item-gi>
            </n-grid>

            <n-flex justify="end" style="margin-top: 24px;">
                <n-button quaternary @click="props.close()">إلغاء</n-button>
                <n-button type="primary" size="large" @click="handleSubmit" style="min-width: 120px;">
                    {{ props.isAdd ? 'إضافة المنتج' : 'حفظ التغييرات' }}
                </n-button>
            </n-flex>
        </n-form>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMessage } from 'naive-ui'

const { getItemById, addItem, editItem } = useInventory()
const { getCategories } = useCategory()
const message = useMessage()

const props = defineProps({
    itemId: {
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

const categoryOptions = computed(() => {
    return getCategories().map(cat => ({
        label: cat.name,
        value: cat.name
    }))
})

let newItem = ref({
    id: null,
    name: "",
    price: null,
    color: "",
    category: null,
    buyprice: null,
    quantity: 0,
    isFav: false,
    barcode: "",
    deleted: false
})

if (!props.isAdd) {
    const item = getItemById(props.itemId)
    if (item) {
        newItem.value = { ...item }
    }
}

const handleSubmit = () => {
    if (!newItem.value.name) {
        message.error('يرجى إدخال اسم المنتج')
        return
    }
    if (newItem.value.price === null) {
        message.error('يرجى إدخال سعر البيع')
        return
    }

    if (props.isAdd) {
        addItem(newItem.value)
        message.success('تم إضافة المنتج بنجاح')
    } else {
        editItem(props.itemId, newItem.value)
        message.success('تم تحديث بيانات المنتج')
    }
    props.close()
}
</script>
