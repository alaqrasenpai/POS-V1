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

    <!-- الرسوم البيانية -->
    <n-grid :cols="2" :x-gap="16" :y-gap="16" class="charts">
      <n-gi>
        <n-card title="توزيع العملاء">
          <Chart :type="'pie'" :options="customerChartOptions" :series="customerSeries" />
        </n-card>
      </n-gi>

      <n-gi>
        <n-card title="المبيعات الشهرية">
          <Chart :type="'line'" :options="salesChartOptions" :series="salesSeries" />
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
import Chart from '@/components/Chart.vue';

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

// بيانات الرسوم البيانية
const customerSeries = ref([0, 0]);
const customerChartOptions = ref({
  labels: ['العملاء العاديين', 'العملاء المفضلين'],
  colors: ['#008FFB', '#00E396'],
});

const salesSeries = ref([{ name: 'المبيعات', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }]);
const salesChartOptions = ref({
  chart: {
    id: 'sales-chart',
  },
  xaxis: {
    categories: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  },
  colors: ['#FF4560'],
});

onMounted(() => {
  // حساب إحصائيات العملاء
  totalCustomers.value = getCustomers().length;
  favCustomers.value = getFavCustomers().length;
  customerSeries.value = [totalCustomers.value - favCustomers.value, favCustomers.value];

  // حساب إحصائيات المخزون
  totalItems.value = getItems().length;
  favItems.value = getFavItems().length;

  // حساب إحصائيات الموردين
  totalSuppliers.value = getSuppliers().length;

  // حساب إحصائيات المبيعات
  totalSellOrders.value = getAlldSellOrders().length;

  // بيانات المبيعات الشهرية (يمكن استبدالها ببيانات حقيقية)
  salesSeries.value[0].data = [30, 40, 35, 50, 49, 60, 70, 91, 125, 100, 110, 120];
});
</script>

<style scoped>
.homepage {
  padding: 20px;
}

.charts {
  margin-top: 20px;
}
</style>