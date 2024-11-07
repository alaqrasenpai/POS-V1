import { reactive } from 'vue';
const state = reactive({
    sellOrders: []
});

export const useSellOrder = () => {

    const getSellOrderById = (id) => {
        return state.sellOrders.find(item => item.id === id);
    };

    const getAlldSellOrders = () => {
        return state.sellOrders;
    };

    const addSellOrder = (newItem) => {
        // Get the current list of sell orders
        const sellOrders = state.sellOrders;

        // Determine the new id
        let newId = 1; // Default to 1 if there are no sell orders
        if (sellOrders.length > 0) {
            // Find the max id in the existing orders
            const maxId = Math.max(...sellOrders.map(order => order.id));
            newId = maxId + 1;
        }

        // Set the new item's id
        newItem.id = newId;
        console.log(newItem)
        // Add the new item to the list
        sellOrders.push(newItem);
        return newId
    };


    return { addSellOrder, getAlldSellOrders, getSellOrderById };
};
