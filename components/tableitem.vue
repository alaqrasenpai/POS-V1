<template>
    <tr @click="handleAddItem" v-show="itemobejct.quantity > 0 && !itemobejct.deleted" >
        <th scope="row" >
            {{ itemobejct.name }}
        </th>
        <td >
            {{ itemobejct.color }}
        </td>
        <td >
            {{ itemobejct.category }}
        </td>
        <td >
            ${{ itemobejct.price }}
        </td>
        <td >
            <button  >
                Add
            </button>
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
const { addItem } = useCart();

const handleAddItem = () => {
    props.itemobejct.quantity=1;
    addItem(props.itemobejct);
    toast.add({ title: 'Added to cart!' })
};
</script>
