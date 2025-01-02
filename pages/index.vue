<template>
    <div class="homepage">
      <n-grid :cols="4" :x-gap="16" :y-gap="16">
        <!-- إحصائيات العملاء -->
        <n-gi>
          <n-card title="العملاء">
            <n-statistic label="إجمالي العملاء" :value="totalCustomers" />
            <n-statistic label="العملاء المفضلين" :value="favCustomers" />
          </n-card>
        </n-gi>
  
        <!-- إحصائيات المخزون -->
        <n-gi>
          <n-card title="المخزون">
            <n-statistic label="إجمالي العناصر" :value="totalItems" />
            <n-statistic label="العناصر المفضلة" :value="favItems" />
          </n-card>
        </n-gi>
  
        <!-- إحصائيات الموردين -->
        <n-gi>
          <n-card title="الموردين">
            <n-statistic label="إجمالي الموردين" :value="totalSuppliers" />
          </n-card>
        </n-gi>
  
        <!-- إحصائيات المبيعات -->
        <n-gi>
          <n-card title="المبيعات">
            <n-statistic label="إجمالي الطلبات" :value="totalSellOrders" />
          </n-card>
        </n-gi>
      </n-grid>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useCustomers } from '@/composables/useCustomers';
  import { useInventory } from '@/composables/useInventory';
  import { useSuppliers } from '@/composables/useSuppliers';
  import { useSellOrder } from '@/composables/useSellOrder';
  
  const { getCustomers, getFavCustomers } = useCustomers();
  const { getItems, getFavItems } = useInventory();
  const { getSuppliers } = useSuppliers();
  const { getAlldSellOrders } = useSellOrder();
  
  const totalCustomers = ref(0);
  const favCustomers = ref(0);
  const totalItems = ref(0);
  const favItems = ref(0);
  const totalSuppliers = ref(0);
  const totalSellOrders = ref(0);
  
  onMounted(() => {
    // حساب إحصائيات العملاء
    totalCustomers.value = getCustomers().length;
    favCustomers.value = getFavCustomers().length;
  
    // حساب إحصائيات المخزون
    totalItems.value = getItems().length;
    favItems.value = getFavItems().length;
  
    // حساب إحصائيات الموردين
    totalSuppliers.value = getSuppliers().length;
  
    // حساب إحصائيات المبيعات
    totalSellOrders.value = getAlldSellOrders().length;
  });
  </script>
  
  <style scoped>
  .homepage {
    padding: 20px;
  }
  </style>