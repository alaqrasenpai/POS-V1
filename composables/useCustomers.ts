import { reactive, computed } from 'vue';
import { useAuth } from '@/composables/useAuth';

const state = reactive({
    customers: [
        // عملاء المتجر الأول
        { id: 1, name: "محمد أحمد", email: "mohamed@example.com", address: "عمان", phoneNumber: "079000000", isFav: true, storeId: 1 },
        { id: 2, name: "زياد خالد", email: "ziad@example.com", address: "إربد", phoneNumber: "078000000", isFav: false, storeId: 1 },

        // عملاء المتجر الثاني (الصيدلية)
        { id: 3, name: "ليلى حسن", email: "layla@example.com", address: "القاهرة", phoneNumber: "011000000", isFav: true, storeId: 2 },
        { id: 4, name: "د. إبراهيم", email: "ibrahim@example.com", address: "الجيزة", phoneNumber: "012000000", isFav: false, storeId: 2 },
    ]
});

export const useCustomers = () => {
    const { currentUser } = useAuth();
    const currentStoreId = computed(() => currentUser.value?.storeId);

    const getCustomers = () => {
        if (!currentStoreId.value) return [];
        return state.customers.filter(c => c.storeId === currentStoreId.value);
    };

    const getCustomerById = (id) => {
        return state.customers.find(c => c.id === id && c.storeId === currentStoreId.value);
    };

    const getFavCustomers = () => {
        return getCustomers().filter(c => c.isFav);
    };

    const getCustomersFiltered = (searchTerm) => {
        const storeCustomers = getCustomers();
        if (!searchTerm) return storeCustomers;

        const lower = searchTerm.toLowerCase();
        return storeCustomers.filter(c =>
            c.name.toLowerCase().includes(lower) ||
            c.phoneNumber.includes(lower)
        );
    };

    const addCustomer = (newCustomer) => {
        const newId = state.customers.length ? Math.max(...state.customers.map(c => c.id)) + 1 : 1;
        const customerToAdd = { ...newCustomer, id: newId, storeId: currentStoreId.value };
        state.customers.push(customerToAdd);
        return customerToAdd;
    };

    const editCustomer = (id, updatedCustomer) => {
        const index = state.customers.findIndex(c => c.id === id && c.storeId === currentStoreId.value);
        if (index !== -1) {
            state.customers[index] = { ...state.customers[index], ...updatedCustomer };
        }
    };

    return {
        getCustomers,
        getCustomersFiltered,
        addCustomer,
        getFavCustomers,
        getCustomerById,
        editCustomer
    };
};
