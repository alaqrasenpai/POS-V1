const state = reactive({
    itemsTrans: [
        {
            id: 1,
            name: "عنصر واحد",
            TransType: "sell",
            supplier: "Black",
            itemId: 1,
            date: ""
        },
        {
            id: 2,
            name: "شبس",
            TransType: "sell",
            supplier: "Black",
            itemId: 1,
            date: ""

        }, {
            id: 3,
            name: "بزر",
            TransType: "sell",
            supplier: "Black",
            itemId: 1,
            date: ""

        },
    ]
});
export const useInventoryTrans = () => {

    const getItemTransById = (id) => {
        return state.itemsTrans.find(item => item.id === id);
    };
    const getItemsTrans = () => {
        console.log("hello")
        return state.itemsTrans
    };
    const getFavitemsTrans = () => {
        return state.itemsTrans.filter(item => item.isFav === true);
    };
    const getItemsTransFiltered = (itemName) => {
        console.log("test test")
        console.log(state.itemsTrans)

        if (!itemName) {
            return state.itemsTrans;
        }

        const lowerCaseSearchTerm = itemName.toLowerCase();

        return state.itemsTrans.filter(item => {
            return (
                item.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                item.TransType.toLowerCase().includes(lowerCaseSearchTerm) ||
                item.supplier.toLowerCase().includes(lowerCaseSearchTerm) ||
                item.itemId.toString().includes(lowerCaseSearchTerm) ||
                item.date.toString().includes(lowerCaseSearchTerm) 
            );
        });
    };
    const addItemTrans = (newItem) => {
        // Assign a new unique ID to the new item
        const newId = state.itemsTrans.length ? Math.max(...state.itemsTrans.map(item => item.id)) + 1 : 1;
        const itemToAdd = { ...newItem, id: newId };

        // Add the new item to the itemsTrans array
        state.itemsTrans.push(itemToAdd);
        console.log(state.itemsTrans)
        return itemToAdd;
    };
    const editItemTrans = (id, updatedItem) => {
        const index = state.itemsTrans.findIndex(item => item.id === id);
        if (index !== -1) {
            // Merge the updated item properties with the existing item
            state.itemsTrans[index] = { ...state.itemsTrans[index], ...updatedItem };
            console.log(`Item with ID ${id} updated successfully.`);
        } else {
            console.log(`Item with ID ${id} not found.`);
        }
    };


    return { getItemsTrans, getItemsTransFiltered, addItemTrans, getFavitemsTrans, getItemTransById, editItemTrans };
};
