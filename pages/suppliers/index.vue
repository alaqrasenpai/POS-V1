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
                                    placeholder="البحث عن موزع" />
                                <SuppliersAddSupplier />

                            </n-flex>

                            <SuppliersSupplierstable :listOfItems="filteredItems" />
                        </n-flex>
                    </n-layout>

                </div>
            </div>
        </div>

    </section>
</template>

<script setup>

const searchTerm = ref('');
// const { getItems, getItemsFiltered, getFavItems, getItemById } = useInventory();
const { getSuppliers, getSuppliersFiltered, addSupplier, geSupplierById } = useSuppliers();
const items = getSuppliers();

const filteredItems = computed(() => {
    if (!searchTerm.value) {
        return items;
    }
    return getSuppliersFiltered(searchTerm.value)
});
</script>
