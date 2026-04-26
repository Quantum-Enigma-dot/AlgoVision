import { parseArray, parseEdges, parseNodes } from "./inputParsers.js";

const ensure = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};

const parseTokenValue = (token) => {
  if (token === undefined) return undefined;
  const value = String(token).trim();
  if (!value.length) return undefined;
  const asNumber = Number(value);
  return Number.isNaN(asNumber) ? value : asNumber;
};

const parseInitialValues = (text) => {
  if (!text) return [];
  return text
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => parseTokenValue(item));
};

const parseOperationScript = (text = "") => {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [opRaw, arg1, arg2] = line.split(/\s+/);
      const op = String(opRaw || "").trim();
      const parsed = { op };

      if (["push", "enqueue", "enqueue_front", "enqueue_rear", "insert", "search", "delete", "insert_begin", "insert_end"].includes(op)) {
        parsed.value = parseTokenValue(arg1);
      }
      if (["insert_pos", "delete_pos"].includes(op)) {
        if (op === "insert_pos") {
          parsed.value = parseTokenValue(arg1);
          parsed.position = Number(arg2);
        } else {
          parsed.position = Number(arg1);
        }
      }
      if (op === "prefix_search") {
        parsed.prefix = String(arg1 || "").trim();
      }
      if (op === "traverse") {
        parsed.traversal = String(arg1 || "inorder").trim().toLowerCase();
      }
      if (op === "enqueue" && arg2 !== undefined) {
        parsed.priority = Number(arg2);
      }

      return parsed;
    });
};

export const buildPayloadAndValidate = (category, algorithm, inputData) => {
  if (category === "sorting") {
    const array = parseArray(inputData.arrayText);
    ensure(array.length > 0, "Invalid input: provide at least one number for the array.");
    ensure(array.every((value) => Number.isFinite(value)), "Invalid input: array must contain only numbers.");
    ensure(array.length <= 120, "Invalid input: array size must be at most 120.");
    return { array };
  }

  if (category === "search") {
    const array = parseArray(inputData.arrayText);
    ensure(array.length > 0, "Invalid input: provide at least one number for the array.");
    ensure(array.every((value) => Number.isFinite(value)), "Invalid input: array must contain only numbers.");

    if (algorithm === "binary_search") {
      ensure(
        array.every((value, index) => index === 0 || array[index - 1] <= value),
        "Invalid input: binary search requires the array to be sorted in nondecreasing order."
      );
      const target = Number(inputData.targetValue);
      ensure(Number.isFinite(target), "Invalid input: provide a numeric target value.");
      return { array, target };
    }

    return { array };
  }

  if (category === "graph") {
    const nodes = parseNodes(inputData.nodesText);
    const edges = parseEdges(inputData.edgesText).map((edge) => ({
      ...edge,
      weight: inputData.weighted ? edge.weight : 1
    }));
    const allowNegativeWeights = algorithm === "bellman_ford";

    ensure(nodes.length > 0, "Invalid input: provide graph nodes.");
    ensure(edges.length > 0, "Invalid input: provide at least one edge.");
    ensure(
      edges.every((edge) => nodes.includes(edge.from) && nodes.includes(edge.to)),
      "Invalid input: every edge endpoint must exist in nodes."
    );
    ensure(
      edges.every((edge) => Number.isFinite(edge.weight) && (allowNegativeWeights || edge.weight >= 0)),
      allowNegativeWeights
        ? "Invalid input: graph weights must be valid numbers."
        : "Invalid input: graph weights must be non-negative numbers."
    );

    const start = (inputData.startNode || "").trim() || nodes[0];
    ensure(nodes.includes(start), "Invalid input: start node must be one of the graph nodes.");

    const sink = (inputData.sinkNode || "").trim() || nodes[nodes.length - 1];
    ensure(nodes.includes(sink), "Invalid input: sink node must be one of the graph nodes.");

    const maxColorsValue = Number(inputData.maxColors || 3);
    const max_colors = Number.isInteger(maxColorsValue) && maxColorsValue > 0
      ? maxColorsValue
      : 3;

    return {
      nodes,
      edges,
      directed: Boolean(inputData.directed),
      start,
      sink,
      max_colors
    };
  }

  if (category === "dp") {
    if (algorithm === "knapsack_01") {
      const weights = parseArray(inputData.weightsText);
      const values = parseArray(inputData.valuesText);
      const capacity = Number(inputData.capacity);

      ensure(weights.length > 0, "Invalid input: provide item weights.");
      ensure(values.length > 0, "Invalid input: provide item values.");
      ensure(weights.length === values.length, "Invalid input: weights and values must have equal length.");
      ensure(weights.every((value) => Number.isInteger(value) && value > 0), "Invalid input: weights must be positive integers.");
      ensure(values.every((value) => Number.isFinite(value) && value >= 0), "Invalid input: values must be non-negative numbers.");
      ensure(Number.isInteger(capacity) && capacity >= 0, "Invalid input: capacity must be a non-negative integer.");

      return { weights, values, capacity };
    }

    if (algorithm === "matrix_chain_multiplication") {
      const dimensions = parseArray(inputData.dimensionsText);
      ensure(dimensions.length >= 2, "Invalid input: provide at least two matrix dimensions.");
      ensure(
        dimensions.every((value) => Number.isInteger(value) && value > 0),
        "Invalid input: dimensions must be positive integers."
      );
      return { dimensions };
    }

    const textA = inputData.textA || "";
    const textB = inputData.textB || "";
    ensure(textA.length > 0 && textB.length > 0, "Invalid input: provide both strings for this DP algorithm.");
    return { text_a: textA, text_b: textB };
  }

  if (category === "string") {
    const text = inputData.text || "";
    if (algorithm === "huffman_coding") {
      ensure(text.length > 0, "Invalid input: text cannot be empty.");
      return { text };
    }

    const pattern = inputData.pattern || "";
    ensure(text.length > 0, "Invalid input: text cannot be empty.");
    ensure(pattern.length > 0, "Invalid input: pattern cannot be empty.");
    ensure(pattern.length <= text.length, "Invalid input: pattern length must not exceed text length.");
    return { text, pattern };
  }

  if (category === "backtracking") {
    if (algorithm === "queens_8_problem") {
      const size = Number(inputData.boardSize || 8);
      ensure(Number.isInteger(size) && size >= 4 && size <= 10, "Invalid input: board size must be an integer between 4 and 10.");
      return { size };
    }

    throw new Error("Invalid input: unsupported backtracking topic.");
  }

  if (category === "stack") {
    const initial_values = parseInitialValues(inputData.initialValuesText || "");
    const operations = parseOperationScript(inputData.operationsText || "");
    const capacity = Number(inputData.capacity || 8);

    ensure(Number.isInteger(capacity) && capacity > 0, "Invalid input: capacity must be a positive integer.");
    ensure(operations.length > 0, "Invalid input: add at least one stack operation.");

    if (algorithm === "array_stack") {
      ensure(initial_values.length <= capacity, "Invalid input: initial values exceed stack capacity.");
    }

    return { initial_values, operations, capacity };
  }

  if (category === "queue") {
    const initial_values = parseInitialValues(inputData.initialValuesText || "");
    const operations = parseOperationScript(inputData.operationsText || "");
    const capacity = Number(inputData.capacity || 8);

    ensure(Number.isInteger(capacity) && capacity > 0, "Invalid input: capacity must be a positive integer.");
    ensure(operations.length > 0, "Invalid input: add at least one queue operation.");
    ensure(initial_values.length <= capacity, "Invalid input: initial values exceed queue capacity.");

    if (algorithm === "priority_queue") {
      operations.forEach((op) => {
        if (op.op === "enqueue") {
          ensure(op.value !== undefined, "Invalid input: priority queue enqueue requires a value.");
          ensure(Number.isFinite(op.priority), "Invalid input: priority queue enqueue requires numeric priority.");
        }
      });
    }

    return { initial_values, operations, capacity };
  }

  if (category === "linked_list") {
    const initial_values = parseInitialValues(inputData.initialValuesText || "");
    const operations = parseOperationScript(inputData.operationsText || "");

    ensure(operations.length > 0, "Invalid input: add at least one linked-list operation.");

    operations.forEach((op) => {
      if (["insert_begin", "insert_end", "search"].includes(op.op)) {
        ensure(op.value !== undefined, `Invalid input: ${op.op} requires a value.`);
      }
      if (op.op === "insert_pos") {
        ensure(op.value !== undefined, "Invalid input: insert_pos requires a value.");
        ensure(Number.isInteger(op.position) && op.position >= 0, "Invalid input: insert_pos requires a non-negative position.");
      }
      if (op.op === "delete_pos") {
        ensure(Number.isInteger(op.position) && op.position >= 0, "Invalid input: delete_pos requires a non-negative position.");
      }
    });

    return { initial_values, operations };
  }

  if (category === "tree") {
    const operations = parseOperationScript(inputData.operationsText || "");
    ensure(operations.length > 0, "Invalid input: add at least one tree operation.");

    if (algorithm === "trie") {
      const initial_values = (inputData.initialValuesText || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      operations.forEach((op) => {
        if (["insert", "delete", "search"].includes(op.op)) {
          ensure(op.value !== undefined && String(op.value).length > 0, `Invalid input: ${op.op} requires a word.`);
        }
        if (op.op === "prefix_search") {
          ensure(op.prefix && op.prefix.length > 0, "Invalid input: prefix_search requires a prefix.");
        }
      });

      return { initial_values, operations };
    }

    const initial_values = parseInitialValues(inputData.initialValuesText || "");
    const isBTreeFamily = algorithm === "b_tree" || algorithm === "b_plus_tree";
    const rawOrder = Number(inputData.order || 4);
    const order = Number.isInteger(rawOrder) ? rawOrder : 4;

    operations.forEach((op) => {
      if (["insert", "delete", "search"].includes(op.op)) {
        ensure(op.value !== undefined, `Invalid input: ${op.op} requires a value.`);
      }
      if (op.op === "traverse") {
        const allowed = ["inorder", "preorder", "postorder", "levelorder"];
        ensure(allowed.includes(op.traversal || "inorder"), "Invalid input: traversal must be inorder/preorder/postorder/levelorder.");
      }
    });

    if (isBTreeFamily) {
      ensure(order >= 3 && order <= 32, "Invalid input: tree order must be an integer between 3 and 32.");
    }

    return isBTreeFamily
      ? { initial_values, operations, order }
      : { initial_values, operations };
  }

  throw new Error("Invalid input: unsupported category.");
};
