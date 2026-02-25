// composables/useActivityLog.js
export const useActivityLog = () => {
    const logs = useState('activity_logs', () => [
        {
            id: 1,
            timestamp: new Date().toLocaleString('ar-DZ'),
            user: 'مدير النظام',
            action: 'تسجيل دخول',
            details: 'دخل المدير للنظام',
            type: 'info'
        }
    ])

    const addLog = (action, details, type = 'info', userName = null) => {
        const newId = logs.value.length ? Math.max(...logs.value.map(l => l.id)) + 1 : 1

        let finalUser = userName
        if (!finalUser) {
            try {
                const userCookie = useCookie('pos_user_data')
                if (userCookie.value) {
                    const userData = typeof userCookie.value === 'string' ? JSON.parse(userCookie.value) : userCookie.value
                    finalUser = userData.name
                }
            } catch (e) {
                console.error('Log user error:', e)
            }
        }

        logs.value.unshift({
            id: newId,
            timestamp: new Date().toLocaleString('ar-DZ'),
            user: finalUser || 'نظام',
            action,
            details,
            type
        })

        if (logs.value.length > 500) {
            logs.value = logs.value.slice(0, 500)
        }
    }

    const getLogs = () => logs.value
    const clearLogs = () => { logs.value = [] }

    return {
        addLog,
        getLogs,
        clearLogs
    }
}
