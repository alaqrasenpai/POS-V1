const state = reactive({
    items: [
        {
            id: 1,
            name: "عنصر واحد",
            price: 500,
            color: "Black",
            category: "Accessories",
            buyprice: 300,
            quantity: 0,
            isFav: true,
            barcode: "5a66a32",
            deleted: false,
        },
        {
            id: 2,
            name: "شبس",
            price: 300,
            color: "Black",
            category: "Accessories",
            buyprice: 300,
            quantity: 5,
            isFav: false,
            barcode: "566a3s2",
            deleted: false,

        }, {
            id: 3,
            name: "بزر",
            price: 500,
            color: "Black",
            category: "Accessories",
            buyprice: 300,
            quantity: 4,
            isFav: true,
            barcode: "566a3d2",
            deleted: false,

        },
    ]
});
export const useInventory = () => {

    const getItemById = (id) => {
        return state.items.find(item => item.id === id);
    };
    const getItems = () => {
        console.log("hello")
        return state.items
    };
    const getFavItems = () => {
        return state.items.filter(item => item.isFav === true);
    };
    const updateItemQuantity = (id, quantity) => {
        const item = state.items.find(item => item.id === id);
        if (item) {
            item.quantity -= quantity; // تحديث الكمية في المستودع
        }
    };

    const getItemsFiltered = (itemName) => {
        console.log("test test")
        console.log(state.items)

        if (!itemName) {
            return state.items;
        }

        const lowerCaseSearchTerm = itemName.toLowerCase();

        return state.items.filter(item => {
            return (
                item.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                item.color.toLowerCase().includes(lowerCaseSearchTerm) ||
                item.category.toLowerCase().includes(lowerCaseSearchTerm) ||
                item.price.toString().includes(lowerCaseSearchTerm) ||
                item.barcode.toString().includes(lowerCaseSearchTerm) ||
                item.quantity.toString().includes(lowerCaseSearchTerm)
            );
        });
    };
    const addItem = (newItem) => {
        // Assign a new unique ID to the new item
        const newId = state.items.length ? Math.max(...state.items.map(item => item.id)) + 1 : 1;
        const itemToAdd = { ...newItem, id: newId };

        // Add the new item to the items array
        state.items.push(itemToAdd);
        console.log(state.items)
        return itemToAdd;
    };
    const editItem = (id, updatedItem) => {
        const index = state.items.findIndex(item => item.id === id);
        if (index !== -1) {
            // Merge the updated item properties with the existing item
            state.items[index] = { ...state.items[index], ...updatedItem };
            console.log(`Item with ID ${id} updated successfully.`);
        } else {
            console.log(`Item with ID ${id} not found.`);
        }
    };


    return { getItems, getItemsFiltered, addItem, getFavItems, getItemById, editItem ,updateItemQuantity};
};
