import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    admins: [],
    isLoading: false,
    error: null,
    adminData: null,
    isEditing: false
};

const adminAdminSlice = createSlice({
    name: "adminAdmins",
    initialState,
    reducers: {
        setIsEditing(state, action) {
            state.isEditing = action.payload
        },
        setAdmins: (state, action) => {
            console.log(action.payload)
            state.admins = action.payload;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        saveAdmin: (state, action) => {
            state.admins.push(action.payload);
        },
        addAdmin: (state, action) => {
            state.admins.push(action.payload);
        },
        deleteAdmin: (state, action) => {
            state.admins = state.admins.filter(
                (admin) => admin.id !== action.payload
            );
        },
        setAdminData: (state, action) => {

            state.admins = action.payload; // Set the fetched admin data
            state.isLoading = false
        },
        getAdminData: (state) => {
            state.isLoading = true

        },
        editAdmin: (state, action) => {
            state.isLoading = false
            const editedAdmin = action.payload;
        },
    },
});

export const {
    setIsEditing,
    editAdmin,
    setAdmins,
    setLoading,
    setError,
    saveAdmin,
    deleteAdmin,
    addAdmin,
    setAdminData,
    getAdminData,

} = adminAdminSlice.actions;

export default adminAdminSlice.reducer;