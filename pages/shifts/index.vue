<template>
  <div class="page-container" style="padding: 20px;">
    <!-- Page Header -->
    <div style="margin-bottom: 24px;">
      <n-h1 style="margin: 0;">إدارة الورديات (Shift Management)</n-h1>
      <n-text depth="3">إدارة النقدية بالدرج، بدء وإنهاء الورديات، ومتابعة الأرباح والجرد.</n-text>
    </div>

    <n-grid :cols="isMobile ? 1 : 2" :x-gap="24" :y-gap="24">
      <!-- الوردية المفتوحة حالياً -->
      <n-gi>
        <n-card
          :title="activeShift ? 'الوردية الحالية' : 'لا توجد وردية مفتوحة'"
          :bordered="false"
          size="large"
          class="main-content-card"
        >
          <!-- حالة عدم وجود وردية -->
          <div v-if="!activeShift">
            <n-alert type="warning" show-icon style="margin-bottom: 20px;">
              يجب فتح وردية جديدة واستلام رصيد الدرج لتتمكن من بدء عمليات البيع.
            </n-alert>
            <n-form>
              <n-form-item label="المبلغ الافتتاحي في الدرج (بداية العهدة)">
                <n-input-number
                  v-model:value="startingCash"
                  :min="0"
                  size="large"
                  placeholder="أدخل المبلغ الموجود حالياً..."
                  style="width: 100%"
                />
              </n-form-item>
              <n-button type="primary" size="large" block @click="handleOpenShift">
                فتح الوردية واستلام الصندوق
              </n-button>
            </n-form>
          </div>

          <!-- حالة وجود وردية مفتوحة -->
          <div v-else>
            <n-descriptions bordered column="1" label-placement="left" style="margin-bottom: 20px;">
              <n-descriptions-item label="رقم الوردية">{{ activeShift.id }}</n-descriptions-item>
              <n-descriptions-item label="وقت الفتح">{{ new Date(activeShift.startTime).toLocaleString() }}</n-descriptions-item>
              <n-descriptions-item label="الرصيد الافتتاحي">
                <n-tag type="info">{{ activeShift.startingCash.toFixed(2) }} {{ settings.currency }}</n-tag>
              </n-descriptions-item>
              <n-descriptions-item label="النقدية المتوقعة (الدرج)">
                <n-tag type="success" size="large" style="font-weight: bold; font-size: 16px;">
                  {{ activeShift.expectedEndingCash.toFixed(2) }} {{ settings.currency }}
                </n-tag>
              </n-descriptions-item>
            </n-descriptions>

            <!-- الإيداع والسحب -->
            <n-flex justify="space-between" align="stretch" style="margin-bottom: 24px;">
              <div style="flex: 1; padding-left: 10px;">
                <n-button dashed block type="info" @click="showAddCashModal = true">
                  إيداع في الدرج (+)
                </n-button>
              </div>
              <div style="flex: 1; padding-right: 10px;">
                <n-button dashed block type="warning" @click="showWithdrawModal = true">
                  سحب من الدرج (-)
                </n-button>
              </div>
            </n-flex>

            <n-divider dashed />

            <!-- إغلاق الوردية -->
            <n-h3 style="margin-bottom: 12px; color: #d03050;">إغلاق الوردية (Z-Report)</n-h3>
            <n-form>
              <n-form-item label="المبلغ الفعلي الموجود في الدرج حالياً">
                <n-input-number
                  v-model:value="actualCash"
                  :min="0"
                  size="large"
                  placeholder="قم بعدّ النقدية وأدخل المبلغ هنا..."
                  style="width: 100%"
                />
              </n-form-item>
              
              <n-alert
                v-if="actualCash !== null"
                :type="getDifferenceType()"
                style="margin-bottom: 20px;"
              >
                الفارق: {{ (actualCash - activeShift.expectedEndingCash).toFixed(2) }} 
                ({{ getDifferenceText() }})
              </n-alert>

              <n-button
                type="error"
                size="large"
                block
                :disabled="actualCash === null"
                @click="handleCloseShift"
              >
                إنهاء الوردية واصدار تقرير Z-Report
              </n-button>
            </n-form>
          </div>
        </n-card>
      </n-gi>

      <!-- سجل الورديات -->
      <n-gi>
        <n-card title="سجل الورديات السابقة" :bordered="false" class="main-content-card">
          <n-data-table
            :columns="historyColumns"
            :data="shiftHistory"
            :pagination="{ pageSize: 5 }"
            :scroll-x="600"
          />
        </n-card>
      </n-gi>
    </n-grid>

    <!-- Modal: إيداع -->
    <n-modal v-model:show="showAddCashModal">
      <n-card title="إيداع نقدي" style="width: 400px;" :bordered="false">
        <n-form>
          <n-form-item label="المبلغ">
            <n-input-number v-model:value="transactionAmount" :min="1" style="width: 100%" />
          </n-form-item>
          <n-form-item label="السبب">
            <n-input v-model:value="transactionNotes" placeholder="مثال: إضافة فكة للدرج..." />
          </n-form-item>
          <n-button type="primary" block @click="submitTransaction('in')">حفظ العملية</n-button>
        </n-form>
      </n-card>
    </n-modal>

    <!-- Modal: سحب -->
    <n-modal v-model:show="showWithdrawModal">
      <n-card title="سحب نقدي" style="width: 400px;" :bordered="false">
        <n-form>
          <n-form-item label="المبلغ">
            <n-input-number v-model:value="transactionAmount" :min="1" style="width: 100%" />
          </n-form-item>
          <n-form-item label="التوجيه (السبب)">
            <n-input v-model:value="transactionNotes" placeholder="مثال: مصروفات، سحب للمدير..." />
          </n-form-item>
          <n-button type="warning" block @click="submitTransaction('out')">تأكيد السحب</n-button>
        </n-form>
      </n-card>
    </n-modal>

    <!-- Modal: تقرير الوردية التفصيلي -->
    <n-modal v-model:show="showReportModal">
      <n-card style="width: 450px;" title="تقرير جرد الوردية (Z-Report)" :bordered="false" role="dialog" aria-modal="true">
        <div v-if="selectedReport">
          <table style="width: 100%; border-collapse: collapse; text-align: right; line-height: 2.5;">
            <tbody>
                <tr>
                    <th style="border-bottom: 1px solid #efeff5;">رقم الوردية</th>
                    <td style="border-bottom: 1px solid #efeff5;">{{ selectedReport.id }}</td>
                </tr>
                <tr>
                    <th style="border-bottom: 1px solid #efeff5;">وقت الإنشاء</th>
                    <td style="border-bottom: 1px solid #efeff5;">{{ new Date(selectedReport.startTime).toLocaleString() }}</td>
                </tr>
                <tr>
                    <th style="border-bottom: 1px solid #efeff5;">وقت الإغلاق</th>
                    <td style="border-bottom: 1px solid #efeff5;">{{ new Date(selectedReport.endTime).toLocaleString() }}</td>
                </tr>
                <tr>
                    <th style="border-bottom: 1px solid #efeff5;">الرصيد الافتتاحي</th>
                    <td style="border-bottom: 1px solid #efeff5;">{{ selectedReport.startingCash.toFixed(2) }} {{ settings.currency }}</td>
                </tr>
                <tr>
                    <th style="border-bottom: 1px solid #efeff5;">المتوقع (النظام)</th>
                    <td style="border-bottom: 1px solid #efeff5;">{{ selectedReport.expectedEndingCash.toFixed(2) }} {{ settings.currency }}</td>
                </tr>
                <tr>
                    <th style="border-bottom: 1px solid #efeff5;">الفعلي (الجرد)</th>
                    <td style="border-bottom: 1px solid #efeff5;">{{ selectedReport.actualEndingCash.toFixed(2) }} {{ settings.currency }}</td>
                </tr>
                <tr>
                    <th style="border-bottom: 1px solid #efeff5;">العجز / الزيادة</th>
                    <td style="border-bottom: 1px solid #efeff5;">
                        <span :style="{ color: selectedReport.difference < 0 ? '#d03050' : (selectedReport.difference > 0 ? '#f0a020' : '#18a058'), fontWeight: 'bold' }">
                            {{ selectedReport.difference.toFixed(2) }} {{ settings.currency }}
                        </span>
                    </td>
                </tr>
                <tr style="background-color: #fafafc;">
                    <th style="padding-right: 8px;">إجمالي المبيعات</th>
                    <td style="padding-left: 8px; font-weight: bold;">{{ getShiftTotalSales(selectedReport.id).toFixed(2) }} {{ settings.currency }}</td>
                </tr>
                <tr style="background-color: #f6ffed;">
                    <th style="padding-right: 8px;">صافي أرباح الوردية</th>
                    <td style="padding-left: 8px; font-weight: bold; color: #18a058;">{{ getShiftProfit(selectedReport.id).toFixed(2) }} {{ settings.currency }}</td>
                </tr>
            </tbody>
          </table>
        </div>
        <template #footer>
          <n-button type="primary" block @click="showReportModal = false">إغلاق التقرير</n-button>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue';
import { useMessage, NTag, NButton, NDescriptions, NDescriptionsItem } from 'naive-ui';
import { useSettings } from '@/composables/useSettings';
import { useShifts } from '@/composables/useShifts';
import { useSellOrder } from '@/composables/useSellOrder';
import { useSellOrderDtl } from '@/composables/useSellOrderDtl';
import { useScreen } from '@/composables/useScreen';

const { settings } = useSettings();
const { getActiveShift, openShift, closeShift, addCashTransaction, getShiftHistory } = useShifts();
const { getAlldSellOrders } = useSellOrder();
const { getAllSellOrdeDtl } = useSellOrderDtl();
const { isMobile } = useScreen();
const message = useMessage();

// States
const startingCash = ref(0);
const actualCash = ref(null);
const showAddCashModal = ref(false);
const showWithdrawModal = ref(false);
const transactionAmount = ref(0);
const transactionNotes = ref('');

const showReportModal = ref(false);
const selectedReport = ref(null);

const activeShift = computed(() => getActiveShift());
const shiftHistory = computed(() => getShiftHistory().filter(s => s.status === 'closed'));

const handleOpenShift = () => {
  const result = openShift(startingCash.value);
  if (result.success) {
    message.success('تم فتح الوردية وتفعيل نقطة البيع.');
    startingCash.value = 0;
  } else {
    message.error(result.message);
  }
};

const submitTransaction = (type) => {
  if (!transactionAmount.value || transactionAmount.value <= 0) return;
  const result = addCashTransaction(transactionAmount.value, type, transactionNotes.value);
  if (result.success) {
    message.success('تم تسجيل العملية بنجاح.');
    showAddCashModal.value = false;
    showWithdrawModal.value = false;
    transactionAmount.value = 0;
    transactionNotes.value = '';
  } else {
    message.error(result.message);
  }
};

const handleCloseShift = () => {
    const result = closeShift(actualCash.value);
    if (result.success) {
        message.success('تم إغلاق الوردية وحفظ التقرير بنجاح.');
        actualCash.value = null;
    } else {
        message.error(result.message);
    }
};

const getDifferenceType = () => {
    const diff = actualCash.value - activeShift.value.expectedEndingCash;
    if (diff === 0) return 'success';
    if (diff < 0) return 'error';
    return 'warning';
};

const getDifferenceText = () => {
    const diff = actualCash.value - activeShift.value.expectedEndingCash;
    if (diff === 0) return 'مطابق';
    if (diff < 0) return 'عجز';
    return 'زيادة';
};

const getShiftTotalSales = (shiftId) => {
    const orders = getAlldSellOrders().filter(o => o.shiftId === shiftId && !o.deleted);
    return orders.reduce((sum, o) => sum + o.totalPrice, 0);
};

const getShiftProfit = (shiftId) => {
    const orders = getAlldSellOrders().filter(o => o.shiftId === shiftId && !o.deleted);
    const orderIds = orders.map(o => o.id);
    const details = getAllSellOrdeDtl().filter(d => orderIds.includes(d.orderId));
    return details.reduce((total, d) => total + ((d.totalPrice - (d.buyPrice || 0)) * d.itemQuan), 0);
};

const viewReport = (row) => {
    selectedReport.value = row;
    showReportModal.value = true;
};

const historyColumns = [
    { title: 'الوردية', key: 'id', width: 120 },
    {
        title: 'الإغلاق',
        key: 'endTime',
        render(row) { return new Date(row.endTime).toLocaleString(); }
    },
    {
        title: 'الفارق',
        key: 'difference',
        render(row) {
            return h(NTag, {
                type: row.difference < 0 ? 'error' : (row.difference > 0 ? 'warning' : 'success'),
                bordered: false
            }, { default: () => row.difference.toFixed(2) });
        }
    },
    {
        title: 'الإجراءات',
        key: 'actions',
        render(row) {
            return h(NButton, {
                size: 'small',
                type: 'primary',
                onClick: () => viewReport(row)
            }, { default: () => 'عرض التقرير' });
        }
    }
];
</script>

<style scoped>
.page-container {
    max-width: 1200px;
    margin: 0 auto;
}
:deep(.n-card) {
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}
</style>
