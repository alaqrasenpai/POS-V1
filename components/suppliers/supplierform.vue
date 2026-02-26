<template>
    <div style="padding-top: 10px;">
        <n-form :model="newSupplier" label-placement="top">
            <n-grid :cols="2" :x-gap="16">
                <n-form-item-gi :label="t('suppliers.supplierName')">
                    <n-input :placeholder="t('suppliers.searchPlaceholder')" v-model:value="newSupplier.name" />
                </n-form-item-gi>
                <n-form-item-gi :label="t('common.phone')">
                    <n-input :placeholder="t('common.phone')" v-model:value="newSupplier.phonenumber" />
                </n-form-item-gi>

                <n-form-item-gi :label="t('common.address')">
                    <n-input :placeholder="t('common.address')" v-model:value="newSupplier.address" />
                </n-form-item-gi>
                <n-form-item-gi :label="t('common.notes')">
                    <n-input :placeholder="t('common.notes')" v-model:value="newSupplier.notes" />
                </n-form-item-gi>
            </n-grid>

            <n-flex justify="end" style="margin-top: 24px;">
                <n-button quaternary @click="props.close()">{{ t('common.cancel') }}</n-button>
                <n-button type="primary" size="large" @click="handleSubmit" style="min-width: 120px;">
                    {{ props.isAdd ? t('suppliers.addSupplier') : t('common.save') }}
                </n-button>
            </n-flex>
        </n-form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMessage } from 'naive-ui'
import { useSuppliers } from '@/composables/useSuppliers'

import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()
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
        message.error(t('suppliers.enterNameError'))
        return
    }

    if (props.isAdd) {
        addSupplier(newSupplier.value)
        message.success(t('suppliers.addSuccess'))
    } else {
        editSupplier(props.supplierId, newSupplier.value)
        message.success(t('suppliers.updateSuccess'))
    }
    props.close()
}
</script>
