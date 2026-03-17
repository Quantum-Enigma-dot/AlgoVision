export const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const generateRandomSortingInput = (size = 10) => {
  const safeSize = Math.min(60, Math.max(5, Number(size) || 10));
  const array = Array.from({ length: safeSize }, () => randomInt(1, 99));
  return { arrayText: array.join(","), arraySize: safeSize };
};

export const generateRandomGraphInput = () => {
  const count = randomInt(5, 9);
  const nodes = Array.from({ length: count }, (_, index) => String.fromCharCode(65 + index));
  const directed = Math.random() > 0.6;
  const weighted = true;
  const edgeSet = new Set();
  const edges = [];

  const normalizeKey = (from, to) => {
    if (directed) {
      return `${from}->${to}`;
    }
    return from < to ? `${from}--${to}` : `${to}--${from}`;
  };

  const addEdge = (from, to, weight) => {
    if (from === to) return false;
    const key = normalizeKey(from, to);
    if (edgeSet.has(key)) return false;
    edgeSet.add(key);
    edges.push({ from, to, weight });
    return true;
  };

  // Build a backbone first so every generated graph is connected enough to visualize clearly.
  for (let i = 0; i < count - 1; i += 1) {
    const from = nodes[i];
    const to = nodes[i + 1];
    addEdge(from, to, randomInt(1, 15));
    if (!directed && Math.random() > 0.7) {
      addEdge(to, from, randomInt(1, 15));
    }
  }

  const possible = directed ? count * (count - 1) : (count * (count - 1)) / 2;
  const targetDensity = directed ? 0.23 : 0.29;
  const targetEdges = Math.min(
    Math.max(count - 1 + randomInt(1, Math.max(2, Math.floor(count / 2))), Math.floor(possible * targetDensity)),
    Math.floor(possible * 0.48)
  );

  let attempts = 0;
  while (edges.length < targetEdges && attempts < 400) {
    attempts += 1;
    const from = nodes[randomInt(0, count - 1)];
    const to = nodes[randomInt(0, count - 1)];
    addEdge(from, to, randomInt(1, 20));
  }

  return {
    nodesText: nodes.join(","),
    edgesText: edges.map((edge) => `${edge.from},${edge.to},${edge.weight}`).join("\n"),
    directed,
    weighted,
    startNode: nodes[0],
    sinkNode: nodes[nodes.length - 1]
  };
};

export const generateRandomDpInput = (algorithm) => {
  if (algorithm === "knapsack_01") {
    const n = randomInt(4, 8);
    const weights = Array.from({ length: n }, () => randomInt(1, 10));
    const values = Array.from({ length: n }, () => randomInt(2, 20));
    const capacity = randomInt(10, 25);
    return {
      weightsText: weights.join(","),
      valuesText: values.join(","),
      capacity,
      textA: "",
      textB: ""
    };
  }

  if (algorithm === "matrix_chain_multiplication") {
    const chainLength = randomInt(3, 6);
    const dimensions = Array.from({ length: chainLength + 1 }, () => randomInt(5, 70));
    return {
      dimensionsText: dimensions.join(",")
    };
  }

  const alphabet = "ACGTXYZ";
  const lenA = randomInt(5, 10);
  const lenB = randomInt(5, 10);
  const buildString = (len) => Array.from({ length: len }, () => alphabet[randomInt(0, alphabet.length - 1)]).join("");

  return {
    textA: buildString(lenA),
    textB: buildString(lenB)
  };
};

export const generateRandomStringInput = () => {
  const alphabet = "abcde";
  const textLength = randomInt(15, 28);
  const patternLength = randomInt(3, 6);
  const text = Array.from({ length: textLength }, () => alphabet[randomInt(0, alphabet.length - 1)]).join("");
  const start = randomInt(0, Math.max(0, text.length - patternLength));
  const pattern = Math.random() > 0.3 ? text.slice(start, start + patternLength) : "edc";
  return { text, pattern };
};
