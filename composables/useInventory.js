import { reactive, computed } from 'vue';
import { useAuth } from '@/composables/useAuth';

const state = reactive({
    items: [
        // منتجات المتجر الأول (تجزئة)
        { id: 1, name: "كابل شحن آيفون", price: 25, color: "White", category: "Electronics", buyprice: 15, quantity: 20, isFav: true, barcode: "1001", storeId: 1, deleted: false },
        { id: 2, name: "سماعة بلوتوث", price: 150, color: "Black", category: "Electronics", buyprice: 90, quantity: 5, isFav: false, barcode: "1002", storeId: 1, deleted: false },
        { id: 3, name: "باور بانك 20ألف", price: 80, color: "Black", category: "Accessories", buyprice: 50, quantity: 12, isFav: true, barcode: "1003", storeId: 1, deleted: false },

        // منتجات المتجر الثاني (صيدلية الشفاء)
        { id: 4, name: "بندول اكسترا", price: 3.5, color: "Red", category: "Medicine", buyprice: 2.1, quantity: 50, isFav: true, barcode: "2001", storeId: 2, deleted: false },
        { id: 5, name: "فيتامين سي 1000", price: 12, color: "Orange", category: "Supplements", buyprice: 8, quantity: 30, isFav: false, barcode: "2002", storeId: 2, deleted: false },
        { id: 6, name: "معقم يدين 500مل", price: 5, color: "Clear", category: "Hygiene", buyprice: 3, quantity: 15, isFav: true, barcode: "2003", storeId: 2, deleted: false },
    ]
});

export const useInventory = () => {
    const { currentUser } = useAuth();

    // الحصول على رمز المتجر للمستخدم الحالي
    const currentStoreId = computed(() => currentUser.value?.storeId);

    const getItemById = (id) => {
        return state.items.find(item => item.id === id && item.storeId === currentStoreId.value);
    };

    const getItems = () => {
        if (!currentStoreId.value) return [];
        return state.items.filter(item => item.storeId === currentStoreId.value && !item.deleted);
    };

    const getFavItems = () => {
        if (!currentStoreId.value) return [];
        return state.items.filter(item => item.isFav && item.storeId === currentStoreId.value && !item.deleted);
    };

    const updateItemQuantity = (id, quantity) => {
        const item = state.items.find(item => item.id === id && item.storeId === currentStoreId.value);
        if (item) {
            item.quantity -= quantity;
        }
    };

    const getItemsFiltered = (itemName) => {
        const storeItems = getItems();
        if (!itemName) return storeItems;

        const lowerCaseSearchTerm = itemName.toLowerCase();

        return storeItems.filter(item => {
            return (
                item.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                item.category.toLowerCase().includes(lowerCaseSearchTerm) ||
                item.barcode.toString().includes(lowerCaseSearchTerm)
            );
        });
    };

    const addItem = (newItem) => {
        const newId = state.items.length ? Math.max(...state.items.map(item => item.id)) + 1 : 1;
        const itemToAdd = {
            ...newItem,
            id: newId,
            storeId: currentStoreId.value, // ربط المنتج بالمتجر الحالي تلقائياً
            deleted: false
        };

        state.items.push(itemToAdd);
        return itemToAdd;
    };

    const editItem = (id, updatedItem) => {
        const index = state.items.findIndex(item => item.id === id && item.storeId === currentStoreId.value);
        if (index !== -1) {
            state.items[index] = { ...state.items[index], ...updatedItem };
        }
    };

    return {
        getItems,
        getItemsFiltered,
        addItem,
        getFavItems,
        getItemById,
        editItem,
        updateItemQuantity
    };
};
