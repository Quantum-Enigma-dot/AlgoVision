const ComplexityTable = ({ complexity, nMeaning = {}, compact = false, title = "Time & Space Complexity" }) => {
  if (!complexity) {
    return null;
  }

  const rows = [
    { label: "Best", value: complexity.best_time, note: nMeaning?.best_time },
    { label: "Average", value: complexity.average_time, note: nMeaning?.average_time },
    { label: "Worst", value: complexity.worst_time, note: nMeaning?.worst_time },
    { label: "Space", value: complexity.space, note: nMeaning?.space }
  ];

  const wrapperClass = compact
    ? "rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-3"
    : "rounded-xl border border-white/10 bg-white/5 p-4";

  return (
    <div className={wrapperClass}>
      <p className="text-xs uppercase tracking-[0.2em] text-sky/40">{title}</p>
      <div className="mt-3 overflow-x-auto">
        <table className={`w-full ${compact ? "min-w-[280px]" : "min-w-[360px]"} text-left text-sm text-sky/80`}>
          <thead>
            <tr className="border-b border-white/10 text-[11px] uppercase tracking-[0.14em] text-sky/45">
              <th className="px-2 py-2">Case</th>
              <th className="px-2 py-2">Complexity</th>
              <th className="px-2 py-2">Meaning</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-white/5 align-top">
                <td className="px-2 py-2 font-semibold text-sky">{row.label}</td>
                <td className="px-2 py-2 font-mono text-cyan-100">{row.value || "-"}</td>
                <td className="px-2 py-2 text-xs text-sky/55">{row.note || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComplexityTable;
