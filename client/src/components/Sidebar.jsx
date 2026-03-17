import { useState } from "react";
import { NavLink } from "react-router-dom";
import { BarChart2, BookOpen, FileText, GitCompare, House, Layers } from "lucide-react";

const Sidebar = ({ isCollapsed, onToggleSidebar }) => {
  const [modulesOpen, setModulesOpen] = useState(true);
  const [categoriesOpen, setCategoriesOpen] = useState(true);

  const navItems = [
    { to: "/", label: "Home", icon: House, activeTone: "bg-accent-sorting/20 text-accent-sorting shadow-glow", idleTone: "text-sky/70 hover:bg-accent-sorting/10 hover:text-accent-sorting" },
    { to: "/analyzer", label: "Analyzer", icon: BarChart2, activeTone: "bg-accent-sorting/20 text-accent-sorting shadow-glow", idleTone: "text-sky/70 hover:bg-accent-sorting/10 hover:text-accent-sorting" },
    { to: "/compare", label: "Compare", icon: GitCompare, activeTone: "bg-accent-graph/20 text-accent-graph shadow-glow", idleTone: "text-sky/70 hover:bg-accent-graph/10 hover:text-accent-graph" },
    { to: "/theory", label: "Theory", icon: BookOpen, activeTone: "bg-accent-dp/20 text-accent-dp shadow-glow", idleTone: "text-sky/70 hover:bg-accent-dp/10 hover:text-accent-dp" },
    { to: "/reports", label: "Reports", icon: FileText, activeTone: "bg-accent-string/20 text-accent-string shadow-glow", idleTone: "text-sky/70 hover:bg-accent-string/10 hover:text-accent-string" }
  ];

  return (
    <aside className="h-full bg-glass shadow-glass px-3 py-6 backdrop-blur-xl transition-all duration-300">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          {!isCollapsed && <p className="text-xs uppercase tracking-[0.2em] text-sky/40">Navigation</p>}
          <button
            onClick={onToggleSidebar}
            className="rounded-md border border-white/20 px-2 py-1 text-xs text-sky/70 hover:border-accent-sorting focus:outline-none focus:ring-2 focus:ring-accent-sorting"
            title="Toggle menu"
            style={{ boxShadow: '0 2px 8px 0 rgba(16,185,129,0.10)' }}
          >
            {isCollapsed ? ">" : "<"}
          </button>
        </div>

        {isCollapsed ? (
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  title={item.label}
                  className={({ isActive }) => `flex items-center justify-center rounded-lg px-2 py-2 transition ${isActive ? item.activeTone : item.idleTone}`}
                >
                  <Icon size={18} aria-hidden="true" />
                </NavLink>
              );
            })}
          </div>
        ) : (
          <>
        <div>
          <button
            onClick={() => setModulesOpen((prev) => !prev)}
            className="w-full rounded-lg px-2 py-2 text-left text-xs font-semibold uppercase tracking-[0.2em] text-sky/40 hover:bg-glassLight transition-all duration-200"
          >
            Modules {modulesOpen ? "-" : "+"}
          </button>
            <div className={`overflow-hidden transition-all duration-300 ${modulesOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="mt-2 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink key={item.to} to={item.to} className={({ isActive }) => `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${isActive ? item.activeTone : item.idleTone}`}>
                      <Icon size={16} aria-hidden="true" />
                      {item.label}
                    </NavLink>
                  );
                })}
              </div>
            </div>
        </div>
        <div>
          <button
            onClick={() => setCategoriesOpen((prev) => !prev)}
            className="w-full rounded-lg px-2 py-2 text-left text-xs font-semibold uppercase tracking-[0.2em] text-sky/40 hover:bg-glassLight transition-all duration-200"
          >
            <span className="inline-flex items-center gap-2">
              <Layers size={14} aria-hidden="true" />
              Categories {categoriesOpen ? "-" : "+"}
            </span>
          </button>
            <div className={`overflow-hidden transition-all duration-300 ${categoriesOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="mt-2 space-y-2 text-sm text-sky/70">
                <p className="rounded-lg bg-accent-sorting/20 px-3 py-2 text-accent-sorting font-semibold shadow-glow">Sorting</p>
                <p className="rounded-lg bg-accent-graph/20 px-3 py-2 text-accent-graph font-semibold shadow-glow">Graph</p>
                <p className="rounded-lg bg-accent-dp/20 px-3 py-2 text-accent-dp font-semibold shadow-glow">Dynamic Programming</p>
                <p className="rounded-lg bg-accent-string/20 px-3 py-2 text-accent-string font-semibold shadow-glow">String Matching</p>
              </div>
            </div>
        </div>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
