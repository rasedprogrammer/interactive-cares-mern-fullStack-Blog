// blog-application/frontend/src/utils/authApi.js

import axios from "axios";

// Get the API URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Function to handle user login
export const login = async (email, password) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
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
      "Content-Type": "application/json",
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
  const config = { headers: { "Content-Type": "application/json" } };
  const { data } = await axios.post(
    `${API_URL}/users/forgot-password`,
    { email },
    config
  );
  return data.message; // Return success message
};

// @desc Submit new password with token
export const resetPassword = async (token, password) => {
  const config = { headers: { "Content-Type": "application/json" } };
  const { data } = await axios.put(
    `${API_URL}/users/reset-password/${token}`,
    { password },
    config
  );
  return data.message; // Return success message
};
