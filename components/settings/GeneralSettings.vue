<template>
  <div class="general-settings">
    <n-form :model="settings" label-placement="top">
      <n-grid :cols="2" :x-gap="24">
        <n-form-item-gi :label="t('settings.language')">
          <n-select v-model:value="currentLang" :options="langOptions" @update:value="handleLangChange" />
        </n-form-item-gi>

        <n-form-item-gi :label="t('common.currency')">
          <n-select v-model:value="settings.currency" :options="currencyOptions" :placeholder="t('common.search')" />
        </n-form-item-gi>

        <n-form-item-gi :label="t('inventory.taxRate')">
          <n-input-number v-model:value="settings.taxRate" :min="0" :max="100" style="width: 100%" />
        </n-form-item-gi>

        <n-form-item-gi :span="2" :label="t('inventory.footerText')">
          <n-input v-model:value="settings.footerText" type="textarea" :placeholder="t('inventory.footerText')"
            :autosize="{ minRows: 2 }" />
        </n-form-item-gi>
      </n-grid>

      <n-flex justify="end" style="margin-top: 24px;">
        <n-button type="primary" size="large" @click="handleSave" :loading="saving">
          {{ t('common.save') }}
        </n-button>
      </n-flex>
    </n-form>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useMessage } from 'naive-ui'
import { useSettings } from '@/composables/useSettings'
import { useActivityLog } from '@/composables/useActivityLog'
import { useI18n } from '@/composables/useI18n'

const { settings, updateSettings } = useSettings()
const { addLog } = useActivityLog()
const { t, setLocale, currentLocale } = useI18n()
const message = useMessage()
const saving = ref(false)

const currentLang = ref(currentLocale.value)

const langOptions = computed(() => [
  { label: t('settings.arabic'), value: 'ar' },
  { label: t('settings.english'), value: 'en' }
])

const currencyOptions = computed(() => [
  { label: `دينار أردني (د.أ)`, value: 'د.أ' },
  { label: `ريال سعودي (ر.س)`, value: 'ر.س' },
  { label: `دولار أمريكي ($)`, value: '$' },
  { label: `شيكل (₪)`, value: '₪' },
  { label: `جنيه مصري (ج.م)`, value: 'ج.م' }
])

const handleLangChange = (val) => {
  setLocale(val)
}

const handleSave = () => {
  saving.value = true
  setTimeout(() => {
    updateSettings(settings.value)
    addLog(t('settings.title'), t('settings.title'), 'warning')
    message.success(t('common.saveSuccess', 'Settings saved successfully'))
    saving.value = false
  }, 500)
}
</script>
