<template>
    <div>
        <div>
            <h1>السلة <n-icon>
                    <CartIcon />
                </n-icon></h1>
            <div>
                <n-button>أداة</n-button>
                <n-button>قائمة</n-button>
                <CustomersAddcustomer />
            </div>
        </div>
        <div>
            <!-- <modal /> -->
        </div>
        <div>
            <ul>
                <li v-for="item in cartItems" :key="item.id">
                    <n-flex justify="space-around">
                        <span>{{ item.name }}</span>
                        <n-input-number
                            style="width: 11vh; padding: 5px; border-radius: 4px; border: 1px solid #ccc; font-size: 14px;"
                            v-model:value="item.quantity"
                            :min="1"
                            :max="getMaxQuantity(item.id)"
                            @update:value="(newValue) => handleQuantityChange(item, newValue)"
                        />
                        <span>{{ item.price }}</span>
                    </n-flex>
                </li>
            </ul>
            <n-input v-model:value="discount" type="text" placeholder="الخصم" color="primary" style="color: whitesmoke;" />
            <UDivider />
            <div>إجمالي المبيعات: {{ totalPrice }}</div>
            <div>الخصم: {{ discount }}</div>
            <div>المجموع: {{ totalPriceWithDis }}</div>
            <n-flex justify="space-between">
                <n-button @click="handleSaveCart">
                    <template #icon>
                        <n-icon>
                            <CashIcon />
                        </n-icon>
                    </template>
                    بيع
                </n-button>
                <n-button @click="handleClearCart" strong secondary type="error">
                    <template #icon>
                        <n-icon>
                            <TrashIcon />
                        </n-icon>
                    </template>
                    إفراغ السلة
                </n-button>
            </n-flex>
        </div>
    </div>
</template>

<script setup>
import {
    TrashBinOutline as TrashIcon,
    CashOutline as CashIcon,
    CartOutline as CartIcon
} from '@vicons/ionicons5';
import { computed, ref, watch } from 'vue';

const { getCartItems, clearCart } = useCart();
const { addSellOrder } = useSellOrder();
const { addSellOrdeDtl } = useSellOrderDtl();
const { getItemById, updateItemQuantity } = useInventory(); // استيراد الدوال اللازمة لإدارة المخزون

const cartItems = computed(() => getCartItems());
let totalPrice = ref(0);
let totalPriceWithDis = ref(0);
let discount = ref(0);
let sellOrder = ref({
    id: null,
    serialnumber: "",
    selldate: null,
    totaltax: null,
    totalPrice: null,
    totalDisc: null,
    deleted: false,
});

// الحصول على الحد الأقصى للكمية المتاحة في المخزون
const getMaxQuantity = (itemId) => {
    const itemInInventory = getItemById(itemId);
    return itemInInventory ? itemInInventory.quantity : 0;
};

// التحقق من الكمية عند التعديل
const handleQuantityChange = (item, newValue) => {
    const itemInInventory = getItemById(item.id);
    if (itemInInventory && newValue > itemInInventory.quantity) {
        alert(`الكمية المطلوبة (${newValue}) تتجاوز الكمية المتاحة في المخزون (${itemInInventory.quantity})!`);
        item.quantity = itemInInventory.quantity; // إعادة الكمية إلى الحد الأقصى المتاح
    } else {
        item.quantity = newValue;
    }
    calculateTotalPrice();
};

// إتمام البيع وتعديل المخزون
const handleSaveCart = () => {
    if (totalPrice.value != 0) {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}${month}${day}`;

        sellOrder.value.serialnumber = formattedDate;
        sellOrder.value.selldate = new Date();
        sellOrder.value.totalPrice = totalPrice.value;
        sellOrder.value.totalDisc = discount.value;

        let sellOrderId = addSellOrder(sellOrder.value);

        for (let i = 0; i < cartItems.value.length; i++) {
            let sellOrderDtl = {
                id: null,
                orderId: sellOrderId,
                itemId: cartItems.value[i].id,
                totaltax: null,
                totalPrice: cartItems.value[i].price,
                itemQuan: cartItems.value[i].quantity,
                itemDisc: null,
                itemName: cartItems.value[i].name,
                deleted: false,
            };
            addSellOrdeDtl(sellOrderDtl);

            // تعديل الكمية في المخزون
            const itemInInventory = getItemById(cartItems.value[i].id);
            if (itemInInventory) {
                const newQuantity = itemInInventory.quantity - cartItems.value[i].quantity;
                updateItemQuantity(cartItems.value[i].id, newQuantity); // تحديث الكمية في المخزون
            }
        }

        discount.value = null;
        clearCart();
    } else {
        alert("السلة فارغة!");
    }
};

// إفراغ السلة
const handleClearCart = () => {
    discount.value = null;
    clearCart();
};

// حساب الإجمالي
const calculateTotalPrice = () => {
    totalPrice.value = cartItems.value.reduce((sum, item) => (sum + item.price * item.quantity), 0);
    totalPriceWithDis.value = totalPrice.value - discount.value;
};

// مراقبة التغييرات في السلة والخصم
watch(cartItems, calculateTotalPrice, { immediate: true, deep: true });
watch(discount, (newValue) => {
    if (totalPrice.value - newValue < 0 && totalPrice.value != 0) {
        alert("قيمة الخصم غير صالحة!");
        discount.value = null;
    } else {
        calculateTotalPrice();
    }
}, { immediate: true, deep: true });
</script>