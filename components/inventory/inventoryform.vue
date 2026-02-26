<template>
    <div style="padding: 12px;">
        <n-form :model="newItem" label-placement="top">
            <n-grid :cols="1" :y-gap="12">
                <n-form-item-gi :label="t('inventory.transName', 'Transition Name')">
                    <n-input :placeholder="t('inventory.enterTransName', 'Enter transition name')"
                        v-model:value="newItem.name" required />
                </n-form-item-gi>

                <n-form-item-gi :label="t('inventory.productName')">
                    <n-select :placeholder="t('inventory.selectProduct', 'Select Product')" :options="itemsList"
                        @update:value="(v) => newItem.itemId = v" filterable />
                </n-form-item-gi>

                <n-form-item-gi :label="t('inventory.supplier') + ' (' + t('common.optional', 'Optional') + ')'">
                    <n-select :placeholder="t('common.search')" :options="suppliersList"
                        @update:value="(v) => newItem.supplierId = v" filterable clearable />
                </n-form-item-gi>

                <n-form-item-gi :label="t('inventory.transType')">
                    <n-select :placeholder="t('inventory.transType')" :options="options"
                        v-model:value="transactionType" />
                </n-form-item-gi>

                <n-form-item-gi :label="t('common.quantity')">
                    <n-input-number :placeholder="t('common.quantity')" v-model:value="newItem.quantity" :min="1"
                        style="width: 100%" />
                </n-form-item-gi>
            </n-grid>

            <n-flex justify="end" style="margin-top: 24px;">
                <n-button quaternary @click="props.close()">{{ t('common.cancel') }}</n-button>
                <n-button type="primary" size="medium" @click="handleSubmit" style="min-width: 100px;">
                    {{ props.isAdd ? t('common.add') : t('common.edit') }}
                </n-button>
            </n-flex>
        </n-form>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMessage } from 'naive-ui'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()

const { getItems, getItemById } = useInventory()
const { getSuppliers } = useSuppliers()
const { addItemTrans } = useInventoryTrans()
const { updateItemQuantity } = useInventory()
const message = useMessage()

const props = defineProps({
    itemId: { type: Number, required: false },
    close: { type: Function, required: true },
    isAdd: { type: Boolean, default: true }
})

const items = getItems()
const suppliers = getSuppliers()

const itemsList = items.map(item => ({ label: item.name, value: item.id }))
const suppliersList = suppliers.map(supplier => ({ label: supplier.name, value: supplier.id }))

const options = computed(() => [
    { label: t('inventory.addQty') + ' (+)', value: 'add' },
    { label: t('inventory.delQty') + ' (-)', value: 'remove' }
])

const transactionType = ref('add')

const newItem = ref({
    name: "",
    itemId: null,
    supplierId: null,
    quantity: 1
})

const handleSubmit = () => {
    if (!newItem.value.itemId) {
        message.warning("يرجى اختيار صنف")
        return
    }

    const item = getItemById(newItem.value.itemId)
    if (!item) return

    const newQty = transactionType.value === 'add'
        ? item.quantity + newItem.value.quantity
        : item.quantity - newItem.value.quantity

    if (newQty < 0) {
        message.error(t('inventory.limitExceededTitle', 'Quantity not available'))
        return
    }

    updateItemQuantity(newItem.value.itemId, newQty)
    addItemTrans({
        name: newItem.value.name || `حركة مخزنية: ${item.name}`,
        TransType: transactionType.value === 'add' ? 'purchase' : 'adjust',
        itemId: newItem.value.itemId,
        date: new Date().toISOString()
    })

    message.success(t('common.success'))
    props.close()
}
</script>
