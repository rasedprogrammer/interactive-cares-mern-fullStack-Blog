// blog-application/frontend/src/redux/slices/authSlice.js

import { createSlice } from '@reduxjs/toolkit';

// Get user info from localStorage if it exists
// This keeps the user logged in across page reloads (persistence)
const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('userInfo')) : null;

const initialState = {
    userInfo: user,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Reducer for Login/Registration Request
        authRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        // Reducer for Successful Login/Registration
        authSuccess: (state, action) => {
            state.loading = false;
            state.userInfo = action.payload; // Payload contains _id, name, email, role, token
            state.error = null;
            
            // Save to Local Storage (persistence)
            if (typeof window !== 'undefined') {
                localStorage.setItem('userInfo', JSON.stringify(action.payload));
            }
        },
        // Reducer for Failed Login/Registration
        authFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.userInfo = null;
            
            // Clear Local Storage
            if (typeof window !== 'undefined') {
                localStorage.removeItem('userInfo');
            }
        },
        // Reducer for Logout (FR-1.5)
        logout: (state) => {
            state.userInfo = null;
            state.loading = false;
            state.error = null;
            
            // Clear Local Storage
            if (typeof window !== 'undefined') {
                localStorage.removeItem('userInfo');
            }
        },
    },
});

export const { authRequest, authSuccess, authFailure, logout } = authSlice.actions;

export default authSlice.reducer;