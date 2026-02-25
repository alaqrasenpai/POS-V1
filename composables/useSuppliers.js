import { reactive, computed } from 'vue';
import { useAuth } from '@/composables/useAuth';

const state = reactive({
    suppliers: [
        // موردين المتجر الأول
        { id: 1, name: "شركة الأمل للإلكترونيات", address: "المنطقة الحرة", phonenumber: "010000001", storeId: 1 },
        { id: 2, name: "مصنع الأفق للبلاستيك", address: "المدينة الصناعية", phonenumber: "010000002", storeId: 1 },

        // موردين المتجر الثاني (الصيدلية)
        { id: 3, name: "مستودع أدوية الحكمة", address: "وسط البلد", phonenumber: "020000001", storeId: 2 },
        { id: 4, name: "شركة النيل للمستحضرات", address: "القاهرة الجديدة", phonenumber: "020000002", storeId: 2 },
    ]
});

export const useSuppliers = () => {
    const { currentUser } = useAuth();
    const currentStoreId = computed(() => currentUser.value?.storeId);

    const getSuppliers = () => {
        if (!currentStoreId.value) return [];
        return state.suppliers.filter(s => s.storeId === currentStoreId.value);
    };

    const getSupplierById = (id) => {
        return state.suppliers.find(s => s.id === id && s.storeId === currentStoreId.value);
    };

    const getSuppliersFiltered = (supplierName) => {
        const storeSuppliers = getSuppliers();
        if (!supplierName) return storeSuppliers;

        const lowerCaseSearchTerm = supplierName.toLowerCase();
        return storeSuppliers.filter(s => {
            return (
                s.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                s.address.toLowerCase().includes(lowerCaseSearchTerm) ||
                s.phonenumber.includes(lowerCaseSearchTerm)
            );
        });
    };

    const addSupplier = (newsupplier) => {
        const newId = state.suppliers.length ? Math.max(...state.suppliers.map(s => s.id)) + 1 : 1;
        const supplierToAdd = { ...newsupplier, id: newId, storeId: currentStoreId.value };
        state.suppliers.push(supplierToAdd);
        return supplierToAdd;
    };

    const editSupplier = (id, updatedSupplier) => {
        const index = state.suppliers.findIndex(s => s.id === id && s.storeId === currentStoreId.value);
        if (index !== -1) {
            state.suppliers[index] = { ...state.suppliers[index], ...updatedSupplier };
        }
    };

    return { getSuppliers, getSuppliersFiltered, addSupplier, getSupplierById, editSupplier };
};
