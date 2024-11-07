import { reactive } from 'vue';
const state = reactive({
    sellOrdersDtl: []
});

export const useSellOrderDtl = () => {

    const getaSellOrdeDtlrById = (id) => {
        return state.sellOrdersDtl.find(item => item.id === id);
    };

    const getAllSellOrdeDtl = () => {
        return state.sellOrdersDtl;
    };

    const addSellOrdeDtl = (newItem) => {
        const sellOrdersDtl = state.sellOrdersDtl;

        let newId = 1; // Default to 1 if there are no sell orders
        if (sellOrdersDtl.length > 0) {
            // Find the max id in the existing orders
            const maxId = Math.max(...sellOrdersDtl.map(order => order.id));
            newId = maxId + 1;
        }
        newItem.id = newId;

        state.sellOrdersDtl.push(newItem);
        console.log(sellOrdersDtl)
    };


    return { getaSellOrdeDtlrById, addSellOrdeDtl, getAllSellOrdeDtl };
};
