<template>
    <div>
        <form @submit.prevent="handleSubmit">
            <!-- Form Field for Category Name -->
            <n-form-item label="Category Name:">
                <n-input placeholder="Enter category name" v-model:value="newCategory.name" id="name" required />
            </n-form-item>

            <!-- Add and Edit Buttons -->
            <n-button v-if="isAdd" type="primary" @click="handleAdd">
                Add Category
            </n-button>
            <n-button v-else type="primary" @click="handleEdit">
                Edit Category
            </n-button>
        </form>
    </div>
</template>

<script setup>
// Import necessary modules
import { ref } from 'vue'
// import { useCategory } from '@/composables' // Adjust import path as needed

// Define props with defineProps
const props = defineProps({
    categoryId: {
        type: Number,
        required: false
    },
    close: {
        type: Function,
        required: true
    },
    isAdd: {
        type: Boolean,
        required: true
    }
})

// Set up category data and functions
const { addCategory, editCategory, getCategoryById } = useCategory()

// Initialize newCategory with reactive state
let newCategory = ref({
    id: null,
    name: ""
})

// Load existing category data only if editing and categoryId is provided
if (!props.isAdd && props.categoryId) {
    newCategory.value = getCategoryById(props.categoryId)
}

// Add new category function
const handleAdd = () => {
    addCategory(newCategory.value)
    props.close() // Close the modal after adding
    resetForm()
}

// Edit existing category function
const handleEdit = () => {
    editCategory(props.categoryId, newCategory.value)
    props.close() // Close the modal after editing
}

// Reset form function
const resetForm = () => {
    newCategory.value = {
        id: null,
        name: ""
    }
}
</script>
