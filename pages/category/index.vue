<template>
    <section class="">

        <div>
            <div>
                <h1>شاشة التصنيفات</h1>
            </div>
            <div>

                <div>

                    <n-layout content-style="padding: 24px;" :native-scrollbar="false">
                        <n-flex vertical justify="space-between">
                            <n-flex justify="space-between" size="large">
                                <n-input round style="width: 20vh;" v-model:value="searchTerm" type="text"
                                    placeholder="البحث باسم التصنيف" />
                                <!-- <input v-model="searchTerm" type="text" placeholder="البحث باسم المنتج"> -->
                                <CategoryAddCategory />

                            </n-flex>

                            <CategoryCategoriestable :listOfCategories="filteredItems" />
                        </n-flex>
                    </n-layout>


                </div>
            </div>
        </div>

    </section>
</template>

<script setup>

const searchTerm = ref('');
const { addCategory, getCategories, getCategoryById, deleteCategory } = useCategory();
const items = getCategories();
console.log(items)

const filteredItems = computed(() => {
    if (!searchTerm.value) {
        return items;
    }
    return getItemsFiltered(searchTerm.value)
});
</script>
