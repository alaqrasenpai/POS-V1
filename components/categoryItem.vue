<template>
    <tr @click="handleAddItem" v-show="itemobejct.quantity > 0 && !itemobejct.deleted" >
        <th scope="row" >
            {{ itemobejct.name }}
        </th>
        <td >
            {{ itemobejct.id }}
        </td>

        <td >
            <n-button @click="handleSubmit" >
                Add
            </n-button>   
        </td>
    </tr>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    itemobejct: {
        type: Object,
        required: false
    },

});
const { addCategory } = useCategory();

const handleAddItem = () => {
    props.itemobejct.quantity=1;
    addCategory(props.itemobejct);
    console.log({ title: 'Added to category!' })
};
</script>
