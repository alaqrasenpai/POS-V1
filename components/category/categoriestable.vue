<template>
    <div >
        <table >
            <thead >
                <tr>
                    <th scope="col" >Id</th>
                    <th scope="col" >Cateogry name</th>
                </tr>
            </thead>
            <tbody>
                <categoryitem
                    v-for="item in listOfCategories"
                    :itemobejct="item"
                />
            </tbody>
        </table>
    </div>
</template>

<script setup>
const props = defineProps({
    listOfCategories: {
        type: Array,
        required: true
    }
});
</script>
