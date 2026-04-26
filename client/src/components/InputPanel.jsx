const InputPanel = ({ category, algorithm, inputData, setInputData, onRandomInput, interactive = true, studyNote = "" }) => {
  if (!interactive) {
    return (
      <div className="rounded-xl border border-cyan-300/25 bg-cyan-400/10 p-4 text-sm text-cyan-100">
        <p className="font-semibold">Study Mode</p>
        <p className="mt-2 text-cyan-50/90">
          {studyNote || "This syllabus topic is available for reading and code review in the Analyzer, but interactive execution is not implemented yet in this repo."}
        </p>
      </div>
    );
  }

  const updateField = (field, value) => {
    setInputData((prev) => ({ ...prev, [field]: value }));
  };

  const OPERATIONS = {
    stack: [
      { value: "push", label: "Push", needsValue: true },
      { value: "pop", label: "Pop" },
      { value: "peek", label: "Peek/Top" },
      { value: "isEmpty", label: "isEmpty" },
      { value: "isFull", label: "isFull" }
    ],
    linear_queue: [
      { value: "enqueue", label: "Enqueue", needsValue: true },
      { value: "dequeue", label: "Dequeue" },
      { value: "front", label: "Front" },
      { value: "rear", label: "Rear" },
      { value: "isEmpty", label: "isEmpty" },
      { value: "isFull", label: "isFull" }
    ],
    circular_queue: [
      { value: "enqueue", label: "Enqueue", needsValue: true },
      { value: "dequeue", label: "Dequeue" },
      { value: "front", label: "Front" },
      { value: "rear", label: "Rear" },
      { value: "isEmpty", label: "isEmpty" },
      { value: "isFull", label: "isFull" }
    ],
    deque: [
      { value: "enqueue", label: "Enqueue Rear", needsValue: true },
      { value: "enqueue_front", label: "Enqueue Front", needsValue: true },
      { value: "enqueue_rear", label: "Enqueue Rear (explicit)", needsValue: true },
      { value: "dequeue", label: "Dequeue Front" },
      { value: "dequeue_front", label: "Dequeue Front (explicit)" },
      { value: "dequeue_rear", label: "Dequeue Rear" },
      { value: "front", label: "Front" },
      { value: "rear", label: "Rear" },
      { value: "isEmpty", label: "isEmpty" },
      { value: "isFull", label: "isFull" }
    ],
    priority_queue: [
      { value: "enqueue", label: "Enqueue (value + priority)", needsValue: true, needsPriority: true },
      { value: "dequeue", label: "Dequeue" },
      { value: "front", label: "Front" },
      { value: "rear", label: "Rear" },
      { value: "isEmpty", label: "isEmpty" },
      { value: "isFull", label: "isFull" }
    ],
    linked_list: [
      { value: "insert_begin", label: "Insert at beginning", needsValue: true },
      { value: "insert_end", label: "Insert at end", needsValue: true },
      { value: "insert_pos", label: "Insert at position", needsValue: true, needsPosition: true },
      { value: "delete_begin", label: "Delete at beginning" },
      { value: "delete_end", label: "Delete at end" },
      { value: "delete_pos", label: "Delete at position", needsPosition: true },
      { value: "search", label: "Search", needsValue: true },
      { value: "traverse", label: "Traverse" },
      { value: "reverse", label: "Reverse" }
    ],
    tree_standard: [
      { value: "insert", label: "Insert", needsValue: true },
      { value: "delete", label: "Delete", needsValue: true },
      { value: "search", label: "Search", needsValue: true },
      { value: "traverse", label: "Traversal", needsTraversal: true }
    ],
    heap: [
      { value: "insert", label: "Insert", needsValue: true },
      { value: "delete", label: "Delete root/value", needsValue: true, valueOptional: true },
      { value: "search", label: "Search", needsValue: true },
      { value: "traverse", label: "Traversal", needsTraversal: true },
      { value: "heapify", label: "Heapify" }
    ],
    trie: [
      { value: "insert", label: "Insert word", needsValue: true },
      { value: "delete", label: "Delete word", needsValue: true },
      { value: "search", label: "Search word", needsValue: true },
      { value: "prefix_search", label: "Prefix search", needsPrefix: true },
      { value: "traverse", label: "Traverse" }
    ]
  };

  const getOperationOptions = () => {
    if (category === "stack") return OPERATIONS.stack;
    if (category === "queue") return OPERATIONS[algorithm] || OPERATIONS.linear_queue;
    if (category === "linked_list") return OPERATIONS.linked_list;
    if (category === "tree") {
      if (algorithm === "trie") return OPERATIONS.trie;
      if (algorithm === "min_heap" || algorithm === "max_heap") return OPERATIONS.heap;
      return OPERATIONS.tree_standard;
    }
    return [];
  };

  const operationOptions = getOperationOptions();
  const selectedOperation = inputData.operationType || operationOptions[0]?.value || "";
  const selectedOperationSpec = operationOptions.find((item) => item.value === selectedOperation) || operationOptions[0] || null;

  const addOperation = () => {
    if (!selectedOperationSpec) return;

    const value = String(inputData.operationValue || "").trim();
    const position = String(inputData.operationPosition || "").trim();
    const priority = String(inputData.operationPriority || "").trim();
    const prefix = String(inputData.operationPrefix || "").trim();
    const traversal = String(inputData.operationTraversal || "inorder").trim();

    let line = selectedOperationSpec.value;
    if (selectedOperationSpec.needsValue) {
      if (!value && !selectedOperationSpec.valueOptional) return;
      if (value) line += ` ${value}`;
    }
    if (selectedOperationSpec.needsPosition) {
      if (!position) return;
      line += ` ${position}`;
    }
    if (selectedOperationSpec.needsPriority) {
      if (!priority) return;
      line += ` ${priority}`;
    }
    if (selectedOperationSpec.needsPrefix) {
      if (!prefix) return;
      line += ` ${prefix}`;
    }
    if (selectedOperationSpec.needsTraversal) {
      line += ` ${traversal || "inorder"}`;
    }

    setInputData((prev) => {
      const existing = String(prev.operationsText || "").trim();
      const operationsText = existing ? `${existing}\n${line}` : line;
      return {
        ...prev,
        operationsText,
        operationValue: "",
        operationPosition: "",
        operationPriority: "",
        operationPrefix: ""
      };
    });
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

      {category === "search" && (
        <>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-sky/50">
              {algorithm === "binary_search" ? "Sorted Array Input" : "Array Input"}
            </label>
            <input
              className={fieldClass}
              placeholder={algorithm === "binary_search" ? "e.g. 3,7,9,12,21" : "e.g. 5,1,9,2,8"}
              value={inputData.arrayText || ""}
              onChange={(event) => updateField("arrayText", event.target.value)}
            />
          </div>

          {algorithm === "binary_search" && (
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-sky/50">Target Value</label>
              <input
                type="number"
                className={fieldClass}
                placeholder="e.g. 12"
                value={inputData.targetValue || ""}
                onChange={(event) => updateField("targetValue", event.target.value)}
              />
            </div>
          )}

          <button
            onClick={onRandomInput}
            className={actionBtnClass}
          >
            Generate Random Search Input
          </button>
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
            {algorithm === "graph_coloring" && (
              <input
                type="number"
                min="1"
                max="12"
                className="rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2 text-sm text-sky"
                placeholder="Max colors"
                value={inputData.maxColors || 3}
                onChange={(event) => updateField("maxColors", event.target.value)}
              />
            )}
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

      {category === "dp" && ["lcs", "edit_distance", "longest_common_substring"].includes(algorithm) && (
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
            {algorithm === "edit_distance"
              ? "Generate Random Edit Distance Input"
              : algorithm === "longest_common_substring"
                ? "Generate Random LCSubstring Input"
                : "Generate Random LCS Input"}
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

      {category === "backtracking" && algorithm === "queens_8_problem" && (
        <>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-sky/50">Board Size</label>
            <input
              type="number"
              min="4"
              max="10"
              className={fieldClass}
              placeholder="8"
              value={inputData.boardSize || 8}
              onChange={(event) => updateField("boardSize", event.target.value)}
            />
            <p className="mt-1 text-xs text-sky/45">Default is 8. Smaller sizes solve faster if you want shorter traces.</p>
          </div>

          <button
            onClick={onRandomInput}
            className={actionBtnClass}
          >
            Generate N-Queens Setup
          </button>
        </>
      )}

      {category === "string" && algorithm === "huffman_coding" && (
        <>
          <input
            className={fieldClass}
            placeholder="Text to encode"
            value={inputData.text || ""}
            onChange={(event) => updateField("text", event.target.value)}
          />
          <button
            onClick={onRandomInput}
            className={actionBtnClass}
          >
            Generate Random Huffman Input
          </button>
        </>
      )}

      {category === "string" && algorithm !== "huffman_coding" && (
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

      {["stack", "queue", "linked_list", "tree"].includes(category) && (
        <>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-sky/50">Initial Values (comma-separated)</label>
            <input
              className={fieldClass}
              placeholder={category === "tree" ? "e.g. 50,30,70" : "e.g. 10,20,30"}
              value={inputData.initialValuesText || ""}
              onChange={(event) => updateField("initialValuesText", event.target.value)}
            />
          </div>

          {category === "tree" && ["b_tree", "b_plus_tree"].includes(algorithm) && (
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-sky/50">Tree Order (max children)</label>
              <input
                type="number"
                min="3"
                max="12"
                className={fieldClass}
                value={inputData.order || 4}
                onChange={(event) => updateField("order", event.target.value)}
              />
            </div>
          )}

          {(category === "stack" || category === "queue") && (
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-sky/50">Capacity</label>
              <input
                type="number"
                min="1"
                max="200"
                className={fieldClass}
                value={inputData.capacity || 8}
                onChange={(event) => updateField("capacity", event.target.value)}
              />
            </div>
          )}

          <div className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-3">
            <label className="text-xs uppercase tracking-[0.2em] text-sky/50">Operation Selector</label>
            <div className="grid gap-2 md:grid-cols-2">
              <select
                className="rounded-lg border border-white/15 bg-slate-900/70 px-3 py-2 text-sm text-sky"
                value={selectedOperation}
                onChange={(event) => updateField("operationType", event.target.value)}
              >
                {operationOptions.map((op) => (
                  <option key={op.value} value={op.value}>{op.label}</option>
                ))}
              </select>

              {selectedOperationSpec?.needsTraversal && (
                <select
                  className="rounded-lg border border-white/15 bg-slate-900/70 px-3 py-2 text-sm text-sky"
                  value={inputData.operationTraversal || "inorder"}
                  onChange={(event) => updateField("operationTraversal", event.target.value)}
                >
                  <option value="inorder">Inorder</option>
                  <option value="preorder">Preorder</option>
                  <option value="postorder">Postorder</option>
                  <option value="levelorder">Level-order</option>
                </select>
              )}

              {selectedOperationSpec?.needsValue && (
                <input
                  className="rounded-lg border border-white/15 bg-slate-900/70 px-3 py-2 text-sm text-sky"
                  placeholder={selectedOperationSpec?.valueOptional ? "Value (optional)" : "Value"}
                  value={inputData.operationValue || ""}
                  onChange={(event) => updateField("operationValue", event.target.value)}
                />
              )}

              {selectedOperationSpec?.needsPosition && (
                <input
                  type="number"
                  min="0"
                  className="rounded-lg border border-white/15 bg-slate-900/70 px-3 py-2 text-sm text-sky"
                  placeholder="Position"
                  value={inputData.operationPosition || ""}
                  onChange={(event) => updateField("operationPosition", event.target.value)}
                />
              )}

              {selectedOperationSpec?.needsPriority && (
                <input
                  type="number"
                  className="rounded-lg border border-white/15 bg-slate-900/70 px-3 py-2 text-sm text-sky"
                  placeholder="Priority"
                  value={inputData.operationPriority || ""}
                  onChange={(event) => updateField("operationPriority", event.target.value)}
                />
              )}

              {selectedOperationSpec?.needsPrefix && (
                <input
                  className="rounded-lg border border-white/15 bg-slate-900/70 px-3 py-2 text-sm text-sky"
                  placeholder="Prefix"
                  value={inputData.operationPrefix || ""}
                  onChange={(event) => updateField("operationPrefix", event.target.value)}
                />
              )}
            </div>

            <button onClick={addOperation} className={actionBtnClass}>
              Add Operation
            </button>
          </div>

          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-sky/50">Operations Script (one per line)</label>
            <textarea
              rows="7"
              className={fieldClass}
              placeholder="push 10\npop\npeek\nisEmpty"
              value={inputData.operationsText || ""}
              onChange={(event) => updateField("operationsText", event.target.value)}
            />
          </div>

          <button onClick={onRandomInput} className={actionBtnClass}>
            Generate Random Operations
          </button>
        </>
      )}
    </div>
  );
};

export default InputPanel;
