import { useAuth } from '@/composables/useAuth';

export const useCategory = () => {
    const { currentUser } = useAuth();
    const currentStoreId = computed(() => currentUser.value?.storeId);

    // استخدام useState لمشاركة الحالة بين الصفحات في Nuxt 3
    const categories = useState('categories_list', () => [
        // تصنيفات المتجر الأول
        { id: 1, name: "إلكترونيات", storeId: 1 },
        { id: 2, name: "إكسسوارات", storeId: 1 },

        // تصنيفات المتجر الثاني (الصيدلية)
        { id: 3, name: "أدوية", storeId: 2 },
        { id: 4, name: "فيتامينات", storeId: 2 },
        { id: 5, name: "نظافة شخصية", storeId: 2 }
    ]);

    const getCategories = () => {
        if (!currentStoreId.value) return [];
        return categories.value.filter(c => c.storeId === currentStoreId.value);
    };

    const getCategoryById = (id) => {
        return categories.value.find(item => item.id === Number(id) && item.storeId === currentStoreId.value);
    };

    const getCategoriesFiltered = (term) => {
        const storeCats = getCategories();
        if (!term) return storeCats;
        const lowerTerm = term.toLowerCase();
        return storeCats.filter(cat => cat.name.toLowerCase().includes(lowerTerm));
    };

    const addCategory = (newItem) => {
        const newId = categories.value.length ? Math.max(...categories.value.map(item => item.id)) + 1 : 1;
        const itemToAdd = { ...newItem, id: newId, storeId: currentStoreId.value };
        categories.value.push(itemToAdd);

        const { addLog } = useActivityLog();
        addLog('إضافة تصنيف', `تم إضافة تصنيف جديد: ${newItem.name}`, 'success');
    };

    const editCategory = (id, updatedItem) => {
        const index = categories.value.findIndex(item => item.id === Number(id) && item.storeId === currentStoreId.value);
        if (index !== -1) {
            const oldName = categories.value[index].name;
            categories.value[index] = { ...categories.value[index], ...updatedItem };
            const { addLog } = useActivityLog();
            addLog('تعديل تصنيف', `تم تعديل التصنيف ${oldName} إلى ${updatedItem.name}`, 'info');
        }
    };

    const deleteCategory = (id) => {
        const index = categories.value.findIndex(item => item.id === Number(id) && item.storeId === currentStoreId.value);
        if (index !== -1) {
            const catName = categories.value[index].name;
            categories.value.splice(index, 1);
            const { addLog } = useActivityLog();
            addLog('حذف تصنيف', `تم حذف التصنيف: ${catName}`, 'warning');
        }
    };

    return {
        addCategory,
        getCategories,
        getCategoryById,
        deleteCategory,
        editCategory,
        getCategoriesFiltered
    };
};
