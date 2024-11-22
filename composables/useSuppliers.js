const state = reactive({
    suppliers: [
        {
            id: 1,
            name: "مركز واحد",
            address: "العنوان",
            phonenumber: "0597060381",

        },
        {
            id: 2,
            name: "مركز اثنين",
            address: "العنوان",
            phonenumber: "0597060381",

        }, {
            id: 3,
            name: "مركز ثلاث",
            address: "العنوان",
            phonenumber: "0597060381",

        },
    ]
});
export const useSuppliers = () => {

    const getSupplierById = (id) => {
        return state.suppliers.find(supplier => supplier.id === id);
    };
    const getSuppliers = () => {
        console.log("hello")
        return state.suppliers
    };

    const getSuppliersFiltered = (supplierName) => {
        console.log("test test")
        console.log(state.suppliers)

        if (!supplierName) {
            return state.suppliers;
        }

        const lowerCaseSearchTerm = supplierName.toLowerCase();

        return state.suppliers.filter(supplier => {
            return (
                supplier.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                supplier.address.toLowerCase().includes(lowerCaseSearchTerm) ||
                supplier.phonenumber.toLowerCase().includes(lowerCaseSearchTerm)
            );
        });
    };
    const addSupplier = (newsupplier) => {
        // Assign a new unique ID to the new item
        const newId = state.suppliers.length ? Math.max(...state.suppliers.map(supplier => supplier.id)) + 1 : 1;
        const supplierToAdd = { ...newsupplier, id: newId };

        // Add the new item to the items array
        state.suppliers.push(supplierToAdd);
        console.log(state.suppliers)
        return supplierToAdd;
    };
    const editSupplier = (id, updatedSupplier) => {
        const index = state.suppliers.findIndex(supplier => supplier.id === id);
        if (index !== -1) {
            // Merge the updated item properties with the existing item
            state.suppliers[index] = { ...state.suppliers[index], ...updatedSupplier };
            console.log(`supplier with ID ${id} updated successfully.`);
        } else {
            console.log(`Item with ID ${id} not found.`);
        }
    };


    return { getSuppliers, getSuppliersFiltered, addSupplier, getSupplierById, editSupplier };
};
