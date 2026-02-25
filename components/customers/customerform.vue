<template>
    <div style="padding-top: 10px;">
        <n-form :model="newCustomer" label-placement="top">
            <n-grid :cols="2" :x-gap="16">
                <n-form-item-gi label="اسم العميل">
                    <n-input placeholder="الاسم الكامل" v-model:value="newCustomer.name" />
                </n-form-item-gi>
                <n-form-item-gi label="رقم الهاتف">
                    <n-input placeholder="رقم الجوال" v-model:value="newCustomer.phoneNumber" />
                </n-form-item-gi>
                
                <n-form-item-gi label="البريد الإلكتروني">
                    <n-input placeholder="example@mail.com" v-model:value="newCustomer.email" />
                </n-form-item-gi>
                <n-form-item-gi label="العنوان">
                    <n-input placeholder="المدينة / المنطقة" v-model:value="newCustomer.address" />
                </n-form-item-gi>
            </n-grid>

            <n-flex justify="end" style="margin-top: 24px;">
                <n-button quaternary @click="props.close()">إلغاء</n-button>
                <n-button type="primary" size="large" @click="handleSubmit" style="min-width: 120px;">
                    {{ props.isAdd ? 'إضافة عميل جديد' : 'حفظ التعديلات' }}
                </n-button>
            </n-flex>
        </n-form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMessage } from 'naive-ui'
import { useCustomers } from '@/composables/useCustomers'

const { getCustomerById, addCustomer, editCustomer } = useCustomers()
const message = useMessage()

const props = defineProps({
    customerId: {
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

let newCustomer = ref({
    id: null,
    name: "",
    email: "",
    phoneNumber: "",
    address: ""
})

if (!props.isAdd) {
    const customer = getCustomerById(props.customerId)
    if (customer) {
        newCustomer.value = { ...customer }
    }
}

const handleSubmit = () => {
    if (!newCustomer.value.name) {
        message.error('يرجى إدخال اسم العميل')
        return
    }
    if (!newCustomer.value.phoneNumber) {
        message.error('يرجى إدخال رقم الهاتف')
        return
    }

    if (props.isAdd) {
        addCustomer(newCustomer.value)
        message.success('تم إضافة العميل بنجاح')
    } else {
        editCustomer(props.customerId, newCustomer.value)
        message.success('تم تحديث بيانات العميل')
    }
    props.close()
}
</script>
