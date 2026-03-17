import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 30000
});

export const fetchAlgorithms = async () => {
  const response = await api.get("/algorithms");
  return response.data;
};

export const runAlgorithm = async (payload) => {
  const response = await api.post("/run", payload);
  return response.data;
};

export const compareAlgorithms = async (payload) => {
  const response = await api.post("/compare", payload);
  return response.data;
};

export const fetchTheory = async (name) => {
  const response = await api.get(`/theory/${name}`);
  return response.data;
};

export default api;
