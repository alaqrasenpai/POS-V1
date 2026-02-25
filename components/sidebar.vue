<template>
  <ClientOnly>
    <n-layout-sider 
      collapse-mode="width" 
      :collapsed-width="64" 
      :width="240" 
      show-trigger="arrow-circle"
      bordered 
      placement="right"
      :inverted="inverted" 
      @collapse="collapsed = true" 
      @expand="collapsed = false"
      class="side-nav"
    >
      <SidebarContent v-if="!collapsed" />
      <n-menu 
        v-else
        :collapsed-width="64" 
        :collapsed-icon-size="22" 
        :options="menuOptions" 
        @update:value="handleMenuClick"
        :inverted="inverted" 
      />
    </n-layout-sider>
  </ClientOnly>
</template>

<script setup>
import { ref } from "vue";
import { useMenu } from '@/composables/useMenu';

const { menuOptions, handleMenuClick } = useMenu();
const inverted = ref(false);
const collapsed = ref(false);
</script>

<style scoped>
.side-nav {
  height: calc(100vh - 56px);
}
</style>