<template>
    <section class="">

        <div>
            <div>
                <h1>شاشة المنتجات</h1>
            </div>
            <div>

                <div>
                    <n-layout content-style="padding: 24px;" :native-scrollbar="false">
                        <n-flex vertical justify="space-between">
                            <n-flex justify="space-between" size="large">
                                <n-input round style="width: 20vh;" v-model:value="searchTerm" type="text"
                                    placeholder="البحث باسم المنتج" />
                                <!-- <input v-model="searchTerm" type="text" placeholder="البحث باسم المنتج"> -->
                                <div>
                                    <ItemAddItem />
                                    <InventoryAddTransToInventory />
                                </div>
                            </n-flex>

                            <InventoryInventorytable :listOfItems="filteredItems" />
                        </n-flex>
                    </n-layout>

                </div>
            </div>
        </div>

    </section>
</template>

<script setup>

const searchTerm = ref('');
const { getItems, getItemsFiltered, getFavItems, getItemById } = useInventory();
const items = getItems();

const filteredItems = computed(() => {
    if (!searchTerm.value) {
        return items;
    }
    return getItemsFiltered(searchTerm.value)
});
</script>
