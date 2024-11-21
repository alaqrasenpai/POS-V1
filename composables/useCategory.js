import { reactive } from 'vue';
const state = reactive({
    categories: [{
        id: 1,
        name: "test"
    }, {
        id: 2,
        name: "test2"
    }]
});

export const useCategory = () => {

    const getCategoryById = (id) => {
        return state.categories.find(item => item.id === id);
    };

    const getCategories = () => {
        return state.categories;
    };
    const editCategory = (id, updatedItem) => {
        const index = state.items.findIndex(item => item.id === id);
        if (index !== -1) {
            // Merge the updated item properties with the existing item
            state.categories[index] = { ...state.categories[index], ...updatedItem };
            console.log(`categories with ID ${id} updated successfully.`);
        } else {
            console.log(`categories with ID ${id} not found.`);
        }
    };
    const addCategory = (newItem) => {
        const newId = state.categories.length ? Math.max(...state.categories.map(item => item.id)) + 1 : 1;
        const itemToAdd = { ...newItem, id: newId };

        state.categories.push(itemToAdd);

    };


    const deleteCategory = (id) => {
        const index = state.categories.findIndex(item => item.id === id);
        if (index !== -1) {
            state.categories.splice(index, 1);
        }
    };

    return { addCategory, getCategories, getCategoryById, deleteCategory,editCategory };
};
