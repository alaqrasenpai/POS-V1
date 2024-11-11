<template>
    <div>
        <form @submit.prevent="handleSubmit">
            <div>
                <n-form-item label="Name :">
                    <n-input placeholder="Name" v-model:value="newItem.name" id="name" required />
                </n-form-item>

            </div>
            <div>
                <n-form-item label="Price :">
                    <n-input placeholder="Price" v-model:value="newItem.price" id="price" type="number" required />
                </n-form-item>

            </div>
            <div>
                <n-form-item label="Buy Price :">
                    <n-input placeholder="Buy Price" v-model:value="newItem.buyprice" id="buyprice" type="number"
                        required />
                </n-form-item>

            </div>
            <div>
                <n-form-item label="Color :">
                    <n-input placeholder="Color" v-model:value="newItem.color" id="color" />

                </n-form-item>

            </div>
            <div>
                <n-form-item label="Category :">
                    <n-input placeholder="Category" v-model:value="newItem.category" id="category" />

                </n-form-item>
            </div>
            <div>
                <n-form-item label="Quantity :">
                    <n-input placeholder="Quantity" v-model:value="newItem.quantity" id="quantity" type="number" />

                </n-form-item>

                
            </div>
            <div>
                <n-checkbox v-model:value="newItem.isFav" id="isFav" size="large" label="Is Favorite" />

            </div>
            <div>
                <n-checkbox v-model:value="newItem.deleted" size="large" label="Is Deleted" id="deleted"
                    type="checkbox" />
            </div>
            <div>
                <n-form-item label="Barcode :">
                    <n-input placeholder="Barcode" v-model:value="newItem.barcode" id="barcode" />

                </n-form-item>

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
