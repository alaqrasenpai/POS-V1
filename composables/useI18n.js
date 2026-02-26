import { ref, computed } from 'vue'
import ar from '@/locales/ar'
import en from '@/locales/en'

const translations = { ar, en }

export const useI18n = () => {
    // Current locale state, default to 'ar'
    const locale = useCookie('app-locale', { default: () => 'ar' })

    // Computed translations for current locale
    const t_data = computed(() => translations[locale.value] || translations.ar)

    /**
     * Translation function
     * Usage: t('common.save')
     */
    const t = (path, params = {}) => {
        const keys = path.split('.')
        let current = t_data.value

        for (const key of keys) {
            if (current[key] === undefined) return path
            current = current[key]
        }

        if (typeof current === 'string' && params) {
            return current.replace(/\{(\w+)\}/g, (_, k) => params[k] !== undefined ? params[k] : `{${k}}`)
        }

        return current
    }

    /**
     * Toggle or set language
     */
    const setLocale = (newLocale) => {
        if (translations[newLocale]) {
            locale.value = newLocale
        }
    }

    const currentLocale = computed(() => locale.value)
    const isRTL = computed(() => locale.value === 'ar')

    return {
        t,
        setLocale,
        currentLocale,
        isRTL
    }
}
