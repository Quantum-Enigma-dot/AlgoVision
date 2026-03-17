export const sortingPresets = [
  { name: "Nearly Sorted", array: [1, 2, 3, 5, 4, 6, 7] },
  { name: "Random", array: [9, 3, 7, 1, 6, 2, 8] },
  { name: "Reversed", array: [9, 8, 7, 6, 5, 4, 3] }
];

export const graphPresets = [
  {
    name: "Campus Map",
    nodes: ["A", "B", "C", "D", "E"],
    edges: [
      { from: "A", to: "B", weight: 2 },
      { from: "A", to: "C", weight: 4 },
      { from: "B", to: "C", weight: 1 },
      { from: "B", to: "D", weight: 7 },
      { from: "C", to: "E", weight: 3 },
      { from: "D", to: "E", weight: 2 }
    ],
    directed: false,
    start: "A",
    sink: "E"
  }
];

export const dpPresets = {
  knapsack: {
    weights: [1, 3, 4, 5],
    values: [1, 4, 5, 7],
    capacity: 7
  },
  matrixChain: {
    dimensions: [10, 30, 5, 60]
  },
  lcs: {
    textA: "AGGTAB",
    textB: "GXTXAYB"
  }
};

export const stringPresets = {
  text: "ababcabcabababd",
  pattern: "ababd"
};
