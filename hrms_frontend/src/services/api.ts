import axios from "axios";

const api = axios.create({
  baseURL: "https://etharademo.pythonanywhere.com/api/",
});

export default api;
