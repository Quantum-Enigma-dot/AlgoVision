import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const Home = () => {
  const featureCards = [
    {
      title: "Analyzer",
      description: "Run algorithms on custom inputs and animate every operation step-by-step.",
      color: "from-accent-sorting/30 to-accent-sorting/5",
      to: "/analyzer"
    },
    {
      title: "Compare",
      description: "Benchmark algorithms side-by-side with instant visual performance contrast.",
      color: "from-accent-graph/30 to-accent-graph/5",
      to: "/compare"
    },
    {
      title: "Theory",
      description: "Review complexity, paradigms, and optimization guidance in one place.",
      color: "from-accent-dp/30 to-accent-dp/5",
      to: "/theory"
    }
  ];

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 panel p-7 md:p-10">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="pointer-events-none absolute -left-14 -top-16 h-64 w-64 rounded-full bg-accent-sorting/20 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.08 }}
          className="pointer-events-none absolute -right-12 top-10 h-72 w-72 rounded-full bg-accent-dp/20 blur-3xl"
        />

        <div className="relative grid gap-10 lg:grid-cols-[1.25fr_1fr]">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.4em] text-emerald-200">Interactive Algorithm Lab</p>
            <h1 className="text-balance text-4xl font-semibold leading-tight text-sky md:text-5xl">
            AlgoVision - Visualize, Analyze, and Optimize Algorithms in Real Time
            </h1>
            <p className="max-w-2xl text-base text-sky/75">
              Bridge theory and practice with live execution traces, comparative metrics, and educational visual narratives.
              Built for DAA coursework, demos, and interview preparation.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/analyzer"
                className="rounded-full border border-emerald-200/40 bg-emerald-400/20 px-6 py-3 text-sm font-semibold text-emerald-100 shadow-glow transition hover:-translate-y-0.5 hover:bg-emerald-300/30"
              >
                Open Analyzer
              </Link>
              <Link
                to="/compare"
                className="rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold text-sky/90 transition hover:-translate-y-0.5 hover:border-white/45"
              >
                Compare Algorithms
              </Link>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.14 }}
            className="glass rounded-2xl p-6"
          >
            <h2 className="text-lg font-semibold text-sky">What you can do</h2>
            <ul className="mt-4 space-y-3 text-sm text-sky/75">
              <li className="flex items-start gap-3"><span className="mt-0.5 h-2 w-2 rounded-full bg-accent-sorting" />Watch step-by-step execution with live metrics.</li>
              <li className="flex items-start gap-3"><span className="mt-0.5 h-2 w-2 rounded-full bg-accent-graph" />Compare algorithms with charts and winner summaries.</li>
              <li className="flex items-start gap-3"><span className="mt-0.5 h-2 w-2 rounded-full bg-accent-dp" />Explore complexity and paradigm theory cards.</li>
              <li className="flex items-start gap-3"><span className="mt-0.5 h-2 w-2 rounded-full bg-accent-string" />Export run history for reports and viva discussion.</li>
            </ul>
          </motion.div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {featureCards.map((card, index) => (
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
              className={`group relative block h-full rounded-2xl border border-white/10 bg-gradient-to-br ${card.color} p-6 shadow-glass transition hover:scale-[1.02] hover:border-cyan-300/40 hover:shadow-[0_0_24px_rgba(34,211,238,0.2)]`}
            >
              <h3 className="text-lg font-semibold text-sky">{card.title}</h3>
              <p className="mt-2 pr-6 text-sm text-sky/75">{card.description}</p>
              <ArrowRight size={16} className="absolute bottom-4 right-4 text-sky/70 transition group-hover:text-cyan-200" aria-hidden="true" />
            </Link>
          </motion.div>
        ))}
      </section>
    </div>
  );
};

export default Home;
