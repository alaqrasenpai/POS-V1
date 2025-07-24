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

    <!-- الإحصائيات الإضافية -->
    <n-grid :cols="3" :x-gap="16" :y-gap="16" style="margin-top: 20px;">
      <!-- إجمالي المبيعات -->
      <n-gi>
        <n-card title="إجمالي المبيعات">
          <n-statistic label="الإيرادات الكلية" :value="totalSales" />
        </n-card>
      </n-gi>
      <!-- الطلبات المقدمة -->
      <n-gi>
        <n-card title="الطلبات">
          <n-statistic label="الطلبات المقدمة" :value="totalSellOrders" />
        </n-card>
      </n-gi>
      <!-- متوسط قيمة الطلب -->
      <n-gi>
        <n-card title="الأداء">
          <n-statistic label="متوسط قيمة الطلب" :value="averageOrderValue" />
        </n-card>
      </n-gi>
    </n-grid>

    <!-- جدول الطلبات الأخيرة والمخزون -->
    <n-grid :cols="2" :x-gap="16" :y-gap="16" class="charts" style="margin-top: 20px;">
      <!-- جدول الطلبات الأخيرة -->
      <n-gi>
        <n-card title="أحدث الطلبات">
          <n-data-table :columns="recentOrdersColumns" :data="recentOrders" :pagination="{ pageSize: 5 }"
            :bordered="false" />
        </n-card>
      </n-gi>
      <!-- مخطط مستوى المخزون -->
      <n-gi>
        <n-card title="مستوى المخزون">
          <Chart :type="'bar'" :options="inventoryChartOptions" :series="inventorySeries" />
        </n-card>
      </n-gi>
    </n-grid>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useCustomers } from '@/composables/useCustomers';
import { useInventory } from '@/composables/useInventory';
import { useSuppliers } from '@/composables/useSuppliers';
import { useSellOrder } from '@/composables/useSellOrder';
import Chart from '@/components/Chart.vue';

const { getCustomers, getFavCustomers } = useCustomers();
const { getItems, getFavItems } = useInventory();
const { getSuppliers } = useSuppliers();
const { getAlldSellOrders } = useSellOrder();

// الإحصائيات الموجودة
const totalCustomers = ref(0);
const favCustomers = ref(0);
const totalItems = ref(0);
const favItems = ref(0);
const totalSuppliers = ref(0);
const totalSellOrders = ref(0);

// الإحصائيات الجديدة
const totalSales = ref(0);
const averageOrderValue = ref(0);

// بيانات الرسوم البيانية القديمة
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

// بيانات الطلبات الأخيرة
const recentOrders = ref([]);
const recentOrdersColumns = ref([
  {
    title: 'رقم الطلب',
    key: 'id',
  },
  {
    title: 'تاريخ البيع',
    key: 'selldate',
  },
  {
    title: 'الإجمالي',
    key: 'totalPrice',
  },
]);

// بيانات مخطط المخزون
const inventorySeries = ref([{ name: 'الكمية', data: [] }]);
const inventoryChartOptions = ref({
  chart: {
    id: 'inventory-chart',
  },
  xaxis: {
    categories: [],
  },
  colors: ['#00E396'],
});

// حساب متوسط قيمة الطلب
const calculateAverageOrderValue = computed(() => {
  if (totalSellOrders.value === 0) return 0;
  return (totalSales.value / totalSellOrders.value).toFixed(2);
});

onMounted(() => {
  // حساب إحصائيات العملاء
  const customers = getCustomers();
  totalCustomers.value = customers.length;
  favCustomers.value = getFavCustomers().length;
  customerSeries.value = [totalCustomers.value - favCustomers.value, favCustomers.value];

  // حساب إحصائيات المخزون
  const items = getItems();
  totalItems.value = items.length;
  favItems.value = getFavItems().length;

  // حساب إحصائيات الموردين
  totalSuppliers.value = getSuppliers().length;

  // حساب إحصائيات المبيعات
  const sellOrders = getAlldSellOrders();
  totalSellOrders.value = sellOrders.length;

  // حساب إجمالي المبيعات
  totalSales.value = sellOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

  // حساب متوسط قيمة الطلب
  averageOrderValue.value = calculateAverageOrderValue.value;

  // أحدث الطلبات (آخر 5 طلبات)
  recentOrders.value = [...sellOrders]
    .sort((a, b) => new Date(b.selldate) - new Date(a.selldate))
    .slice(0, 5);

  // بيانات مخطط المخزون
  const topItems = [...items]
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10); // أول 10 عناصر بأعلى كمية

  inventorySeries.value[0].data = topItems.map(item => item.quantity);
  inventoryChartOptions.value.xaxis.categories = topItems.map(item => item.name);

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