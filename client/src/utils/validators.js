import { parseArray, parseEdges, parseNodes } from "./inputParsers.js";

const ensure = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};

export const buildPayloadAndValidate = (category, algorithm, inputData) => {
  if (category === "sorting") {
    const array = parseArray(inputData.arrayText);
    ensure(array.length > 0, "Invalid input: provide at least one number for the array.");
    ensure(array.every((value) => Number.isFinite(value)), "Invalid input: array must contain only numbers.");
    ensure(array.length <= 120, "Invalid input: array size must be at most 120.");
    return { array };
  }

  if (category === "graph") {
    const nodes = parseNodes(inputData.nodesText);
    const edges = parseEdges(inputData.edgesText).map((edge) => ({
      ...edge,
      weight: inputData.weighted ? edge.weight : 1
    }));

    ensure(nodes.length > 0, "Invalid input: provide graph nodes.");
    ensure(edges.length > 0, "Invalid input: provide at least one edge.");
    ensure(
      edges.every((edge) => nodes.includes(edge.from) && nodes.includes(edge.to)),
      "Invalid input: every edge endpoint must exist in nodes."
    );
    ensure(
      edges.every((edge) => Number.isFinite(edge.weight) && edge.weight >= 0),
      "Invalid input: graph weights must be non-negative numbers."
    );

    const start = (inputData.startNode || "").trim() || nodes[0];
    ensure(nodes.includes(start), "Invalid input: start node must be one of the graph nodes.");

    const sink = (inputData.sinkNode || "").trim() || nodes[nodes.length - 1];
    ensure(nodes.includes(sink), "Invalid input: sink node must be one of the graph nodes.");

    return {
      nodes,
      edges,
      directed: Boolean(inputData.directed),
      start,
      sink
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
    ensure(textA.length > 0 && textB.length > 0, "Invalid input: provide both strings for LCS.");
    return { text_a: textA, text_b: textB };
  }

  if (category === "string") {
    const text = inputData.text || "";
    const pattern = inputData.pattern || "";
    ensure(text.length > 0, "Invalid input: text cannot be empty.");
    ensure(pattern.length > 0, "Invalid input: pattern cannot be empty.");
    ensure(pattern.length <= text.length, "Invalid input: pattern length must not exceed text length.");
    return { text, pattern };
  }

  throw new Error("Invalid input: unsupported category.");
};
