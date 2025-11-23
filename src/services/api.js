import axios from "axios";

const API = axios.create({
  baseURL: "https://todo-backend-neon-chi.vercel.app/api",
});

export default API;
