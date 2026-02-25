import { h } from 'vue'
import { NIcon } from 'naive-ui'
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
    CalendarOutline
} from "@vicons/ionicons5"

export const useMenu = () => {
    const { hasPermission, logout } = useAuth()
    const router = useRouter()

    const renderIcon = (icon) => {
        return () => h(NIcon, null, { default: () => h(icon) })
    }

    const allOptions = [
        {
            label: "إدارة المنصة",
            key: "super-admin",
            icon: renderIcon(LayersOutline),
            to: "/super-admin",
            permission: "super_admin"
        },
        {
            label: "الرئيسية",
            key: "home",
            icon: renderIcon(HomeOutline),
            to: "/",
            permission: "view_dashboard"
        },
        {
            label: "شاشة البيع",
            key: "sell-order",
            icon: renderIcon(CartOutline),
            to: "/sellorder",
            permission: "sell_orders"
        },
        {
            label: "المخزون",
            key: "inventory",
            icon: renderIcon(ListOutline),
            to: "/inventory",
            permission: "manage_inventory"
        },
        {
            label: "التصنيفات",
            key: "categories",
            icon: renderIcon(LayersOutline),
            to: "/category",
            permission: "manage_categories"
        },
        {
            label: "الموردين",
            key: "suppliers",
            icon: renderIcon(PeopleOutline),
            to: "/suppliers",
            permission: "manage_suppliers"
        },
        {
            label: "العملاء",
            key: "customers",
            icon: renderIcon(PersonOutline),
            to: "/customers",
            permission: "view_customers"
        },
        {
            label: "إدارة الشيكات",
            key: "checks",
            icon: renderIcon(CalendarOutline),
            to: "/payments/checks",
            permission: "view_reports"
        },
        {
            label: "إدارة الأقساط",
            key: "installments",
            icon: renderIcon(LayersOutline),
            to: "/payments/installments",
            permission: "view_reports"
        },
        {
            label: "التقارير",
            key: "reports",
            icon: renderIcon(StatsChartOutline),
            to: "/tabs",
            permission: "view_reports"
        },
        {
            label: "إعدادات النظام",
            key: "settings",
            icon: renderIcon(SettingsOutline),
            to: "/admin-settings",
            permission: "all"
        },
        {
            label: "تسجيل الخروج",
            key: "logout",
            icon: renderIcon(LogOutOutline)
        }
    ]

    const menuOptions = computed(() => {
        return allOptions.filter(option => {
            if (!option.permission) return true
            return hasPermission(option.permission)
        })
    })

    const handleMenuClick = (key) => {
        if (key === 'logout') {
            logout()
            return
        }

        const option = allOptions.find(o => o.key === key)
        if (option && option.to) {
            router.push(option.to)
        }
    }

    return {
        menuOptions,
        handleMenuClick
    }
}
