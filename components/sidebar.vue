<template>
    <ClientOnly>
      <n-layout-sider
        collapse-mode="transform"
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
    LogOutOutline as LogOutIcon
  } from "@vicons/ionicons5";
  import { NIcon } from "naive-ui";
  import { defineComponent, h, ref } from "vue";
  import { useRouter } from "vue-router";
  
  function renderIcon(icon) {
    return () => h(NIcon, null, { default: () => h(icon) });
  }
  
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
    {
      label: "Logout",
      key: "logout",
      icon: renderIcon(LogOutIcon),
      to: "/logout"
    }
  ];
  
  export default defineComponent({
    setup() {
      const router = useRouter();
      const inverted = ref(false); // حالة inverted
  
      const handleMenuSelect = (key) => {
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