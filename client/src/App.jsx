import { Navigate, Route, Routes } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import Layout from "./layouts/Layout.jsx";
import Home from "./pages/Home.jsx";
import Analyzer from "./pages/Analyzer.jsx";
import Compare from "./pages/Compare.jsx";
import Theory from "./pages/Theory.jsx";
import Report from "./pages/Report.jsx";
import AIAdvisor from "./pages/AIAdvisor.jsx";
import Benchmark from "./pages/Benchmark.jsx";
import Playground from "./pages/Playground.jsx";
import AlgoVisualizer from "./pages/AlgoVisualizer.jsx";
import { ALGORITHM_CATALOG } from "./data/algorithms.js";

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ type: "spring", stiffness: 170, damping: 24, mass: 0.45 }}
  >
    {children}
  </motion.div>
);

const App = () => {
  const location = useLocation();
  const algorithmsData = ALGORITHM_CATALOG;

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<Layout />}>
          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/analyzer" element={<PageWrapper><Analyzer algorithmsData={algorithmsData} /></PageWrapper>} />
          <Route path="/analyse" element={<Navigate to="/analyzer" replace />} />
          <Route path="/analyze" element={<Navigate to="/analyzer" replace />} />
          <Route path="/compare" element={<PageWrapper><Compare algorithmsData={algorithmsData} /></PageWrapper>} />
          <Route path="/theory" element={<PageWrapper><Theory algorithmsData={algorithmsData} /></PageWrapper>} />
          <Route path="/reports" element={<PageWrapper><Report /></PageWrapper>} />
          <Route path="/report" element={<Navigate to="/reports" replace />} />
          <Route path="/ai-advisor" element={<PageWrapper><AIAdvisor /></PageWrapper>} />
          <Route path="/benchmark" element={<PageWrapper><Benchmark algorithmsData={algorithmsData} /></PageWrapper>} />
          <Route path="/playground" element={<PageWrapper><Playground /></PageWrapper>} />
          <Route path="/algo-visualizer" element={<PageWrapper><AlgoVisualizer /></PageWrapper>} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

export default App;
