<template>
    <section class="">

        <div >
            <div >
                <h1 >شاشة التصنيفات</h1>
            </div>
            <div >

                <div >
                    <div >
                        <input v-model="searchTerm" type="text" placeholder="البحث باسم التصنيف"
                            >
                        <div >
                            <CategoryAddCategory/>
                        </div>
                    </div>
                    <div >

                        <CategoryCategoriestable :listOfCategories="filteredItems" />

                    </div>
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
