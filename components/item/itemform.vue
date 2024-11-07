<template>
    <div>
        <form @submit.prevent="handleSubmit">
            <div>
                <label for="name">Name:</label>
                <input v-model="newItem.name" id="name" required />
            </div>
            <div>
                <label for="price">Price:</label>
                <input v-model="newItem.price" id="price" type="number" required />
            </div>
            <div>
                <label for="buyprice">Buy Price:</label>
                <input v-model="newItem.buyprice" id="buyprice" type="number" required />
            </div>
            <div>
                <label for="color">Color:</label>
                <input v-model="newItem.color" id="color" />
            </div>
            <div>
                <label for="category">Category:</label>
                <input v-model="newItem.category" id="category" />
            </div>
            <div>
                <label for="quantity">Quantity:</label>
                <input v-model="newItem.quantity" id="quantity" type="number" />
            </div>
            <div>
                <input v-model="newItem.isFav" id="isFav" type="checkbox" />
                <label for="isFav">Is Favorite</label>
            </div>
            <div>
                <input v-model="newItem.deleted" id="deleted" type="checkbox" />
                <label for="deleted">Is Deleted</label>
            </div>
            <div>
                <label for="barcode">Barcode:</label>
                <input v-model="newItem.barcode" id="barcode" />
            </div>
            <button v-if="props.isAdd" type="submit" @click="$emit('closePOP')">Add
                Item</button>
            <button v-if="!props.isAdd" @click="$emit('closePOP')" type="submit">Edit
                Item</button>
        </form>


    </div>
</template>

<script setup>
import { useMessage } from 'naive-ui'

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
    message.info(
        'I don\'t know why nobody told you how to unfold your love',
        { duration: 5000 }
    )
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
