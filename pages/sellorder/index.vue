<template>
    <n-layout style="height: 100vh">
        <n-layout-header style="height: 64px; padding: 24px" bordered>
            <n-h2> شاشة البيع
            </n-h2>
        </n-layout-header>

        <n-layout position="absolute" style="top: 64px; bottom: 64px" has-sider>

            <n-layout-sider content-style="padding: 24px;width:100%" :native-scrollbar="false" bordered>
                <cart />

            </n-layout-sider>
            <n-layout content-style="padding: 24px;" :native-scrollbar="false">
                <n-flex vertical justify="space-between">
                    <n-flex justify="space-between" size="large">
                        <n-input round style="width: 20vh;" v-model:value="searchTerm" type="text"
                            placeholder="البحث باسم المنتج" />
                        <!-- <input v-model="searchTerm" type="text" placeholder="البحث باسم المنتج"> -->
                        <ItemAddItem />

                    </n-flex>

                    <ItemItems :listOfItems="filteredItems" />
                </n-flex>
            </n-layout>
        </n-layout>



    </n-layout>

</template>

<script setup>

const searchTerm = ref('');
const { getItems, getItemsFiltered, getFavItems, getItemById } = useInventory();
const items = getItems().filter(item => item.isFav === true);

const filteredItems = computed(() => {
    if (!searchTerm.value) {
        return items;
    }
    return getItemsFiltered(searchTerm.value)
});
</script>
