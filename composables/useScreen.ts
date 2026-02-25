import { ref, onMounted, onUnmounted, computed } from 'vue'

export const useScreen = () => {
    const windowWidth = ref(0)

    const updateWidth = () => {
        if (typeof window !== 'undefined') {
            windowWidth.value = window.innerWidth
        }
    }

    onMounted(() => {
        updateWidth()
        window.addEventListener('resize', updateWidth)
    })

    onUnmounted(() => {
        window.removeEventListener('resize', updateWidth)
    })

    const isMobile = computed(() => windowWidth.value < 768)
    const isTablet = computed(() => windowWidth.value >= 768 && windowWidth.value < 1024)
    const isDesktop = computed(() => windowWidth.value >= 1024)

    return {
        windowWidth,
        isMobile,
        isTablet,
        isDesktop
    }
}
