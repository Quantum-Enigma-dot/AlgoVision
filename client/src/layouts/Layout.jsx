import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";

const Layout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(260);

  const startSidebarResize = (event) => {
    if (isSidebarCollapsed) return;
    const startX = event.clientX;
    const startWidth = sidebarWidth;

    const onMouseMove = (moveEvent) => {
      const nextWidth = Math.min(420, Math.max(190, startWidth + (moveEvent.clientX - startX)));
      setSidebarWidth(nextWidth);
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-accent-sorting/20 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-accent-dp/20 blur-3xl" />
        <div className="absolute left-1/2 bottom-20 h-60 w-60 rounded-full bg-violet-500/10 blur-3xl" />
      </div>
      <Navbar
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
      />
      <div className="relative z-10 flex min-h-[calc(100vh-73px)]">
        <div
          className="hidden border-r border-white/10 lg:block"
          style={{ width: isSidebarCollapsed ? 72 : sidebarWidth }}
        >
          <Sidebar isCollapsed={isSidebarCollapsed} onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)} />
        </div>
        {!isSidebarCollapsed && (
          <div
            className="hidden w-2 cursor-col-resize bg-white/5 transition hover:bg-emerald-300/30 lg:block"
            onMouseDown={startSidebarResize}
          />
        )}
        <div className="flex flex-1 flex-col">
          <main className="flex-1 px-4 pb-8 pt-6 md:px-8 xl:px-10">
            <Outlet />
          </main>
          <footer className="border-t border-white/5 px-6 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-sky/30">
              <p>
                <span className="font-semibold text-sky/50">AlgoVision</span> — Interactive Algorithm Analyzer & Optimizer
              </p>
              <p>Built with React, FastAPI, D3, and Groq AI</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Layout;
