<!-- components/sidebar.vue -->
<template>
  <ClientOnly>
    <n-layout-sider
      collapse-mode="width"
      :collapsed-width="64"
      :width="240"
      show-trigger="arrow-circle"
      content-style="padding: 24px;"
      bordered
      :inverted="inverted"
      @collapse="handleCollapse"
      @expand="handleExpand"
    >
      <n-menu
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="menuOptions"
        @update:value="handleMenuSelect"
        :inverted="inverted"
      />
    </n-layout-sider>
  </ClientOnly>
</template>

<script>
import {
  HomeOutline as HomeIcon,
  CartOutline as CartIcon,
  ListOutline as ListIcon,
  LayersOutline as LayersIcon,
  PeopleOutline as PeopleIcon,
  PersonOutline as PersonIcon,
  LogOutOutline as LogOutIcon,
  FileTrayFullOutline as FileTrayFullIcon // إذا كنت تستخدمها
} from "@vicons/ionicons5";
import { NIcon } from "naive-ui";
import { defineComponent, h, ref } from "vue";
import { useRouter } from "vue-router";

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

export default defineComponent({
  setup() {
    const router = useRouter();
    const inverted = ref(false); // حالة inverted

    const menuOptions = [
      {
        label: "Home",
        key: "home",
        icon: renderIcon(HomeIcon),
        to: "/"
      },
      {
        label: "Sell Order",
        key: "sell-order",
        icon: renderIcon(CartIcon),
        to: "/sellorder"
      },
      {
        label: "Inventory",
        key: "inventory",
        icon: renderIcon(ListIcon),
        to: "/inventory"
      },
      {
        label: "Sell Orders",
        key: "sell-orders",
        icon: renderIcon(LayersIcon),
        to: "/tabs"
      },
      {
        label: "Categories",
        key: "categories",
        icon: renderIcon(LayersIcon),
        to: "/category"
      },
      {
        label: "Suppliers",
        key: "suppliers",
        icon: renderIcon(PeopleIcon),
        to: "/suppliers"
      },
      {
        label: "Customers",
        key: "customers",
        icon: renderIcon(PersonIcon),
        to: "/customers"
      },
      // يمكنك إضافة هذا إذا كانت صفحة الفواتير والمرتجعات موجودة
      // {
      //   label: "Invoices & Returns",
      //   key: "invoices-returns",
      //   icon: renderIcon(FileTrayFullIcon),
      //   to: "/invoices-returns"
      // },
      {
        label: "Logout",
        key: "logout",
        icon: renderIcon(LogOutIcon),
      }
    ];

    const handleMenuSelect = (key) => {
      if (key === 'logout') {
        // مسح حالة تسجيل الدخول التجريبي
        localStorage.removeItem('pos_demo_logged_in');
        // توجيه المستخدم إلى صفحة تسجيل الدخول
        router.push('/login');
        return;
      }

      const selectedOption = menuOptions.find(option => option.key === key);
      if (selectedOption && selectedOption.to) {
        router.push(selectedOption.to);
      }
    };

    const handleCollapse = () => {
      console.log("Sidebar collapsed");
    };

    const handleExpand = () => {
      console.log("Sidebar expanded");
    };

    return {
      inverted,
      menuOptions,
      handleMenuSelect,
      handleCollapse,
      handleExpand
    };
  }
});
</script>