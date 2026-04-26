const CATEGORY_INPUT_FORMAT = {
  sorting: [
    "array: comma-separated integers",
    "example: 5,1,4,2,8"
  ],
  search: [
    "Study topic in Analyzer mode",
    "Review the notes panel for expected inputs and invariants"
  ],
  divide_conquer: [
    "Study topic in Analyzer mode",
    "Focus on the split, recurse, and combine structure"
  ],
  greedy: [
    "Study topic in Analyzer mode",
    "Focus on the greedy choice and why it stays safe"
  ],
  graph: [
    "nodes: comma-separated node labels",
    "edges: one per line as from,to,weight",
    "start: source node label"
  ],
  dp: [
    "Depends on algorithm (knapsack / string pair / matrix dimensions)",
    "Knapsack: weights[], values[], capacity",
    "String pair: textA, textB",
    "Matrix chain: dimensions[]"
  ],
  string: [
    "text: source string",
    "pattern: pattern string (except Huffman uses only text)"
  ],
  backtracking: [
    "Study topic in Analyzer mode",
    "Track candidate state, safety checks, and backtrack points"
  ],
  complexity: [
    "Theory topic in Analyzer mode",
    "Review definitions, reductions, and proof structure rather than runtime input"
  ],
  stack: [
    "initial values: comma-separated",
    "operations: one per line (push/pop/peek/etc)",
    "capacity: positive integer"
  ],
  queue: [
    "initial values: comma-separated",
    "operations: one per line (enqueue/dequeue/front/rear/etc)",
    "capacity: positive integer"
  ],
  linked_list: [
    "initial values: comma-separated",
    "operations: one per line (insert/delete/search/traverse)"
  ],
  tree: [
    "initial values: comma-separated",
    "operations: one per line (insert/delete/search/traverse)",
    "trie uses words instead of numeric keys"
  ]
};

const ALGORITHM_INPUT_FORMAT_OVERRIDES = {
  knapsack_01: [
    "weights: comma-separated positive integers",
    "values: comma-separated non-negative numbers",
    "capacity: non-negative integer"
  ],
  lcs: [
    "textA: first string",
    "textB: second string"
  ],
  edit_distance: [
    "textA: source string",
    "textB: target string"
  ],
  longest_common_substring: [
    "textA: first string",
    "textB: second string"
  ],
  matrix_chain_multiplication: [
    "dimensions: n+1 integers p0..pn",
    "represents matrices A1..An where Ai is p(i-1) x p(i)"
  ],
  huffman_coding: [
    "text: input string to encode"
  ],
  bellman_ford: [
    "nodes: comma-separated labels",
    "edges: from,to,weight (negative weights allowed)",
    "start: source node"
  ],
  topological_sort: [
    "nodes: comma-separated labels",
    "edges: from,to,weight (weight ignored)",
    "directed: true recommended"
  ],
  b_tree: [
    "initial values: comma-separated keys",
    "order: integer >= 3 (max children per internal node)",
    "operations: insert/delete/search/traverse"
  ],
  b_plus_tree: [
    "initial values: comma-separated keys",
    "order: integer >= 3 (max children per internal node)",
    "operations: insert/delete/search/traverse"
  ],
  binary_search: [
    "sorted array of keys",
    "target value to search for"
  ],
  finding_maximum_and_minimum: [
    "numeric array or sequence",
    "pairwise comparison is the common optimized variant"
  ],
  expected_running_time_randomized_quick_sort: [
    "randomized pivot quick sort recurrence",
    "expected-comparisons or expected recursion-tree analysis"
  ],
  strassen_matrix_multiplication: [
    "two square matrices of compatible size",
    "usually padded to powers of two in recursive presentations"
  ],
  karatsuba_large_integer_multiplication: [
    "two large integers or digit strings",
    "split operands into high and low halves"
  ],
  job_sequencing_with_deadlines: [
    "jobs with id, deadline, and profit",
    "one unit processing time per job in the classical form"
  ],
  minimum_cost_spanning_trees: [
    "weighted connected graph",
    "Prim and Kruskal are the standard exact methods"
  ],
  optimal_storage_on_tapes: [
    "file lengths",
    "optionally access probabilities for weighted variants"
  ],
  optimal_merge_patterns: [
    "list of file lengths",
    "min-heap is the standard implementation tool"
  ],
  single_source_shortest_paths: [
    "graph with a chosen source vertex",
    "algorithm depends on whether negative weights are allowed"
  ],
  transitive_closure: [
    "directed graph or adjacency matrix",
    "goal is Boolean reachability between every pair"
  ],
  multistage_graph: [
    "layered DAG with stage labels",
    "edge weights and a designated sink"
  ],
  all_pairs_shortest_paths: [
    "weighted graph",
    "goal is the full pairwise distance matrix"
  ],
  optimal_binary_search_trees: [
    "sorted keys with successful/unsuccessful search probabilities",
    "prefix sums help compute interval weights quickly"
  ],
  reliability_design: [
    "component costs and reliabilities",
    "overall budget or redundancy constraints"
  ],
  bi_connected_components: [
    "undirected graph",
    "DFS discovery and low-link arrays"
  ],
  queens_8_problem: [
    "board size n (8 in the classic problem)",
    "row-wise placement with column and diagonal checks"
  ],
  branch_and_bound_strategy: [
    "optimization problem with a search tree",
    "requires a branching rule and a bounding function"
  ],
  approximation_algorithm_for_vertex_cover: [
    "graph edges",
    "choose an uncovered edge and add both endpoints"
  ],
  set_cover_problem: [
    "universe of elements",
    "collection of subsets or weighted subsets"
  ],
  satisfiability_sat: [
    "Boolean formula",
    "usually CNF or 3-CNF in NP-completeness contexts"
  ]
};

const ALGORITHM_PSEUDOCODE = {
  shell_sort: [
    "initialize gap = n//2",
    "for each gap pass: gapped insertion sort",
    "halve gap each round",
    "finish when gap reaches 1 then 0"
  ],
  topological_sort: [
    "compute indegree for each node",
    "enqueue all zero-indegree nodes",
    "pop queue, append to order, decrement neighbors",
    "if processed count < V, graph contains a cycle"
  ],
  bubble_sort: [
    "repeat passes over array",
    "compare adjacent elements",
    "swap if out of order",
    "stop early if no swaps"
  ],
  counting_sort: [
    "compute min and max",
    "count frequency of each value",
    "build prefix sums",
    "place elements in output from right to left"
  ],
  dijkstra: [
    "initialize distances with infinity",
    "push source into min-priority queue",
    "extract nearest node",
    "relax outgoing edges"
  ],
  bellman_ford: [
    "initialize distances with infinity",
    "repeat V-1 times: relax every edge",
    "if one full pass has no update, stop",
    "run one extra pass to detect negative cycles"
  ],
  lcs: [
    "build (n+1) x (m+1) DP table",
    "if chars match: use diagonal + 1",
    "otherwise take max(top, left)",
    "answer is dp[n][m]"
  ],
  edit_distance: [
    "build (n+1) x (m+1) DP table",
    "initialize first row and column",
    "transition with insert, delete, replace",
    "answer is dp[n][m]"
  ],
  longest_common_substring: [
    "build (n+1) x (m+1) DP table",
    "if chars match: dp[i][j] = dp[i-1][j-1] + 1",
    "if mismatch: reset dp[i][j] = 0",
    "track max value and ending index"
  ],
  kmp: [
    "build LPS table for pattern",
    "scan text with two pointers",
    "on mismatch jump using LPS",
    "record matches when pattern pointer reaches end"
  ],
  z_algorithm: [
    "construct s = pattern + '$' + text",
    "compute Z array using [L,R] window reuse",
    "index i is a match if Z[i] >= pattern length"
  ],
  boyer_moore: [
    "precompute last occurrence table",
    "align pattern and compare right-to-left",
    "on mismatch shift using bad-character rule",
    "record full matches and continue"
  ],
  binary_search: [
    "set low and high over the sorted range",
    "check the middle element against the target",
    "discard the impossible half",
    "repeat until found or the interval becomes empty"
  ],
  finding_maximum_and_minimum: [
    "initialize current min and max",
    "scan remaining elements or element pairs",
    "update extrema using the fewest comparisons possible"
  ],
  expected_running_time_randomized_quick_sort: [
    "write the recurrence E[T(n)] = E[T(L)] + E[T(R)] + O(n)",
    "bound the probability of highly unbalanced pivots",
    "sum expected partition work over the recursion tree"
  ],
  strassen_matrix_multiplication: [
    "split matrices into quadrants",
    "compute seven recursive block products",
    "combine them into four output quadrants",
    "switch to classical multiplication near the cutoff"
  ],
  karatsuba_large_integer_multiplication: [
    "split each operand into high and low halves",
    "recurse on ac, bd, and (a+b)(c+d)",
    "derive the middle term from those three products",
    "recombine using base shifts"
  ],
  job_sequencing_with_deadlines: [
    "sort jobs by descending profit",
    "find the latest free slot before each job's deadline",
    "schedule the job if a slot exists",
    "sum profits of accepted jobs"
  ],
  minimum_cost_spanning_trees: [
    "apply cut/cycle properties",
    "use Prim to grow one tree or Kruskal to join components",
    "stop after selecting V-1 safe edges"
  ],
  optimal_storage_on_tapes: [
    "sort files by ascending length",
    "place shorter files earlier on tape",
    "compute average or weighted retrieval time"
  ],
  optimal_merge_patterns: [
    "push all file sizes into a min-heap",
    "extract the two smallest files",
    "merge them and add the merge cost",
    "push the merged file back and repeat"
  ],
  single_source_shortest_paths: [
    "initialize source distance to zero",
    "relax edges according to the chosen shortest-path algorithm",
    "read the final distance array from the source"
  ],
  transitive_closure: [
    "initialize a Boolean reachability matrix",
    "allow each vertex as an intermediate",
    "propagate reachability with logical OR/AND updates"
  ],
  multistage_graph: [
    "process stages from sink backward",
    "compute best cost-to-go for each node",
    "store next-choice pointers for path reconstruction"
  ],
  all_pairs_shortest_paths: [
    "initialize the distance matrix",
    "allow each vertex as an intermediate",
    "update every pair distance when a shorter route is found"
  ],
  optimal_binary_search_trees: [
    "build interval DP tables",
    "try each key as root of the interval",
    "add subtree costs plus interval weight",
    "store the minimum expected cost"
  ],
  reliability_design: [
    "model each subsystem choice under a budget",
    "use DP to combine subsystem decisions",
    "maximize the resulting system reliability"
  ],
  bi_connected_components: [
    "run DFS with discovery and low-link values",
    "push DFS tree edges onto a stack",
    "pop one component whenever an articulation split is found"
  ],
  queens_8_problem: [
    "place a queen in the current row",
    "reject columns and diagonals already under attack",
    "recurse to next row or backtrack on failure"
  ],
  branch_and_bound_strategy: [
    "branch into subproblems",
    "compute an optimistic bound for each node",
    "prune nodes whose bound cannot beat the incumbent",
    "continue until the best feasible solution is proved optimal"
  ],
  approximation_algorithm_for_vertex_cover: [
    "pick an uncovered edge",
    "add both endpoints to the cover",
    "remove all covered edges",
    "repeat until no uncovered edges remain"
  ],
  set_cover_problem: [
    "track uncovered elements",
    "pick the subset with the best uncovered gain",
    "mark those elements covered",
    "repeat until the universe is covered"
  ],
  satisfiability_sat: [
    "guess a truth assignment",
    "evaluate every clause",
    "accept iff all clauses are satisfied"
  ]
};

const DEFAULT_PSEUDOCODE = [
  "initialize data structures",
  "iterate through input and update state",
  "record intermediate transitions",
  "return result and metrics"
];

export const ALGORITHM_EXPANSION_PLAN = {
  sorting: {
    implemented: ["counting_sort", "shell_sort"],
    planned_next: ["bucket_sort", "tim_sort"]
  },
  graph: {
    implemented: ["bellman_ford", "topological_sort"],
    planned_next: ["a_star", "strongly_connected_components"]
  },
  dp: {
    implemented: ["edit_distance", "longest_common_substring"],
    planned_next: ["coin_change", "longest_increasing_subsequence"]
  },
  string: {
    implemented: ["z_algorithm", "boyer_moore", "huffman_coding"],
    planned_next: ["aho_corasick", "suffix_array"]
  }
};

const getInputFormat = (algorithm) => {
  if (!algorithm) {
    return [];
  }
  return ALGORITHM_INPUT_FORMAT_OVERRIDES[algorithm.name] || CATEGORY_INPUT_FORMAT[algorithm.category] || [];
};

const getPseudocode = (algorithm) => {
  if (!algorithm) {
    return DEFAULT_PSEUDOCODE;
  }
  return ALGORITHM_PSEUDOCODE[algorithm.name] || DEFAULT_PSEUDOCODE;
};

export const toUnifiedAlgorithmMetadata = (algorithm) => {
  if (!algorithm) {
    return null;
  }

  const codeTemplates = algorithm.codeByLanguage || {
    python: algorithm.code || ""
  };

  return {
    name: algorithm.name,
    displayName: algorithm.display_name || algorithm.name,
    category: algorithm.category,
    description: algorithm.description,
    inputFormat: getInputFormat(algorithm),
    complexity: algorithm.complexity || null,
    pseudocode: getPseudocode(algorithm),
    codeTemplates,
    expansionStatus: Object.values(ALGORITHM_EXPANSION_PLAN)
      .some((entry) => entry.implemented.includes(algorithm.name))
      ? "newly-added"
      : "existing"
  };
};

export const buildUnifiedMetadataMap = (algorithms = []) => {
  return Object.fromEntries(
    algorithms.map((algorithm) => [algorithm.name, toUnifiedAlgorithmMetadata(algorithm)])
  );
};
