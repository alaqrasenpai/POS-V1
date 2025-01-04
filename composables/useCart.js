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
        const itemInInventory = getItemById(newItem.id); // الحصول على العنصر من المخزون

        if (itemInInventory && itemInInventory.quantity >= newItem.quantity) {
            const existingItem = state.cartItems.find(item => item.id === newItem.id);

            if (existingItem) {
                // إذا كان العنصر موجودًا في السلة، تأكد من أن الكلية لا تتجاوز الكمية المتاحة
                if (existingItem.quantity + 1 <= itemInInventory.quantity) {
                    existingItem.quantity += 1; // تحديث الكمية في السلة
                } else {
                    alert(`الكمية المطلوبة (${existingItem.quantity + newItem.quantity}) تتجاوز الكمية المتاحة في المخزون (${itemInInventory.quantity})!`);
                }
            } else {
                // إذا كان العنصر غير موجود في السلة، أضفه بشرط ألا تتجاوز الكمية المتاحة
                if (newItem.quantity <= itemInInventory.quantity) {
                    state.cartItems.push({ ...newItem, quantity: 1 });
                } else {
                    alert(`الكمية المطلوبة (${newItem.quantity}) تتجاوز الكمية المتاحة في المخزون (${itemInInventory.quantity})!`);
                }
            }
        } else {
            alert("الكمية غير متاحة في المخزون!");
        }
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