import { Link, NavLink } from "react-router-dom";

const Navbar = ({ isSidebarCollapsed, onToggleSidebar }) => {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-glass backdrop-blur-xl shadow-glass">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="hidden rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold text-sky/80 transition hover:border-accent-sorting hover:text-accent-sorting lg:block focus:outline-none focus:ring-2 focus:ring-accent-sorting"
            style={{ boxShadow: '0 2px 8px 0 rgba(16,185,129,0.10)' }}
          >
            {isSidebarCollapsed ? "Open Menu" : "Collapse Menu"}
          </button>
          <Link to="/" className="text-2xl font-display font-bold tracking-tight text-sky drop-shadow-glow animate-float">
            <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-violet-300 bg-clip-text text-transparent">Algo</span>Vision
          </Link>
        </div>
        <nav className="hidden items-center gap-1 text-sm font-medium md:flex">
          <NavLink to="/analyzer" className={({ isActive }) => `transition px-3 py-1.5 rounded-lg ${isActive ? 'bg-accent-sorting/20 text-accent-sorting shadow-glow' : 'text-sky/70 hover:text-accent-sorting hover:bg-accent-sorting/10'}`}>Analyzer</NavLink>
          <NavLink to="/compare" className={({ isActive }) => `transition px-3 py-1.5 rounded-lg ${isActive ? 'bg-accent-graph/20 text-accent-graph shadow-glow' : 'text-sky/70 hover:text-accent-graph hover:bg-accent-graph/10'}`}>Compare</NavLink>
          <NavLink to="/ai-advisor" className={({ isActive }) => `transition px-3 py-1.5 rounded-lg ${isActive ? 'bg-violet-400/20 text-violet-300 shadow-[0_0_20px_rgba(139,92,246,0.15)]' : 'text-sky/70 hover:text-violet-300 hover:bg-violet-400/10'}`}>
            AI Advisor
          </NavLink>
          <NavLink to="/benchmark" className={({ isActive }) => `transition px-3 py-1.5 rounded-lg ${isActive ? 'bg-cyan-400/20 text-cyan-300' : 'text-sky/70 hover:text-cyan-300 hover:bg-cyan-400/10'}`}>Benchmark</NavLink>
          <NavLink to="/playground" className={({ isActive }) => `transition px-3 py-1.5 rounded-lg ${isActive ? 'bg-pink-400/20 text-pink-300' : 'text-sky/70 hover:text-pink-300 hover:bg-pink-400/10'}`}>Playground</NavLink>
          <NavLink to="/algo-visualizer" className={({ isActive }) => `transition px-3 py-1.5 rounded-lg ${isActive ? 'bg-cyan-400/20 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.12)]' : 'text-sky/70 hover:text-cyan-300 hover:bg-cyan-400/10'}`}>
            Visualizer
          </NavLink>
          <NavLink to="/theory" className={({ isActive }) => `transition px-3 py-1.5 rounded-lg ${isActive ? 'bg-accent-dp/20 text-accent-dp shadow-glow' : 'text-sky/70 hover:text-accent-dp hover:bg-accent-dp/10'}`}>Theory</NavLink>
          <NavLink to="/reports" className={({ isActive }) => `transition px-3 py-1.5 rounded-lg ${isActive ? 'bg-accent-string/20 text-accent-string shadow-glow' : 'text-sky/70 hover:text-accent-string hover:bg-accent-string/10'}`}>Reports</NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
