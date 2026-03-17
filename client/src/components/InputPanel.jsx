const InputPanel = ({ category, algorithm, inputData, setInputData, onRandomInput }) => {
  const updateField = (field, value) => {
    setInputData((prev) => ({ ...prev, [field]: value }));
  };

  const fieldClass = "mt-2 w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2.5 text-sm text-sky shadow-inner transition placeholder:text-sky/35 focus:border-cyan-300/45 focus:outline-none";
  const actionBtnClass = "rounded-xl border border-emerald-300/30 bg-emerald-400/20 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:-translate-y-0.5 hover:bg-emerald-300/30";

  return (
    <div className="space-y-4">
      {category === "sorting" && (
        <>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-sky/50">Array Input</label>
            <input
              className={fieldClass}
              placeholder="e.g. 5,1,4,2,8"
              value={inputData.arrayText || ""}
              onChange={(event) => updateField("arrayText", event.target.value)}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-[auto_1fr] sm:items-center">
            <input
              type="number"
              min="5"
              max="50"
              className="w-28 rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2 text-sm text-sky"
              value={inputData.arraySize || 10}
              onChange={(event) => updateField("arraySize", event.target.value)}
            />
            <button
              onClick={onRandomInput}
              className={actionBtnClass}
            >
              Generate Random
            </button>
          </div>
        </>
      )}

      {category === "graph" && (
        <>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-sky/50">Nodes (comma-separated)</label>
            <input
              className={fieldClass}
              placeholder="A,B,C,D"
              value={inputData.nodesText || ""}
              onChange={(event) => updateField("nodesText", event.target.value)}
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-sky/50">Edges (from,to,weight)</label>
            <textarea
              rows="4"
              className={fieldClass}
              placeholder="A,B,1\nB,C,2\nC,D,1"
              value={inputData.edgesText || ""}
              onChange={(event) => updateField("edgesText", event.target.value)}
            />
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            <input
              className="rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2 text-sm text-sky"
              placeholder="Start node"
              value={inputData.startNode || ""}
              onChange={(event) => updateField("startNode", event.target.value)}
            />
            <input
              className="rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2 text-sm text-sky"
              placeholder="Sink node"
              value={inputData.sinkNode || ""}
              onChange={(event) => updateField("sinkNode", event.target.value)}
            />
            <label className="flex items-center gap-2 text-sm text-sky/70">
              <input
                type="checkbox"
                checked={inputData.directed || false}
                onChange={(event) => updateField("directed", event.target.checked)}
              />
              Directed
            </label>
            <label className="flex items-center gap-2 text-sm text-sky/70">
              <input
                type="checkbox"
                checked={inputData.weighted ?? true}
                onChange={(event) => updateField("weighted", event.target.checked)}
              />
              Weighted
            </label>
          </div>
          <button
            onClick={onRandomInput}
            className={actionBtnClass}
          >
            Generate Random Graph
          </button>
        </>
      )}

      {category === "dp" && algorithm === "knapsack_01" && (
        <>
          <input
            className={fieldClass}
            placeholder="Weights e.g. 1,3,4,5"
            value={inputData.weightsText || ""}
            onChange={(event) => updateField("weightsText", event.target.value)}
          />
          <input
            className={fieldClass}
            placeholder="Values e.g. 1,4,5,7"
            value={inputData.valuesText || ""}
            onChange={(event) => updateField("valuesText", event.target.value)}
          />
          <input
            type="number"
            className={fieldClass}
            placeholder="Capacity"
            value={inputData.capacity || 0}
            onChange={(event) => updateField("capacity", event.target.value)}
          />
          <button
            onClick={onRandomInput}
            className={actionBtnClass}
          >
            Generate Random Knapsack
          </button>
        </>
      )}

      {category === "dp" && algorithm === "lcs" && (
        <>
          <input
            className={fieldClass}
            placeholder="String A"
            value={inputData.textA || ""}
            onChange={(event) => updateField("textA", event.target.value)}
          />
          <input
            className={fieldClass}
            placeholder="String B"
            value={inputData.textB || ""}
            onChange={(event) => updateField("textB", event.target.value)}
          />
          <button
            onClick={onRandomInput}
            className={actionBtnClass}
          >
            Generate Random LCS Input
          </button>
        </>
      )}

      {category === "dp" && algorithm === "matrix_chain_multiplication" && (
        <>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-sky/50">Matrix Dimensions</label>
            <input
              className={fieldClass}
              placeholder="e.g. 10,30,5,60"
              value={inputData.dimensionsText || ""}
              onChange={(event) => updateField("dimensionsText", event.target.value)}
            />
            <p className="mt-1 text-xs text-sky/45">For matrices A1..An, enter n+1 dimensions p0..pn.</p>
          </div>
          <button
            onClick={onRandomInput}
            className={actionBtnClass}
          >
            Generate Random Matrix Chain
          </button>
        </>
      )}

      {category === "string" && (
        <>
          <input
            className={fieldClass}
            placeholder="Text"
            value={inputData.text || ""}
            onChange={(event) => updateField("text", event.target.value)}
          />
          <input
            className={fieldClass}
            placeholder="Pattern"
            value={inputData.pattern || ""}
            onChange={(event) => updateField("pattern", event.target.value)}
          />
          <button
            onClick={onRandomInput}
            className={actionBtnClass}
          >
            Generate Random String Input
          </button>
        </>
      )}
    </div>
  );
};

export default InputPanel;
