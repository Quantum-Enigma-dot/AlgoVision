import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { useTheme } from "../hooks/useTheme.js";

const SortingViz = ({ step, stepIndex, totalSteps, zoom = 1 }) => {
  const svgRef = useRef(null);
  const array = step?.array || [];
  const highlights = new Set(step?.indices || []);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 760;
    const height = Math.round(290 * zoom);
    const margin = { top: 18, right: 16, bottom: 26, left: 20 };
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    if (!array.length) {
      return;
    }

    const x = d3
      .scaleBand()
      .domain(array.map((_, index) => String(index)))
      .range([margin.left, width - margin.right])
      .padding(0.12);

    const y = d3
      .scaleLinear()
      .domain([Math.min(0, d3.min(array) || 0), Math.max(0, d3.max(array) || 1)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const baseline = y(0);

    svg
      .append("line")
      .attr("x1", margin.left)
      .attr("x2", width - margin.right)
      .attr("y1", baseline)
      .attr("y2", baseline)
      .attr("stroke", "#64748b")
      .attr("stroke-width", 1);

    const bars = svg
      .append("g")
      .selectAll("rect")
      .data(array.map((value, index) => ({ value, index })))
      .enter()
      .append("rect")
      .attr("x", (d) => x(String(d.index)) || 0)
      .attr("y", baseline)
      .attr("width", x.bandwidth())
      .attr("height", 0)
      .attr("rx", 6)
      .attr("fill", (d) => {
        if (step?.type === "pivot" && step?.indices?.[0] === d.index) return "#f59e0b";
        if (highlights.has(d.index)) return "#ff6a3d";
        return "#10b981";
      });

    bars
      .transition()
      .duration(320)
      .ease(d3.easeCubicOut)
      .attr("y", (d) => Math.min(y(d.value), baseline))
      .attr("height", (d) => Math.abs(y(d.value) - baseline));

  }, [array, highlights, step]);

  const action = step?.type || "-";
  const highlighted = step?.indices?.length ? step.indices.join(", ") : "none";
  const hasGap = step?.gap !== undefined;
  const hasPivot = step?.pivot !== undefined;
  const hasRange = Array.isArray(step?.range) && step.range.length >= 2;
  const hasComparisons = step?.comparisons !== undefined;
  const hasSwaps = step?.swaps !== undefined;

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-white/10 bg-slate-950/30 px-3 py-2 text-sm text-sky/75">
        {step?.description || "State updated."}
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950/30 p-3">
        <div className="flex min-w-max gap-2">
          {array.map((value, index) => {
            const isPivot = step?.type === "pivot" && step?.indices?.[0] === index;
            const isActive = highlights.has(index);
            const colorClass = isPivot
              ? "bg-amber-400/20 text-amber-200 border-amber-300/40"
              : isActive
                ? "bg-orange-500/20 text-orange-100 border-orange-300/40"
                : "bg-emerald-400/20 text-emerald-100 border-emerald-300/40";
            return (
              <div
                key={`${index}-${value}`}
                className={`min-w-12 rounded-lg border px-3 py-2 text-center text-base font-semibold ${colorClass}`}
              >
                {value}
              </div>
            );
          })}
        </div>
      </div>

      <svg ref={svgRef} className="w-full rounded-xl bg-slate-900/30" style={{ height: `${18 * zoom}rem` }} />
      <div className="grid gap-2 text-xs text-sky/70 md:grid-cols-3 lg:grid-cols-6">
        <p className="rounded-lg bg-white/5 px-3 py-2">Step: {stepIndex + 1} / {totalSteps}</p>
        <p className="rounded-lg bg-white/5 px-3 py-2">Action: {action}</p>
        <p className="rounded-lg bg-white/5 px-3 py-2">Active Indices: {highlighted}</p>
        {hasGap && <p className="rounded-lg bg-white/5 px-3 py-2">Gap: {step.gap}</p>}
        {hasPivot && <p className="rounded-lg bg-white/5 px-3 py-2">Pivot: {step.pivot}</p>}
        {hasRange && <p className="rounded-lg bg-white/5 px-3 py-2">Range: {step.range[0]}..{step.range[1]}</p>}
        {hasComparisons && <p className="rounded-lg bg-white/5 px-3 py-2">Comparisons: {step.comparisons}</p>}
        {hasSwaps && <p className="rounded-lg bg-white/5 px-3 py-2">Swaps/Writes: {step.swaps}</p>}
      </div>
      <div className="flex flex-wrap gap-3 text-xs text-sky/70">
        <span className="rounded-full bg-emerald-400/20 px-3 py-1">Normal Bar</span>
        <span className="rounded-full bg-amber-400/20 px-3 py-1">Pivot</span>
        <span className="rounded-full bg-orange-500/20 px-3 py-1">Compared/Swapped</span>
      </div>
    </div>
  );
};

const SearchViz = ({ step, stepIndex, totalSteps, zoom = 1, algorithm }) => {
  const array = step?.array || [];
  const low = Number.isInteger(step?.low) ? step.low : -1;
  const high = Number.isInteger(step?.high) ? step.high : -1;
  const mid = Number.isInteger(step?.mid) ? step.mid : -1;
  const currentIndex = Number.isInteger(step?.currentIndex) ? step.currentIndex : -1;
  const minIndex = Number.isInteger(step?.minIndex) ? step.minIndex : -1;
  const maxIndex = Number.isInteger(step?.maxIndex) ? step.maxIndex : -1;

  const getCellClass = (index) => {
    if (algorithm === "binary_search") {
      if (mid === index && step?.type === "found") return "border-emerald-300/45 bg-emerald-400/25 text-emerald-50";
      if (mid === index) return "border-amber-300/45 bg-amber-400/20 text-amber-100";
      if (index >= low && index <= high) return "border-cyan-300/35 bg-cyan-400/15 text-cyan-50";
      return "border-white/10 bg-white/5 text-sky/45";
    }

    if (currentIndex === index && step?.type === "inspect") return "border-amber-300/45 bg-amber-400/20 text-amber-100";
    if (minIndex === index && maxIndex === index) return "border-fuchsia-300/45 bg-fuchsia-400/20 text-fuchsia-100";
    if (minIndex === index) return "border-emerald-300/45 bg-emerald-400/20 text-emerald-100";
    if (maxIndex === index) return "border-rose-300/45 bg-rose-400/20 text-rose-100";
    return "border-white/10 bg-white/5 text-sky/70";
  };

  return (
    <div className="space-y-4" style={{ zoom }}>
      <div className="rounded-xl border border-white/10 bg-slate-950/30 px-3 py-2 text-sm text-sky/75">
        {step?.description || "Updated search state."}
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950/30 p-3">
        <div className="flex min-w-max gap-2">
          {array.map((value, index) => (
            <div key={`search-${index}-${value}`} className={`min-w-14 rounded-lg border px-3 py-2 text-center text-base font-semibold ${getCellClass(index)}`}>
              <div>{value}</div>
              <div className="mt-1 text-[10px] font-normal opacity-75">i={index}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-2 text-xs text-sky/70 md:grid-cols-2 lg:grid-cols-4">
        <p className="rounded-lg bg-white/5 px-3 py-2">Step: {stepIndex + 1} / {totalSteps}</p>
        <p className="rounded-lg bg-white/5 px-3 py-2">Action: {String(step?.type || "-").replace(/_/g, " ")}</p>
        {algorithm === "binary_search" ? (
          <>
            <p className="rounded-lg bg-white/5 px-3 py-2">Window: {low >= 0 && high >= 0 ? `${low}..${high}` : "empty"}</p>
            <p className="rounded-lg bg-white/5 px-3 py-2">Mid / Target: {mid >= 0 ? `${mid} / ${step?.target}` : `- / ${step?.target ?? "-"}`}</p>
          </>
        ) : (
          <>
            <p className="rounded-lg bg-white/5 px-3 py-2">Min Index: {minIndex >= 0 ? `${minIndex} (${array[minIndex]})` : "-"}</p>
            <p className="rounded-lg bg-white/5 px-3 py-2">Max Index: {maxIndex >= 0 ? `${maxIndex} (${array[maxIndex]})` : "-"}</p>
          </>
        )}
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-sky/70">
        {algorithm === "binary_search" ? (
          <>
            <span className="rounded-full border border-cyan-300/35 bg-cyan-400/15 px-3 py-1">Current search window</span>
            <span className="rounded-full border border-amber-300/35 bg-amber-400/20 px-3 py-1">Middle element</span>
            <span className="rounded-full border border-emerald-300/35 bg-emerald-400/20 px-3 py-1">Found target</span>
          </>
        ) : (
          <>
            <span className="rounded-full border border-amber-300/35 bg-amber-400/20 px-3 py-1">Currently inspected</span>
            <span className="rounded-full border border-emerald-300/35 bg-emerald-400/20 px-3 py-1">Current minimum</span>
            <span className="rounded-full border border-rose-300/35 bg-rose-400/20 px-3 py-1">Current maximum</span>
          </>
        )}
      </div>
    </div>
  );
};

const BacktrackingViz = ({ step, stepIndex, totalSteps, zoom = 1, algorithm }) => {
  if (algorithm !== "queens_8_problem") {
    return <div className="text-sm text-sky/50">No backtracking visualizer is available for this topic yet.</div>;
  }

  const size = Number(step?.size || 8);
  const board = Array.isArray(step?.board) ? step.board : Array.from({ length: size }, () => Array.from({ length: size }, () => "."));
  const activeRow = Number.isInteger(step?.row) ? step.row : -1;
  const activeCol = Number.isInteger(step?.col) ? step.col : -1;
  const placements = Array.isArray(step?.placements) ? step.placements : [];

  return (
    <div className="space-y-4" style={{ zoom }}>
      <div className="rounded-xl border border-white/10 bg-slate-950/30 px-3 py-2 text-sm text-sky/75">
        {step?.description || "Updated backtracking state."}
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950/30 p-4">
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${size}, minmax(2.25rem, 1fr))` }}>
          {board.flatMap((rowCells, rowIndex) => (
            rowCells.map((cell, colIndex) => {
              const isDark = (rowIndex + colIndex) % 2 === 1;
              const isActive = rowIndex === activeRow && colIndex === activeCol;
              const hasQueen = cell === "Q";
              const baseClass = isDark ? "bg-slate-800/80" : "bg-slate-700/55";
              const stateClass = hasQueen
                ? "border-emerald-300/45 text-emerald-100"
                : isActive && step?.type === "conflict"
                  ? "border-rose-300/55 text-rose-100"
                  : isActive
                    ? "border-amber-300/55 text-amber-100"
                    : "border-white/10 text-sky/35";

              return (
                <div
                  key={`queen-${rowIndex}-${colIndex}`}
                  className={`flex h-11 items-center justify-center rounded-md border text-lg font-semibold ${baseClass} ${stateClass}`}
                >
                  {hasQueen ? "Q" : "·"}
                </div>
              );
            })
          ))}
        </div>
      </div>

      <div className="grid gap-2 text-xs text-sky/70 md:grid-cols-2 lg:grid-cols-4">
        <p className="rounded-lg bg-white/5 px-3 py-2">Step: {stepIndex + 1} / {totalSteps}</p>
        <p className="rounded-lg bg-white/5 px-3 py-2">Action: {String(step?.type || "-").replace(/_/g, " ")}</p>
        <p className="rounded-lg bg-white/5 px-3 py-2">Active cell: {activeRow >= 0 && activeCol >= 0 ? `r${activeRow + 1}, c${activeCol + 1}` : "-"}</p>
        <p className="rounded-lg bg-white/5 px-3 py-2">Queens placed: {placements.filter((value) => value >= 0).length} / {size}</p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-sky/70">
        <p>Placements by row: {placements.map((col, row) => (col >= 0 ? `r${row + 1}->c${col + 1}` : `r${row + 1}->-`)).join(", ")}</p>
        {step?.reason && <p className="mt-1 text-rose-200">Conflict reason: {step.reason}</p>}
      </div>
    </div>
  );
};

const GraphViz = ({ step, input, zoom = 1, algorithm, minimalView = false }) => {
  const { theme } = useTheme();
  const svgRef = useRef(null);
  const markerSeedRef = useRef(`graph-${Math.random().toString(36).slice(2, 9)}`);
  const [displayMode, setDisplayMode] = useState("adaptive");
  const [encodingMode, setEncodingMode] = useState("both");
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);
  const [hoveredEdgeId, setHoveredEdgeId] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const isGraphColoring = String(algorithm || "") === "graph_coloring";
  const isLightTheme = theme === "light";
  const svgHeightRem = minimalView ? 27 : 18;

  const stepPathNodes = useMemo(
    () => (Array.isArray(step?.path) ? step.path.map((node) => String(node).trim()).filter(Boolean) : []),
    [step]
  );
  const stepPathEdges = useMemo(
    () => stepPathNodes.slice(0, -1).map((from, index) => ({ from, to: stepPathNodes[index + 1] })),
    [stepPathNodes]
  );
  const explicitStepEdge = useMemo(() => {
    const from = step?.edge?.from;
    const to = step?.edge?.to;
    if (from === undefined || from === null || to === undefined || to === null) {
      return null;
    }
    return { from: String(from).trim(), to: String(to).trim() };
  }, [step]);

  const colorPalette = useMemo(
    () => [
      "#ef4444",
      "#f97316",
      "#f59e0b",
      "#84cc16",
      "#22c55e",
      "#10b981",
      "#14b8a6",
      "#06b6d4",
      "#3b82f6",
      "#6366f1",
      "#8b5cf6",
      "#d946ef",
      "#ec4899",
      "#e11d48"
    ],
    []
  );

  const nodes = useMemo(() => {
    if (input.nodes && input.nodes.length) {
      return input.nodes.map((id, index) => ({ id, index }));
    }
    const nodeSet = new Set();
    (input.edges || []).forEach((edge) => {
      nodeSet.add(edge.from);
      nodeSet.add(edge.to);
    });
    return Array.from(nodeSet).map((id, index) => ({ id, index }));
  }, [input]);

  const edges = useMemo(() => {
    const sourceTargetCount = new Map();
    const sourceTargetIndex = new Map();
    const directedPairSet = new Set();

    (input.edges || []).forEach((edge) => {
      const sourceId = String(edge.from);
      const targetId = String(edge.to);
      const key = `${sourceId}->${targetId}`;
      directedPairSet.add(key);
      sourceTargetCount.set(key, (sourceTargetCount.get(key) || 0) + 1);
    });

    return (input.edges || []).map((edge, index) => {
      const sourceId = String(edge.from);
      const targetId = String(edge.to);
      const key = `${sourceId}->${targetId}`;
      const reverseKey = `${targetId}->${sourceId}`;
      const sameDirectionIndex = sourceTargetIndex.get(key) || 0;
      sourceTargetIndex.set(key, sameDirectionIndex + 1);

      return {
        id: `${sourceId}->${targetId}-${index}`,
        sourceId,
        targetId,
        source: edge.from,
        target: edge.to,
        weight: Number.isFinite(Number(edge.weight)) ? Number(edge.weight) : 0,
        sameDirectionIndex,
        sameDirectionTotal: sourceTargetCount.get(key) || 1,
        hasReverse: directedPairSet.has(reverseKey),
      };
    });
  }, [input]);

  const edgeStats = useMemo(() => {
    if (!edges.length) {
      return { min: 0, max: 0, density: 0, isDense: false };
    }
    const weights = edges.map((edge) => edge.weight);
    const min = d3.min(weights) ?? 0;
    const max = d3.max(weights) ?? 0;
    const nodeCount = nodes.length || 1;
    const possibleDirectedEdges = Math.max(nodeCount * (nodeCount - 1), 1);
    const density = edges.length / possibleDirectedEdges;
    const isDense = nodeCount > 8 || edges.length > 12 || density > 0.35;
    return { min, max, density, isDense };
  }, [edges, nodes.length]);

  const graphSizing = useMemo(() => {
    const nodeCount = Math.max(nodes.length, 1);
    const denseBoost = edgeStats.isDense ? 1.2 : 1;
    const nodeRadius = nodeCount > 10 ? 16 : nodeCount > 7 ? 18 : 20;
    const linkDistance = Math.max(100, (180 - nodeCount * 8) * denseBoost);
    const charge = -(280 + nodeCount * 24) * denseBoost;
    const collision = nodeRadius + (edgeStats.isDense ? 14 : 10);
    return { nodeRadius, linkDistance, charge, collision };
  }, [edgeStats.isDense, nodes.length]);

  const resolvedLabelMode = useMemo(() => {
    if (displayMode === "adaptive") {
      return edgeStats.isDense ? "focus" : "inline";
    }
    return displayMode;
  }, [displayMode, edgeStats.isDense]);

  useEffect(() => {
    setSelectedEdgeId(null);
    setHoveredEdgeId(null);
    setSelectedNodeId(null);
    setHoveredNodeId(null);
  }, [input.edges, input.nodes]);

  useEffect(() => {
    const isDirected = Boolean(input.directed);
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = Math.round((minimalView ? 980 : 620) * zoom);
    const height = Math.round((minimalView ? 560 : 340) * zoom);
    const padding = Math.max(30, graphSizing.nodeRadius + 14);
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const nodeData = nodes.map((node, index) => {
      const angle = (index / Math.max(nodes.length, 1)) * Math.PI * 2;
      const radius = Math.min(width, height) * 0.32;
      return {
        ...node,
        x: width / 2 + radius * Math.cos(angle),
        y: height / 2 + radius * Math.sin(angle),
      };
    });

    const linkData = edges.map((edge) => ({ ...edge }));

    const simulation = d3
      .forceSimulation(nodeData)
      .force("charge", d3.forceManyBody().strength(graphSizing.charge))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX(width / 2).strength(0.06))
      .force("y", d3.forceY(height / 2).strength(0.06))
      .force(
        "link",
        d3
          .forceLink(linkData)
          .id((d) => d.id)
          .distance((d) => graphSizing.linkDistance + Math.min(d.weight * 1.2, 22))
          .strength(edgeStats.isDense ? 0.55 : 0.7)
      )
      .force("collide", d3.forceCollide().radius(graphSizing.collision).iterations(2))
      .stop();

    const tickCount = edgeStats.isDense ? 260 : 190;
    for (let i = 0; i < tickCount; i += 1) {
      simulation.tick();
      nodeData.forEach((node) => {
        node.x = Math.min(width - padding, Math.max(padding, node.x));
        node.y = Math.min(height - padding, Math.max(padding, node.y));
      });
    }

    const explicitVisited = Array.isArray(step?.visited)
      ? step.visited.map((node) => String(node))
      : [];
    const discoveredFromDistances = step?.distances && typeof step.distances === "object"
      ? Object.entries(step.distances)
          .filter(([, value]) => value !== null && value !== undefined)
          .map(([node]) => String(node))
      : [];
    const visited = new Set(explicitVisited.length ? explicitVisited : discoveredFromDistances);

    const assignment = step?.assignment && typeof step.assignment === "object"
      ? step.assignment
      : step?.result?.assignment && typeof step.result.assignment === "object"
        ? step.result.assignment
        : {};
    const assignedColors = new Map(
      Object.entries(assignment)
        .map(([node, color]) => [String(node), Number(color)])
        .filter(([, color]) => Number.isFinite(color) && color > 0)
    );

    const activeEdge = explicitStepEdge || (stepPathEdges.length === 1 ? stepPathEdges[0] : null);
    const activePathEdgeKeys = new Set(
      stepPathEdges.flatMap((edgeDatum) => {
        const direct = `${edgeDatum.from}->${edgeDatum.to}`;
        if (isDirected) {
          return [direct];
        }
        return [direct, `${edgeDatum.to}->${edgeDatum.from}`];
      })
    );
    const activeNode = String(
      step?.current ??
      step?.node ??
      activeEdge?.to ??
      stepPathNodes[stepPathNodes.length - 1] ??
      ""
    );
    const conflictNode = String(step?.conflict_with ?? "");
    const tryingNode = String(step?.type === "try" ? step?.node : "");
    const sourceNode = String(input.start || "");
    const destinationNode = String(input.sink || "");

    const activeFrom = activeEdge ? String(activeEdge.from) : "";
    const activeTo = activeEdge ? String(activeEdge.to) : "";

    const activeFocusNodes = new Set(
      [activeNode, activeFrom, activeTo, conflictNode, tryingNode, ...stepPathNodes]
        .map((node) => String(node || "").trim())
        .filter(Boolean)
    );
    const activeNeighborhood = new Set(activeFocusNodes);

    linkData.forEach((edgeDatum) => {
      const sourceId = String(edgeDatum.sourceId || edgeDatum.source?.id || "");
      const targetId = String(edgeDatum.targetId || edgeDatum.target?.id || "");
      if (activeFocusNodes.has(sourceId) || activeFocusNodes.has(targetId)) {
        activeNeighborhood.add(sourceId);
        activeNeighborhood.add(targetId);
      }
    });

    const stepHasFocus = !selectedEdgeId && !selectedNodeId && activeFocusNodes.size > 0;

    const isActiveLink = (edgeDatum) => {
      const sourceId = String(edgeDatum?.source?.id ?? edgeDatum?.sourceId);
      const targetId = String(edgeDatum?.target?.id ?? edgeDatum?.targetId);
      if (activePathEdgeKeys.has(`${sourceId}->${targetId}`)) {
        return true;
      }
      if (!activeEdge) {
        return false;
      }
      if (sourceId === activeFrom && targetId === activeTo) {
        return true;
      }
      if (!isDirected && sourceId === activeTo && targetId === activeFrom) {
        return true;
      }
      return false;
    };

    const isIncidentToActiveFocus = (edgeDatum) => {
      const sourceId = String(edgeDatum?.source?.id ?? edgeDatum?.sourceId);
      const targetId = String(edgeDatum?.target?.id ?? edgeDatum?.targetId);
      return activeFocusNodes.has(sourceId) || activeFocusNodes.has(targetId);
    };

    const defaultEdgeColor = "#64748b";
    const inactiveEdgeColor = "#475569";
    const activeEdgeColor = "#fb923c";
    const focusedEdgeColor = "#22d3ee";

    const colorScale = d3
      .scaleLinear()
      .domain(edgeStats.min === edgeStats.max ? [edgeStats.min, edgeStats.min + 1] : [edgeStats.min, edgeStats.max])
      .range(["#7dd3fc", "#fb923c"]);
    const widthScale = d3
      .scaleLinear()
      .domain(edgeStats.min === edgeStats.max ? [edgeStats.min, edgeStats.min + 1] : [edgeStats.min, edgeStats.max])
      .range([1.4, 4.6]);

    const getEdgeColor = (weight) => {
      if (encodingMode === "none" || encodingMode === "thickness") {
        return defaultEdgeColor;
      }
      return colorScale(weight);
    };

    const getEdgeWidth = (weight) => {
      if (encodingMode === "none" || encodingMode === "color") {
        return 1.8;
      }
      return widthScale(weight);
    };

    const markerNormalId = `${markerSeedRef.current}-arrow-normal`;
    const markerActiveId = `${markerSeedRef.current}-arrow-active`;

    if (isDirected) {
      const defs = svg.append("defs");
      defs
        .append("marker")
        .attr("id", markerNormalId)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", graphSizing.nodeRadius + 9)
        .attr("refY", 0)
        .attr("markerWidth", 8)
        .attr("markerHeight", 8)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", defaultEdgeColor);

      defs
        .append("marker")
        .attr("id", markerActiveId)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", graphSizing.nodeRadius + 9)
        .attr("refY", 0)
        .attr("markerWidth", 8)
        .attr("markerHeight", 8)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", focusedEdgeColor);
    }

    const getCurveOffset = (edge) => {
      if (edge.sourceId === edge.targetId) {
        return 0;
      }
      const needsCurve = edge.hasReverse || edge.sameDirectionTotal > 1 || isDirected;
      if (!needsCurve) {
        return 0;
      }
      const lane = edge.sameDirectionIndex;
      const sign = lane % 2 === 0 ? 1 : -1;
      const layer = Math.floor(lane / 2) + 1;
      return sign * (12 + layer * 8 + (edge.hasReverse ? 6 : 0));
    };

    const getEdgeGeometry = (edge) => {
      const source = edge.source;
      const target = edge.target;
      if (!source || !target) {
        return { path: "", labelX: 0, labelY: 0 };
      }

      const sx = source.x;
      const sy = source.y;
      const tx = target.x;
      const ty = target.y;

      if (edge.sourceId === edge.targetId) {
        const loopRadius = graphSizing.nodeRadius + 12;
        const path = [
          `M ${sx} ${sy - graphSizing.nodeRadius}`,
          `C ${sx + loopRadius} ${sy - loopRadius}, ${sx - loopRadius} ${sy - loopRadius}, ${sx} ${sy - graphSizing.nodeRadius}`,
        ].join(" ");
        return { path, labelX: sx, labelY: sy - loopRadius - 8 };
      }

      const dx = tx - sx;
      const dy = ty - sy;
      const distance = Math.max(Math.hypot(dx, dy), 1);
      const ux = dx / distance;
      const uy = dy / distance;

      const startTrim = graphSizing.nodeRadius + 3;
      const endTrim = graphSizing.nodeRadius + (isDirected ? 11 : 3);
      const startX = sx + ux * startTrim;
      const startY = sy + uy * startTrim;
      const endX = tx - ux * endTrim;
      const endY = ty - uy * endTrim;

      const curveOffset = getCurveOffset(edge);
      if (curveOffset === 0) {
        const mx = (startX + endX) / 2;
        const my = (startY + endY) / 2;
        const nx = -uy;
        const ny = ux;
        return {
          path: `M ${startX} ${startY} L ${endX} ${endY}`,
          labelX: mx + nx * 8,
          labelY: my + ny * 8,
        };
      }

      const mx = (startX + endX) / 2;
      const my = (startY + endY) / 2;
      const nx = -uy;
      const ny = ux;
      const cx = mx + nx * curveOffset;
      const cy = my + ny * curveOffset;
      const labelX = 0.25 * startX + 0.5 * cx + 0.25 * endX;
      const labelY = 0.25 * startY + 0.5 * cy + 0.25 * endY;

      return {
        path: `M ${startX} ${startY} Q ${cx} ${cy} ${endX} ${endY}`,
        labelX,
        labelY,
      };
    };

    const linkGroup = svg
      .append("g")
      .attr("stroke-linecap", "round")
      .selectAll("path")
      .data(linkData)
      .enter()
      .append("path")
      .attr("d", (d) => getEdgeGeometry(d).path)
      .attr("stroke", (d) => {
        const isActivePath = isActiveLink(d);
        const isFocusedPath = d.id === hoveredEdgeId || d.id === selectedEdgeId;
        if (isActivePath) {
          return activeEdgeColor;
        }
        if (isFocusedPath) {
          return focusedEdgeColor;
        }
        if (selectedNodeId && String(d.source.id) !== selectedNodeId && String(d.target.id) !== selectedNodeId) {
          return inactiveEdgeColor;
        }
        if (stepHasFocus && !isIncidentToActiveFocus(d)) {
          return inactiveEdgeColor;
        }
        return getEdgeColor(d.weight);
      })
      .attr("stroke-width", (d) => {
        const isActivePath = isActiveLink(d);
        const isFocusedPath = d.id === hoveredEdgeId || d.id === selectedEdgeId;
        if (isActivePath) {
          return 4.8;
        }
        if (isFocusedPath) {
          return Math.max(3.4, getEdgeWidth(d.weight));
        }
        if (stepHasFocus && isIncidentToActiveFocus(d)) {
          return Math.max(3.1, getEdgeWidth(d.weight));
        }
        if (stepHasFocus) {
          return 1.2;
        }
        return getEdgeWidth(d.weight);
      })
      .attr("opacity", (d) => {
        if (selectedEdgeId) {
          return d.id === selectedEdgeId ? 1 : 0.2;
        }
        if (selectedNodeId) {
          return String(d.source.id) === selectedNodeId || String(d.target.id) === selectedNodeId ? 0.95 : 0.18;
        }
        if (stepHasFocus) {
          if (isActiveLink(d)) {
            return 1;
          }
          return isIncidentToActiveFocus(d) ? 0.72 : 0.12;
        }
        return 0.72;
      })
      .attr("marker-end", (d) => {
        if (!isDirected) {
          return null;
        }
        const isActivePath = isActiveLink(d);
        const isFocusedPath = d.id === hoveredEdgeId || d.id === selectedEdgeId;
        return `url(#${isActivePath || isFocusedPath ? markerActiveId : markerNormalId})`;
      })
      .attr("fill", "none")
      .style("cursor", "pointer")
      .on("mouseenter", (_, d) => setHoveredEdgeId(d.id))
      .on("mouseleave", () => setHoveredEdgeId(null))
      .on("click", (_, d) => {
        setSelectedEdgeId((current) => (current === d.id ? null : d.id));
      });

    const labels = svg
      .append("g")
      .selectAll("text")
      .data(linkData)
      .enter()
      .append("text")
      .text((d) => `${d.sourceId} ${isDirected ? "→" : "↔"} ${d.targetId} (${d.weight})`)
      .attr("x", (d) => getEdgeGeometry(d).labelX)
      .attr("y", (d) => getEdgeGeometry(d).labelY)
      .attr("text-anchor", "middle")
      .attr("fill", "#dbeafe")
      .attr("font-size", 10)
      .attr("font-weight", 700)
      .attr("paint-order", "stroke")
      .attr("stroke", "#020617")
      .attr("stroke-width", 3.2)
      .attr("stroke-linejoin", "round")
      .attr("opacity", 1);

    labels.attr("opacity", (d) => {
      if (resolvedLabelMode === "inline") {
        if (selectedEdgeId) {
          return d.id === selectedEdgeId ? 1 : 0.32;
        }
        return edgeStats.isDense ? 0.88 : 1;
      }
      if (resolvedLabelMode === "focus") {
        return d.id === hoveredEdgeId || d.id === selectedEdgeId ? 1 : 0;
      }
      if (resolvedLabelMode === "hidden") {
        return d.id === selectedEdgeId ? 1 : 0;
      }
      return d.id === hoveredEdgeId || d.id === selectedEdgeId ? 1 : 0;
    });

    const nodeGroup = svg
      .append("g")
      .selectAll("circle")
      .data(nodeData)
      .enter()
      .append("circle")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", graphSizing.nodeRadius)
      .attr("fill", (d) => {
        const id = String(d.id);
        if (isGraphColoring) {
          const colorNo = assignedColors.get(id) || 0;
          if (id === conflictNode && colorNo > 0) return "#f87171";
          if (id === tryingNode) return "#facc15";
          if (colorNo > 0) return colorPalette[(colorNo - 1) % colorPalette.length];
          return "#0f172a";
        }
        if (id === selectedNodeId) return "#22d3ee";
        if (id === sourceNode) return "#f59e0b";
        if (id === destinationNode) return "#a78bfa";
        if (id === activeNode) return "#38bdf8";
        if (visited.has(id)) return "#14b8a6";
        return "#0f766e";
      })
      .attr("stroke", (d) => {
        const id = String(d.id);
        if (isGraphColoring) {
          if (id === tryingNode) return "#fde68a";
          if (id === conflictNode) return "#fecaca";
          const colorNo = assignedColors.get(id) || 0;
          if (colorNo > 0) return "#e2e8f0";
          return "#334155";
        }
        if (id === selectedNodeId) return "#a5f3fc";
        if (id === sourceNode) return "#fde68a";
        if (id === destinationNode) return "#ddd6fe";
        if (id === activeNode) return "#bae6fd";
        return "#99f6e4";
      })
      .attr("stroke-width", (d) => (String(d.id) === selectedNodeId ? 2.8 : 1.8))
      .attr("opacity", (d) => {
        const id = String(d.id);
        if (!selectedNodeId) {
          if (stepHasFocus) {
            if (activeFocusNodes.has(id)) {
              return 1;
            }
            return activeNeighborhood.has(id) ? 0.56 : 0.2;
          }
          return 0.95;
        }
        return id === selectedNodeId ? 1 : 0.38;
      })
      .style("cursor", "pointer")
      .on("mouseenter", (_, d) => setHoveredNodeId(String(d.id)))
      .on("mouseleave", () => setHoveredNodeId(null))
      .on("click", (_, d) => {
        const id = String(d.id);
        setSelectedNodeId((current) => (current === id ? null : id));
      });

    nodeGroup
      .filter((d) => String(d.id) === selectedNodeId || String(d.id) === hoveredNodeId)
      .attr("filter", "drop-shadow(0px 0px 7px rgba(34,211,238,0.8))");

    svg
      .append("g")
      .selectAll("text")
      .data(nodeData)
      .enter()
      .append("text")
      .text((d) => d.id)
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y + 4.5)
      .attr("text-anchor", "middle")
      .attr("fill", "#ecfeff")
      .attr("font-size", 12)
      .attr("font-weight", 700)
      .attr("paint-order", "stroke")
      .attr("stroke", "#082f49")
      .attr("stroke-width", 2.4)
      .attr("opacity", (d) => {
        const id = String(d.id);
        if (!selectedNodeId) {
          if (stepHasFocus) {
            if (activeFocusNodes.has(id)) {
              return 1;
            }
            return activeNeighborhood.has(id) ? 0.72 : 0.32;
          }
          return 1;
        }
        return id === selectedNodeId ? 1 : 0.45;
      });
  }, [
    edgeStats.max,
    edgeStats.min,
    edgeStats.isDense,
    edges,
    encodingMode,
    graphSizing.charge,
    graphSizing.collision,
    graphSizing.linkDistance,
    graphSizing.nodeRadius,
    hoveredEdgeId,
    hoveredNodeId,
    input.directed,
    input.sink,
    input.start,
    nodes,
    resolvedLabelMode,
    selectedEdgeId,
    selectedNodeId,
    minimalView,
    step
  ]);

  const highlightedEdge = edges.find((edge) => edge.id === selectedEdgeId || edge.id === hoveredEdgeId) || null;
  const highlightedNode = nodes.find((node) => String(node.id) === selectedNodeId || String(node.id) === hoveredNodeId) || null;

  const frontier = step?.queue ?? step?.stack ?? null;
  const frontierLabel = step?.queue ? "Queue" : step?.stack ? "Stack" : null;
  const visitedList = Array.isArray(step?.visited) ? step.visited.map((node) => String(node)) : [];
  const distances = step?.distances && typeof step.distances === "object" ? step.distances : null;
  const indegree = step?.indegree && typeof step.indegree === "object" ? step.indegree : null;

  const assignmentEntries = isGraphColoring
    ? Object.entries(step?.assignment || {})
        .map(([node, color]) => [String(node), Number(color)])
        .filter(([, color]) => Number.isFinite(color) && color > 0)
        .sort(([a], [b]) => a.localeCompare(b))
    : [];
  const colorsUsed = new Set(assignmentEntries.map(([, color]) => color));
  const maxColors = Number.isFinite(Number(input?.max_colors))
    ? Number(input.max_colors)
    : Number.isFinite(Number(input?.maxColors))
      ? Number(input.maxColors)
      : 0;

  const formatFrontierItem = (item) => {
    if (Array.isArray(item) && item.length >= 2) {
      const [priority, node] = item;
      return `${String(node)}(${String(priority)})`;
    }
    return String(item);
  };

  const formatListPreview = (list = [], limit = 18) => {
    if (!Array.isArray(list) || list.length === 0) {
      return "(empty)";
    }
    const head = list.slice(0, limit).map(formatFrontierItem).join(", ");
    if (list.length <= limit) {
      return head;
    }
    return `${head} … +${list.length - limit} more`;
  };

  const distanceEntries = distances
    ? Object.entries(distances)
        .map(([node, value]) => [String(node), value])
        .sort(([a], [b]) => a.localeCompare(b))
    : [];
  const indegreeEntries = indegree
    ? Object.entries(indegree)
        .map(([node, value]) => [String(node), value])
        .sort(([a], [b]) => a.localeCompare(b))
    : [];

  const algorithmKey = String(algorithm || "").toLowerCase();
  const algorithmGuide = (() => {
    if (algorithmKey === "bfs") {
      return {
        title: "Breadth-First Search (BFS)",
        idea: "BFS explores nodes level by level using a queue, so nearby nodes are visited first.",
        focus: "Watch the queue and visited sets. The front of the queue is the next node to process."
      };
    }
    if (algorithmKey === "dfs") {
      return {
        title: "Depth-First Search (DFS)",
        idea: "DFS goes as deep as possible before backtracking, using a stack or recursion.",
        focus: "Follow the active node and stack path to understand where recursion/backtracking happens."
      };
    }
    if (algorithmKey === "dijkstra") {
      return {
        title: "Dijkstra Shortest Path",
        idea: "Dijkstra repeatedly chooses the smallest known-distance node and relaxes outgoing edges.",
        focus: "Check distance updates and the highlighted edge; relaxations improve shortest-known costs."
      };
    }
    if (algorithmKey === "bellman_ford") {
      return {
        title: "Bellman-Ford",
        idea: "Bellman-Ford relaxes all edges multiple times and can handle negative edge weights.",
        focus: "Look for repeated relaxations across rounds and distance values that keep improving."
      };
    }
    if (algorithmKey === "topological_sort") {
      return {
        title: "Topological Sort",
        idea: "Topological sort orders nodes so every directed edge goes from left step to later step.",
        focus: "Watch in-degree changes and which node becomes eligible (in-degree 0)."
      };
    }
    if (algorithmKey === "prim") {
      return {
        title: "Prim Minimum Spanning Tree",
        idea: "Prim grows one connected tree by adding the cheapest edge to a new node each step.",
        focus: "Track the chosen edge and which node gets newly added to the tree."
      };
    }
    if (algorithmKey === "kruskal") {
      return {
        title: "Kruskal Minimum Spanning Tree",
        idea: "Kruskal picks edges in increasing weight order, skipping edges that create cycles.",
        focus: "Observe accepted/rejected edges and how the forest gradually merges into one tree."
      };
    }
    if (algorithmKey === "ford_fulkerson") {
      return {
        title: "Ford-Fulkerson Maximum Flow",
        idea: "Each augmenting path pushes extra flow through residual capacity until no source-to-sink path remains.",
        focus: "Track the highlighted path, bottleneck, and total flow after each augmentation."
      };
    }
    if (algorithmKey === "hamiltonian_cycle") {
      return {
        title: "Hamiltonian Cycle Search",
        idea: "Backtracking extends a path through unvisited neighbors and rewinds when a branch fails.",
        focus: "Watch the active path evolve; backtracking shortens it before trying the next branch."
      };
    }
    if (algorithmKey === "tsp_branch_bound") {
      return {
        title: "TSP Branch and Bound",
        idea: "The solver expands candidate tours, prunes expensive branches, and keeps the best completed cycle.",
        focus: "Observe the expanded path and whenever a new best tour replaces the old one."
      };
    }

    return {
      title: "Graph Traversal / Optimization",
      idea: `This algorithm works on ${input?.directed ? "directed" : "undirected"} edges and updates graph state each step.`,
      focus: "Use highlighted nodes/edges plus step text to follow what changed and why."
    };
  })();

  const readableStepType = String(step?.type || "update").replace(/_/g, " ");
  const summaryEdge = explicitStepEdge || (stepPathEdges.length === 1 ? stepPathEdges[0] : null);
  const currentNodeLabel = step?.current ?? step?.node ?? summaryEdge?.to ?? stepPathNodes[stepPathNodes.length - 1] ?? null;
  const activeEdgeLabel = summaryEdge ? `${summaryEdge.from} ${input.directed ? "→" : "↔"} ${summaryEdge.to}` : null;
  const activePathLabel = stepPathNodes.length > 1 ? stepPathNodes.join(" → ") : null;

  const beginnerStepHint = (() => {
    if (algorithmKey === "bfs") {
      return frontierLabel
        ? `Read ${frontierLabel} left-to-right: the first item is processed next in BFS order.`
        : "BFS keeps expanding neighbors layer by layer from the start node.";
    }
    if (algorithmKey === "dfs") {
      return frontierLabel
        ? `${frontierLabel} shows the current depth path; backtracking happens when no new neighbor exists.`
        : "DFS dives deep first, then backtracks when it reaches a dead end.";
    }
    if (["dijkstra", "bellman_ford"].includes(algorithmKey)) {
      return distanceEntries.length
        ? "Distance table shows current best-known cost from source; smaller updates are improvements."
        : "Shortest path algorithms repeatedly relax edges to improve path costs.";
    }
    if (algorithmKey === "topological_sort") {
      return indegreeEntries.length
        ? "Nodes with in-degree 0 are ready to be placed next in the topological order."
        : "Topological sort repeatedly removes dependencies until ordering is complete.";
    }
    if (algorithmKey === "ford_fulkerson") {
      return activePathLabel
        ? "Highlighted path shows where residual capacity is being consumed this step."
        : "Ford-Fulkerson keeps searching for augmenting source-to-sink paths in the residual graph.";
    }
    if (algorithmKey === "hamiltonian_cycle") {
      return activePathLabel
        ? "The path shows the current trial route; backtrack steps remove the last node and retry."
        : "Hamiltonian search tries to visit every node once before closing a cycle.";
    }
    if (algorithmKey === "tsp_branch_bound") {
      return activePathLabel
        ? "Current path is the branch being expanded; best updates lock in a cheaper full tour."
        : "Branch and bound prunes expensive routes early to avoid full brute force.";
    }
    return frontierLabel
      ? `${frontierLabel} lists candidates for upcoming processing steps.`
      : "Track highlighted nodes and edges to understand each transition.";
  })();

  const showExtendedPanels = !minimalView;

  return (
    <div className={minimalView ? "space-y-2" : "space-y-3"}>
      {showExtendedPanels && (
        <div className="rounded-xl border border-white/10 bg-slate-950/30 px-3 py-2 text-sm text-sky/75">
          {step?.description || "State updated."}
        </div>
      )}

      {showExtendedPanels && (
        <div className="grid gap-2 text-xs md:grid-cols-2">
        <div className="rounded-lg border border-cyan-300/30 bg-cyan-400/10 px-3 py-2 text-sky/80">
          <div className="text-[10px] uppercase tracking-[0.18em] text-cyan-200/75">Algorithm Idea</div>
          <p className="mt-1 text-sm font-semibold text-cyan-100">{algorithmGuide.title}</p>
          <p className="mt-1 text-sky/75">{algorithmGuide.idea}</p>
          <p className="mt-1 text-sky/65">{algorithmGuide.focus}</p>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sky/75">
          <div className="text-[10px] uppercase tracking-[0.18em] text-sky/45">Current Step Explained</div>
          <p className="mt-1">Action: <span className="font-semibold text-sky/90">{readableStepType}</span></p>
          {currentNodeLabel !== null && currentNodeLabel !== undefined && (
            <p className="mt-1">Current node: <span className="font-semibold text-cyan-100">{String(currentNodeLabel)}</span></p>
          )}
          {activeEdgeLabel && (
            <p className="mt-1">Highlighted edge: <span className="font-semibold text-orange-200">{activeEdgeLabel}</span></p>
          )}
          {activePathLabel && (
            <p className="mt-1">Active path: <span className="font-semibold text-purple-200">{activePathLabel}</span></p>
          )}
          {Number.isFinite(Number(step?.bottleneck)) && (
            <p className="mt-1">Bottleneck: <span className="font-semibold text-amber-100">{String(step.bottleneck)}</span></p>
          )}
          {Number.isFinite(Number(step?.flow)) && (
            <p className="mt-1">Current flow: <span className="font-semibold text-emerald-100">{String(step.flow)}</span></p>
          )}
          <p className="mt-1 text-sky/65">{beginnerStepHint}</p>
        </div>
      </div>
      )}

      {showExtendedPanels && (
      <div className="grid gap-2 text-xs md:grid-cols-2">
        <label className="grid min-w-0 grid-cols-1 gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sky/80 lg:grid-cols-[auto_1fr] lg:items-center">
          <span className="min-w-0 truncate text-sky/60">Weight Labels:</span>
          <select
            value={displayMode}
            onChange={(event) => setDisplayMode(event.target.value)}
            className="w-full min-w-0 truncate rounded-md border border-white/15 bg-slate-900/70 px-2 py-1 text-sky"
          >
            <option value="adaptive">Adaptive (sparse=inline, dense=focus)</option>
            <option value="inline">Always inline</option>
            <option value="focus">Hover or selection only</option>
            <option value="hidden">Only selected edge</option>
          </select>
        </label>

        <label className="grid min-w-0 grid-cols-1 gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sky/80 lg:grid-cols-[auto_1fr] lg:items-center">
          <span className="min-w-0 truncate text-sky/60">Weight Encoding:</span>
          <select
            value={encodingMode}
            onChange={(event) => setEncodingMode(event.target.value)}
            className="w-full min-w-0 truncate rounded-md border border-white/15 bg-slate-900/70 px-2 py-1 text-sky"
          >
            <option value="both">Color + thickness</option>
            <option value="color">Color only</option>
            <option value="thickness">Thickness only</option>
            <option value="none">None</option>
          </select>
        </label>
      </div>
      )}

      {showExtendedPanels && isGraphColoring && (
        <div className="grid gap-2 text-xs text-sky/70 md:grid-cols-2">
          <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <div className="mb-1 text-[10px] uppercase tracking-[0.18em] text-sky/40">Color Assignment</div>
            {assignmentEntries.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {assignmentEntries.map(([node, color]) => (
                  <span key={`assign-${node}`} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/70 px-3 py-1 text-[11px]">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: colorPalette[(color - 1) % colorPalette.length] }}
                    />
                    {node}: c{color}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sky/50">No vertex has been assigned a color yet.</p>
            )}
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <div className="mb-1 text-[10px] uppercase tracking-[0.18em] text-sky/40">Coloring Progress</div>
            <p>Action: <span className="font-semibold text-sky/90">{String(step?.type || "-")}</span></p>
            {step?.node && <p className="mt-1">Node: <span className="font-semibold text-cyan-100">{String(step.node)}</span></p>}
            {step?.color !== undefined && <p className="mt-1">Trying color: <span className="font-semibold text-amber-100">c{step.color}</span></p>}
            {step?.conflict_with && (
              <p className="mt-1 text-rose-200">Conflict with neighbor: {String(step.conflict_with)}</p>
            )}
            <p className="mt-2 text-sky/60">
              Used {colorsUsed.size}
              {maxColors > 0 ? ` / ${maxColors}` : ""} colors so far.
            </p>
          </div>
        </div>
      )}

      {showExtendedPanels && (
      <div className="flex min-w-0 flex-wrap items-center gap-2 text-xs">
        <button
          type="button"
          onClick={() => {
            setSelectedNodeId(null);
            setHoveredNodeId(null);
          }}
          className="rounded-lg border border-cyan-300/25 bg-cyan-400/10 px-3 py-1 text-cyan-100 transition hover:border-cyan-300/55"
        >
          Clear Node Focus
        </button>
        <button
          type="button"
          onClick={() => {
            setSelectedEdgeId(null);
            setHoveredEdgeId(null);
          }}
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-1 text-sky/70 transition hover:border-white/30"
        >
          Clear Edge Focus
        </button>
        <span className="rounded-full bg-white/5 px-3 py-1 text-sky/60">
          {resolvedLabelMode === "inline" && "Label mode: inline"}
          {resolvedLabelMode === "focus" && "Label mode: hover/selection"}
          {resolvedLabelMode === "hidden" && "Label mode: selection only"}
        </span>
      </div>
      )}

      <svg
        ref={svgRef}
        className={`w-full rounded-xl ${isLightTheme ? "bg-white" : "bg-slate-900/30"}`}
        style={{ height: `${svgHeightRem * zoom}rem` }}
      />

      {showExtendedPanels && (
      <div className="grid gap-2 text-xs text-sky/70 md:grid-cols-2">
        <div className="rounded-lg bg-white/5 px-3 py-2">
          <div className="mb-1 text-[10px] uppercase tracking-[0.18em] text-sky/40">Weight Encoding</div>
          {(encodingMode === "both" || encodingMode === "color") && (
            <div className="flex items-center gap-2">
              <span>{edgeStats.min}</span>
              <div
                className="h-2 flex-1 rounded"
                style={{ background: "linear-gradient(90deg, #93c5fd 0%, #f97316 100%)" }}
              />
              <span>{edgeStats.max}</span>
            </div>
          )}
          {(encodingMode === "both" || encodingMode === "thickness") && (
            <div className="mt-2 flex items-center gap-3 text-sky/60">
              <span className="text-[11px]">thin</span>
              <span className="h-px w-8 bg-slate-300" />
              <span className="h-[3px] w-8 bg-slate-300" />
              <span className="h-[5px] w-8 bg-slate-300" />
              <span className="text-[11px]">thick</span>
            </div>
          )}
          {encodingMode === "none" && <div className="text-sky/50">Encoding disabled.</div>}
          {encodingMode !== "none" && <div className="mt-2 text-sky/50">Edge style scales with weight and focus state.</div>}
        </div>

        <div className="rounded-lg bg-white/5 px-3 py-2">
          <div className="mb-1 text-[10px] uppercase tracking-[0.18em] text-sky/40">Edge and Node Details</div>
          {highlightedEdge ? (
            <p>
              {highlightedEdge.sourceId} {input.directed ? "→" : "↔"} {highlightedEdge.targetId} ({highlightedEdge.weight})
            </p>
          ) : (
            <p className="text-sky/50">Hover or click an edge to inspect it here.</p>
          )}
          {highlightedNode && (
            <p className="mt-2 text-cyan-100">
              Node: {highlightedNode.id}
              {String(highlightedNode.id) === String(input.start || "") ? " | source" : ""}
              {String(highlightedNode.id) === String(input.sink || "") ? " | destination" : ""}
            </p>
          )}
        </div>
      </div>
      )}

      {showExtendedPanels && (
        frontierLabel ||
        visitedList.length ||
        distanceEntries.length ||
        indegreeEntries.length ||
        stepPathNodes.length > 1 ||
        Number.isFinite(Number(step?.bottleneck)) ||
        Number.isFinite(Number(step?.flow))
      ) && (
        <div className="grid gap-2 text-xs text-sky/70 md:grid-cols-2">
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <div className="mb-1 text-[10px] uppercase tracking-[0.18em] text-sky/40">Frontier / Path / Visited</div>
            {frontierLabel ? (
              <p className="text-sky/80">
                {frontierLabel}: <span className="text-sky/60">{formatListPreview(frontier)}</span>
              </p>
            ) : (
              <p className="text-sky/50">No frontier snapshot for this step.</p>
            )}
            {stepPathNodes.length > 1 && (
              <p className="mt-2 text-sky/60">Path: {stepPathNodes.join(" → ")}</p>
            )}
            {visitedList.length > 0 && (
              <p className="mt-2 text-sky/60">Visited: {formatListPreview(visitedList, 22)}</p>
            )}
          </div>

          <div className="rounded-lg bg-white/5 px-3 py-2">
            <div className="mb-1 text-[10px] uppercase tracking-[0.18em] text-sky/40">Distances / In-degree</div>
            {distanceEntries.length > 0 ? (
              <div className="max-h-32 overflow-auto pr-1">
                <table className="w-full text-[11px]">
                  <tbody>
                    {distanceEntries.map(([node, value]) => (
                      <tr key={`dist-${node}`} className="border-b border-white/5 last:border-b-0">
                        <td className="py-1 pr-2 font-semibold text-sky/80">{node}</td>
                        <td className="py-1 text-right font-mono text-cyan-100">
                          {value === null || value === undefined ? "∞" : String(value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : indegreeEntries.length > 0 ? (
              <div className="max-h-32 overflow-auto pr-1">
                <table className="w-full text-[11px]">
                  <tbody>
                    {indegreeEntries.map(([node, value]) => (
                      <tr key={`deg-${node}`} className="border-b border-white/5 last:border-b-0">
                        <td className="py-1 pr-2 font-semibold text-sky/80">{node}</td>
                        <td className="py-1 text-right font-mono text-cyan-100">{String(value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sky/50">No distances/indegree data for this step.</p>
            )}
            {Number.isFinite(Number(step?.bottleneck)) && (
              <p className="mt-2 text-sky/60">Bottleneck: {String(step.bottleneck)}</p>
            )}
            {Number.isFinite(Number(step?.flow)) && (
              <p className="mt-1 text-sky/60">Flow: {String(step.flow)}</p>
            )}
            {Number.isFinite(Number(step?.cost)) && (
              <p className="mt-1 text-sky/60">Path cost: {String(step.cost)}</p>
            )}
          </div>
        </div>
      )}

      {showExtendedPanels && (
      <div className="flex flex-wrap gap-2 text-[11px] text-sky/70">
        {!isGraphColoring && <span className="rounded-full border border-teal-300/35 bg-teal-400/20 px-3 py-1">Default node</span>}
        {!isGraphColoring && <span className="rounded-full border border-emerald-300/35 bg-emerald-400/20 px-3 py-1">Visited node</span>}
        {!isGraphColoring && <span className="rounded-full border border-sky-300/35 bg-sky-400/20 px-3 py-1">Active/current node</span>}
        {!isGraphColoring && <span className="rounded-full border border-amber-300/35 bg-amber-400/20 px-3 py-1">Source node</span>}
        {!isGraphColoring && <span className="rounded-full border border-violet-300/35 bg-violet-400/20 px-3 py-1">Destination node</span>}
        {isGraphColoring && <span className="rounded-full border border-slate-300/35 bg-slate-700/40 px-3 py-1">Uncolored node</span>}
        {isGraphColoring && <span className="rounded-full border border-amber-300/35 bg-amber-400/20 px-3 py-1">Trying node</span>}
        {isGraphColoring && <span className="rounded-full border border-rose-300/35 bg-rose-400/20 px-3 py-1">Conflict node</span>}
        <span className="rounded-full border border-cyan-300/45 bg-cyan-400/20 px-3 py-1">Selected node/edge</span>
        {!isGraphColoring && <span className="rounded-full border border-orange-300/45 bg-orange-400/20 px-3 py-1">Active edge</span>}
      </div>
      )}
    </div>
  );
};

const FloydWarshallViz = ({ step, steps = [], input, zoom = 1 }) => {
  const nodes = useMemo(() => {
    if (Array.isArray(input?.nodes) && input.nodes.length) {
      return input.nodes.map((node) => String(node));
    }
    const nodeSet = new Set();
    (input?.edges || []).forEach((edge) => {
      nodeSet.add(String(edge.from));
      nodeSet.add(String(edge.to));
    });
    return Array.from(nodeSet);
  }, [input]);

  const latestTableStep = [...steps].reverse().find((item) => Array.isArray(item?.table) && item.table.length > 0) || null;
  const table = step?.table?.length ? step.table : latestTableStep?.table || [];
  const activeRow = Number.isInteger(step?.row) ? step.row : -1;
  const activeCol = Number.isInteger(step?.col) ? step.col : -1;
  const via = step?.via ?? null;
  const updatedValue = step?.value;

  if (!table.length) {
    return <div className="text-sm text-sky/50">No distance matrix to render yet.</div>;
  }

  const labelFor = (idx) => nodes?.[idx] ?? String(idx);

  return (
    <div className="space-y-4" style={{ zoom }}>
      <div className="rounded-xl border border-white/10 bg-slate-950/30 px-3 py-2 text-sm text-sky/75">
        {step?.description || "Updated distance matrix."}
      </div>

      <div className="grid gap-2 text-xs text-sky/70 md:grid-cols-3">
        <p className="rounded-lg bg-white/5 px-3 py-2">Via: {via || "-"}</p>
        <p className="rounded-lg bg-white/5 px-3 py-2">Cell: {activeRow >= 0 && activeCol >= 0 ? `${labelFor(activeRow)} → ${labelFor(activeCol)}` : "-"}</p>
        <p className="rounded-lg bg-white/5 px-3 py-2">New dist: {updatedValue === null || updatedValue === undefined ? "-" : String(updatedValue)}</p>
      </div>

      <div className="overflow-auto rounded-xl border border-white/10 bg-slate-950/30 p-3">
        <table className="border-separate border-spacing-1 text-xs">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 min-w-16 rounded bg-slate-900/80 px-2 py-1 text-sky/45">from\\to</th>
              {table[0].map((_, colIndex) => (
                <th
                  key={`fw-head-${colIndex}`}
                  className="min-w-14 rounded bg-slate-900/80 px-2 py-1 font-mono text-sky/80"
                >
                  {labelFor(colIndex)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.map((row, rowIndex) => (
              <tr key={`fw-row-${rowIndex}`}>
                <th className="sticky left-0 z-10 min-w-16 rounded bg-slate-900/80 px-2 py-1 font-mono text-sky/70">
                  {labelFor(rowIndex)}
                </th>
                {row.map((value, colIndex) => {
                  const isActive = rowIndex === activeRow && colIndex === activeCol;
                  const cellValue = value === null || value === undefined ? "∞" : String(value);
                  const className = isActive
                    ? "min-w-14 rounded border border-emerald-300/50 bg-emerald-400/20 px-2 py-1 text-center font-semibold text-emerald-100"
                    : "min-w-14 rounded border border-white/10 bg-white/5 px-2 py-1 text-center text-sky";

                  return (
                    <td key={`fw-cell-${rowIndex}-${colIndex}`} className={className}>
                      {cellValue}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-sky/70">
        <span className="rounded-full border border-emerald-300/40 bg-emerald-400/20 px-3 py-1">Updated cell</span>
        <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1">∞ = unreachable so far</span>
      </div>
    </div>
  );
};

const DpViz = ({ step, steps = [], status, algorithm, input, zoom = 1 }) => {
  const latestTableStep = [...steps].reverse().find((item) => Array.isArray(item?.table) && item.table.length > 0) || null;
  const table = step?.table?.length ? step.table : latestTableStep?.table || [];
  const activeRow = Number.isInteger(step?.row) ? step.row : -1;
  const activeCol = Number.isInteger(step?.col) ? step.col : -1;
  const activeAction = step?.action || "";

  const textA = String(input?.text_a || "");
  const textB = String(input?.text_b || "");
  const isStringDp = ["lcs", "edit_distance", "longest_common_substring"].includes(algorithm) && textA.length > 0 && textB.length > 0;
  const isLcs = algorithm === "lcs" && isStringDp;
  const isEditDistance = algorithm === "edit_distance" && isStringDp;
  const isLongestCommonSubstring = algorithm === "longest_common_substring" && isStringDp;

  const sourceHint = (() => {
    if (!isStringDp || activeRow < 1 || activeCol < 1 || !table.length) {
      return { type: null, row: -1, col: -1 };
    }

    if (isLcs) {
      if (activeAction === "match") {
        return { type: "diagonal", row: activeRow - 1, col: activeCol - 1 };
      }
      const top = table?.[activeRow - 1]?.[activeCol] ?? -Infinity;
      const left = table?.[activeRow]?.[activeCol - 1] ?? -Infinity;
      if (top >= left) {
        return { type: "top", row: activeRow - 1, col: activeCol };
      }
      return { type: "left", row: activeRow, col: activeCol - 1 };
    }

    if (isEditDistance) {
      if (activeAction === "match" || activeAction === "replace") {
        return { type: "diagonal", row: activeRow - 1, col: activeCol - 1 };
      }
      if (activeAction === "insert") {
        return { type: "left", row: activeRow, col: activeCol - 1 };
      }
      if (activeAction === "delete") {
        return { type: "top", row: activeRow - 1, col: activeCol };
      }

      const top = table?.[activeRow - 1]?.[activeCol] ?? Infinity;
      const left = table?.[activeRow]?.[activeCol - 1] ?? Infinity;
      const diagonal = table?.[activeRow - 1]?.[activeCol - 1] ?? Infinity;
      const best = Math.min(top, left, diagonal);
      if (best === diagonal) return { type: "diagonal", row: activeRow - 1, col: activeCol - 1 };
      if (best === top) return { type: "top", row: activeRow - 1, col: activeCol };
      return { type: "left", row: activeRow, col: activeCol - 1 };
    }

    if (isLongestCommonSubstring && activeAction === "match") {
      return { type: "diagonal", row: activeRow - 1, col: activeCol - 1 };
    }

    return { type: null, row: -1, col: -1 };
  })();

  const reconstructedLcs = useMemo(() => {
    if (!isLcs || !table.length) {
      return "";
    }
    let i = textA.length;
    let j = textB.length;
    const chars = [];
    while (i > 0 && j > 0) {
      if (textA[i - 1] === textB[j - 1]) {
        chars.push(textA[i - 1]);
        i -= 1;
        j -= 1;
      } else if ((table?.[i - 1]?.[j] ?? 0) >= (table?.[i]?.[j - 1] ?? 0)) {
        i -= 1;
      } else {
        j -= 1;
      }
    }
    return chars.reverse().join("");
  }, [isLcs, table, textA, textB]);

  const reconstructedSubstring = useMemo(() => {
    if (!isLongestCommonSubstring || !table.length) {
      return "";
    }

    let best = 0;
    let endIndex = 0;
    for (let i = 1; i < table.length; i += 1) {
      for (let j = 1; j < (table[i] || []).length; j += 1) {
        const value = Number(table[i][j] || 0);
        if (value > best) {
          best = value;
          endIndex = i;
        }
      }
    }

    if (best <= 0) {
      return "";
    }
    return textA.slice(endIndex - best, endIndex);
  }, [isLongestCommonSubstring, table, textA]);

  if (!table.length && status === "completed") {
    return (
      <div className="rounded-xl border border-red-300/35 bg-red-400/10 px-3 py-3 text-sm text-red-100">
        Execution completed, but no DP table data was returned for rendering. Please rerun or check this algorithm step payload.
      </div>
    );
  }

  if (!table.length) {
    return <div className="text-sm text-sky/50">No DP table to render yet.</div>;
  }

  if (isStringDp) {
    const finalLength = table?.[textA.length]?.[textB.length] ?? 0;
    const longestSubstringLength = table.reduce(
      (best, row) => Math.max(best, ...((row || []).map((value) => Number(value || 0)))),
      0
    );

    const intro = isLcs
      ? "Each cell dp[i][j] stores the LCS length for prefixes of string1 and string2."
      : isEditDistance
        ? "Each cell dp[i][j] stores the minimum edits needed to convert prefix A[0..i) to B[0..j)."
        : "Each cell dp[i][j] stores longest contiguous-match length ending at i and j; mismatches reset to 0.";

    const sourceLegend = isEditDistance
      ? "Diagonal/top/left represent replace-delete-insert transitions."
      : isLongestCommonSubstring
        ? "Only diagonal contributes on match; mismatch resets to 0."
        : "Diagonal = match, top/left = carry best subsequence.";

    return (
      <div className="space-y-4" style={{ zoom }}>
        <div className="rounded-xl border border-blue-300/20 bg-blue-400/10 px-3 py-2 text-sm text-blue-100">
          {intro}
        </div>

        <div className="grid gap-2 text-xs text-sky/70 md:grid-cols-2">
          <div className="min-w-0 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <p className="text-sky/40">Rows (string1)</p>
            <p className="mt-1 truncate font-mono text-sm text-sky">{textA}</p>
          </div>
          <div className="min-w-0 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <p className="text-sky/40">Columns (string2)</p>
            <p className="mt-1 truncate font-mono text-sm text-sky">{textB}</p>
          </div>
        </div>

        <div className="overflow-auto rounded-xl border border-white/10 bg-slate-950/30 p-3">
          <table className="border-separate border-spacing-1 text-xs">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 min-w-12 rounded bg-slate-900/80 px-2 py-1 text-sky/50">i/j</th>
                <th className="min-w-10 rounded bg-slate-900/80 px-2 py-1 text-sky/40">-</th>
                {textB.split("").map((char, idx) => (
                  <th key={`col-char-${idx}`} className="min-w-10 rounded bg-slate-900/80 px-2 py-1 font-mono text-sky/80">
                    {char}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.map((row, rowIndex) => (
                <tr key={`row-${rowIndex}`}>
                  <th className="sticky left-0 z-10 min-w-12 rounded bg-slate-900/80 px-2 py-1 font-mono text-sky/70">
                    {rowIndex === 0 ? "-" : textA[rowIndex - 1]}
                  </th>
                  {row.map((value, colIndex) => {
                    const isActive = rowIndex === activeRow && colIndex === activeCol;
                    const isSource = rowIndex === sourceHint.row && colIndex === sourceHint.col;
                    const isMatchCell = isActive && activeAction === "match";
                    const isResetCell = isLongestCommonSubstring && isActive && activeAction !== "match";
                    const isTransitionCell = isActive && !isMatchCell && !isResetCell;

                    let className = "min-w-10 rounded border border-white/10 bg-white/5 px-2 py-1 text-center text-sky";
                    if (isSource) {
                      className = "min-w-10 rounded border border-cyan-300/50 bg-cyan-400/15 px-2 py-1 text-center text-cyan-100";
                    }
                    if (isTransitionCell) {
                      className = "min-w-10 rounded border border-amber-300/50 bg-amber-400/20 px-2 py-1 text-center font-semibold text-amber-100";
                    }
                    if (isResetCell) {
                      className = "min-w-10 rounded border border-rose-300/50 bg-rose-400/20 px-2 py-1 text-center font-semibold text-rose-100";
                    }
                    if (isMatchCell) {
                      className = "min-w-10 rounded border border-emerald-300/50 bg-emerald-400/25 px-2 py-1 text-center font-semibold text-emerald-100";
                    }

                    return (
                      <td key={`cell-${rowIndex}-${colIndex}`} className={className}>
                        {value}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-sky/70">
          <span className="rounded-full border border-emerald-300/40 bg-emerald-400/20 px-3 py-1">Active match cell</span>
          <span className="rounded-full border border-amber-300/40 bg-amber-400/20 px-3 py-1">Active transition cell</span>
          {isLongestCommonSubstring && (
            <span className="rounded-full border border-rose-300/40 bg-rose-400/20 px-3 py-1">Mismatch reset to 0</span>
          )}
          <span className="rounded-full border border-cyan-300/40 bg-cyan-400/15 px-3 py-1">Transition source ({sourceHint.type || "-"})</span>
          <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1">{sourceLegend}</span>
        </div>

        <div className="grid gap-2 md:grid-cols-2">
          {isLcs && (
            <>
              <div className="rounded-xl border border-blue-300/35 bg-blue-400/15 px-3 py-2 text-sm text-blue-100">
                Final LCS length: <span className="font-semibold">{finalLength}</span>
              </div>
              <div className="min-w-0 rounded-xl border border-purple-300/35 bg-purple-400/15 px-3 py-2 text-sm text-purple-100">
                Reconstructed subsequence: <span className="font-mono font-semibold">{reconstructedLcs || "(empty)"}</span>
              </div>
            </>
          )}

          {isEditDistance && (
            <>
              <div className="rounded-xl border border-blue-300/35 bg-blue-400/15 px-3 py-2 text-sm text-blue-100">
                Minimum edit distance: <span className="font-semibold">{finalLength}</span>
              </div>
              <div className="rounded-xl border border-purple-300/35 bg-purple-400/15 px-3 py-2 text-sm text-purple-100">
                Tip: follow highlighted source cell to see whether each update was insert, delete, replace, or match.
              </div>
            </>
          )}

          {isLongestCommonSubstring && (
            <>
              <div className="rounded-xl border border-blue-300/35 bg-blue-400/15 px-3 py-2 text-sm text-blue-100">
                Longest common substring length: <span className="font-semibold">{longestSubstringLength}</span>
              </div>
              <div className="min-w-0 rounded-xl border border-purple-300/35 bg-purple-400/15 px-3 py-2 text-sm text-purple-100">
                Reconstructed substring: <span className="font-mono font-semibold">{reconstructedSubstring || "(empty)"}</span>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  if (algorithm === "knapsack_01") {
    const weights = input?.weights || [];
    const values = input?.values || [];
    const capacity = Math.max(0, Number(input?.capacity || table[0]?.length - 1 || 0));

    return (
      <div className="space-y-3">
        <div className="rounded-xl border border-blue-300/20 bg-blue-400/10 px-3 py-2 text-sm text-blue-100">
          dp[i][w] stores best value using first i items within capacity w. Each cell compares "skip" vs "take".
        </div>
        <div className="overflow-auto rounded-xl border border-white/10 bg-slate-950/30 p-3">
          <table className="border-separate border-spacing-1 text-xs">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 min-w-36 rounded bg-slate-900/80 px-2 py-1 text-sky/45">Item / Capacity</th>
              {Array.from({ length: capacity + 1 }, (_, idx) => (
                <th key={`knapsack-head-${idx}`} className="min-w-9 rounded bg-slate-900/80 px-2 py-1 text-sky/55">{idx}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.map((row, rowIndex) => (
              <tr key={`knapsack-row-${rowIndex}`}>
                <th className="sticky left-0 z-10 min-w-36 rounded bg-slate-900/80 px-2 py-1 text-left text-sky/65">
                  {rowIndex === 0
                    ? "∅ (base)"
                    : `Item ${rowIndex} (w=${weights[rowIndex - 1] ?? "-"}, v=${values[rowIndex - 1] ?? "-"})`}
                </th>
                {row.map((value, colIndex) => (
                  <td
                    key={`knapsack-cell-${rowIndex}-${colIndex}`}
                    className={`min-w-9 rounded border px-2 py-1 text-center ${rowIndex === activeRow && colIndex === activeCol ? "border-emerald-300/50 bg-emerald-400/20 font-semibold text-emerald-100" : "border-white/10 bg-white/5 text-sky"}`}
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (algorithm === "matrix_chain_multiplication") {
    return (
      <div className="space-y-3">
        <div className="rounded-xl border border-blue-300/20 bg-blue-400/10 px-3 py-2 text-sm text-blue-100">
          dp[i][j] stores minimum scalar multiplications for matrices Mi..Mj. Each update tries all split points k.
        </div>
        <div className="overflow-auto rounded-xl border border-white/10 bg-slate-950/30 p-3">
          <table className="border-separate border-spacing-1 text-xs">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 min-w-16 rounded bg-slate-900/80 px-2 py-1 text-sky/45">i/j</th>
              {table.map((_, idx) => (
                <th key={`mcm-head-${idx}`} className="min-w-10 rounded bg-slate-900/80 px-2 py-1 text-sky/55">M{idx + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.map((row, rowIndex) => (
              <tr key={`mcm-row-${rowIndex}`}>
                <th className="sticky left-0 z-10 min-w-16 rounded bg-slate-900/80 px-2 py-1 text-sky/65">M{rowIndex + 1}</th>
                {row.map((value, colIndex) => (
                  <td
                    key={`mcm-cell-${rowIndex}-${colIndex}`}
                    className={`min-w-10 rounded border px-2 py-1 text-center ${rowIndex === activeRow && colIndex === activeCol ? "border-emerald-300/50 bg-emerald-400/20 font-semibold text-emerald-100" : "border-white/10 bg-white/5 text-sky"}`}
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-auto rounded-xl border border-white/10 bg-slate-950/30 p-3" style={{ zoom }}>
      <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${table[0]?.length || 1}, minmax(28px, 1fr))` }}>
        {table.flatMap((row, rowIndex) =>
          row.map((value, colIndex) => {
            const isActive = step?.row === rowIndex && step?.col === colIndex;
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`flex h-9 w-9 items-center justify-center rounded border text-xs ${isActive ? "border-emerald-300/40 bg-emerald-400 text-ink" : "border-white/10 bg-white/10"}`}
              >
                {value}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const HuffmanViz = ({ step, steps = [], input, zoom = 1 }) => {
  const finalStep = [...steps].reverse().find((item) => item?.type === "complete") || null;
  const sortStep = [...steps].find((item) => item?.type === "sort") || null;
  const frequencies = step?.frequencies || finalStep?.frequencies || [];
  const codes = step?.codes || finalStep?.codes || {};
  const encodedText = step?.encoded_text || finalStep?.encoded_text || "";
  const originalBits = step?.original_bits ?? finalStep?.original_bits ?? String(input?.text || "").length * 8;
  const encodedBits = step?.encoded_bits ?? finalStep?.encoded_bits ?? encodedText.length;
  const compressionRatio = step?.compression_ratio ?? finalStep?.compression_ratio ?? (originalBits ? Number((encodedBits / originalBits).toFixed(4)) : 0);
  const savingsBits = step?.savings_bits ?? finalStep?.savings_bits ?? Math.max(0, originalBits - encodedBits);
  const currentIndex = Math.max(0, steps.findIndex((item) => item === step));
  const countedChars = new Set(
    steps
      .slice(0, currentIndex + 1)
      .filter((item) => item?.type === "frequency")
      .map((item) => item?.char)
  );
  const queue = step?.queue || [];
  const sortedQueue = sortStep?.queue || [];
  const tableRows = step?.table_rows || finalStep?.table_rows || [];

  const renderChar = (char) => (char === " " ? "space" : char);
  const orderedCodes = Object.entries(codes).sort(([a], [b]) => a.localeCompare(b));
  const computedRows = tableRows.length
    ? tableRows
    : frequencies.map((entry) => {
        const code = codes[entry.char] || "";
        return {
          char: entry.char,
          frequency: entry.frequency,
          code,
          code_length: code.length,
          weighted_bits: entry.frequency * code.length,
          ascii_bits: entry.frequency * 8,
        };
      });

  const stageOrder = ["frequency", "sort", "merge", "code", "complete"];
  const stageLabels = {
    frequency: "1. Count Frequencies",
    sort: "2. Sort Ascending",
    merge: "3. Optimal Merging",
    code: "4. Assign Codes",
    complete: "5. Final Coding Table"
  };
  const activeStage = stageOrder.includes(step?.type) ? step.type : "frequency";
  const activeStageIndex = stageOrder.indexOf(activeStage);

  return (
    <div className="space-y-4" style={{ zoom }}>
      <div className="rounded-xl border border-indigo-300/25 bg-indigo-400/10 px-3 py-2 text-sm text-indigo-100">
        Huffman workflow: count frequencies, sort ascending, merge optimal pairs one by one, assign prefix codes, then present the final coding table.
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        {stageOrder.map((stage, index) => {
          const isDone = index < activeStageIndex;
          const isActive = index === activeStageIndex;
          const chipClass = isActive
            ? "border-cyan-300/55 bg-cyan-400/20 text-cyan-100"
            : isDone
              ? "border-emerald-300/45 bg-emerald-400/20 text-emerald-100"
              : "border-white/15 bg-white/5 text-sky/60";
          return (
            <span key={stage} className={`rounded-full border px-3 py-1 ${chipClass}`}>
              {stageLabels[stage]}
            </span>
          );
        })}
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-3">
        <div className="mb-2 text-xs uppercase tracking-[0.18em] text-sky/50">Character Frequencies</div>
        <div className="flex flex-wrap gap-2 text-xs">
          {frequencies.map((entry) => {
            const isCounted = countedChars.has(entry.char) || activeStageIndex >= 1;
            return (
              <span
                key={`freq-${entry.char}`}
                className={`rounded-full border px-3 py-1 ${
                  isCounted
                    ? "border-emerald-300/40 bg-emerald-400/20 text-emerald-100"
                    : "border-white/20 bg-white/5 text-sky/65"
                }`}
              >
                {renderChar(entry.char)}: {entry.frequency}
              </span>
            );
          })}
        </div>
      </div>

      {step?.type === "frequency" && (
        <div className="rounded-xl border border-cyan-300/35 bg-cyan-400/12 px-3 py-2 text-sm text-cyan-100">
          Counting symbol: <span className="font-semibold">{renderChar(step?.char)}</span> {" → "}{step?.frequency}
        </div>
      )}

      {step?.type === "sort" && (
        <div className="rounded-xl border border-amber-300/35 bg-amber-400/12 p-3">
          <div className="mb-2 text-xs uppercase tracking-[0.18em] text-amber-100/80">Ascending Queue</div>
          <div className="flex flex-wrap gap-2 text-xs">
            {sortedQueue.map((item) => (
              <span key={item.id} className="rounded-full border border-amber-300/40 bg-amber-400/20 px-3 py-1 text-amber-100">
                {item.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {step?.type === "merge" && (
        <div className="space-y-3">
          <div className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300/80">
              Optimal Merge {step?.merge_no || 1} / {step?.total_merges || "?"}
            </div>
            <div className="flex items-center justify-center gap-3 sm:gap-6">
              <div className="flex h-16 w-16 flex-col items-center justify-center rounded-full border-2 border-emerald-300/45 bg-emerald-400/20 text-emerald-100">
                <span className="text-xl font-bold">{step?.left?.frequency}</span>
                <span className="max-w-[52px] truncate text-[10px]">{renderChar(step?.left?.char || "node")}</span>
              </div>
              <div className="text-2xl font-bold text-sky/30">+</div>
              <div className="flex h-16 w-16 flex-col items-center justify-center rounded-full border-2 border-emerald-300/45 bg-emerald-400/20 text-emerald-100">
                <span className="text-xl font-bold">{step?.right?.frequency}</span>
                <span className="max-w-[52px] truncate text-[10px]">{renderChar(step?.right?.char || "node")}</span>
              </div>
              <div className="text-2xl font-bold text-sky/30">{"→"}</div>
              <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full border-2 border-indigo-400/70 bg-indigo-500/25 px-1 py-2 text-indigo-100">
                <span className="text-xl font-bold">{step?.parent?.frequency}</span>
                <span className="text-[10px] uppercase tracking-wider opacity-80">parent</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-950/35 p-3">
            <div className="mb-2 text-xs uppercase tracking-[0.18em] text-sky/50">Queue After Merge</div>
            <div className="flex flex-wrap gap-2 text-xs">
              {queue.map((item) => (
                <span key={item.id} className={`rounded-full border px-3 py-1 ${item.is_leaf ? "border-emerald-300/40 bg-emerald-400/20 text-emerald-100" : "border-amber-300/40 bg-amber-400/20 text-amber-100"}`}>
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {step?.type === "code" && (
        <div className="space-y-3">
          <div className="rounded-xl border border-purple-300/35 bg-purple-400/12 px-3 py-2 text-sm text-purple-100">
            Code assignment {step?.code_no || 1} / {step?.total_codes || "?"}: <span className="font-semibold">{renderChar(step?.char)}</span> {" → "}<span className="font-mono font-semibold">{step?.code}</span>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-950/35 p-3">
            <div className="mb-2 text-xs uppercase tracking-[0.18em] text-sky/50">Codes Built So Far</div>
            <div className="grid gap-2 sm:grid-cols-2">
              {orderedCodes.map(([char, code]) => (
                <div key={`code-${char}`} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-sky">
                  <span className="text-sky/60">{renderChar(char)}</span>
                  <span>{" -> "}</span>
                  <span className="text-emerald-200">{code}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {step?.type === "complete" && (
        <div className="space-y-3">
          <div className="grid gap-2 text-xs text-sky/70 md:grid-cols-4">
            <p className="rounded-lg bg-white/5 px-3 py-2">Original bits: {originalBits}</p>
            <p className="rounded-lg bg-white/5 px-3 py-2">Encoded bits: {encodedBits}</p>
            <p className="rounded-lg bg-white/5 px-3 py-2">Saved bits: {savingsBits}</p>
            <p className="rounded-lg bg-white/5 px-3 py-2">Compression ratio: {compressionRatio}</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-950/35 p-3">
            <div className="mb-2 text-xs uppercase tracking-[0.18em] text-sky/50">Final Huffman Coding Table</div>
            <div className="overflow-auto">
              <table className="min-w-full border-separate border-spacing-y-1 text-xs">
                <thead>
                  <tr>
                    <th className="rounded bg-slate-900/80 px-2 py-1 text-left text-sky/55">Symbol</th>
                    <th className="rounded bg-slate-900/80 px-2 py-1 text-right text-sky/55">Freq</th>
                    <th className="rounded bg-slate-900/80 px-2 py-1 text-left text-sky/55">Code</th>
                    <th className="rounded bg-slate-900/80 px-2 py-1 text-right text-sky/55">Code Len</th>
                    <th className="rounded bg-slate-900/80 px-2 py-1 text-right text-sky/55">Huffman Bits</th>
                    <th className="rounded bg-slate-900/80 px-2 py-1 text-right text-sky/55">ASCII Bits</th>
                  </tr>
                </thead>
                <tbody>
                  {computedRows.map((row) => (
                    <tr key={`row-${row.char}`}>
                      <td className="rounded border border-white/10 bg-white/5 px-2 py-1 text-sky">{renderChar(row.char)}</td>
                      <td className="rounded border border-white/10 bg-white/5 px-2 py-1 text-right text-sky">{row.frequency}</td>
                      <td className="rounded border border-white/10 bg-white/5 px-2 py-1 font-mono text-emerald-200">{row.code}</td>
                      <td className="rounded border border-white/10 bg-white/5 px-2 py-1 text-right text-sky">{row.code_length}</td>
                      <td className="rounded border border-white/10 bg-white/5 px-2 py-1 text-right text-cyan-100">{row.weighted_bits}</td>
                      <td className="rounded border border-white/10 bg-white/5 px-2 py-1 text-right text-sky">{row.ascii_bits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {encodedText && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="mb-2 text-xs uppercase tracking-[0.18em] text-sky/50">Encoded Bitstream Preview</div>
              <p className="break-all font-mono text-xs text-emerald-200">{encodedText.slice(0, 360)}{encodedText.length > 360 ? "..." : ""}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const StringViz = ({ step, input, zoom = 1 }) => {
  const text = String(step?.text || input?.text || "");
  const pattern = String(step?.pattern || input?.pattern || "");
  const isKmpCompare = Number.isInteger(step?.text_index) && Number.isInteger(step?.pattern_index);
  const index = Number.isInteger(step?.index) ? step.index : Number.isInteger(step?.text_index) ? step.text_index : 0;
  const patternIndex = Number.isInteger(step?.pattern_index) ? step.pattern_index : 0;
  const windowStart = isKmpCompare ? Math.max(0, index - patternIndex) : Math.max(0, index);
  const currentCompareTextIndex = step?.type === "compare" ? (isKmpCompare ? index : windowStart + patternIndex) : -1;
  const showMatchBadge = step?.type === "match" || Boolean(step?.match);
  const showMismatchBadge = step?.type === "compare" && step?.match === false;

  return (
    <div className="space-y-4 overflow-x-hidden font-mono text-sm" style={{ zoom }}>
      <div className="rounded-xl border border-white/10 bg-white/5 p-3">
        <div className="mb-2 text-sky/50">Text</div>
        <div className="overflow-x-auto">
          <div className="flex min-w-max gap-1">
          {text.split("").map((char, idx) => {
            const inWindow = idx >= windowStart && idx < windowStart + pattern.length;
            const isCompare = idx === currentCompareTextIndex;
            const isMatch = isCompare && step?.match === true;
            const isMismatch = isCompare && step?.match === false;

            let className = "h-9 w-9 rounded-md border border-white/20 bg-slate-900/80 text-sky/80 flex items-center justify-center";
            if (inWindow) className = "h-9 w-9 rounded-md border border-amber-300/35 bg-amber-400/15 text-amber-100 flex items-center justify-center";
            if (isMatch) className = "h-9 w-9 rounded-md border border-emerald-300/45 bg-emerald-400/25 text-emerald-100 flex items-center justify-center";
            if (isMismatch) className = "h-9 w-9 rounded-md border border-red-300/45 bg-red-400/20 text-red-100 flex items-center justify-center";

            return (
              <div key={`text-${idx}-${char}`} className={className}>
                {char}
              </div>
            );
          })}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-3">
        <div className="mb-2 text-sky/50">Pattern Window</div>
        <div className="overflow-hidden">
          <div
            className="flex min-w-max gap-1 transition-transform duration-300 ease-out"
            style={{ transform: `translateX(${windowStart * 40}px)` }}
          >
            {pattern.split("").map((char, idx) => {
              const isCompare = step?.type === "compare" && idx === patternIndex;
              const isMatch = isCompare && step?.match === true;
              const isMismatch = isCompare && step?.match === false;

              let className = "h-9 w-9 rounded-md border border-cyan-300/35 bg-cyan-400/20 text-cyan-100 flex items-center justify-center";
              if (isMatch) className = "h-9 w-9 rounded-md border border-emerald-300/45 bg-emerald-400/25 text-emerald-100 flex items-center justify-center";
              if (isMismatch) className = "h-9 w-9 rounded-md border border-red-300/45 bg-red-400/20 text-red-100 flex items-center justify-center";

              return (
                <div key={`pattern-${idx}-${char}`} className={className}>
                  {char}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-sky/65">
        <span className="rounded-full bg-white/5 px-3 py-1">Text Index: {index}</span>
        <span className="rounded-full bg-white/5 px-3 py-1">Pattern Index: {patternIndex}</span>
        <span className="rounded-full bg-amber-400/15 px-3 py-1 text-amber-100">Current window starts at {windowStart}</span>
        {showMatchBadge && (
          <span className="rounded-full border border-emerald-300/45 bg-emerald-400/25 px-3 py-1 text-emerald-100">
            Match found at index {index}
          </span>
        )}
        {showMismatchBadge && (
          <span className="rounded-full border border-red-300/45 bg-red-400/25 px-3 py-1 text-red-100">✗ Mismatch</span>
        )}
      </div>
    </div>
  );
};

const DataStructureViz = ({ category, step, stepIndex, totalSteps, zoom = 1 }) => {
  const state = step?.state || {};
  const values = state?.values || [];
  const isError = step?.status === "error";

  const renderLinear = () => {
    if (state?.variant === "priority") {
      const items = state?.items || [];
      return (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {items.map((item, idx) => (
              <div key={`pq-${idx}`} className="rounded-lg border border-cyan-300/35 bg-cyan-400/15 px-3 py-2 text-xs text-cyan-100">
                <div>value: <span className="font-semibold">{String(item.value)}</span></div>
                <div>priority: {item.priority}</div>
              </div>
            ))}
            {!items.length && <p className="text-sm text-sky/45">Structure is empty.</p>}
          </div>
        </div>
      );
    }

    if (state?.variant === "circular") {
      const slots = state?.slots || [];
      return (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {slots.map((value, idx) => {
              const isFront = idx === state.front_index;
              const isRear = idx === state.rear_index;
              return (
                <div
                  key={`slot-${idx}`}
                  className={`min-w-16 rounded-lg border px-2 py-2 text-center text-xs ${isFront || isRear ? "border-amber-300/45 bg-amber-400/20 text-amber-100" : "border-white/15 bg-white/5 text-sky/70"}`}
                >
                  <div className="text-[10px] text-sky/45">#{idx}</div>
                  <div className="font-semibold">{value === null || value === undefined ? "-" : String(value)}</div>
                  <div className="text-[10px]">
                    {isFront ? "F" : ""}{isRear ? "R" : ""}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    const direction = category === "stack" ? "vertical" : "horizontal";
    return (
      <div className="space-y-3">
        <div className={`flex ${direction === "vertical" ? "flex-col-reverse items-start" : "items-center flex-wrap"} gap-2`}>
          {values.map((value, idx) => (
            <div key={`value-${idx}`} className="rounded-lg border border-emerald-300/40 bg-emerald-400/20 px-3 py-2 text-sm font-semibold text-emerald-100">
              {String(value)}
            </div>
          ))}
          {!values.length && <p className="text-sm text-sky/45">Structure is empty.</p>}
        </div>
      </div>
    );
  };

  const renderLinkedList = () => {
    const nodes = Array.isArray(state?.nodes) && state.nodes.length
      ? state.nodes
      : values.map((value, index) => ({ id: `n${index}`, value, index }));
    const variant = String(state?.variant || "singly_linked_list");
    const isDoubly = variant.includes("doubly");
    const isCircular = variant.includes("circular");
    const highlightIndex = Number.isInteger(state?.highlight_index) ? state.highlight_index : -1;

    if (!nodes.length) {
      return <p className="text-sm text-sky/45">Linked list is empty.</p>;
    }

    return (
      <div className="space-y-3">
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950/30 p-3">
          <div className="flex min-w-max items-center gap-2">
            {nodes.map((node, idx) => {
              const isHighlighted = idx === highlightIndex;
              const cardClass = isHighlighted
                ? "border-amber-300/50 bg-amber-400/20 text-amber-100"
                : "border-emerald-300/40 bg-emerald-400/20 text-emerald-100";

              return (
                <div key={`ll-${node.id || idx}`} className="flex items-center gap-2">
                  <div className={`min-w-24 rounded-lg border px-3 py-2 text-center text-xs ${cardClass}`}>
                    <div className="text-[10px] uppercase tracking-[0.12em] opacity-80">Node {idx}</div>
                    <div className="mt-1 text-sm font-semibold">{String(node.value)}</div>
                  </div>

                  {idx < nodes.length - 1 && (
                    <div className="flex flex-col items-center text-[10px] text-sky/55">
                      <span className="font-semibold text-sky/75">next</span>
                      <span className="text-lg leading-none text-cyan-200">→</span>
                      {isDoubly && <span className="text-lg leading-none text-cyan-200">←</span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-sky/70">
          <span className="rounded-full border border-cyan-300/35 bg-cyan-400/15 px-3 py-1">Head: {String(state?.head ?? "null")}</span>
          <span className="rounded-full border border-cyan-300/35 bg-cyan-400/15 px-3 py-1">Tail: {String(state?.tail ?? "null")}</span>
          {isDoubly && <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1">Doubly linked (next + prev)</span>}
          {isCircular && <span className="rounded-full border border-purple-300/35 bg-purple-400/15 px-3 py-1">Circular link: tail → head</span>}
        </div>
      </div>
    );
  };

  const renderTree = () => {
    const nodes = state?.nodes || [];
    const edges = state?.edges || [];
    const leafLinks = state?.leaf_links || [];
    const isMultiKeyTree = nodes.some((node) => Array.isArray(node?.keys));

    if (!nodes.length) {
      return <p className="text-sm text-sky/45">Tree is empty.</p>;
    }

    const width = Math.round(760 * zoom);
    const levelHeight = Math.round(88 * zoom);
    const levelMap = new Map();
    nodes.forEach((node) => {
      const level = Number(node.level || 0);
      if (!levelMap.has(level)) {
        levelMap.set(level, []);
      }
      levelMap.get(level).push(node);
    });

    const levels = Array.from(levelMap.keys()).sort((a, b) => a - b);
    const height = Math.max(220, (levels.length + 1) * levelHeight);
    const positions = new Map();

    levels.forEach((level) => {
      const list = levelMap.get(level) || [];
      list.sort((a, b) => String(a.id).localeCompare(String(b.id)));
      list.forEach((node, idx) => {
        const x = ((idx + 1) * width) / (list.length + 1);
        const y = 48 + level * levelHeight;
        positions.set(node.id, { x, y });
      });
    });

    const highlight = state?.highlight_value;

    if (isMultiKeyTree) {
      return (
        <svg className="w-full rounded-xl bg-slate-900/30" viewBox={`0 0 ${width} ${height}`} style={{ height: `${18 * zoom}rem` }}>
          <g>
            {edges.map((edge, idx) => {
              const from = positions.get(edge.from);
              const to = positions.get(edge.to);
              if (!from || !to) return null;
              return (
                <g key={`edge-${idx}`}>
                  <line x1={from.x} y1={from.y + 14} x2={to.x} y2={to.y - 14} stroke="#64748b" strokeWidth="1.5" />
                </g>
              );
            })}

            {leafLinks.map((edge, idx) => {
              const from = positions.get(edge.from);
              const to = positions.get(edge.to);
              if (!from || !to) return null;
              return (
                <g key={`leaf-link-${idx}`}>
                  <line
                    x1={from.x + 20}
                    y1={from.y + 20}
                    x2={to.x - 20}
                    y2={to.y + 20}
                    stroke="#a78bfa"
                    strokeWidth="1.6"
                    strokeDasharray="6 4"
                  />
                  <text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 + 30} textAnchor="middle" fill="#c4b5fd" fontSize="10">
                    next
                  </text>
                </g>
              );
            })}
          </g>

          <g>
            {nodes.map((node) => {
              const pos = positions.get(node.id);
              if (!pos) return null;
              const keys = Array.isArray(node.keys) ? node.keys : [];
              const text = keys.length ? keys.map((value) => String(value)).join(" | ") : "-";
              const nodeWidth = Math.max(60, 24 + keys.length * 34);
              const nodeHeight = 30;
              const x = pos.x - nodeWidth / 2;
              const y = pos.y - nodeHeight / 2;
              const isHighlighted = highlight !== undefined && keys.some((value) => String(value) === String(highlight));
              const isLeaf = Boolean(node.leaf);

              return (
                <g key={`node-${node.id}`}>
                  <rect
                    x={x}
                    y={y}
                    width={nodeWidth}
                    height={nodeHeight}
                    rx={8}
                    fill={isHighlighted ? "#f59e0b" : isLeaf ? "#1d4ed8" : "#0f766e"}
                    stroke={isHighlighted ? "#fde68a" : "#bae6fd"}
                    strokeWidth={isHighlighted ? 2.4 : 1.4}
                  />
                  <text x={pos.x} y={pos.y + 4} textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="700">
                    {text}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      );
    }

    return (
      <svg className="w-full rounded-xl bg-slate-900/30" viewBox={`0 0 ${width} ${height}`} style={{ height: `${18 * zoom}rem` }}>
        <g>
          {edges.map((edge, idx) => {
            const from = positions.get(edge.from);
            const to = positions.get(edge.to);
            if (!from || !to) return null;
            return (
              <g key={`edge-${idx}`}>
                <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#64748b" strokeWidth="1.5" />
                {edge.label && (
                  <text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 4} textAnchor="middle" fill="#94a3b8" fontSize="10">
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}
        </g>
        <g>
          {nodes.map((node) => {
            const pos = positions.get(node.id);
            if (!pos) return null;
            const isHighlighted = highlight !== undefined && String(node.value) === String(highlight);
            const isTerminal = Boolean(node.terminal);
            return (
              <g key={`node-${node.id}`}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={18}
                  fill={isHighlighted ? "#f59e0b" : isTerminal ? "#8b5cf6" : "#0f766e"}
                  stroke={isHighlighted ? "#fde68a" : "#99f6e4"}
                  strokeWidth={isHighlighted ? 2.5 : 1.5}
                />
                <text x={pos.x} y={pos.y + 4} textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="700">
                  {String(node.value)}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    );
  };

  return (
    <div className="space-y-4">
      <div className={`rounded-xl border px-3 py-2 text-sm ${isError ? "border-red-300/40 bg-red-400/15 text-red-100" : "border-cyan-300/30 bg-cyan-400/10 text-cyan-100"}`}>
        {step?.message || "State updated."}
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-sky/70">
        <span className="rounded-full bg-white/5 px-3 py-1">Step: {stepIndex + 1} / {totalSteps}</span>
        <span className="rounded-full bg-white/5 px-3 py-1">Operation: {step?.operation || step?.type || "-"}</span>
        {state?.size !== undefined && <span className="rounded-full bg-white/5 px-3 py-1">Size: {state.size}</span>}
        {state?.capacity !== undefined && <span className="rounded-full bg-white/5 px-3 py-1">Capacity: {state.capacity}</span>}
        {state?.front !== undefined && <span className="rounded-full bg-white/5 px-3 py-1">Front: {String(state.front)}</span>}
        {state?.rear !== undefined && <span className="rounded-full bg-white/5 px-3 py-1">Rear: {String(state.rear)}</span>}
        {state?.top !== undefined && <span className="rounded-full bg-white/5 px-3 py-1">Top: {String(state.top)}</span>}
      </div>

      {state?.kind === "linked_list" ? renderLinkedList() : state?.kind === "tree" ? renderTree() : renderLinear()}

      {Array.isArray(state?.traversed) && state.traversed.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-sky/75">
          Traversal: {state.traversed.map((item) => String(item)).join(" -> ")}
        </div>
      )}

      {state?.traversals && (
        <div className="grid gap-2 md:grid-cols-2">
          {Object.entries(state.traversals).map(([key, list]) => (
            <div key={key} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-sky/75">
              <span className="font-semibold text-sky/90">{key}:</span> {Array.isArray(list) ? list.map((item) => String(item)).join(", ") : "-"}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const VisualizationCanvas = ({ category, algorithm, steps, stepIndex, input, zoom = 1, status, minimalView = false, emptyStateMessage }) => {
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const step = steps?.[stepIndex] || {};

  const wrapVisualization = (content) => (
    <div className={`viz-theme-root ${isLightTheme ? "viz-theme-light" : ""}`}>
      {content}
    </div>
  );

  if (!steps || steps.length === 0) {
    return wrapVisualization(
      <div className="space-y-4 rounded-xl border border-white/10 bg-slate-950/35 p-5">
        <div className="h-40 rounded-xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
        <div className="grid gap-2 md:grid-cols-3">
          <div className="h-12 rounded-lg bg-white/5" />
          <div className="h-12 rounded-lg bg-white/5" />
          <div className="h-12 rounded-lg bg-white/5" />
        </div>
        <p className="text-sm text-sky/55">
          {emptyStateMessage || "No steps yet. Run the algorithm to visualize transitions, metrics, and state changes."}
        </p>
      </div>
    );
  }

  if (category === "sorting") {
    return wrapVisualization(<SortingViz step={step} stepIndex={stepIndex} totalSteps={steps.length} zoom={zoom} />);
  }

  if (category === "search") {
    return wrapVisualization(<SearchViz step={step} stepIndex={stepIndex} totalSteps={steps.length} zoom={zoom} algorithm={algorithm} />);
  }

  if (category === "graph") {
    if (algorithm === "floyd_warshall") {
      return wrapVisualization(<FloydWarshallViz step={step} steps={steps} input={input} zoom={zoom} />);
    }
    return wrapVisualization(<GraphViz step={step} input={input} zoom={zoom} algorithm={algorithm} minimalView={minimalView} />);
  }

  if (category === "dp") {
    return wrapVisualization(<DpViz step={step} steps={steps} status={status} algorithm={algorithm} input={input} zoom={zoom} />);
  }

  if (category === "string") {
    if (algorithm === "huffman_coding") {
      return wrapVisualization(<HuffmanViz step={step} steps={steps} input={input} zoom={zoom} />);
    }
    return wrapVisualization(<StringViz step={step} input={input} zoom={zoom} />);
  }

  if (category === "backtracking") {
    return wrapVisualization(<BacktrackingViz step={step} stepIndex={stepIndex} totalSteps={steps.length} zoom={zoom} algorithm={algorithm} />);
  }

  if (["stack", "queue", "linked_list", "tree"].includes(category)) {
    return wrapVisualization(<DataStructureViz category={category} step={step} stepIndex={stepIndex} totalSteps={steps.length} zoom={zoom} />);
  }

  return null;
};

export default VisualizationCanvas;
