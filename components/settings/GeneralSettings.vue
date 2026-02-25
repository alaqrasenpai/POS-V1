<template>
  <div class="general-settings">
    <n-form :model="settings" label-placement="top">
      <n-grid :cols="2" :x-gap="24">
        <n-form-item-gi label="العملة المستخدمة">
          <n-select v-model:value="settings.currency" :options="currencyOptions" placeholder="اختر العملة" />
        </n-form-item-gi>

        <n-form-item-gi label="نسبة الضريبة (%)">
          <n-input-number v-model:value="settings.taxRate" :min="0" :max="100" style="width: 100%" />
        </n-form-item-gi>

        <n-form-item-gi :span="2" label="نص التذييل في الفاتورة (Footer)">
          <n-input v-model:value="settings.footerText" type="textarea" placeholder="نص يظهر في أسفل الفاتورة المطبوعة"
            :autosize="{ minRows: 2 }" />
        </n-form-item-gi>
      </n-grid>

      <n-flex justify="end" style="margin-top: 24px;">
        <n-button type="primary" size="large" @click="handleSave" :loading="saving">
          حفظ الإعدادات المالية
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

const currencyOptions = [
  { label: 'دينار أردني (د.أ)', value: 'د.أ' },
  { label: 'ريال سعودي (ر.س)', value: 'ر.س' },
  { label: 'دولار أمريكي ($)', value: '$' },
  { label: 'شيكل (₪)', value: '₪' },
  { label: 'جنيه مصري (ج.م)', value: 'ج.م' }
]

const handleSave = () => {
  saving.value = true
  // في العادة هنا ستقوم بحفظ البيانات لقاعدة بيانات، هنا سنحاكي ذلك
  setTimeout(() => {
    updateSettings(settings.value)
    addLog('تحديث الإعدادات', 'قام المدير بتحديث إعدادات النظام العامة', 'warning')
    message.success('تم حفظ الإعدادات العامة بنجاح')
    saving.value = false
  }, 500)
}
</script>
