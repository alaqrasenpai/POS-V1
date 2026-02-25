// composables/usePayments.js
export const usePayments = () => {
    // حالة الشيكات
    const checks = useState('system_checks', () => [
        {
            id: 1,
            orderId: 101,
            customerName: 'أحمد علي',
            checkNumber: 'CHQ-5521',
            amount: 1500,
            dueDate: '2024-05-15',
            status: 'pending', // pending, cashed, returned
            createdAt: '2024-02-23'
        }
    ])

    // حالة الأقساط
    const installments = useState('system_installments', () => [
        {
            id: 1,
            orderId: 102,
            customerName: 'سارة محمود',
            totalAmount: 5000,
            paidAmount: 1000,
            remainingAmount: 4000,
            installmentsCount: 4,
            status: 'active', // active, completed, overdue
            payments: [
                { id: 1, amount: 1000, date: '2024-02-23' }
            ],
            createdAt: '2024-02-23'
        }
    ])

    // وظائف البحث والإضافة
    const getChecks = () => checks.value
    const getInstallments = () => installments.value

    const addCheck = (check) => {
        const newId = checks.value.length ? Math.max(...checks.value.map(c => c.id)) + 1 : 1
        checks.value.push({
            ...check,
            id: newId,
            status: 'pending',
            createdAt: new Date().toISOString().split('T')[0]
        })
    }

    const updateCheckStatus = (id, status) => {
        const index = checks.value.findIndex(c => c.id === id)
        if (index !== -1) {
            checks.value[index].status = status
        }
    }

    const addInstallment = (installment) => {
        const newId = installments.value.length ? Math.max(...installments.value.map(i => i.id)) + 1 : 1
        installments.value.push({
            ...installment,
            id: newId,
            status: 'active',
            createdAt: new Date().toISOString().split('T')[0],
            payments: installment.payments || []
        })
    }

    const addInstallmentPayment = (id, amount) => {
        const index = installments.value.findIndex(i => i.id === id)
        if (index !== -1) {
            const inst = installments.value[index]
            inst.paidAmount += amount
            inst.remainingAmount -= amount
            inst.payments.push({
                id: inst.payments.length + 1,
                amount,
                date: new Date().toISOString().split('T')[0]
            })
            if (inst.remainingAmount <= 0) {
                inst.status = 'completed'
            }
        }
    }

    return {
        getChecks,
        getInstallments,
        addCheck,
        updateCheckStatus,
        addInstallment,
        addInstallmentPayment
    }
}
