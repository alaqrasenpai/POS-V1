<template>

    <n-tabs type="segment" animated>
        <n-tab-pane name="Sell Order" tab="Sell Order">
            <n-data-table :columns="columns" :data="sellOrders" :pagination="pagination" :bordered="false" />
        </n-tab-pane>
        <n-tab-pane name="Sell Order DTL" tab="Sell Order DTL">
            <n-data-table :columns="columnsDTL" :data="sellOrdersDtl" :pagination="pagination" :bordered="false" />
        </n-tab-pane>
  
    </n-tabs>

</template>

<script setup>
import { ref } from 'vue'
const searchTerm = ref('');
useSellOrderDtl
const { getItems, getItemsFiltered } = useInventory();
const { getAlldSellOrders } = useSellOrder();
const { getAllSellOrdeDtl } = useSellOrderDtl();
const items = getItems();
const sellOrders = getAlldSellOrders();
const sellOrdersDtl = getAllSellOrdeDtl();
console.log(sellOrdersDtl)
const columns = [
    {
        title: 'Order Number',
        key: 'id', // Match the property in listOfItems for Product name
    },
    {
        title: 'Sell Date',
        key: 'selldate', // Match the property in listOfItems for Product name
    },
    {
        title: 'Setial number',
        key: 'serialnumber', // Match the property in listOfItems for Color
    },
    {
        title: 'Total discound',
        key: 'totalDisc', // Match the property in listOfItems for Category
    },
    {
        title: 'Total Price',
        key: 'totalPrice', // Match the property in listOfItems for Price
    }

]
const columnsDTL = [
    {
        title: 'Item Name',
        key: 'itemName', // Match the property in listOfItems for Product name
    },
    {
        title: 'Total Price',
        key: 'totalPrice', // Match the property in listOfItems for Color
    },
    {
        title: 'Quantity',
        key: 'itemQuan', // Match the property in listOfItems for Category
    },
    {
        title: 'Order Number',
        key: 'orderId', // Match the property in listOfItems for Price
    }

]
const filteredItems = computed(() => {
    if (!searchTerm.value) {
        return items;
    }
    return getItemsFiltered(searchTerm.value)
});
const activeTab = ref(0)
</script>

<!-- <style scoped>
.tabs-container {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.tabs {
    display: flex;
    border-bottom: 2px solid #ddd;
}

.tabs button {
    flex: 1;
    padding: 10px;
    border: none;
    background: #f4f4f4;
    cursor: pointer;
    transition: background 0.3s, color 0.3s;
}

.tabs button.active {
    background: #007bff;
    color: white;
    font-weight: bold;
}

.tab-content {
    padding: 20px;
    border: 1px solid #ddd;
    border-top: none;
}
</style> -->