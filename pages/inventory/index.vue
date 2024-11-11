<template>
    <section class="">

        <div >
            <div >
                <h1 >شاشة المنتجات</h1>
            </div>
            <div >

                <div >
                    <div >
                        <input v-model="searchTerm" type="text" placeholder="البحث باسم المنتج"
                            >
                        <div >
                            <ItemAddItem/>
                        </div>
                    </div>
                    <div >

                        <InventoryInventorytable :listOfItems="filteredItems" />

                    </div>
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
