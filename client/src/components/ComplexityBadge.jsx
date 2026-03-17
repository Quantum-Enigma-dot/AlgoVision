const ComplexityBadge = ({ label, value, note }) => {
  return (
    <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 px-3 py-2 text-xs text-sky/70">
      <div className="text-[10px] uppercase tracking-[0.2em] text-sky/45">{label}</div>
      <div className="mt-1 font-semibold text-sky">{value}</div>
      {note && <div className="mt-1 text-[11px] leading-5 text-sky/45">{note}</div>}
    </div>
  );
};

export default ComplexityBadge;
