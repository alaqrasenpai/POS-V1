<template>
    <div style="padding: 12px;">
        <n-form :model="newItem" label-placement="top">
            <n-grid :cols="1" :y-gap="12">
                <n-form-item-gi label="اسم الحركة">
                    <n-input placeholder="أدخل اسم الحركة" v-model:value="newItem.name" required />
                </n-form-item-gi>

                <n-form-item-gi label="الصنف">
                    <n-select placeholder="اختر الصنف" :options="itemsList" @update:value="(v) => newItem.itemId = v"
                        filterable />
                </n-form-item-gi>

                <n-form-item-gi label="المورد (اختياري)">
                    <n-select placeholder="اختر المورد" :options="suppliersList"
                        @update:value="(v) => newItem.supplierId = v" filterable clearable />
                </n-form-item-gi>

                <n-form-item-gi label="نوع العملية">
                    <n-select placeholder="اختر نوع العملية" :options="options" v-model:value="transactionType" />
                </n-form-item-gi>

                <n-form-item-gi label="الكمية">
                    <n-input-number placeholder="الكمية" v-model:value="newItem.quantity" :min="1"
                        style="width: 100%" />
                </n-form-item-gi>
            </n-grid>

            <n-flex justify="end" style="margin-top: 24px;">
                <n-button quaternary @click="props.close()">إلغاء</n-button>
                <n-button type="primary" size="medium" @click="handleSubmit" style="min-width: 100px;">
                    {{ props.isAdd ? 'إضافة حركة' : 'تحديث الحركة' }}
                </n-button>
            </n-flex>
        </n-form>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMessage } from 'naive-ui'

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

const options = [
    { label: 'إضافة للمخزون (+)', value: 'add' },
    { label: 'سحب من المخزون (-)', value: 'remove' }
]

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
        message.error("الكمية المطلوبة غير متوفرة في المخزن")
        return
    }

    updateItemQuantity(newItem.value.itemId, newQty)
    addItemTrans({
        name: newItem.value.name || `حركة مخزنية: ${item.name}`,
        TransType: transactionType.value === 'add' ? 'purchase' : 'adjust',
        itemId: newItem.value.itemId,
        date: new Date().toISOString()
    })

    message.success("تم تحديث المخزون بنجاح")
    props.close()
}
</script>
