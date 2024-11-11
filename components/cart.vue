<template>
    <div>
        <div>
            <h1>السلة <n-icon>
                    <CartIcon />
                </n-icon></h1>
            <div>
                <n-button>أداة</n-button>
                <n-button>قائمة</n-button>
                <n-button>إضافة عميل</n-button>

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

                        <n-input-number style="width: 11vh;" v-model:value="item.quantity" />
                        <span>{{ item.price }}</span>
                    </n-flex>

                </li>
            </ul>
            <n-input v-model:value="discount" type="text" placeholder="الخصم" color="primary"
                style="color: whitesmoke;" />
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
                <!-- <button>إفراغ السلة</button> -->
                <n-button @click="handleClearCart" strong secondary type="error">
                    <template #icon>
                        <n-icon>
                            <TrashIcon />
                        </n-icon>
                    </template>
                    إفراغ السلة
                </n-button></n-flex>


        </div>
    </div>
</template>

<script setup>

import {
    TrashBinOutline
        as TrashIcon, CashOutline as CashIcon, CartOutline as CartIcon
} from '@vicons/ionicons5'


const { getCartItems, clearCart } = useCart();
const { addSellOrder, getAlldSellOrders, getSellOrderById } = useSellOrder();
const { getaSellOrdeDtlrById, addSellOrdeDtl, getAllSellOrdeDtl } = useSellOrderDtl();
const cartItems = computed(() => getCartItems());
let totalPrice = ref(0)
let totalPriceWithDis = ref(0)
let discount = ref(0)
let sellOrder = ref({
    id: null,
    serialnumber: "",
    selldate: null,
    totaltax: null,
    totalPrice: null,
    totalDisc: null,
    deleted: false,
})

discount.value = null;
const handleClearCart = () => {
    discount.value = null
    clearCart();

};

const handleSaveCart = () => {
    if (totalPrice.value != 0) {
        const currentDate = new Date();

        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(currentDate.getDate()).padStart(2, '0');

        const formattedDate = `${year}${month}${day}`;
        sellOrder.value.serialnumber = formattedDate;
        sellOrder.value.selldate = new Date();
        sellOrder.value.totalPrice = totalPrice.value;
        sellOrder.value.totalDisc = discount.value;

        let sellOrderId = addSellOrder(sellOrder.value)
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
            }
            addSellOrdeDtl(sellOrderDtl);
        }
        discount.value = null;

        clearCart();
    } else {
        alert("Cart is empty")
    }

};
const calculateTotalPrice = () => {
    console.log('Calculating total price...'); // Debug: Check when this runs
    console.log(totalPrice.value)

    console.log(discount.value)
    totalPrice.value = cartItems.value.reduce((sum, item) => (sum + item.price * item.quantity), 0);

    totalPriceWithDis.value = totalPrice.value - discount.value;
    console.log('Total Price:', totalPrice.value); // Debug: Log calculated price
};

watch(cartItems, (newItems, oldItems) => {
    console.log('Cart items changed:', newItems); // Debug: Log cart items change
    calculateTotalPrice();
}, { immediate: true, deep: true });
watch(discount, (newItems, oldItems) => {
    console.log('Discount Changed:', newItems);
    if (totalPrice.value - discount.value < 0 && totalPrice.value != 0) {
        alert("enter valid value ");
        discount.value = null;

    }
    else {

        calculateTotalPrice();

    }
}, { immediate: true, deep: true });
</script>
