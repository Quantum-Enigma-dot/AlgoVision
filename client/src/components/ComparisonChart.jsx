import { useMemo } from "react";
import { motion } from "framer-motion";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getAlgorithmDisplayName } from "../data/algorithms.js";

const ComparisonChart = ({ results }) => {
  const data = useMemo(() => {
    return results.map((item) => ({
      name: getAlgorithmDisplayName(item.algorithm),
      time: item.metrics.execution_time_ms || 0,
      comparisons: item.metrics.comparisons || 0,
      swaps: item.metrics.swaps || 0
    }));
  }, [results]);

  const safeMax = (a, b) => Math.max(a, b) || 1;
  const a = data[0] || { time: 0, comparisons: 0, swaps: 0, name: "A" };
  const b = data[1] || { time: 0, comparisons: 0, swaps: 0, name: "B" };

  const groupedData = [
    {
      metric: "Time",
      [a.name]: (a.time / safeMax(a.time, b.time)) * 100,
      [b.name]: (b.time / safeMax(a.time, b.time)) * 100
    },
    {
      metric: "Comparisons",
      [a.name]: (a.comparisons / safeMax(a.comparisons, b.comparisons)) * 100,
      [b.name]: (b.comparisons / safeMax(a.comparisons, b.comparisons)) * 100
    },
    {
      metric: "Swaps",
      [a.name]: (a.swaps / safeMax(a.swaps, b.swaps)) * 100,
      [b.name]: (b.swaps / safeMax(a.swaps, b.swaps)) * 100
    }
  ];

  return (
    <div className="space-y-6">
      {["time", "comparisons", "swaps"].map((metricKey) => (
        <div key={`metric-${metricKey}`} className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="text-xs uppercase tracking-[0.2em] text-sky/50">{metricKey}</div>
          {data.map((item, index) => {
            const max = safeMax(a[metricKey], b[metricKey]);
            const width = `${(item[metricKey] / max) * 100}%`;
            return (
              <div key={`${metricKey}-${item.name}`} className="space-y-1">
                <div className="flex items-center justify-between text-xs text-sky/65">
                  <span>{item.name}</span>
                  <span>{item[metricKey]}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width }}
                    transition={{ duration: 0.4, ease: "easeInOut", delay: index * 0.05 }}
                    className={`h-full rounded-full ${index === 0 ? "bg-emerald-300" : "bg-cyan-300"}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ))}

      <div className="h-72 rounded-xl border border-white/10 bg-white/5 p-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={groupedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="metric" tick={{ fill: "#cbd5e1", fontSize: 12 }} />
            <YAxis domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey={a.name} fill="#34d399" radius={[4, 4, 0, 0]} />
            <Bar dataKey={b.name} fill="#22d3ee" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ComparisonChart;
