import { reactive } from 'vue';
const state = reactive({
    cartItems: []
});

export const useCart = () => {

    const getItemById = (id) => {
        return state.cartItems.find(item => item.id === id);
    };

    const getCartItems = () => {
        return state.cartItems;
    };

    const addItem = (newItem) => {
        // Find the item in the cartItems array
        const existingItem = state.cartItems.find(item => item.id === newItem.id);

        if (existingItem) {
            // If item exists, increment the quantity
            existingItem.quantity += newItem.quantity;
        } else {
            // If item does not exist, add it to the cart with a quantity of 1
            state.cartItems.push({ ...newItem, quantity: 1 });
        }
    };
    const clearCart = () => {
        state.cartItems = [];
    };

    return { getCartItems, getItemById, addItem, clearCart };
};
