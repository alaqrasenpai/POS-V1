<template>
  <div class="receipt-wrapper" ref="receiptRef">
    <div class="receipt-inner">
      <!-- Header -->
      <div class="receipt-header">
        <h2 class="shop-name">{{ settings.shopname }}</h2>
        <p class="shop-tel" v-if="settings.phoneNumber">هاتف: {{ settings.phoneNumber }}</p>
        <p class="receipt-title">فاتورة مبيعات</p>
      </div>

      <!-- Order Info -->
      <div class="order-info">
        <div class="info-row">
          <span>رقم الفاتورة:</span>
          <span>{{ order.serialnumber }}</span>
        </div>
        <div class="info-row">
          <span>التاريخ:</span>
          <span>{{ formatDate(order.selldate) }}</span>
        </div>
        <div class="info-row" v-if="customerName">
          <span>العميل:</span>
          <span>{{ customerName }}</span>
        </div>
      </div>

      <div class="divider"></div>

      <!-- Items Table -->
      <table class="items-table">
        <thead>
          <tr>
            <th align="right">الصنف</th>
            <th align="center">الكمية</th>
            <th align="left">الإجمالي</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in details" :key="item.id">
            <td align="right">{{ item.itemName }}</td>
            <td align="center">{{ item.itemQuan }}</td>
            <td align="left">{{ (item.totalPrice * item.itemQuan).toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>

      <div class="divider"></div>

      <!-- Totals -->
      <div class="totals-section">
        <div class="total-row">
          <span>المجموع الفرعي:</span>
          <span>{{ (order.totalPrice + (order.totalDisc || 0)).toFixed(2) }} {{ settings.currency }}</span>
        </div>
        <div class="total-row" v-if="order.totalDisc > 0">
          <span>الخصم:</span>
          <span>-{{ order.totalDisc.toFixed(2) }} {{ settings.currency }}</span>
        </div>
        <div class="total-row grand-total">
          <span>الإجمالي النهائي:</span>
          <span>{{ order.totalPrice.toFixed(2) }} {{ settings.currency }}</span>
        </div>
      </div>

      <div class="divider"></div>

      <!-- Payment Info -->
      <div class="payment-info">
        <span>طريقة الدفع: </span>
        <strong>{{ translatePaymentMethod(order.paymentMethod) }}</strong>
      </div>

      <!-- Footer -->
      <div class="receipt-footer">
        <p>شكراً لزيارتكم!</p>
        <div class="qr-placeholder" v-if="order.serialnumber">
           <!-- Simple barcode or placeholder -->
           <div class="barcode">{{ order.serialnumber }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSettings } from '@/composables/useSettings';
import { useCustomers } from '@/composables/useCustomers';

const props = defineProps({
  order: {
    type: Object,
    required: true
  },
  details: {
    type: Array,
    required: true
  }
});

const { settings } = useSettings();
const { getCustomers } = useCustomers();

const customerName = computed(() => {
  if (!props.order.customerId) return null;
  const customer = getCustomers().find(c => c.id === props.order.customerId);
  return customer ? customer.name : null;
});

const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('ar-EG') + ' ' + d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
};

const translatePaymentMethod = (method) => {
  const map = {
    'cash': 'نقدي',
    'visa': 'فيزا / بطاقة',
    'check': 'شيك',
    'installment': 'تقسيط'
  };
  return map[method] || method;
};

// Function to trigger print
const printReceipt = () => {
    window.print();
};

defineExpose({ printReceipt });
</script>

<style scoped>
.receipt-wrapper {
  background: white;
  width: 100%;
  max-width: 320px; /* Standard 80mm width */
  margin: 0 auto;
  padding: 10px;
  font-family: 'Courier New', Courier, monospace;
  color: black;
  direction: rtl;
}

.receipt-inner {
  border: 1px solid #eee;
  padding: 10px;
}

.receipt-header {
  text-align: center;
  margin-bottom: 15px;
}

.shop-name {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 800;
}

.shop-tel {
  font-size: 0.8rem;
  margin: 2px 0;
}

.receipt-title {
  font-weight: bold;
  border: 1px solid black;
  display: inline-block;
  padding: 2px 10px;
  margin-top: 10px;
}

.order-info {
  font-size: 0.85rem;
  margin-bottom: 10px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2px;
}

.divider {
  border-top: 1px dashed black;
  margin: 10px 0;
}

.items-table {
  width: 100%;
  font-size: 0.85rem;
  border-collapse: collapse;
}

.items-table th {
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
}

.items-table td {
  padding: 5px 0;
}

.totals-section {
  font-size: 0.9rem;
}

.total-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 3px;
}

.grand-total {
  font-weight: 800;
  font-size: 1.1rem;
  margin-top: 5px;
}

.payment-info {
  text-align: center;
  font-size: 0.85rem;
}

.receipt-footer {
  text-align: center;
  margin-top: 20px;
  font-size: 0.8rem;
}

.barcode {
  font-size: 0.7rem;
  letter-spacing: 2px;
  font-weight: bold;
  margin-top: 5px;
}

</style>

<style>
/* Global Print Overrides to hide modal boundaries and buttons */
@media print {
  @page {
    margin: 0;
    size: 80mm auto;
  }
  
  body * {
    visibility: hidden;
  }
  
  .receipt-wrapper, .receipt-wrapper * {
    visibility: visible;
  }
  
  .receipt-wrapper {
    position: fixed;
    left: 0;
    top: 0;
    width: 80mm;
    z-index: 9999;
  }

  /* Hide Naive UI Modal parts */
  .n-modal, .n-card, .n-card-header, .n-card__footer, .n-modal-mask {
    box-shadow: none !important;
    border: none !important;
    background: transparent !important;
  }
  
  .n-card-header, .n-card__footer, .n-base-close {
    display: none !important;
  }
}
</style>
