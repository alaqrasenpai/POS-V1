// composables/useUsers.js
export const useUsers = () => {
    // تعريف الصلاحيات المتاحة في النظام
    const availablePermissions = [
        { label: 'لوحة التحكم', value: 'view_dashboard' },
        { label: 'شاشة البيع', value: 'sell_orders' },
        { label: 'إدارة المخزون', value: 'manage_inventory' },
        { label: 'التصنيفات', value: 'manage_categories' },
        { label: 'الموردين', value: 'manage_suppliers' },
        { label: 'العملاء', value: 'view_customers' },
        { label: 'التقارير المالية', value: 'view_reports' },
        { label: 'إدارة المستخدمين', value: 'all' }
    ];

    const users = useState('system_users', () => [
        {
            id: 0,
            username: 'super',
            password: 'super123',
            name: 'المدير العام للمنصة',
            role: 'super_admin',
            storeId: 0, // 0 يعني إذن وصول لجميع المتاجر أو إدارة المنصة
            permissions: ['all'],
            active: true,
            lastLogin: '-'
        },
        {
            id: 1,
            username: 'admin',
            password: 'admin123',
            name: 'مدير النظام (المتجر 1)',
            role: 'admin',
            storeId: 1, // مرتبط بالمتجر الأول
            permissions: ['all'],
            active: true,
            lastLogin: '2024-02-23 10:00'
        },
        {
            id: 2,
            username: 'cashier',
            password: 'cashier123',
            name: 'أحمد الكاشير (المتجر 1)',
            role: 'cashier',
            storeId: 1, // مرتبط بالمتجر الأول
            permissions: ['view_dashboard', 'sell_orders', 'view_customers'],
            active: true,
            lastLogin: '2024-02-23 09:30'
        },
        {
            id: 3,
            username: 'manager',
            password: 'manager123',
            name: 'سارة مديرة المبيعات (المتجر 1)',
            role: 'manager',
            storeId: 1, // مرتبط بالمتجر الأول
            permissions: ['view_dashboard', 'manage_inventory', 'view_reports', 'view_customers'],
            active: false,
            lastLogin: '2024-02-22 17:00'
        },
        {
            id: 4,
            username: 'p_admin',
            password: 'p123',
            name: 'مدير صيدلية الشفاء (المتجر 2)',
            role: 'admin',
            storeId: 2, // مرتبط بمتجر صيدلية الشفاء
            permissions: ['all'],
            active: true,
            lastLogin: '22/02/2024'
        }
    ])

    const getUsers = () => users.value

    const addUser = (user) => {
        const newId = users.value.length ? Math.max(...users.value.map(u => u.id)) + 1 : 1
        users.value.push({
            ...user,
            id: newId,
            active: true,
            lastLogin: '-'
        })
        const { addLog } = useActivityLog()
        addLog('إضافة مستخدم', `تم إنشاء حساب للموظف: ${user.name}`, 'success')
    }

    const updateUser = (id, updatedData) => {
        const index = users.value.findIndex(u => u.id === id)
        if (index !== -1) {
            const oldName = users.value[index].name
            users.value[index] = { ...users.value[index], ...updatedData }

            const { addLog } = useActivityLog()
            addLog('تعديل مستخدم', `تعديل بيانات الحساب: ${oldName}`, 'info')

            // تحديث فورية للجلسة إذا كان هذا هو المستخدم الحالي
            const { refreshSession } = useAuth()
            refreshSession(users.value[index])
        }
    }

    const deleteUser = (id) => {
        const index = users.value.findIndex(u => u.id === id)
        if (index !== -1) {
            const userName = users.value[index].name
            users.value.splice(index, 1)
            const { addLog } = useActivityLog()
            addLog('حذف مستخدم', `تم حذف حساب الموظف: ${userName}`, 'warning')
        }
    }

    const toggleUserStatus = (id) => {
        const index = users.value.findIndex(u => u.id === id)
        if (index !== -1) {
            users.value[index].active = !users.value[index].active

            const status = users.value[index].active ? 'فتح' : 'قفل'
            const { addLog } = useActivityLog()
            addLog('تغيير حالة حساب', `تم ${status} حساب الموظف: ${users.value[index].name}`, 'info')

            // إذا تم تعطيل المستخدم الحالي، سيتم طرده في التحقق القادم
            const { refreshSession } = useAuth()
            refreshSession(users.value[index])
        }
    }

    return {
        getUsers,
        addUser,
        updateUser,
        deleteUser,
        toggleUserStatus,
        availablePermissions
    }
}
