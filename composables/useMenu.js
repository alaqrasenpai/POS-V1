import { h, computed } from 'vue'
import * as NaiveUI from 'naive-ui'
const { NIcon } = NaiveUI
import {
    HomeOutline,
    CartOutline,
    ListOutline,
    LayersOutline,
    PeopleOutline,
    PersonOutline,
    LogOutOutline,
    StatsChartOutline,
    SettingsOutline,
    CalendarOutline,
    TimeOutline
} from "@vicons/ionicons5"
import { useI18n } from '@/composables/useI18n'
import { useAuth } from '@/composables/useAuth'

export const useMenu = () => {
    const { hasPermission, logout } = useAuth()
    const { t } = useI18n()
    const router = useRouter()

    const renderIcon = (icon) => {
        return () => h(NIcon, null, { default: () => h(icon) })
    }

    const allOptions = computed(() => [
        {
            label: t('common.superAdmin'),
            key: "super-admin",
            icon: renderIcon(LayersOutline),
            to: "/super-admin",
            permission: "super_admin"
        },
        {
            label: t('common.dashboard'),
            key: "home",
            icon: renderIcon(HomeOutline),
            to: "/",
            permission: "view_dashboard"
        },
        {
            label: t('common.sales'),
            key: "sell-order",
            icon: renderIcon(CartOutline),
            to: "/sellorder",
            permission: "sell_orders"
        },
        {
            label: t('common.inventory'),
            key: "inventory",
            icon: renderIcon(ListOutline),
            to: "/inventory",
            permission: "manage_inventory"
        },
        {
            label: "إدارة الورديات",
            key: "shifts",
            icon: renderIcon(TimeOutline),
            to: "/shifts",
            permission: "shifts"
        },
        {
            label: t('common.categories'),
            key: "categories",
            icon: renderIcon(LayersOutline),
            to: "/category",
            permission: "manage_categories"
        },
        {
            label: t('common.suppliers'),
            key: "suppliers",
            icon: renderIcon(PeopleOutline),
            to: "/suppliers",
            permission: "manage_suppliers"
        },
        {
            label: t('common.customers'),
            key: "customers",
            icon: renderIcon(PersonOutline),
            to: "/customers",
            permission: "view_customers"
        },
        {
            label: t('common.checks'),
            key: "checks",
            icon: renderIcon(CalendarOutline),
            to: "/payments/checks",
            permission: "view_reports"
        },
        {
            label: t('common.installments'),
            key: "installments",
            icon: renderIcon(LayersOutline),
            to: "/payments/installments",
            permission: "view_reports"
        },
        {
            label: t('common.reports'),
            key: "reports",
            icon: renderIcon(StatsChartOutline),
            to: "/tabs",
            permission: "view_reports"
        },
        {
            label: t('common.settings'),
            key: "settings",
            icon: renderIcon(SettingsOutline),
            to: "/admin-settings",
            permission: "all"
        },
        {
            label: t('common.logout'),
            key: "logout",
            icon: renderIcon(LogOutOutline)
        }
    ])

    const menuOptions = computed(() => {
        return allOptions.value.filter(option => {
            if (!option.permission) return true
            return hasPermission(option.permission)
        })
    })

    const handleMenuClick = (key) => {
        if (key === 'logout') {
            logout()
            return
        }

        const option = allOptions.value.find(o => o.key === key)
        if (option && option.to) {
            router.push(option.to)
        }
    }

    return {
        menuOptions,
        handleMenuClick
    }
}
