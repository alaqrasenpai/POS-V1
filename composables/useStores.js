// composables/useStores.js
export const useStores = () => {
    // قائمة المتاجر المشتركة في المنصة
    const stores = useState('platform_stores', () => [
        {
            id: 1,
            name: 'متجر التجزئة الأول',
            slug: 'store-1',
            logo: '',
            ownerId: 1,
            active: true,
            registeredPhone: '0123456789',
            createdAt: '2024-01-10',
            plan: 'Pro',
            status: 'paid',
            settings: {
                currency: 'ريال',
                shopName: 'متجر التجزئة الأول'
            }
        },
        {
            id: 2,
            name: 'صيدلية الشفاء',
            slug: 'pharmacy-1',
            logo: '',
            ownerId: 4,
            active: true,
            registeredPhone: '0555555555',
            createdAt: '2024-02-15',
            plan: 'Basic',
            status: 'trial',
            settings: {
                currency: 'جنيه',
                shopName: 'صيدلية الشفاء'
            }
        }
    ]);

    const getStores = () => stores.value;

    const getStoreById = (id) => stores.value.find(s => s.id === Number(id));

    const getStoreBySlug = (slug) => stores.value.find(s => s.slug === slug);

    const toggleStoreStatus = (id) => {
        const index = stores.value.findIndex(s => s.id === id);
        if (index !== -1) {
            stores.value[index].active = !stores.value[index].active;
            stores.value[index].status = stores.value[index].active ? 'paid' : 'suspended';
        }
    };

    const addStore = (storeData) => {
        const newId = stores.value.length ? Math.max(...stores.value.map(s => s.id)) + 1 : 1;
        stores.value.push({
            ...storeData,
            id: newId,
            active: true,
            createdAt: new Date().toISOString().split('T')[0],
            status: 'trial'
        });
    };

    const updateStore = (id, updatedData) => {
        const index = stores.value.findIndex(s => s.id === id);
        if (index !== -1) {
            stores.value[index] = { ...stores.value[index], ...updatedData };
        }
    };

    return {
        getStores,
        getStoreById,
        getStoreBySlug,
        addStore,
        updateStore
    };
};
