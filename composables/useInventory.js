import { reactive, computed } from 'vue';
import { useAuth } from '@/composables/useAuth';

const state = reactive({
    items: new Map([
        // منتجات المتجر الأول (تجزئة)
        [1, { id: 1, name: "كابل شحن آيفون", price: 25, color: "White", category: "Electronics", buyprice: 15, quantity: 20, isFav: true, barcode: "1001", storeId: 1, deleted: false }],
        [2, { id: 2, name: "سماعة بلوتوث", price: 150, color: "Black", category: "Electronics", buyprice: 90, quantity: 5, isFav: false, barcode: "1002", storeId: 1, deleted: false }],
        [3, { id: 3, name: "باور بانك 20ألف", price: 80, color: "Black", category: "Accessories", buyprice: 50, quantity: 12, isFav: true, barcode: "1003", storeId: 1, deleted: false }],

        // منتجات المتجر الثاني (صيدلية الشفاء)
        [4, { id: 4, name: "بندول اكسترا", price: 3.5, color: "Red", category: "Medicine", buyprice: 2.1, quantity: 50, isFav: true, barcode: "2001", storeId: 2, deleted: false }],
        [5, { id: 5, name: "فيتامين سي 1000", price: 12, color: "Orange", category: "Supplements", buyprice: 8, quantity: 30, isFav: false, barcode: "2002", storeId: 2, deleted: false }],
        [6, { id: 6, name: "معقم يدين 500مل", price: 5, color: "Clear", category: "Hygiene", buyprice: 3, quantity: 15, isFav: true, barcode: "2003", storeId: 2, deleted: false }],
    ])
});

const itemsList = computed(() => Array.from(state.items.values()));

export const useInventory = () => {
    const { currentUser } = useAuth();

    // الحصول على رمز المتجر للمستخدم الحالي
    const currentStoreId = computed(() => currentUser.value?.storeId);

    const getItemById = (id) => {
        const item = state.items.get(id);
        return (item && item.storeId === currentStoreId.value) ? item : undefined;
    };

    const getItems = () => {
        if (!currentStoreId.value) return [];
        return itemsList.value.filter(item => item.storeId === currentStoreId.value && !item.deleted);
    };

    const getFavItems = () => {
        if (!currentStoreId.value) return [];
        return itemsList.value.filter(item => item.isFav && item.storeId === currentStoreId.value && !item.deleted);
    };

    const updateItemQuantity = (id, quantity) => {
        const item = state.items.get(id);
        if (item && item.storeId === currentStoreId.value) {
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
        const allItems = itemsList.value;
        const newId = allItems.length ? Math.max(...allItems.map(item => item.id)) + 1 : 1;
        const itemToAdd = {
            ...newItem,
            id: newId,
            storeId: currentStoreId.value, // ربط المنتج بالمتجر الحالي تلقائياً
            deleted: false
        };

        state.items.set(newId, itemToAdd);
        return itemToAdd;
    };

    const editItem = (id, updatedItem) => {
        const item = state.items.get(id);
        if (item && item.storeId === currentStoreId.value) {
            state.items.set(id, { ...item, ...updatedItem });
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
