import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Bot, TrendingUp, Terminal, BarChart2, BookOpen, GitCompare, Cpu, Layers, Zap, Code2, Users, FlaskConical } from "lucide-react";
import { ALGORITHM_CATALOG, getLanguages, normalizeCategoryLabel } from "../data/algorithms.js";

const FEATURES = [
  {
    title: "Algorithm Analyzer",
    description: "Run algorithms step-by-step with live visualizations, synced code highlighting, and voice-guided explanations.",
    color: "from-emerald-500/30 to-teal-500/10",
    borderHover: "hover:border-emerald-300/40",
    icon: BarChart2,
    to: "/analyzer",
  },
  {
    title: "Practice Lab (Offline Q++)",
    description: "Generate local AI-like algorithm challenges with easy, medium, and hard levels. No external API calls.",
    color: "from-teal-500/30 to-emerald-500/10",
    borderHover: "hover:border-teal-300/40",
    icon: FlaskConical,
    to: "/practice",
  },
  {
    title: "Compare & Benchmark",
    description: "Side-by-side comparison and scalability benchmark with beautiful performance charts.",
    color: "from-amber-500/30 to-orange-500/10",
    borderHover: "hover:border-amber-300/40",
    icon: GitCompare,
    to: "/compare",
  },
  {
    title: "AI Advisor",
    description: "Get algorithm explanations, problem-based suggestions, and guided tutoring.",
    color: "from-violet-500/30 to-purple-500/10",
    borderHover: "hover:border-violet-300/40",
    icon: Bot,
    to: "/ai-advisor",
  },
  {
    title: "Complexity Forensics (Offline)",
    description: "Paste C, Python, C++, Java, or Go code and get offline time/space complexity with a reasoning trace.",
    color: "from-amber-500/30 to-yellow-500/10",
    borderHover: "hover:border-amber-300/40",
    icon: Code2,
    to: "/complexity-forensics",
  },
  {
    title: "Theory Library",
    description: "Deep-dive into complexity, paradigms, use cases, and optimization tips for every algorithm.",
    color: "from-blue-500/30 to-indigo-500/10",
    borderHover: "hover:border-blue-300/40",
    icon: BookOpen,
    to: "/theory",
  },
  {
    title: "Scalability Benchmarker",
    description: "Test how algorithms scale with multi-size inputs and visualize performance curves.",
    color: "from-cyan-500/30 to-sky-500/10",
    borderHover: "hover:border-cyan-300/40",
    icon: TrendingUp,
    to: "/benchmark",
  },
  {
    title: "Code Playground",
    description: "Write, edit, and run Python, C, C++, JavaScript, Java, and Go in one sandboxed environment.",
    color: "from-pink-500/30 to-rose-500/10",
    borderHover: "hover:border-pink-300/40",
    icon: Terminal,
    to: "/playground",
  },
];

const CATEGORY_COLORS = {
  sorting: { bg: "bg-emerald-400/15", text: "text-emerald-200", border: "border-emerald-300/30" },
  graph: { bg: "bg-amber-400/15", text: "text-amber-200", border: "border-amber-300/30" },
  dp: { bg: "bg-blue-400/15", text: "text-blue-200", border: "border-blue-300/30" },
  string: { bg: "bg-pink-400/15", text: "text-pink-200", border: "border-pink-300/30" },
};

const Home = () => {
  const categoryAlgoCounts = {};
  ALGORITHM_CATALOG.forEach((a) => {
    categoryAlgoCounts[a.category] = (categoryAlgoCounts[a.category] || 0) + 1;
  });

  const stats = [
    { label: "Algorithms", value: `${ALGORITHM_CATALOG.length}+`, icon: Cpu },
    { label: "Categories", value: String(Object.keys(categoryAlgoCounts).length), icon: Layers },
    { label: "Languages", value: String(getLanguages().length), icon: Code2 },
    { label: "Visualizations", value: "Live + Voice", icon: Zap },
  ];

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 panel p-8 md:p-12">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-25" />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.85, delay: 0.1 }}
          className="pointer-events-none absolute right-0 top-6 h-80 w-80 rounded-full bg-violet-500/15 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl"
        />

        <div className="relative grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-6">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-400/15 px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-emerald-200"
            >
              <Zap size={12} /> Interactive Algorithm Lab
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-balance text-4xl font-bold leading-tight text-sky md:text-5xl lg:text-[3.4rem]"
            >
              AlgoVision{" "}
              <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-violet-300 bg-clip-text text-transparent">
                Visualize, Analyze
              </span>{" "}
              & Optimize
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-xl text-base leading-7 text-sky/70"
            >
              The upgraded algorithm lab: voice-guided visual execution, offline Complexity Forensics for C/Python/C++/Java/Go, benchmarking, and multilingual playground execution.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="flex flex-wrap gap-3"
            >
              <Link
                to="/analyzer"
                className="rounded-full border border-emerald-200/40 bg-emerald-400/20 px-6 py-3 text-sm font-semibold text-emerald-100 shadow-glow transition hover:-translate-y-0.5 hover:bg-emerald-300/30"
              >
                Open Analyzer
              </Link>
              <Link
                to="/ai-advisor"
                className="rounded-full border border-violet-200/40 bg-violet-400/20 px-6 py-3 text-sm font-semibold text-violet-100 transition hover:-translate-y-0.5 hover:bg-violet-300/30"
              >
                Open AI Tutor
              </Link>
              <Link
                to="/complexity-forensics"
                className="rounded-full border border-amber-200/40 bg-amber-400/20 px-6 py-3 text-sm font-semibold text-amber-100 transition hover:-translate-y-0.5 hover:bg-amber-300/30"
              >
                Open Complexity Forensics
              </Link>
              <Link
                to="/benchmark"
                className="rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold text-sky/90 transition hover:-translate-y-0.5 hover:border-white/45"
              >
                Run Benchmark
              </Link>
            </motion.div>
          </div>

          {/* Stats Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass rounded-2xl p-6"
          >
            <h2 className="text-lg font-semibold text-sky">Platform at a Glance</h2>
            <div className="mt-5 grid grid-cols-2 gap-4">
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    className="rounded-xl border border-white/10 bg-white/5 p-4 text-center"
                  >
                    <Icon size={20} className="mx-auto text-emerald-300/70" />
                    <p className="mt-2 text-2xl font-bold text-sky">{stat.value}</p>
                    <p className="text-xs text-sky/50">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-5 space-y-2">
              {Object.entries(categoryAlgoCounts).map(([cat, count]) => {
                const colors = CATEGORY_COLORS[cat] || {};
                return (
                  <div key={cat} className={`flex items-center justify-between rounded-lg border ${colors.border} ${colors.bg} px-3 py-2`}>
                    <span className={`text-sm font-medium ${colors.text}`}>{normalizeCategoryLabel(cat)}</span>
                    <span className={`text-xs ${colors.text}`}>{count} algorithms</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Cards */}
      <section>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 text-center text-2xl font-bold text-sky"
        >
          Everything You Need to{" "}
          <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
            Master Algorithms
          </span>
        </motion.h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 * index }}
                whileHover={{ y: -6 }}
                className="h-full"
              >
                <Link
                  to={card.to}
                  className={`group relative block h-full rounded-2xl border border-white/10 bg-gradient-to-br ${card.color} p-6 shadow-glass transition hover:scale-[1.02] ${card.borderHover} hover:shadow-[0_0_24px_rgba(34,211,238,0.15)]`}
                >
                  <div className="mb-3 inline-flex rounded-lg bg-white/10 p-2.5">
                    <Icon size={20} className="text-sky/80" />
                  </div>
                  <h3 className="text-lg font-semibold text-sky">{card.title}</h3>
                  <p className="mt-2 pr-6 text-sm leading-6 text-sky/65">{card.description}</p>
                  <ArrowRight size={16} className="absolute bottom-5 right-5 text-sky/50 transition group-hover:translate-x-1 group-hover:text-cyan-200" aria-hidden="true" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Algorithm Catalog */}
      <section className="rounded-2xl panel p-6">
        <h2 className="text-xl font-bold text-sky">Algorithm Catalog</h2>
        <p className="mt-1 text-sm text-sky/50">All {ALGORITHM_CATALOG.length} algorithms available for visualization and analysis</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(categoryAlgoCounts).map(([cat]) => {
            const catAlgos = ALGORITHM_CATALOG.filter((a) => a.category === cat);
            const colors = CATEGORY_COLORS[cat] || {};
            return (
              <div key={cat} className={`rounded-xl border ${colors.border} ${colors.bg} p-4`}>
                <h3 className={`text-sm font-semibold ${colors.text}`}>{normalizeCategoryLabel(cat)}</h3>
                <ul className="mt-2 space-y-1">
                  {catAlgos.map((algo) => (
                    <li key={algo.name}>
                      <Link
                        to={`/analyzer?category=${cat}&algorithm=${algo.name}`}
                        className="text-xs text-sky/60 transition hover:text-sky"
                      >
                        {algo.display_name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Home;
