<template>
  <div class="page-container">
    <div class="page-title-section">
      <div class="page-header-text">
        <n-h1 class="page-title">نظرة عامة على النظام</n-h1>
        <n-text class="page-subtitle">مرحباً بك مجدداً، إليك ملخص أداء متجرك اليوم</n-text>
      </div>
      <n-flex v-if="!isMobile" :size="16">
        <n-button type="primary" secondary @click="refreshDashboard">
          <template #icon><n-icon>
              <RefreshIcon />
            </n-icon></template>
          تحديث البيانات
        </n-button>
        <n-button type="primary" @click="$router.push('/sellorder')">
          <template #icon><n-icon>
              <CartIcon />
            </n-icon></template>
          فتح شاشة البيع
        </n-button>
      </n-flex>
    </div>

    <!-- بطاقات الإحصائيات الرئيسية -->
    <n-grid :cols="isMobile ? 1 : 4" :x-gap="24" :y-gap="24">
      <n-gi>
        <n-card class="stat-card sales-stat" :bordered="false">
          <div class="stat-icon sales">
            <n-icon>
              <CashIcon />
            </n-icon>
          </div>
          <n-statistic label="إجمالي المبيعات" :value="totalSales">
            <template #prefix><n-text depth="3" style="font-size: 14px; margin-inline-end: 4px;">{{ currency
                }}</n-text></template>
          </n-statistic>
          <div class="stat-footer">
            <n-text depth="3">إجمالي {{ totalSellOrders }} عملية بيع</n-text>
          </div>
        </n-card>
      </n-gi>
      <n-gi>
        <n-card class="stat-card items-stat" :bordered="false">
          <div class="stat-icon items">
            <n-icon>
              <CubeIcon />
            </n-icon>
          </div>
          <n-statistic label="أصناف المخزون" :value="totalItems" />
          <div class="stat-footer">
            <n-text depth="3">{{ lowStockItems.length }} أصناف أوشكت على النفاد</n-text>
          </div>
        </n-card>
      </n-gi>
      <n-gi>
        <n-card class="stat-card customers-stat" :bordered="false">
          <div class="stat-icon customers">
            <n-icon>
              <PeopleIcon />
            </n-icon>
          </div>
          <n-statistic label="قاعدة العملاء" :value="totalCustomers" />
          <div class="stat-footer">
            <n-text depth="3">{{ favCustomers }} عملاء مميزين</n-text>
          </div>
        </n-card>
      </n-gi>
      <n-gi>
        <n-card class="stat-card profit-stat" :bordered="false">
          <div class="stat-icon profit">
            <n-icon>
              <TrendingUpIcon />
            </n-icon>
          </div>
          <n-statistic label="متوسط قيمة الطلب" :value="averageOrderValue">
            <template #prefix><n-text depth="3" style="font-size: 14px; margin-inline-end: 4px;">{{ currency
                }}</n-text></template>
          </n-statistic>
          <div class="stat-footer">
            <n-text depth="3">أداء مستقر</n-text>
          </div>
        </n-card>
      </n-gi>
    </n-grid>

    <n-grid :cols="isMobile ? 1 : 12" :x-gap="24" :y-gap="24" style="margin-top: 40px;">
      <!-- مخطط مبيعات الأسبوع -->
      <n-gi span="8">
        <n-card title="حركة المبيعات (آخر 7 أيام)" class="main-content-card" :bordered="false">
          <template #header-extra>
            <n-tag type="success" size="small" round>مباشر</n-tag>
          </template>
          <div style="padding: 10px 0;">
            <Chart type="area" :options="salesChartOptions" :series="salesSeries" />
          </div>
        </n-card>
      </n-gi>

      <!-- توزيع التصنيفات -->
      <n-gi span="4">
        <n-card title="توزيع مبيعات التصنيفات" class="main-content-card" :bordered="false">
          <div style="padding: 10px 0;">
            <Chart type="donut" :options="categoryChartOptions" :series="categorySeries" />
          </div>
          <div style="margin-top: 20px;">
            <n-list size="small" bordered>
              <n-list-item v-for="(cat, index) in topCategories" :key="index">
                <n-flex justify="space-between" align="center">
                  <n-text strong>{{ cat.name }}</n-text>
                  <n-tag :bordered="false" size="small" type="info">{{ cat.count }} قطعة</n-tag>
                </n-flex>
              </n-list-item>
            </n-list>
          </div>
        </n-card>
      </n-gi>

      <!-- تنبيهات المخزون المنخفض -->
      <n-gi :span="isMobile ? 12 : 5">
        <n-card title="تنببهات المخزون (تحتاج لطلب)" class="main-content-card" :bordered="false"
          header-style="color: #d03050">
          <template #header-extra>
            <n-button text type="error" @click="$router.push('/inventory')">عرض الكل</n-button>
          </template>
          <n-empty v-if="lowStockItems.length === 0" description="كل الأصناف متوفرة بشكل جيد"
            style="padding: 40px 0;" />
          <n-scrollbar v-else style="max-height: 350px;">
            <n-list hoverable clickable>
              <n-list-item v-for="item in lowStockItems" :key="item.id" style="padding: 12px;">
                <template #prefix>
                  <n-avatar round :style="{ backgroundColor: '#fff1f0', color: '#f5222d' }">
                    <n-icon>
                      <WarningIcon />
                    </n-icon>
                  </n-avatar>
                </template>
                <n-thing :title="item.name" :description="item.category">
                  <template #footer>
                    <n-flex align="center" :size="8">
                      <n-text depth="3">الكمية المتبقية: </n-text>
                      <n-tag :type="item.quantity === 0 ? 'error' : 'warning'" size="small" round>{{ item.quantity
                        }}</n-tag>
                    </n-flex>
                  </template>
                </n-thing>
              </n-list-item>
            </n-list>
          </n-scrollbar>
        </n-card>
      </n-gi>

      <!-- أحدث العمليات -->
      <n-gi :span="isMobile ? 12 : 7">
        <n-card title="أحدث عمليات البيع" class="main-content-card" :bordered="false">
          <div style="margin-bottom: 16px;">
            <n-data-table :columns="recentOrdersColumns" :data="recentOrders" :bordered="false" size="small" />
          </div>
          <n-flex justify="center" style="margin-top: 24px; padding-bottom: 10px;">
            <n-button quaternary type="primary" @click="$router.push('/tabs')">عرض سجل العمليات الكامل</n-button>
          </n-flex>
        </n-card>
      </n-gi>
    </n-grid>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import {
  PeopleOutline as PeopleIcon,
  CubeOutline as CubeIcon,
  StatsChartOutline as TrendingUpIcon,
  CartOutline as CartIcon,
  CashOutline as CashIcon,
  RefreshOutline as RefreshIcon,
  AlertCircleOutline as WarningIcon
} from '@vicons/ionicons5';
// تمت إزالة الاستيرادات اليدوية للـ composables
import Chart from '@/components/Chart.vue';

const { isMobile } = useScreen();
const { getCustomers, getFavCustomers } = useCustomers();
const { getItems } = useInventory();
const { getSuppliers } = useSuppliers();
const { getAlldSellOrders } = useSellOrder();
const { getSettings } = useSettings();

const currency = computed(() => getSettings().currency || 'ريال');

// States
const totalCustomers = ref(0);
const favCustomers = ref(0);
const totalItems = ref(0);
const totalSellOrders = ref(0);
const totalSales = ref(0);
const averageOrderValue = ref(0);
const lowStockItems = ref([]);
const recentOrders = ref([]);

// Chart Sales Series (Mocking some growth data based on total sales)
const salesSeries = ref([{
  name: 'المبيعات اليومية',
  data: [450, 520, 480, 610, 590, 720, 850]
}]);

const salesChartOptions = ref({
  chart: {
    type: 'area',
    toolbar: { show: false },
    fontFamily: 'Tajawal, sans-serif'
  },
  colors: ['#18a058'],
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.45,
      opacityTo: 0.05,
      stops: [20, 100, 100, 100]
    }
  },
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 3 },
  xaxis: {
    categories: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: { show: false },
  grid: {
    borderColor: '#f1f1f1',
    strokeDashArray: 4
  }
});

// Category Donut
const categorySeries = ref([]);
const categoryChartOptions = ref({
  labels: [],
  chart: { type: 'donut', fontFamily: 'Tajawal, sans-serif' },
  colors: ['#18a058', '#2080f0', '#f0a020', '#d03050', '#722ed1'],
  legend: { position: 'bottom' },
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'إجمالي القطع',
            formatter: (w) => w.globals.seriesTotals.reduce((a, b) => a + b, 0)
          }
        }
      }
    }
  }
});

const topCategories = ref([]);

// Orders Table Columns
const recentOrdersColumns = [
  {
    title: 'رقم العملية',
    key: 'id',
    render: (row) => h('span', { style: 'font-weight: 600' }, `#${row.id}`)
  },
  {
    title: 'الوقت',
    key: 'selldate',
    render: (row) => h('span', {}, new Date(row.selldate).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }))
  },
  {
    title: 'الإجمالي',
    key: 'totalPrice',
    render: (row) => h('n-tag', { type: 'success', bordered: false }, { default: () => `${row.totalPrice} ${currency.value}` })
  }
];

const refreshDashboard = () => {
  const customers = getCustomers();
  totalCustomers.value = customers.length;
  favCustomers.value = getFavCustomers().length;

  const items = getItems();
  totalItems.value = items.length;
  lowStockItems.value = items.filter(i => i.quantity <= 5).sort((a, b) => a.quantity - b.quantity);

  const sellOrders = getAlldSellOrders();
  totalSellOrders.value = sellOrders.length;
  totalSales.value = sellOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  averageOrderValue.value = totalSellOrders.value ? (totalSales.value / totalSellOrders.value).toFixed(1) : 0;

  recentOrders.value = [...sellOrders].sort((a, b) => new Date(b.selldate) - new Date(a.selldate)).slice(0, 5);

  // Categories Distribution Logic
  const catMap = {};
  items.forEach(item => {
    if (item.category) {
      catMap[item.category] = (catMap[item.category] || 0) + item.quantity;
    }
  });

  const cats = Object.entries(catMap).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
  topCategories.value = cats.slice(0, 5);
  categoryChartOptions.value.labels = topCategories.value.map(c => c.name);
  categorySeries.value = topCategories.value.map(c => c.count);
};

onMounted(() => {
  refreshDashboard();
});
</script>

<style scoped>
.stat-card {
  position: relative;
  overflow: hidden;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 16px;
  background: white;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  margin-bottom: 16px;
}

.sales .stat-icon {
  background: #f6ffed;
  color: #52c41a;
}

.items .stat-icon {
  background: #e6f7ff;
  color: #1890ff;
}

.customers .stat-icon {
  background: #fff7e6;
  color: #fa8c16;
}

.profit .stat-icon {
  background: #f9f0ff;
  color: #722ed1;
}

/* Custom colors for stats */
.sales-stat {
  border-top: 4px solid #52c41a;
}

.items-stat {
  border-top: 4px solid #1890ff;
}

.customers-stat {
  border-top: 4px solid #fa8c16;
}

.profit-stat {
  border-top: 4px solid #722ed1;
}

.stat-footer {
  margin-top: auto;
  border-top: 1px solid #f0f0f0;
  padding-top: 8px;
  font-size: 12px;
}

:deep(.n-statistic .n-statistic-value .n-statistic-value__content) {
  font-size: 28px;
  font-weight: 800;
}

:deep(.n-statistic .n-statistic-label) {
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}
</style>