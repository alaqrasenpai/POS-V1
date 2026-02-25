<template>
  <div class="sidebar-content">
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

.sidebar-menu {
  flex: 1;
}
</style>
