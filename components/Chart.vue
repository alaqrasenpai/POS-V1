<template>
    <div>
      <apexchart :type="type" :options="options" :series="series"></apexchart>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  const props = defineProps({
    type: {
      type: String,
      default: 'bar', // يمكنك تغيير النوع إلى 'line', 'pie', إلخ
    },
    options: {
      type: Object,
      required: true,
    },
    series: {
      type: Array,
      required: true,
    },
  });
  </script>
  
  <style scoped>
  /* يمكنك إضافة تنسيقات إضافية هنا */
  </style>