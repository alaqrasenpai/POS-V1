import { reactive } from 'vue';
import { useInventory } from '@/composables/useInventory'; // استيراد الدالة المستخدمة للوصول إلى المخزون

const state = reactive({    // تعريف الحالة الخاصة بالسلة
    cartItems: []
});

export const useCart = () => { // تعريف الدالة المستخدمة للوصول إلى السلة
    const { getItemById, updateItemQuantity } = useInventory();

    const getCartItems = () => { // الدالة المستخدمة للحصول على العناصر الموجودة في السلة
        return state.cartItems;
    };

    const addItem = (newItem) => {
        const itemInInventory = getItemById(newItem.id);

        if (!itemInInventory || itemInInventory.quantity <= 0) {
            return { success: false, error: 'out_of_stock' };
        }

        const existingItem = state.cartItems.find(item => item.id === newItem.id);
        const currentInCart = existingItem ? existingItem.quantity : 0;
        const requestedQuantity = 1; // Default behavior is adding 1

        if (currentInCart + requestedQuantity > itemInInventory.quantity) {
            return {
                success: false,
                error: 'limit_exceeded',
                available: itemInInventory.quantity,
                inCart: currentInCart
            };
        }

        if (existingItem) {
            existingItem.quantity += requestedQuantity;
        } else {
            state.cartItems.push({ ...newItem, quantity: requestedQuantity });
        }

        return { success: true };
    };

    const clearCart = () => {
        state.cartItems = [];
    };

    const completeSale = () => {
        for (const item of state.cartItems) {
            updateItemQuantity(item.id, item.quantity); // تحديث كمية المستودع
        }
        clearCart(); // إفراغ السلة بعد إتمام البيع
    };

    return { getCartItems, addItem, clearCart, completeSale };
};