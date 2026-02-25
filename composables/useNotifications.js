// composables/useNotifications.js
import { watch, computed } from 'vue'

export const useNotifications = () => {
    const notifications = useState('system_notifications', () => [])

    const { getChecks, getInstallments } = usePayments()

    // جعل البيانات مستجيبة للمراقبة
    const checksList = computed(() => getChecks())
    const installmentsList = computed(() => getInstallments())

    const checkDueDates = () => {
        const today = new Date().toISOString().split('T')[0]
        const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

        const newNotifications = []

        // فحص الشيكات المستحقة
        const checks = checksList.value
        checks.forEach(check => {
            if (check.status === 'pending') {
                if (check.dueDate === today) {
                    newNotifications.push({
                        id: `check-${check.id}`,
                        title: 'استحقاق شيك اليوم',
                        message: `الشيك رقم ${check.checkNumber} للعميل ${check.customerName} يستحق اليوم بمبلغ ${check.amount} د.أ`,
                        type: 'warning',
                        link: '/payments/checks'
                    })
                } else if (check.dueDate === tomorrow) {
                    newNotifications.push({
                        id: `check-tmw-${check.id}`,
                        title: 'استحقاق شيك غداً',
                        message: `الشيك رقم ${check.checkNumber} للعميل ${check.customerName} يستحق غداً بمبلغ ${check.amount} د.أ`,
                        type: 'info',
                        link: '/payments/checks'
                    })
                }
            }
        })

        notifications.value = newNotifications
    }

    // مراقبة أي تغيير في الشيكات أو الأقساط لتحديث التنبيهات فوراً
    watch([checksList, installmentsList], () => {
        checkDueDates()
    }, { deep: true })

    const clearNotification = (id) => {
        notifications.value = notifications.value.filter(n => n.id !== id)
    }

    return {
        notifications,
        checkDueDates,
        clearNotification
    }
}
