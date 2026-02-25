<template>
  <div class="sidebar-content">
    <div class="logo-container">
      <n-text strong class="logo-text">{{ settings.shopName }}</n-text>
    </div>
    <n-menu 
      :options="menuOptions" 
      @update:value="handleSelect"
      class="sidebar-menu"
    />
  </div>
</template>

<script setup>
import { useMenu } from '@/composables/useMenu';
import { useSettings } from '@/composables/useSettings';

const emit = defineEmits(['select'])
const { settings } = useSettings();
const { menuOptions, handleMenuClick } = useMenu();

const handleSelect = (key) => {
  emit('select', key)
  handleMenuClick(key)
};
</script>

<style scoped>
.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.logo-container {
  padding: 24px 16px;
  text-align: center;
  border-bottom: 1px solid #eee;
  margin-bottom: 12px;
}
.logo-text {
  font-size: 1.2rem;
  color: #18a058;
}
.sidebar-menu {
  flex: 1;
}
</style>
