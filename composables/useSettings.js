// composables/useSettings.js
import { computed } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useStores } from '@/composables/useStores';

export const useSettings = () => {
    const { currentUser } = useAuth();
    const { getStoreById } = useStores();

    // استخراج إعدادات المتجر الحالي بناءً على المستخدم المسجل
    const settings = computed(() => {
        const storeId = currentUser.value?.storeId;
        if (!storeId) {
            return {
                shopName: 'نظام POS الذكي',
                currency: 'ريال',
                address: '',
                phone: '',
                taxRate: 0,
                footerText: 'شكراً لتعاملكم معنا'
            };
        }

        const store = getStoreById(storeId);
        return store ? store.settings : {};
    });

    const updateSettings = (newSettings) => {
        const { updateStore } = useStores();
        const storeId = currentUser.value?.storeId;
        if (storeId) {
            updateStore(storeId, { settings: { ...settings.value, ...newSettings } });
        }
    };

    const getSettings = () => settings.value;
    const getCurrency = () => settings.value.currency || 'ريال';
    const getShopName = () => settings.value.shopName || 'النظام السحابي';

    return {
        settings,
        updateSettings,
        getSettings,
        getCurrency,
        getShopName
    };
};
