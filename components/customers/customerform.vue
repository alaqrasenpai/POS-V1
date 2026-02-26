<template>
    <div style="padding-top: 10px;">
        <n-form :model="newCustomer" label-placement="top">
            <n-grid :cols="2" :x-gap="16">
                <n-form-item-gi :label="t('customers.customerName')">
                    <n-input :placeholder="t('customers.searchPlaceholder')" v-model:value="newCustomer.name" />
                </n-form-item-gi>
                <n-form-item-gi :label="t('common.phone')">
                    <n-input :placeholder="t('common.phone')" v-model:value="newCustomer.phoneNumber" />
                </n-form-item-gi>

                <n-form-item-gi :label="t('common.email')">
                    <n-input :placeholder="t('common.email')" v-model:value="newCustomer.email" />
                </n-form-item-gi>
                <n-form-item-gi :label="t('common.address')">
                    <n-input :placeholder="t('common.address')" v-model:value="newCustomer.address" />
                </n-form-item-gi>
            </n-grid>

            <n-flex justify="end" style="margin-top: 24px;">
                <n-button quaternary @click="props.close()">{{ t('common.cancel') }}</n-button>
                <n-button type="primary" size="large" @click="handleSubmit" style="min-width: 120px;">
                    {{ props.isAdd ? t('customers.addCustomer') : t('common.save') }}
                </n-button>
            </n-flex>
        </n-form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMessage } from 'naive-ui'
import { useCustomers } from '@/composables/useCustomers'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()
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
        message.error(t('suppliers.enterNameError'))
        return
    }
    if (!newCustomer.value.phoneNumber) {
        message.error(t('common.error')) // Or a specific key
        return
    }

    if (props.isAdd) {
        addCustomer(newCustomer.value)
        message.success(t('customers.addSuccess'))
    } else {
        editCustomer(props.customerId, newCustomer.value)
        message.success(t('customers.updateSuccess'))
    }
    props.close()
}
</script>
