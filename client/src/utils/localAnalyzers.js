const cloneBoardFromPlacements = (placements, size) => (
  Array.from({ length: size }, (_, row) => (
    Array.from({ length: size }, (_, col) => (placements[row] === col ? "Q" : "."))
  ))
);

const normalizeSearchArray = (array = []) => array.map((value) => Number(value));

const runBinarySearch = (payload, complexity) => {
  const array = normalizeSearchArray(payload.array || []);
  const target = Number(payload.target);
  const steps = [];
  let comparisons = 0;
  let low = 0;
  let high = array.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    comparisons += 1;
    steps.push({
      type: "compare",
      array: [...array],
      target,
      low,
      high,
      mid,
      indices: [mid],
      range: [low, high],
      comparisons
    });

    if (array[mid] === target) {
      steps.push({
        type: "found",
        array: [...array],
        target,
        low,
        high,
        mid,
        indices: [mid],
        range: [low, high],
        result_index: mid,
        comparisons
      });
      return {
        algorithm: "binary_search",
        result: { index: mid, found: true, value: array[mid] },
        steps,
        metrics: {
          comparisons,
          swaps: 0,
          execution_time_ms: 0,
          recursion_depth: 0,
          space_estimate: "O(1)",
          input_size: array.length
        },
        complexity
      };
    }

    if (array[mid] < target) {
      steps.push({
        type: "move_right",
        array: [...array],
        target,
        low,
        high,
        mid,
        indices: [mid],
        range: [low, high],
        comparisons
      });
      low = mid + 1;
      continue;
    }

    steps.push({
      type: "move_left",
      array: [...array],
      target,
      low,
      high,
      mid,
      indices: [mid],
      range: [low, high],
      comparisons
    });
    high = mid - 1;
  }

  steps.push({
    type: "not_found",
    array: [...array],
    target,
    low,
    high,
    mid: -1,
    indices: [],
    range: [Math.max(0, low), Math.max(-1, high)],
    comparisons
  });

  return {
    algorithm: "binary_search",
    result: { index: -1, found: false, value: null },
    steps,
    metrics: {
      comparisons,
      swaps: 0,
      execution_time_ms: 0,
      recursion_depth: 0,
      space_estimate: "O(1)",
      input_size: array.length
    },
    complexity
  };
};

const runMinMax = (payload, complexity) => {
  const array = normalizeSearchArray(payload.array || []);
  const steps = [];
  let comparisons = 0;
  let minIndex = 0;
  let maxIndex = 0;

  steps.push({
    type: "initialize",
    array: [...array],
    currentIndex: 0,
    minIndex,
    maxIndex,
    indices: [0]
  });

  for (let currentIndex = 1; currentIndex < array.length; currentIndex += 1) {
    steps.push({
      type: "inspect",
      array: [...array],
      currentIndex,
      minIndex,
      maxIndex,
      indices: [currentIndex, minIndex, maxIndex],
      comparisons
    });

    comparisons += 1;
    if (array[currentIndex] < array[minIndex]) {
      minIndex = currentIndex;
      steps.push({
        type: "new_min",
        array: [...array],
        currentIndex,
        minIndex,
        maxIndex,
        indices: [currentIndex, minIndex, maxIndex],
        comparisons
      });
      continue;
    }

    comparisons += 1;
    if (array[currentIndex] > array[maxIndex]) {
      maxIndex = currentIndex;
      steps.push({
        type: "new_max",
        array: [...array],
        currentIndex,
        minIndex,
        maxIndex,
        indices: [currentIndex, minIndex, maxIndex],
        comparisons
      });
    }
  }

  steps.push({
    type: "result",
    array: [...array],
    currentIndex: array.length - 1,
    minIndex,
    maxIndex,
    minValue: array[minIndex],
    maxValue: array[maxIndex],
    indices: [minIndex, maxIndex],
    comparisons
  });

  return {
    algorithm: "finding_maximum_and_minimum",
    result: {
      min: array[minIndex],
      max: array[maxIndex],
      min_index: minIndex,
      max_index: maxIndex
    },
    steps,
    metrics: {
      comparisons,
      swaps: 0,
      execution_time_ms: 0,
      recursion_depth: 0,
      space_estimate: "O(1)",
      input_size: array.length
    },
    complexity
  };
};

const runQueens = (payload, complexity) => {
  const size = Number(payload.size || 8);
  const steps = [];
  const placements = Array(size).fill(-1);
  const columns = new Set();
  const descendingDiagonals = new Set();
  const ascendingDiagonals = new Set();
  let comparisons = 0;
  let maxDepth = 0;

  const snapshot = (type, row, col, extra = {}) => {
    steps.push({
      type,
      size,
      row,
      col,
      placements: [...placements],
      board: cloneBoardFromPlacements(placements, size),
      recursion_depth: row,
      ...extra
    });
  };

  const canPlace = (row, col) => {
    comparisons += 1;
    if (columns.has(col)) {
      return { ok: false, reason: "column" };
    }

    comparisons += 1;
    if (descendingDiagonals.has(row - col)) {
      return { ok: false, reason: "main diagonal" };
    }

    comparisons += 1;
    if (ascendingDiagonals.has(row + col)) {
      return { ok: false, reason: "anti diagonal" };
    }

    return { ok: true };
  };

  const solve = (row) => {
    if (row === size) {
      snapshot("complete", row - 1, placements[row - 1], { solved: true });
      return true;
    }

    maxDepth = Math.max(maxDepth, row + 1);

    for (let col = 0; col < size; col += 1) {
      snapshot("try", row, col);
      const check = canPlace(row, col);
      if (!check.ok) {
        snapshot("conflict", row, col, { reason: check.reason });
        continue;
      }

      placements[row] = col;
      columns.add(col);
      descendingDiagonals.add(row - col);
      ascendingDiagonals.add(row + col);
      snapshot("place", row, col);

      if (solve(row + 1)) {
        return true;
      }

      columns.delete(col);
      descendingDiagonals.delete(row - col);
      ascendingDiagonals.delete(row + col);
      placements[row] = -1;
      snapshot("backtrack", row, col);
    }

    return false;
  };

  const solved = solve(0);
  const finalPlacements = [...placements];

  return {
    algorithm: "queens_8_problem",
    result: {
      solved,
      placements: finalPlacements,
      board: cloneBoardFromPlacements(finalPlacements, size)
    },
    steps,
    metrics: {
      comparisons,
      swaps: 0,
      execution_time_ms: 0,
      recursion_depth: maxDepth,
      space_estimate: "O(n)",
      input_size: size
    },
    complexity
  };
};

const LOCAL_ANALYZER_RUNNERS = {
  binary_search: runBinarySearch,
  finding_maximum_and_minimum: runMinMax,
  queens_8_problem: runQueens
};

export const hasLocalAnalyzer = (algorithm) => Boolean(LOCAL_ANALYZER_RUNNERS[algorithm]);

export const runLocalAnalyzer = (algorithm, payload, complexity) => {
  const runner = LOCAL_ANALYZER_RUNNERS[algorithm];
  if (!runner) {
    throw new Error("No local analyzer is available for this topic.");
  }
  return runner(payload, complexity);
};