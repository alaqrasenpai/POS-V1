<template>
    <div >
        <form @submit.prevent="handleSubmit" >
            <div>
                <label for="name" >Category Name:</label>
                <input v-model="newItem.name" id="name" required
                     />
            </div>

    
            <button v-if="props.isAdd" type="submit" @click="$emit('closePOP')"
                >Add
                Category</button>
            <button v-if="!props.isAdd" @click="$emit('closePOP')" type="submit"
                >Edit
                Category</button>
        </form>


    </div>
</template>

<script setup>
const { getItems, getItemsFiltered, getFavItems, getItemById, addItem, editItem } = useInventory();

const props = defineProps({
    itemId: {
        type: Number,
        required: false
    },
    close: {
        type: Function,
        required: true
    },
    isAdd: {
        type: Boolean,
        required: false
    }

});
let newItem = ref({
    id: null,
    name: "",
    price: null,
    color: "",
    category: "",
    buyprice: null,
    quantity: 0,
    isFav: 0,
    barcode: "",
    deleted: false,
})
if (!props.isAdd)
    newItem = getItemById(props.itemId);
const editMyItem = () => {
    editItem(props.itemId, newItem.value)
    toast.add({ title: 'Item Edited' })

    props.close();
}
const addNewItem = () => {
    const { getItems, getItemsFiltered, getFavItems, getItemById, addItem } = useInventory();
    // const props = defineProps({
    //     close: {
    //         type: Boolean
    //     }
    // });
    // Assign a new id to the new item
    addItem(newItem.value);
    // Add the new item to the items array
    // props.close = false;
    toast.add({ title: 'Item Added' })
    // Reset the form
    newItem = {
        id: null,
        name: "",
        price: null,
        color: "",
        category: "",
        buyprice: null,
        quantity: 0,
        isFav: 0,
        barcode: "",
        deleted: false,
    };
    props.close();

}
const handleSubmit = () => {
    if (props.isAdd) {
        addNewItem();
    } else {
        editMyItem();
    }
};
</script>
