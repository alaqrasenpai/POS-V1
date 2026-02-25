<template>
  <div class="custom-dropdown" v-click-outside="close">
    <div class="dropdown-trigger" @click="toggle">
      <slot name="trigger"></slot>
    </div>
    <Transition name="fade">
      <div v-if="isOpen" class="dropdown-menu" :class="[placement, { 'is-rtl': isRTL }]">
        <div v-for="option in options" :key="option.key" class="dropdown-item" @click="handleSelect(option)">
          <component :is="option.icon" v-if="option.icon" class="item-icon" />
          <span class="item-label">{{ option.label }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  options: {
    type: Array,
    required: true
  },
  placement: {
    type: String,
    default: 'bottom-end'
  },
  isRTL: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['select']);
const isOpen = ref(false);

const toggle = () => {
  isOpen.value = !isOpen.value;
};

const close = () => {
  isOpen.value = false;
};

const handleSelect = (option) => {
  emit('select', option.key);
  close();
};

// Directive for clicking outside
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event);
      }
    };
    document.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent);
  }
};
</script>

<style scoped>
.custom-dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  z-index: 1000;
  min-width: 180px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  padding: 8px;
  margin-top: 8px;
  border: 1px solid #f0f0f0;
}

.dropdown-menu.bottom-end {
  right: 0;
}

.dropdown-menu.bottom-start {
  left: 0;
}

.dropdown-menu.is-rtl.bottom-end {
  right: auto;
  left: 0;
}

.dropdown-menu.is-rtl.bottom-start {
  left: auto;
  right: 0;
}

.dropdown-menu.is-rtl {
  text-align: right;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  color: #333;
  gap: 10px;
}

.dropdown-item:hover {
  background: #f5f5f5;
}

.item-icon {
  width: 18px;
  height: 18px;
  opacity: 0.7;
}

.item-label {
  font-size: 14px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
