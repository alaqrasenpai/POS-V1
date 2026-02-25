// composables/useSubscriptions.js
import { reactive, computed } from 'vue'

const state = reactive({
    plans: [
        {
            id: 'basic',
            name: 'أساسية (Basic)',
            description: 'مناسبة للمتاجر الصغيرة والمبتدئة',
            price: 0,
            features: ['view_dashboard', 'sell_orders', 'manage_inventory', 'view_customers']
        },
        {
            id: 'pro',
            name: 'احترافية (Pro)',
            description: 'للمتاجر النامية والمؤسسات الصغيرة',
            price: 150,
            features: ['view_dashboard', 'sell_orders', 'manage_inventory', 'manage_categories', 'manage_suppliers', 'view_customers', 'view_reports', 'shifts']
        },
        {
            id: 'enterprise',
            name: 'مؤسسات (Enterprise)',
            description: 'حل برمجي متكامل لكافة احتياجات المؤسسات الكبرى',
            price: 500,
            features: ['all']
        }
    ]
})

export const useSubscriptions = () => {
    const getPlans = () => state.plans

    const getPlanById = (id) => state.plans.find(p => p.id.toLowerCase() === id.toLowerCase())

    const updatePlanFeatures = (planId, features) => {
        const plan = state.plans.find(p => p.id === planId)
        if (plan) {
            plan.features = features
        }
    }

    const addPlan = (planData) => {
        state.plans.push({
            ...planData,
            id: planData.name.toLowerCase().replace(/\s+/g, '-')
        })
    }

    const availablePermissions = [
        { label: 'دخول لوحة التحكم', value: 'view_dashboard' },
        { label: 'إدارة المبيعات', value: 'sell_orders' },
        { label: 'إدارة المخزون', value: 'manage_inventory' },
        { label: 'إدارة التصنيفات', value: 'manage_categories' },
        { label: 'إدارة الموردين', value: 'manage_suppliers' },
        { label: 'عرض العملاء', value: 'view_customers' },
        { label: 'التقارير والإحصائيات', value: 'view_reports' },
        { label: 'إدارة الورديات', value: 'shifts' },
        { label: 'مدير (متجر)', value: 'admin' },
        { label: 'وصول شامل', value: 'all' }
    ]

    return {
        getPlans,
        getPlanById,
        updatePlanFeatures,
        addPlan,
        availablePermissions
    }
}
