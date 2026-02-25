import { computed } from 'vue'

export const useTheme = () => {
    // Default to light mode
    const themeMode = useCookie('app-theme-mode', { default: () => 'light' })

    const isDark = computed(() => themeMode.value === 'dark')

    const toggleTheme = () => {
        themeMode.value = themeMode.value === 'dark' ? 'light' : 'dark'
        updateBodyClass(themeMode.value)
    }

    const setInitialTheme = () => {
        updateBodyClass(themeMode.value)
    }

    const updateBodyClass = (mode) => {
        if (typeof document !== 'undefined') {
            document.body.classList.remove('light-theme', 'dark-theme')
            document.body.classList.add(`${mode}-theme`)
        }
    }

    return {
        isDark,
        toggleTheme,
        setInitialTheme
    }
}
