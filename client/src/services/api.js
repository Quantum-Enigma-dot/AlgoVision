import axios from "axios";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api").replace(/\/$/, "");

const api = axios.create({
  baseURL: API_BASE_URL,
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

export const aiGenerateCode = async (prompt, language = "python") => {
  const response = await api.post("/ai/generate-code", { prompt, language });
  return response.data;
};

// --- Complexity Forensics (Offline) ---

export const analyzeComplexityForensics = async (code, language = "python") => {
  const response = await api.post("/complexity-forensics/analyze", { code, language });
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

export const judgePracticeCode = async (payload) => {
  const response = await api.post("/practice/judge", payload);
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
