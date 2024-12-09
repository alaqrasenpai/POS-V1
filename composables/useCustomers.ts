import { reactive } from 'vue';

const state = reactive({
    customers: [
        {
            id: 1,
            name: "John Doe",
            email: "john.doe@example.com",
            address: "123 Main St, Springfield",
            phoneNumber: "123-456-7890",
            isFav: true, // Example of favorite customer
        },
        {
            id: 2,
            name: "Jane Smith",
            email: "jane.smith@example.com",
            address: "456 Elm St, Springfield",
            phoneNumber: "987-654-3210",
            isFav: false,
        },
        {
            id: 3,
            name: "Ahmad Ali",
            email: "ahmad.ali@example.com",
            address: "789 Pine St, Springfield",
            phoneNumber: "555-123-4567",
            isFav: false,
        },
    ]
});

export const useCustomers = () => {

    // Get customer by ID
    const getCustomerById = (id) => {
        return state.customers.find(customer => customer.id === id);
    };

    // Get all customers
    const getCustomers = () => {
        return state.customers;
    };

    // Get favorite customers (if you need to filter customers marked as favorites)
    const getFavCustomers = () => {
        return state.customers.filter(customer => customer.isFav === true);
    };

    // Get filtered customers based on a search term (name, email, address, phone)
    const getCustomersFiltered = (searchTerm) => {
        if (!searchTerm) {
            return state.customers;
        }

        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        return state.customers.filter(customer => {
            return (
                customer.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                customer.email.toLowerCase().includes(lowerCaseSearchTerm) ||
                customer.address.toLowerCase().includes(lowerCaseSearchTerm) ||
                customer.phoneNumber.includes(lowerCaseSearchTerm)
            );
        });
    };

    // Add a new customer
    const addCustomer = (newCustomer) => {
        const newId = state.customers.length ? Math.max(...state.customers.map(customer => customer.id)) + 1 : 1;
        const customerToAdd = { ...newCustomer, id: newId };

        state.customers.push(customerToAdd);
        console.log(state.customers);
        return customerToAdd;
    };

    // Edit an existing customer
    const editCustomer = (id, updatedCustomer) => {
        const index = state.customers.findIndex(customer => customer.id === id);
        if (index !== -1) {
            state.customers[index] = { ...state.customers[index], ...updatedCustomer };
            console.log(`Customer with ID ${id} updated successfully.`);
        } else {
            console.log(`Customer with ID ${id} not found.`);
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
