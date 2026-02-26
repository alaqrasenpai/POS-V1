<template>
    <div class="cart-wrapper">
        <!-- Section 1: Top Header -->
        <div class="cart-header">
            <n-flex align="center" justify="space-between">
                <n-flex align="center" :size="8">
                    <n-icon size="24" color="#18a058">
                        <CartIcon />
                    </n-icon>
                    <n-h3 style="margin: 0; font-weight: 800;">{{ t('cart.title') }}</n-h3>
                </n-flex>
                <CustomersAddcustomer />
            </n-flex>
        </div>

        <div class="cart-main-content">
            <!-- Section 2: Transaction Config (Customer & Payment) -->
            <div class="transaction-config">
                <div class="config-grid">
                    <div class="config-field">
                        <label>{{ t('cart.customer') }}</label>
                        <n-select v-model:value="selectedCustomerId" :options="customerOptions"
                            :placeholder="t('cart.searchCustomer')" clearable filterable size="medium" />
                    </div>
                    <div class="config-field">
                        <label>{{ t('cart.paymentMethod') }}</label>
                        <n-select v-model:value="paymentMethod" :options="paymentMethodOptions" size="medium">
                            <template #prefix>
                                <n-icon>
                                    <component :is="activePaymentIcon" />
                                </n-icon>
                            </template>
                        </n-select>
                    </div>
                </div>

                <!-- Hidden details for Check/Installment -->
                <transition name="slide-fade">
                    <div v-if="paymentMethod === 'check'" class="special-config-panel">
                        <n-grid :cols="2" :x-gap="8">
                            <n-gi>
                                <n-text depth="3" class="mini-label">{{ t('cart.checkNumber') }}</n-text>
                                <n-input v-model:value="paymentDetails.checkNumber" size="small" placeholder="0000" />
                            </n-gi>
                            <n-gi>
                                <n-text depth="3" class="mini-label">{{ t('cart.dueDate') }}</n-text>
                                <n-date-picker v-model:value="paymentDetails.checkDate" type="date" size="small"
                                    style="width: 100%" />
                            </n-gi>
                        </n-grid>
                    </div>
                    <div v-else-if="paymentMethod === 'installment'" class="special-config-panel installment">
                        <n-grid :cols="2" :x-gap="8">
                            <n-gi>
                                <n-text depth="3" class="mini-label">{{ t('cart.downPayment') }}</n-text>
                                <n-input-number v-model:value="paymentDetails.downPayment" :min="0" size="small"
                                    :show-button="false" />
                            </n-gi>
                            <n-gi>
                                <n-text depth="3" class="mini-label">{{ t('cart.installmentsCount') }}</n-text>
                                <n-input-number v-model:value="paymentDetails.installmentsCount" :min="1"
                                    size="small" />
                            </n-gi>
                        </n-grid>
                        <div class="installment-calc">
                            {{ t('common.installments') }}: <strong>{{ monthlyInstallment }} {{ settings.currency
                                }}</strong> {{
                                    t('cart.monthly') }}
                        </div>
                    </div>
                </transition>
            </div>

            <!-- Section 3: Items List (The scrollable part) -->
            <div class="items-container">
                <div class="items-header">
                    <n-text depth="3">{{ t('cart.itemsList') }} ({{ cartItems.length }})</n-text>
                    <n-button text type="error" size="tiny" v-if="cartItems.length > 0" @click="handleClearCart">{{
                        t('cart.clearAll') }}</n-button>
                </div>

                <div class="items-scroll-area">
                    <transition-group name="list">
                        <div v-for="item in cartItems" :key="item.id" class="item-card">
                            <div class="item-card-top">
                                <n-flex :size="8" align="center" style="flex: 1; overflow: hidden; margin-left: 8px;">
                                    <div v-if="getItemById(item.id)?.images?.length" class="cart-item-image">
                                        <img :src="getItemById(item.id).images[0]" />
                                    </div>
                                    <div v-else class="cart-item-image icon-fallback">
                                        <n-icon size="16">
                                            <CubeIcon />
                                        </n-icon>
                                    </div>
                                    <span class="item-name" :title="item.name">{{ item.name }}</span>
                                </n-flex>
                                <n-button quaternary circle type="error" size="tiny" @click="removeItem(item.id)">
                                    <template #icon><n-icon>
                                            <TrashIcon />
                                        </n-icon></template>
                                </n-button>
                            </div>
                            <div class="item-card-bottom">
                                <div class="unit-price">{{ item.price }} {{ settings.currency }}</div>
                                <div class="quantity-controls">
                                    <n-button strong secondary circle size="tiny"
                                        @click="updateQty(item, -1)">-</n-button>
                                    <span class="qty-display">{{ item.quantity }}</span>
                                    <n-button strong secondary circle size="tiny"
                                        @click="updateQty(item, 1)">+</n-button>
                                </div>
                                <div class="item-subtotal">
                                    {{ (item.price * item.quantity).toFixed(2) }}
                                    <span class="curr">{{ settings.currency }}</span>
                                </div>
                            </div>
                        </div>
                    </transition-group>
                    <n-empty v-if="cartItems.length === 0" :description="t('cart.noItems')" style="margin-top: 40px" />
                </div>
            </div>
        </div>

        <!-- Section 4: Final Footer -->
        <div class="cart-footer">
            <div class="summary-card">
                <div class="summary-row">
                    <span>{{ t('cart.subtotal') }}</span>
                    <span>{{ totalPrice }} {{ settings.currency }}</span>
                </div>
                <div class="summary-row discount-row">
                    <span>{{ t('cart.discount') }}</span>
                    <n-input-number v-model:value="discount" :min="0" size="tiny" class="discount-input"
                        :show-button="false" placeholder="0.00" />
                </div>
                <n-divider class="footer-divider" />
                <div class="summary-row total-row">
                    <span class="total-label">{{ t('cart.finalTotal') }}</span>
                    <span class="total-value">{{ totalPriceWithDis }} {{ settings.currency }}</span>
                </div>
            </div>

            <n-button type="primary" block size="large" class="pay-btn" :disabled="cartItems.length === 0"
                @click="handleSaveCart">
                <template #icon><n-icon>
                        <CashIcon />
                    </n-icon></template>
                {{ t('cart.checkout') }}
            </n-button>
        </div>

        <!-- Receipt Modal -->
        <n-modal v-model:show="showReceipt" :mask-closable="false">
            <n-card style="width: 420px; border-radius: 20px;" :title="t('cart.receiptPreview')" bordered size="huge"
                role="dialog" aria-modal="true" class="main-content-card">
                <template #header-extra>
                    <n-button quaternary circle @click="showReceipt = false" class="hide-on-print">
                        <template #icon><n-icon>
                                <CloseIcon />
                            </n-icon></template>
                    </n-button>
                </template>

                <div id="print-area">
                    <Receipt :order="lastOrder" :details="lastOrderDetails" />
                </div>

                <template #footer>
                    <n-flex justify="end" :size="12" class="hide-on-print">
                        <n-button quaternary @click="showReceipt = false" size="large">{{ t('common.close')
                            }}</n-button>
                        <n-button type="primary" @click="printReceipt" size="large" style="padding: 0 30px">
                            <template #icon><n-icon>
                                    <PrintIcon />
                                </n-icon></template>
                            {{ t('cart.printNow') }}
                        </n-button>
                    </n-flex>
                </template>
            </n-card>
        </n-modal>
    </div>
</template>

<script setup>
import {
    TrashBinOutline as TrashIcon,
    CashOutline as CashIcon,
    CartOutline as CartIcon,
    WalletOutline as WalletIcon,
    CardOutline as VisaIcon,
    CalendarOutline as CheckIcon,
    TimeOutline as InstallmentIcon,
    PrintOutline as PrintIcon,
    CloseOutline as CloseIcon,
    CubeOutline as CubeIcon
} from '@vicons/ionicons5';
import { computed, ref, watch, h } from 'vue';
import { useMessage, NIcon, useDialog } from 'naive-ui';
import { useSettings } from '@/composables/useSettings';
import { useShifts } from '@/composables/useShifts';
import { useI18n } from '@/composables/useI18n';

const { getCartItems, clearCart, removeItem } = useCart();
const { addSellOrder } = useSellOrder();
const { addSellOrdeDtl } = useSellOrderDtl();
const { getItemById, updateItemQuantity } = useInventory();
const { getCustomers } = useCustomers();
const { addItemTrans } = useInventoryTrans();
const { addCheck, addInstallment } = usePayments();
const { addLog } = useActivityLog();
const { settings } = useSettings();
const { isShiftOpen, registerSaleCash } = useShifts();
const { t } = useI18n()
const message = useMessage();
const dialog = useDialog();

const cartItems = computed(() => getCartItems());
const totalPrice = ref(0);
const totalPriceWithDis = ref(0);
const discount = ref(0);
const paymentMethod = ref('cash');

// Receipt States
const showReceipt = ref(false);
const lastOrder = ref({});
const lastOrderDetails = ref([]);

const printReceipt = () => {
    window.print();
};

const paymentMethodOptions = computed(() => [
    { label: t('cart.cash'), value: 'cash' },
    { label: t('cart.visa'), value: 'visa' },
    { label: t('cart.check'), value: 'check' },
    { label: t('cart.installment'), value: 'installment' },
]);

const activePaymentIcon = computed(() => {
    const icons = { cash: WalletIcon, visa: VisaIcon, check: CheckIcon, installment: InstallmentIcon };
    return icons[paymentMethod.value] || WalletIcon;
});

const paymentDetails = ref({
    checkNumber: '',
    checkDate: null,
    downPayment: 0,
    installmentsCount: 1
});

let selectedCustomerId = ref(null);

const customerOptions = computed(() => {
    return getCustomers().map(customer => ({
        label: customer.name,
        value: customer.id,
    }));
});

const remainingAmount = computed(() => {
    const remaining = totalPriceWithDis.value - (paymentDetails.value.downPayment || 0);
    return Math.max(0, remaining).toFixed(2);
});

const monthlyInstallment = computed(() => {
    const count = paymentDetails.value.installmentsCount || 1;
    return (parseFloat(remainingAmount.value) / count).toFixed(2);
});

const updateQty = (item, delta) => {
    const newQty = item.quantity + delta;
    const inv = getItemById(item.id);
    if (newQty < 1) return;
    if (inv && newQty > inv.quantity) {
        dialog.warning({
            title: t('cart.outOfStock'),
            content: t('cart.outOfStockDesc', { qty: inv.quantity }),
            positiveText: t('common.confirm'),
            closable: false
        });
        return;
    }
    item.quantity = newQty;
    calculateTotalPrice();
};

const handleSaveCart = () => {
    if (cartItems.value.length === 0) return;

    if (!isShiftOpen.value) {
        dialog.error({
            title: t('cart.noShiftError'),
            content: t('cart.noShiftDesc'),
            positiveText: t('common.confirm'),
        });
        return;
    }

    if ((paymentMethod.value === 'check' || paymentMethod.value === 'installment') && !selectedCustomerId.value) {
        message.error(t('cart.selectCustomerError'));
        return;
    }

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10).replace(/-/g, '');

    const orderData = {
        serialnumber: formattedDate + '-' + Math.floor(Math.random() * 1000),
        selldate: new Date(),
        totalPrice: totalPriceWithDis.value,
        totalDisc: discount.value,
        paymentMethod: paymentMethod.value,
        customerId: selectedCustomerId.value,
        deleted: false
    };

    let sellOrderId = addSellOrder(orderData);

    lastOrder.value = { ...orderData, id: sellOrderId };
    lastOrderDetails.value = [];

    const customerName = getCustomers().find(c => c.id === selectedCustomerId.value)?.name || t('common.unknown');

    if (paymentMethod.value === 'check') {
        addCheck({ orderId: sellOrderId, customerName, checkNumber: paymentDetails.value.checkNumber, amount: totalPriceWithDis.value, dueDate: paymentDetails.value.checkDate ? new Date(paymentDetails.value.checkDate).toLocaleDateString() : 'غير محدد' });
    } else if (paymentMethod.value === 'installment') {
        addInstallment({ orderId: sellOrderId, customerName, totalAmount: totalPriceWithDis.value, paidAmount: paymentDetails.value.downPayment, remainingAmount: parseFloat(remainingAmount.value), installmentsCount: paymentDetails.value.installmentsCount, payments: [] });
    }

    for (let item of cartItems.value) {
        const inv = getItemById(item.id);
        let dtl = {
            orderId: sellOrderId,
            itemId: item.id,
            totalPrice: item.price,
            buyPrice: inv ? inv.buyprice : 0, // لحساب الأرباح في تقرير الورديات
            itemQuan: item.quantity,
            itemName: item.name,
            deleted: false
        };
        addSellOrdeDtl(dtl);
        lastOrderDetails.value.push(dtl);
        if (inv) updateItemQuantity(item.id, inv.quantity - item.quantity);
        addItemTrans({ name: item.name, TransType: "sell", itemId: item.id, date: new Date().toISOString() });
    }

    // تسجيل نقدية المبيعات في الدرج إذا كان الدفع نقداً
    if (paymentMethod.value === 'cash') {
        registerSaleCash(totalPriceWithDis.value);
    }

    message.success(t('cart.orderSuccess'));
    showReceipt.value = true;
    handleClearCart();
};

const handleClearCart = () => {
    discount.value = 0;
    clearCart();
    paymentMethod.value = 'cash';
    paymentDetails.value = { checkNumber: '', checkDate: null, downPayment: 0, installmentsCount: 1 };
    selectedCustomerId.value = null;
};

const calculateTotalPrice = () => {
    totalPrice.value = cartItems.value.reduce((sum, item) => (sum + item.price * item.quantity), 0);
    totalPriceWithDis.value = Math.max(0, totalPrice.value - (discount.value || 0));
};

watch(cartItems, calculateTotalPrice, { immediate: true, deep: true });
watch(discount, calculateTotalPrice);
</script>

<style scoped>
.cart-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: transparent;
    overflow: hidden;
}

.cart-header {
    background: var(--n-card-color);
    padding: 20px;
    border-bottom: 1px solid var(--n-border-color);
}

.cart-main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.transaction-config {
    padding: 16px;
    background: var(--n-card-color);
    border-bottom: 1px dashed var(--n-border-color);
}

.config-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

.config-field label {
    display: block;
    font-size: 11px;
    font-weight: 700;
    color: #64748b;
    margin-bottom: 4px;
    text-transform: uppercase;
}

.special-config-panel {
    margin-top: 12px;
    padding: 12px;
    background: var(--n-action-color);
    border-radius: 12px;
    border: 1px solid var(--n-border-color);
}

.mini-label {
    font-size: 10px;
    margin-bottom: 2px;
    display: block;
}

.installment-calc {
    margin-top: 8px;
    font-size: 11px;
    text-align: center;
    color: #18a058;
}

.items-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 16px;
    min-height: 0;
}

.items-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.items-scroll-area {
    flex: 1;
    overflow-y: auto;
    padding-left: 4px;
    /* Flip scrollbar padding for RTL */
}

/* Redesigned Item Card */
.item-card {
    background: var(--n-card-color);
    border: 1px solid var(--n-border-color);
    border-radius: 14px;
    padding: 12px;
    margin-bottom: 10px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
    transition: transform 0.2s, border-color 0.2s;
}

.item-card:hover {
    border-color: #18a05899;
    transform: translateX(2px);
    /* Shift right in RTL */
}

.item-card-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 10px;
}

.item-name {
    font-weight: 700;
    font-size: 14px;
    color: var(--n-text-color);
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.cart-item-image {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    overflow: hidden;
    flex-shrink: 0;
}

.cart-item-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.cart-item-image.icon-fallback {
    background: var(--n-action-color);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--n-text-color-3);
}

.item-card-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--n-action-color);
    padding: 6px 12px;
    border-radius: 10px;
}

.unit-price {
    font-size: 11px;
    color: #94a3b8;
}

.quantity-controls {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--n-card-color);
    padding: 2px 8px;
    border-radius: 20px;
    border: 1px solid var(--n-border-color);
}

.qty-display {
    font-weight: 800;
    font-size: 13px;
    min-width: 20px;
    text-align: center;
}

.item-subtotal {
    font-weight: 800;
    font-size: 15px;
    color: #18a058;
}

.item-subtotal .curr {
    font-size: 10px;
    margin-right: 2px;
}

/* Footer */
.cart-footer {
    padding: 20px;
    background: var(--n-card-color);
    border-top: 1px solid var(--n-border-color);
}

.summary-card {
    background: var(--n-action-color);
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 16px;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    margin-bottom: 8px;
    color: #64748b;
}

.discount-row {
    align-items: center;
}

.discount-input {
    width: 80px;
}

.total-row {
    margin-top: 8px;
    color: var(--n-text-color);
}

.total-label {
    font-weight: 700;
    font-size: 15px;
}

.total-value {
    font-weight: 900;
    font-size: 22px;
    color: #18a058;
}

.pay-btn {
    height: 52px;
    font-size: 17px;
    font-weight: 800;
    border-radius: 14px;
    box-shadow: 0 4px 12px rgba(24, 160, 88, 0.2);
}

/* Animations */
.list-enter-active,
.list-leave-active {
    transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: scale(0.9);
}

.slide-fade-enter-active {
    transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateY(-10px);
    opacity: 0;
}
</style>

<style>
@media print {

    .hide-on-print,
    .n-card-header,
    .n-card__footer,
    .n-card__action {
        display: none !important;
    }
}
</style>
