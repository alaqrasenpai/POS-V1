<template>
  <div class="custom-popover" v-click-outside="close">
    <div class="popover-trigger" @click="toggle">
      <slot name="trigger"></slot>
    </div>
    <Transition name="fade">
      <div v-if="isOpen" class="popover-content" :class="[placement, { 'is-rtl': isRTL }]">
        <slot></slot>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  placement: {
    type: String,
    default: 'bottom-end'
  },
  isRTL: {
    type: Boolean,
    default: false
  }
});

const isOpen = ref(false);

const toggle = () => {
  isOpen.value = !isOpen.value;
};

const close = () => {
  isOpen.value = false;
};

defineExpose({ close });

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
.custom-popover {
  position: relative;
  display: inline-block;
}

.popover-content {
  position: absolute;
  top: 100%;
  z-index: 1000;
  background: white;
  border-radius: 16px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.15);
  margin-top: 10px;
  border: 1px solid #f0f0f0;
  overflow: hidden;
}

.popover-content.bottom-end {
  right: 0;
}

.popover-content.bottom-start {
  left: 0;
}

.popover-content.is-rtl.bottom-end {
  right: auto;
  left: 0;
}

.popover-content.is-rtl.bottom-start {
  left: auto;
  right: 0;
}

.popover-content.is-rtl {
  direction: rtl;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
