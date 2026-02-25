import { reactive, computed } from 'vue';
import { useAuth } from '@/composables/useAuth';

const state = reactive({
    warehouses: [
        { id: 1, name: 'المستودع الرئيسي', storeId: 1, location: 'الرياض' },
        { id: 2, name: 'مستودع المعرض', storeId: 1, location: 'جدة' },
        { id: 3, name: 'المخزن الرئيسي', storeId: 2, location: 'الدمام' },
    ]
});

export const useWarehouses = () => {
    const { currentUser } = useAuth();
    const currentStoreId = computed(() => currentUser.value?.storeId);

    const getWarehouses = () => {
        if (!currentStoreId.value) return [];
        return state.warehouses.filter(w => w.storeId === currentStoreId.value);
    };

    const getWarehouseById = (id) => {
        return state.warehouses.find(w => w.id === id && w.storeId === currentStoreId.value);
    };

    const addWarehouse = (data) => {
        const newId = state.warehouses.length ? Math.max(...state.warehouses.map(w => w.id)) + 1 : 1;
        state.warehouses.push({
            ...data,
            id: newId,
            storeId: currentStoreId.value
        });
    };

    const updateWarehouse = (id, data) => {
        const index = state.warehouses.findIndex(w => w.id === id && w.storeId === currentStoreId.value);
        if (index !== -1) {
            state.warehouses[index] = { ...state.warehouses[index], ...data };
        }
    }

    return {
        getWarehouses,
        getWarehouseById,
        addWarehouse,
        updateWarehouse
    };
};
