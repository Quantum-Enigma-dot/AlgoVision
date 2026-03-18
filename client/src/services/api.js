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

// --- AI Advisor ---

export const aiExplain = async (algorithm, context = "") => {
  const response = await api.post("/ai/explain", { algorithm, context });
  return response.data;
};

export const aiSuggest = async (problem) => {
  const response = await api.post("/ai/suggest", { problem });
  return response.data;
};

export const aiAnalyze = async (code, language = "python") => {
  const response = await api.post("/ai/analyze", { code, language });
  return response.data;
};

// --- Benchmark ---

export const runBenchmark = async (category, algorithm, sizes) => {
  const response = await api.post("/benchmark", { category, algorithm, sizes });
  return response.data;
};

// --- Playground ---

export const runPlayground = async (code, language = "python") => {
  const response = await api.post("/playground/run", { code, language });
  return response.data;
};

// --- Algorithm Visualizer ---

export const algoVisualize = async (code, language = "python") => {
  const response = await api.post("/algo-visualize", { code, language });
  return response.data;
};

// --- Code Visualization ---

export const codeViz = async (code, language = "python", action = "flow") => {
  const response = await api.post("/codeviz", { code, language, action });
  return response.data;
};

export default api;
