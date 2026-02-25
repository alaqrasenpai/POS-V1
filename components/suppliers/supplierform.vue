<template>
    <div style="padding-top: 10px;">
        <n-form :model="newSupplier" label-placement="top">
            <n-grid :cols="2" :x-gap="16">
                <n-form-item-gi label="اسم المورد / الشركة">
                    <n-input placeholder="مثال: شركة القدس للتجارة" v-model:value="newSupplier.name" />
                </n-form-item-gi>
                <n-form-item-gi label="رقم الهاتف">
                    <n-input placeholder="رقم التواصل" v-model:value="newSupplier.phonenumber" />
                </n-form-item-gi>
                
                <n-form-item-gi label="العنوان">
                    <n-input placeholder="المدينة، الشارع" v-model:value="newSupplier.address" />
                </n-form-item-gi>
                <n-form-item-gi label="ملاحظات">
                    <n-input placeholder="أي معلومات إضافية" v-model:value="newSupplier.notes" />
                </n-form-item-gi>
            </n-grid>

            <n-flex justify="end" style="margin-top: 24px;">
                <n-button quaternary @click="props.close()">إلغاء</n-button>
                <n-button type="primary" size="large" @click="handleSubmit" style="min-width: 120px;">
                    {{ props.isAdd ? 'إضافة المورد' : 'حفظ التغييرات' }}
                </n-button>
            </n-flex>
        </n-form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMessage } from 'naive-ui'
import { useSuppliers } from '@/composables/useSuppliers'

const { getSupplierById, addSupplier, editSupplier } = useSuppliers()
const message = useMessage()

const props = defineProps({
    supplierId: {
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

let newSupplier = ref({
    id: null,
    name: "",
    phonenumber: "",
    address: "",
    notes: ""
})

if (!props.isAdd) {
    const supplier = getSupplierById(props.supplierId)
    if (supplier) {
        newSupplier.value = { ...supplier }
    }
}

const handleSubmit = () => {
    if (!newSupplier.value.name) {
        message.error('يرجى إدخال اسم المورد')
        return
    }

    if (props.isAdd) {
        addSupplier(newSupplier.value)
        message.success('تم إضافة المورد بنجاح')
    } else {
        editSupplier(props.supplierId, newSupplier.value)
        message.success('تم تحديث بيانات المورد')
    }
    props.close()
}
</script>
