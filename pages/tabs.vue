<template>
    <div class="tabs-container">
        <div class="tabs">
            <button :class="{ active: activeTab === 0 }" class="hover:border-t-amber-500" @click="activeTab = 0">Tab
                1</button>
            <button :class="{ active: activeTab === 1 }" @click="activeTab = 1">Tab 2</button>
        </div>
        <div class="tab-content">
            <div v-if="activeTab === 0">
                <UTable :rows="sellOrders" />
            </div>
            <div v-if="activeTab === 1">
                <!-- <InventoryInventorytable :listOfItems="filteredItems" /> -->
                <UTable :rows="sellOrdersDtl" />

            </div>
            <div v-if="activeTab === 2">Content for Tab 3</div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
const searchTerm = ref('');
useSellOrderDtl
const { getItems, getItemsFiltered, getFavItems, getItemById } = useInventory();
const { addSellOrder, getAlldSellOrders, getSellOrderById } = useSellOrder();
const { getaSellOrdeDtlrById, addSellOrdeDtl, getAllSellOrdeDtl } = useSellOrderDtl();
const items = getItems();
const sellOrders = getAlldSellOrders();
const sellOrdersDtl = getAllSellOrdeDtl();

const filteredItems = computed(() => {
    if (!searchTerm.value) {
        return items;
    }
    return getItemsFiltered(searchTerm.value)
});
const activeTab = ref(0)
</script>

<style scoped>
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
</style>