import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";

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

  return (
    <div className="space-y-3">
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
      <div className="grid gap-2 text-xs text-sky/70 md:grid-cols-3">
        <p className="rounded-lg bg-white/5 px-3 py-2">Step: {stepIndex + 1} / {totalSteps}</p>
        <p className="rounded-lg bg-white/5 px-3 py-2">Action: {action}</p>
        <p className="rounded-lg bg-white/5 px-3 py-2">Active Indices: {highlighted}</p>
      </div>
      <div className="flex flex-wrap gap-3 text-xs text-sky/70">
        <span className="rounded-full bg-emerald-400/20 px-3 py-1">Normal Bar</span>
        <span className="rounded-full bg-amber-400/20 px-3 py-1">Pivot</span>
        <span className="rounded-full bg-orange-500/20 px-3 py-1">Compared/Swapped</span>
      </div>
    </div>
  );
};

const GraphViz = ({ step, input, zoom = 1 }) => {
  const svgRef = useRef(null);
  const markerSeedRef = useRef(`graph-${Math.random().toString(36).slice(2, 9)}`);
  const [displayMode, setDisplayMode] = useState("adaptive");
  const [encodingMode, setEncodingMode] = useState("both");
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);
  const [hoveredEdgeId, setHoveredEdgeId] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);

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

    const width = Math.round(620 * zoom);
    const height = Math.round(340 * zoom);
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

    const visited = new Set(step?.visited || []);
    const activeEdge = step?.edge || null;
    const activeNode = String(step?.current ?? step?.node ?? "");
    const sourceNode = String(input.start || "");
    const destinationNode = String(input.sink || "");

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
        const isActivePath =
          activeEdge && String(d.source.id) === String(activeEdge.from) && String(d.target.id) === String(activeEdge.to);
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
        return getEdgeColor(d.weight);
      })
      .attr("stroke-width", (d) => {
        const isActivePath =
          activeEdge && String(d.source.id) === String(activeEdge.from) && String(d.target.id) === String(activeEdge.to);
        const isFocusedPath = d.id === hoveredEdgeId || d.id === selectedEdgeId;
        if (isActivePath) {
          return 4.8;
        }
        if (isFocusedPath) {
          return Math.max(3.4, getEdgeWidth(d.weight));
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
        return 0.72;
      })
      .attr("marker-end", (d) => {
        if (!isDirected) {
          return null;
        }
        const isActivePath =
          activeEdge && String(d.source.id) === String(activeEdge.from) && String(d.target.id) === String(activeEdge.to);
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
        if (id === selectedNodeId) return "#22d3ee";
        if (id === sourceNode) return "#f59e0b";
        if (id === destinationNode) return "#a78bfa";
        if (id === activeNode) return "#38bdf8";
        if (visited.has(id)) return "#14b8a6";
        return "#0f766e";
      })
      .attr("stroke", (d) => {
        const id = String(d.id);
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
    step
  ]);

  const highlightedEdge = edges.find((edge) => edge.id === selectedEdgeId || edge.id === hoveredEdgeId) || null;
  const highlightedNode = nodes.find((node) => String(node.id) === selectedNodeId || String(node.id) === hoveredNodeId) || null;

  return (
    <div className="space-y-3">
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

      <svg ref={svgRef} className="w-full rounded-xl bg-slate-900/30" style={{ height: `${18 * zoom}rem` }} />

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

      <div className="flex flex-wrap gap-2 text-[11px] text-sky/70">
        <span className="rounded-full border border-teal-300/35 bg-teal-400/20 px-3 py-1">Default node</span>
        <span className="rounded-full border border-emerald-300/35 bg-emerald-400/20 px-3 py-1">Visited node</span>
        <span className="rounded-full border border-sky-300/35 bg-sky-400/20 px-3 py-1">Active/current node</span>
        <span className="rounded-full border border-amber-300/35 bg-amber-400/20 px-3 py-1">Source node</span>
        <span className="rounded-full border border-violet-300/35 bg-violet-400/20 px-3 py-1">Destination node</span>
        <span className="rounded-full border border-cyan-300/45 bg-cyan-400/20 px-3 py-1">Selected node/edge</span>
        <span className="rounded-full border border-orange-300/45 bg-orange-400/20 px-3 py-1">Active edge</span>
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
  const isLcs = textA.length > 0 && textB.length > 0;

  const sourceHint = (() => {
    if (!isLcs || activeRow < 1 || activeCol < 1 || !table.length) {
      return { type: null, row: -1, col: -1 };
    }
    if (activeAction === "match") {
      return { type: "diagonal", row: activeRow - 1, col: activeCol - 1 };
    }
    const top = table?.[activeRow - 1]?.[activeCol] ?? -Infinity;
    const left = table?.[activeRow]?.[activeCol - 1] ?? -Infinity;
    if (top >= left) {
      return { type: "top", row: activeRow - 1, col: activeCol };
    }
    return { type: "left", row: activeRow, col: activeCol - 1 };
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

  if (isLcs) {
    const finalLength = table?.[textA.length]?.[textB.length] ?? 0;
    return (
      <div className="space-y-4" style={{ zoom }}>
        <div className="rounded-xl border border-blue-300/20 bg-blue-400/10 px-3 py-2 text-sm text-blue-100">
          Each cell dp[i][j] stores the LCS length for prefixes of string1 and string2.
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
                    const isSkipCell = isActive && activeAction !== "match";

                    let className = "min-w-10 rounded border border-white/10 bg-white/5 px-2 py-1 text-center text-sky";
                    if (isSource) {
                      className = "min-w-10 rounded border border-cyan-300/50 bg-cyan-400/15 px-2 py-1 text-center text-cyan-100";
                    }
                    if (isSkipCell) {
                      className = "min-w-10 rounded border border-amber-300/50 bg-amber-400/20 px-2 py-1 text-center font-semibold text-amber-100";
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
          <span className="rounded-full border border-amber-300/40 bg-amber-400/20 px-3 py-1">Active non-match cell</span>
          <span className="rounded-full border border-cyan-300/40 bg-cyan-400/15 px-3 py-1">Transition source ({sourceHint.type || "-"})</span>
          <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1">Diagonal = match</span>
          <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1">Top/Left = max choice</span>
        </div>

        <div className="grid gap-2 md:grid-cols-2">
          <div className="rounded-xl border border-blue-300/35 bg-blue-400/15 px-3 py-2 text-sm text-blue-100">
            Final LCS length: <span className="font-semibold">{finalLength}</span>
          </div>
          <div className="min-w-0 rounded-xl border border-purple-300/35 bg-purple-400/15 px-3 py-2 text-sm text-purple-100">
            Reconstructed subsequence: <span className="font-mono font-semibold">{reconstructedLcs || "(empty)"}</span>
          </div>
        </div>
      </div>
    );
  }

  if (algorithm === "knapsack_01") {
    const weights = input?.weights || [];
    const values = input?.values || [];
    const capacity = Math.max(0, Number(input?.capacity || table[0]?.length - 1 || 0));

    return (
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
    );
  }

  if (algorithm === "matrix_chain_multiplication") {
    return (
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

const VisualizationCanvas = ({ category, algorithm, steps, stepIndex, input, zoom = 1, status }) => {
  const step = steps?.[stepIndex] || {};

  if (!steps || steps.length === 0) {
    return (
      <div className="space-y-4 rounded-xl border border-white/10 bg-slate-950/35 p-5">
        <div className="h-40 rounded-xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
        <div className="grid gap-2 md:grid-cols-3">
          <div className="h-12 rounded-lg bg-white/5" />
          <div className="h-12 rounded-lg bg-white/5" />
          <div className="h-12 rounded-lg bg-white/5" />
        </div>
        <p className="text-sm text-sky/55">
          No steps yet. Run the algorithm to visualize transitions, metrics, and state changes.
        </p>
      </div>
    );
  }

  if (category === "sorting") {
    return <SortingViz step={step} stepIndex={stepIndex} totalSteps={steps.length} zoom={zoom} />;
  }

  if (category === "graph") {
    return <GraphViz step={step} input={input} zoom={zoom} />;
  }

  if (category === "dp") {
    return <DpViz step={step} steps={steps} status={status} algorithm={algorithm} input={input} zoom={zoom} />;
  }

  if (category === "string") {
    return <StringViz step={step} input={input} zoom={zoom} />;
  }

  return null;
};

export default VisualizationCanvas;
