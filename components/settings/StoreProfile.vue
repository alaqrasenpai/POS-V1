<template>
    <div class="store-profile">
        <n-form :model="settings" label-placement="top">
            <n-grid :cols="2" :x-gap="24">
                <n-form-item-gi :span="2" label="اسم المتجر">
                    <n-input v-model:value="settings.shopName" placeholder="أدخل اسم المحل التجاري" />
                </n-form-item-gi>

                <n-form-item-gi label="رقم الجوال">
                    <n-input v-model:value="settings.phone" placeholder="رقم الموبايل للتواصل" />
                </n-form-item-gi>

                <n-form-item-gi label="البريد الإلكتروني (اختياري)">
                    <n-input v-model:value="settings.email" placeholder="email@example.com" />
                </n-form-item-gi>

                <n-form-item-gi :span="2" label="عنوان المتجر">
                    <n-input v-model:value="settings.address" placeholder="المدينة، الحي، الشارع..." />
                </n-form-item-gi>

                <n-form-item-gi :span="2" label="وصف بسيط للمتجر">
                    <n-input v-model:value="settings.description" type="textarea"
                        placeholder="اكتب نبذة قصيرة عن نشاطك التجاري" :autosize="{ minRows: 2 }" />
                </n-form-item-gi>
            </n-grid>

            <n-flex justify="end" style="margin-top: 24px;">
                <n-button type="primary" size="large" @click="handleSave" :loading="saving">
                    حفظ بيانات المتجر
                </n-button>
            </n-flex>
        </n-form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMessage } from 'naive-ui'
import { useSettings } from '@/composables/useSettings'
import { useActivityLog } from '@/composables/useActivityLog'

const { settings, updateSettings } = useSettings()
const { addLog } = useActivityLog()
const message = useMessage()
const saving = ref(false)

const handleSave = () => {
    saving.value = true
    setTimeout(() => {
        updateSettings(settings.value)
        addLog('تحديث بيانات المتجر', `تم تحديث بيانات المتجر: ${settings.value.shopName}`, 'info')
        message.success('تم تحديث بيانات المتجر بنجاح')
        saving.value = false
    }, 500)
}
</script>
