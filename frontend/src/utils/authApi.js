<<<<<<< HEAD
// // blog-application/frontend/src/utils/authApi.js

// import axios from "axios";

// // Get the API URL from environment variables
// const API_URL = process.env.NEXT_PUBLIC_API_URL;

// // Function to handle user login
// export const login = async (email, password) => {
//   const config = {
//     headers: {
//       "Content-Type": "application/json",
//     },
//   };

//   const { data } = await axios.post(
//     `${API_URL}/users/login`, // URL: http://localhost:8000/api/users/login
//     { email, password },
//     config
//   );

//   return data;
// };

// // Function to handle user registration
// export const register = async (name, email, password) => {
//   const config = {
//     headers: {
//       "Content-Type": "application/json",
//     },
//   };

//   const { data } = await axios.post(
//     `${API_URL}/users/register`, // URL: http://localhost:8000/api/users/register
//     { name, email, password },
//     config
//   );

//   return data;
// };

// // @desc Request password reset link (Forgot Password)
// export const forgotPassword = async (email) => {
//   const config = { headers: { "Content-Type": "application/json" } };
//   const { data } = await axios.post(
//     `${API_URL}/users/forgot-password`,
//     { email },
//     config
//   );
//   return data.message; // Return success message
// };

// // @desc Submit new password with token
// export const resetPassword = async (token, password) => {
//   const config = { headers: { "Content-Type": "application/json" } };
//   const { data } = await axios.put(
//     `${API_URL}/users/reset-password/${token}`,
//     { password },
//     config
//   );
//   return data.message; // Return success message
// };

// // Verify email
// export const verifyEmail = async (token) => {
//   const { data } = await axios.get(`${API_URL}/users/verify-email/${token}`);
//   return data; // { message: "Email verified successfully!" }
// };

// // Resend verification email
// export const resendVerificationEmail = async (email) => {
//   const config = { headers: { "Content-Type": "application/json" } };
//   const { data } = await axios.post(
//     `${API_URL}/users/resend-verification`,
//     { email },
//     config
//   );
//   return data; // { message: 'Verification email sent!' }
// };

// blog-application/frontend/src/utils/authApi.js

import axios from "axios";

// Base API URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Axios config helper
const configJSON = { headers: { "Content-Type": "application/json" } };

// -------------------- Auth APIs --------------------

// Login user
export const login = async (email, password) => {
  const { data } = await axios.post(
    `${API_URL}/users/login`,
    { email, password },
    configJSON
  );

  // data contains: _id, name, email, role, token, isVerified
  return data;
};

// Register new user
export const register = async (name, email, password) => {
  const { data } = await axios.post(
    `${API_URL}/users/register`,
    { name, email, password },
    configJSON
  );

  // data contains: _id, name, email, role, token, isVerified, message
  return data;
};

// Resend verification email
export const resendVerificationEmail = async (email) => {
  const { data } = await axios.post(
    `${API_URL}/users/resend-verification`,
    { email },
    configJSON
  );

  return data; // { message: 'Verification email sent!' }
};

// Verify email using token
export const verifyEmail = async (token) => {
  const { data } = await axios.get(`${API_URL}/users/verify-email/${token}`);
  return data; // { message: "Email verified successfully", token, user: {...} }
};

// Request password reset (forgot password)
export const forgotPassword = async (email) => {
  const { data } = await axios.post(
    `${API_URL}/users/forgot-password`,
    { email },
    configJSON
  );
  return data; // { message: "Password reset link sent!" }
};

// Reset password using token
export const resetPassword = async (token, password) => {
  const { data } = await axios.put(
    `${API_URL}/users/reset-password/${token}`,
    { password },
    configJSON
  );
  return data; // { message: "Password reset successful!" }
};
=======
// blog-application/frontend/src/utils/authApi.js

import axios from 'axios';

// Get the API URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Function to handle user login
export const login = async (email, password) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const { data } = await axios.post(
        `${API_URL}/users/login`, // URL: http://localhost:8000/api/users/login
        { email, password },
        config
    );

    return data;
};

// Function to handle user registration
export const register = async (name, email, password) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const { data } = await axios.post(
        `${API_URL}/users/register`, // URL: http://localhost:8000/api/users/register
        { name, email, password },
        config
    );

    return data;
};



// @desc Request password reset link (Forgot Password)
export const forgotPassword = async (email) => {
    const config = { headers: { 'Content-Type': 'application/json' } };
    const { data } = await axios.post(`${API_URL}/users/forgot-password`, { email }, config);
    return data.message; // Return success message
};

// @desc Submit new password with token
export const resetPassword = async (token, password) => {
    const config = { headers: { 'Content-Type': 'application/json' } };
    const { data } = await axios.put(`${API_URL}/users/reset-password/${token}`, { password }, config);
    return data.message; // Return success message
};
>>>>>>> 6f42eb0e80347aacea666ba624841bb26b06cb86
