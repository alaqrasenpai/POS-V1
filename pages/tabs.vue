<template>
    <n-tabs type="segment" animated>
        <n-tab-pane name="Sell Order" tab="Sell Order">
            <n-data-table :columns="columns" :data="sellOrders" :pagination="pagination" :bordered="false" />
        </n-tab-pane>
        <n-tab-pane name="Sell Order DTL" tab="Sell Order DTL">
            <n-data-table :columns="columnsDTL" :data="sellOrdersDtl" :pagination="pagination" :bordered="false" />
        </n-tab-pane>
        <n-tab-pane name="Transactions" tab="Transactions">
            <InventoryInventorytranstable :listOfItems="filteredItems" />
        </n-tab-pane>
    </n-tabs>
</template>

<script setup>
import { ref, computed } from 'vue';

const { getCustomerById } = useCustomers(); // استيراد getCustomerById من useCustomers
const { getAlldSellOrders } = useSellOrder();
const { getAllSellOrdeDtl } = useSellOrderDtl();
const { getItemsTrans, getItemsTransFiltered } = useInventoryTrans();

const searchTerm = ref('');
const items = getItemsTrans();
const sellOrders = getAlldSellOrders();
const sellOrdersDtl = getAllSellOrdeDtl();

// دالة مساعدة للحصول على اسم الزبون بناءً على الـ customerId
const getCustomerNameById = (customerId) => {
    const customer = getCustomerById(customerId);
    return customer ? customer.name : 'Unknown Customer';
};

const columns = [
    {
        title: 'Order Number',
        key: 'id',
    },
    {
        title: 'Sell Date',
        key: 'selldate',
    },
    {
        title: 'Customer Name',
        key: 'customerId',
        render: (row) => getCustomerNameById(row.customerId), // استخدام render لعرض اسم الزبون
    },
    {
        title: 'Serial number',
        key: 'serialnumber',
    },
    {
        title: 'Total discound',
        key: 'totalDisc',
    },
    {
        title: 'Total Price',
        key: 'totalPrice',
    },
];

const columnsDTL = [
    {
        title: 'Item Name',
        key: 'itemName',
    },
    {
        title: 'Total Price',
        key: 'totalPrice',
    },
    {
        title: 'Quantity',
        key: 'itemQuan',
    },
    {
        title: 'Order Number',
        key: 'orderId',
    },
];

const filteredItems = computed(() => {
    if (!searchTerm.value) {
        return items;
    }
    return getItemsTransFiltered(searchTerm.value);
});

const activeTab = ref(0);
</script>