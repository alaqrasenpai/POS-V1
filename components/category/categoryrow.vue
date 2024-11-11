<template>
    <tr >
        <th scope="row" >
            {{ itemobejct.id }}
        </th>
        <td >
            {{ itemobejct.name }}
        </td>
        <td >
            {{ itemobejct.category }}
        </td>
    </tr>
</template>

<script setup>

const props = defineProps({
    itemobejct: {
        type: Object,
        required: false
    },

});
const { addItem } = useCart();

const handleEditItem = () => {
    props.itemobejct.quantity = 1;
    addItem(props.itemobejct);
    toast.add({ title: 'Added to cart!' })
};
</script>
