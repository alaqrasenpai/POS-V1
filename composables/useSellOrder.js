import { reactive, computed } from 'vue';
import { useAuth } from '@/composables/useAuth';

const state = reactive({
    sellOrders: []
});

export const useSellOrder = () => {
    const { currentUser } = useAuth();
    const currentStoreId = computed(() => currentUser.value?.storeId);

    const getSellOrderById = (id) => {
        return state.sellOrders.find(order => order.id === id && order.storeId === currentStoreId.value);
    };

    const getAlldSellOrders = () => {
        if (!currentStoreId.value) return [];
        return state.sellOrders.filter(order => order.storeId === currentStoreId.value);
    };

    const addSellOrder = (newItem) => {
        if (!currentStoreId.value) return null;

        const newId = state.sellOrders.length ? Math.max(...state.sellOrders.map(order => order.id)) + 1 : 1;

        const orderToAdd = {
            ...newItem,
            id: newId,
            storeId: currentStoreId.value // ربط الفاتورة بالمتجر الحالي
        };

        state.sellOrders.push(orderToAdd);
        return newId;
    };

    return { addSellOrder, getAlldSellOrders, getSellOrderById };
};
