<template>
    <div >
        <table >
            <thead >
                <tr>
                    <th scope="col" >Product name</th>
                    <th scope="col" >Color</th>
                    <th scope="col" >Category</th>
                    <th scope="col" >Price</th>
                    <th scope="col" >Status</th>
                    <th scope="col" ><span >Edit</span></th>
                </tr>
            </thead>
            <tbody>
                <InventoryInventoryrow v-for="item in listOfItems" :itemobejct="item" />
            </tbody>
        </table>
    </div>
</template>

<script setup>
const props = defineProps({
    listOfItems: {
        type: Array,
        required: true
    }
});
</script>
