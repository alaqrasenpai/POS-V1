<template>
    <section class="">

        <div>
            <div>
                <h1>شاشة العملاء</h1>
            </div>
            <div>

                <div>
                    <n-layout content-style="padding: 24px;" :native-scrollbar="false">
                        <n-flex vertical justify="space-between">
                            <n-flex justify="space-between" size="large">
                                <n-input round style="width: 20vh;" v-model:value="searchTerm" type="text"
                                    placeholder="البحث باسم العميل" />
                                <div>
                                    <CustomersAddcustomer />
                                </div>
                            </n-flex>

                            <CustomersTable :listOfCustomers="filteredItems" />
                        </n-flex>
                    </n-layout>

                </div>
            </div>
        </div>

    </section>
</template>

<script setup>

const searchTerm = ref('');
const { getCustomers,getCustomersFiltered } = useCustomers();
const items = getCustomers();

const filteredItems = computed(() => {
    if (!searchTerm.value) {
        return items;
    }
    return getCustomersFiltered(searchTerm.value)
});
</script>
