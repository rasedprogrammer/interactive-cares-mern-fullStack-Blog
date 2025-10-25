import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Your backend URL
  withCredentials: true, // allows cookies/JWT
});

export default api;
