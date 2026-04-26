import { ANALYZER_STUDY_CATALOG } from "./analyzerStudyTopics.js";

export const CATEGORY_LABELS = {
  sorting: "Sorting",
  search: "Search",
  divide_conquer: "Divide and Conquer",
  greedy: "Greedy",
  graph: "Graph",
  dp: "Dynamic Programming",
  backtracking: "Backtracking",
  string: "String Matching",
  complexity: "Complexity Theory",
  stack: "Stacks",
  queue: "Queues",
  linked_list: "Linked Lists",
  tree: "Trees"
};

const CATEGORY_ORDER = ["sorting", "search", "divide_conquer", "greedy", "graph", "dp", "backtracking", "string", "complexity", "stack", "queue", "linked_list", "tree"];

export const ALGO_DISPLAY_NAMES = {
  bubble_sort: "Bubble Sort",
  binary_search: "Binary Search",
  finding_maximum_and_minimum: "Finding Maximum and Minimum",
  expected_running_time_randomized_quick_sort: "Expected Running Time of Randomized Quick Sort",
  cocktail_sort: "Cocktail Sort",
  comb_sort: "Comb Sort",
  counting_sort: "Counting Sort",
  gnome_sort: "Gnome Sort",
  selection_sort: "Selection Sort",
  insertion_sort: "Insertion Sort",
  merge_sort: "Merge Sort",
  quick_sort: "Quick Sort",
  heap_sort: "Heap Sort",
  shell_sort: "Shell Sort",
  radix_sort: "Radix Sort",
  randomized_quick_sort: "Randomized Quick Sort",
  randomized_quick: "Randomized Quick Sort",
  strassen_matrix_multiplication: "Strassen's Matrix Multiplication",
  karatsuba_large_integer_multiplication: "Karatsuba's Large Integer Multiplication",
  job_sequencing_with_deadlines: "Job Sequencing with Deadlines",
  minimum_cost_spanning_trees: "Minimum Cost Spanning Trees",
  optimal_storage_on_tapes: "Optimal Storage on Tapes",
  optimal_merge_patterns: "Optimal Merge Patterns",
  single_source_shortest_paths: "Single Source Shortest Paths",
  transitive_closure: "Transitive Closure",
  bfs: "Breadth-First Search",
  dfs: "Depth-First Search",
  dijkstra: "Dijkstra's Algorithm",
  bellman_ford: "Bellman-Ford",
  topological_sort: "Topological Sort",
  floyd_warshall: "Floyd-Warshall",
  multistage_graph: "Multistage Graph",
  all_pairs_shortest_paths: "All Pairs Shortest Paths",
  ford_fulkerson: "Ford-Fulkerson (Edmonds-Karp)",
  bi_connected_components: "Bi-Connected Components",
  graph_coloring: "Graph Coloring",
  hamiltonian_cycle: "Hamiltonian Cycle",
  hamiltonian: "Hamiltonian Cycle",
  prim: "Prim's MST",
  kruskal: "Kruskal's MST",
  tsp_branch_bound: "TSP (Branch & Bound)",
  tsp: "TSP (Branch & Bound)",
  knapsack_01: "0/1 Knapsack",
  optimal_binary_search_trees: "Optimal Binary Search Trees (OBST)",
  reliability_design: "Reliability Design",
  queens_8_problem: "8-Queens Problem",
  branch_and_bound_strategy: "Branch and Bound Strategy",
  lcs: "Longest Common Subsequence",
  longest_common_substring: "Longest Common Substring",
  edit_distance: "Edit Distance",
  matrix_chain_multiplication: "Matrix Chain Multiplication",
  matrix_chain: "Matrix Chain Multiplication",
  naive: "Naive Pattern Matching",
  kmp: "KMP Algorithm",
  boyer_moore: "Boyer-Moore",
  z_algorithm: "Z Algorithm",
  rabin_karp: "Rabin-Karp",
  huffman_coding: "Huffman Coding",
  np_hard_problems: "NP-Hard Problems",
  np_complete_problems: "NP-Complete Problems",
  tractable_and_intractable_problems: "Tractable and Intractable Problems",
  non_deterministic_search_and_sorting: "Non-deterministic Search and Sorting",
  complexity_classes: "Complexity Classes: P, NP, NP-Complete, NP-Hard",
  satisfiability_sat: "Satisfiability (SAT)",
  cooks_theorem: "Cook's Theorem",
  reductions: "Reductions",
  procedure_for_np_completeness: "Procedure for NP-Completeness",
  clique_decision_problem: "Clique Decision Problem",
  approximation_algorithm_for_vertex_cover: "Approximation Algorithm for Vertex Cover",
  set_cover_problem: "Set Cover Problem",
  array_stack: "Array Stack",
  linked_stack: "Linked List Stack",
  linear_queue: "Linear Queue",
  circular_queue: "Circular Queue",
  deque: "Deque",
  priority_queue: "Priority Queue",
  singly_linked_list: "Singly Linked List",
  doubly_linked_list: "Doubly Linked List",
  circular_singly_linked_list: "Circular Singly Linked List",
  circular_doubly_linked_list: "Circular Doubly Linked List",
  binary_tree: "Binary Tree",
  binary_search_tree: "Binary Search Tree",
  avl_tree: "AVL Tree",
  b_tree: "B-Tree",
  b_plus_tree: "B+ Tree",
  min_heap: "Min Heap",
  max_heap: "Max Heap",
  trie: "Trie"
};

export const LANGUAGE_LABELS = {
  python: "Python",
  javascript: "JavaScript",
  c: "C",
  cpp: "C++",
  java: "Java",
  go: "Go"
};

export const LANGUAGE_TAB_WIDTHS = {
  python: "70px",
  javascript: "95px",
  c: "48px",
  cpp: "55px",
  java: "60px",
  go: "52px"
};

export const getLanguages = () => ["python", "javascript", "c", "cpp", "java", "go"];

export const getLanguageLabel = (language) => LANGUAGE_LABELS[language] || language;

export const normalizeCategoryLabel = (category) => CATEGORY_LABELS[category] || category;

export const getAlgorithmDisplayName = (name) => ALGO_DISPLAY_NAMES[name] || name;

export const formatCategoryOptions = (categories) => {
  return [...categories]
    .sort((a, b) => {
      const ai = CATEGORY_ORDER.indexOf(a);
      const bi = CATEGORY_ORDER.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    })
    .map((category) => ({ value: category, label: normalizeCategoryLabel(category) }));
};

const complexityNote = {
  bubble_sort: {
    best_time: "n = number of input elements. Doubling n roughly doubles work in best-case early-exit runs.",
    average_time: "n = number of input elements. O(n^2) means pairwise checks grow quadratically.",
    worst_time: "n = number of input elements. Reverse order leads to repeated full passes.",
    space: "Uses constant extra storage while swapping in-place."
  },
  selection_sort: {
    best_time: "n = number of input elements. It still scans the unsorted suffix every pass.",
    average_time: "n = number of input elements. Work is dominated by repeated minimum scans.",
    worst_time: "n = number of input elements. Runtime pattern does not change much with input order.",
    space: "In-place algorithm with O(1) extra memory."
  },
  insertion_sort: {
    best_time: "n = number of input elements. Nearly sorted arrays shift very little.",
    average_time: "n = number of input elements. Inner shifts create quadratic behavior on random arrays.",
    worst_time: "n = number of input elements. Reverse order causes maximum shifts.",
    space: "Only a few temp variables are needed."
  },
  merge_sort: {
    best_time: "n = number of elements. Divide-and-conquer gives n work per level and log n levels.",
    average_time: "n = number of elements. Merge work remains stable across distributions.",
    worst_time: "n = number of elements. Balanced splitting preserves O(n log n).",
    space: "Needs auxiliary arrays proportional to n while merging."
  },
  quick_sort: {
    best_time: "n = number of elements. Balanced partitions produce logarithmic recursion depth.",
    average_time: "n = number of elements. Typical pivots keep partitions fairly balanced.",
    worst_time: "n = number of elements. Repeatedly poor pivots degenerate recursion.",
    space: "Recursion stack usually O(log n), worst-case O(n)."
  },
  heap_sort: {
    best_time: "n = number of elements. Heapify plus n extracts dominates runtime.",
    average_time: "n = number of elements. Every extract/heapify is logarithmic.",
    worst_time: "n = number of elements. Guaranteed O(n log n).",
    space: "In-place heap operations require O(1) auxiliary space."
  },
  radix_sort: {
    best_time: "n = number of elements, k = number of digits processed.",
    average_time: "O(nk) because each digit pass scans all n elements.",
    worst_time: "Still O(nk) for fixed-base integer keys.",
    space: "Uses counting buckets: O(n + b), where b is radix base."
  },
  randomized_quick_sort: {
    best_time: "n = number of elements. Random pivots often avoid pathological partitions.",
    average_time: "Expected O(n log n) with high probability.",
    worst_time: "Worst-case O(n^2) still exists but is far less likely.",
    space: "Expected recursion depth remains near O(log n)."
  },
  counting_sort: {
    best_time: "n = elements, k = value range size. Linear in both n and key range.",
    average_time: "Counts frequencies once, then reconstructs output with prefix sums.",
    worst_time: "Still O(n + k) because no nested element comparisons occur.",
    space: "Uses output buffer + count array, typically O(n + k)."
  },
  shell_sort: {
    best_time: "n = number of input elements. Performance depends on the chosen gap sequence.",
    average_time: "Gap-based insertion passes reduce long-distance inversions early.",
    worst_time: "Can degrade to quadratic behavior with poor gaps or adversarial order.",
    space: "In-place updates require only O(1) auxiliary memory."
  },
  bfs: {
    best_time: "V = vertices, E = edges. Each vertex and edge is processed at most once.",
    average_time: "Queue-based traversal gives O(V + E) on adjacency lists.",
    worst_time: "Still O(V + E) even when graph is fully reachable.",
    space: "Visited set plus queue can hold up to O(V) nodes."
  },
  dfs: {
    best_time: "V = vertices, E = edges. Traversal touches each adjacency once.",
    average_time: "Adjacency-list DFS is linear in graph size: O(V + E).",
    worst_time: "Connected dense inputs still remain O(V + E).",
    space: "Recursion/stack plus visited markers uses O(V)."
  },
  dijkstra: {
    best_time: "V = vertices, E = edges. Heap operations dominate.",
    average_time: "O((V + E) log V) with a binary heap priority queue.",
    worst_time: "Every edge relaxation can trigger heap work.",
    space: "Distance, parent, visited, and heap structures are O(V)."
  },
  bellman_ford: {
    best_time: "V = vertices, E = edges. Each pass relaxes all edges.",
    average_time: "O(VE), with early-stop if a full pass has no updates.",
    worst_time: "Runs V-1 relax phases + one cycle-check phase.",
    space: "Stores distances and parents for each vertex: O(V)."
  },
  topological_sort: {
    best_time: "V = vertices, E = edges. Kahn's queue processing touches each edge once.",
    average_time: "Linear pass over indegrees + adjacency traversal gives O(V + E).",
    worst_time: "Still O(V + E), even when graph has no zero-indegree shortcuts.",
    space: "Indegree map + queue + output order are O(V)."
  },
  floyd_warshall: {
    best_time: "V = vertices. Triple nested loops iterate over all (i, j, k).",
    average_time: "All-pairs dynamic programming is O(V^3).",
    worst_time: "No input distribution shortcut changes cubic order.",
    space: "Stores a V x V distance matrix (O(V^2))."
  },
  ford_fulkerson: {
    best_time: "V = vertices, E = edges. Edmonds-Karp uses BFS per augmenting path.",
    average_time: "Performance depends on augmenting path count and residual updates.",
    worst_time: "Edmonds-Karp bound is O(VE^2).",
    space: "Residual graph and parent arrays require O(V + E)."
  },
  graph_coloring: {
    best_time: "V = vertices, C = colors. Strong constraints can prune early.",
    average_time: "Backtracking is typically exponential in V.",
    worst_time: "Upper bound behaves like O(C^V).",
    space: "Color assignment and recursion depth scale with V."
  },
  hamiltonian_cycle: {
    best_time: "V = vertices. Favorable constraints prune many partial tours.",
    average_time: "Search remains combinatorial for most instances.",
    worst_time: "Backtracking may explore factorially many candidates.",
    space: "Path + visited state typically O(V)."
  },
  prim: {
    best_time: "V = vertices, E = edges. Heap-based edge selection drives runtime.",
    average_time: "O((V + E) log V) with adjacency lists and priority queue.",
    worst_time: "Dense graphs increase heap operations via many edges.",
    space: "Graph + key arrays + heap are O(V + E)."
  },
  kruskal: {
    best_time: "V = vertices, E = edges. Sorting edges dominates.",
    average_time: "O(E log E) with near-constant DSU operations.",
    worst_time: "Worst-case still tied to edge sorting complexity.",
    space: "Stores sorted edges and DSU parent/rank arrays."
  },
  tsp_branch_bound: {
    best_time: "n = number of cities. Good bounds prune many branches early.",
    average_time: "Still exponential but often far below brute force.",
    worst_time: "Can degrade toward factorial exploration.",
    space: "Cost matrix + recursion state are typically O(n^2)."
  },
  knapsack_01: {
    best_time: "n = number of items, W = capacity. DP table fills n x W states.",
    average_time: "Runtime scales with both item count and capacity.",
    worst_time: "No shortcut changes asymptotic O(nW) for full table fill.",
    space: "2D DP table is O(nW), 1D optimization can reduce to O(W)."
  },
  lcs: {
    best_time: "n = length of string A, m = length of string B.",
    average_time: "LCS compares all prefix pairs, giving O(nm).",
    worst_time: "Dense mismatch patterns still require full DP grid fill.",
    space: "Standard DP stores an (n+1) x (m+1) matrix."
  },
  edit_distance: {
    best_time: "n = length of string A, m = length of string B.",
    average_time: "Levenshtein DP fills all n×m states.",
    worst_time: "Still O(nm) as each cell evaluates insert/delete/replace.",
    space: "Classic table uses O(nm); rolling rows can reduce space."
  },
  longest_common_substring: {
    best_time: "n = length of string A, m = length of string B.",
    average_time: "Each DP cell tracks contiguous-match length, yielding O(nm).",
    worst_time: "Still O(nm) because the full table is evaluated in standard form.",
    space: "Typical DP matrix is O(nm), with rolling-row optimization possible."
  },
  matrix_chain_multiplication: {
    best_time: "n = number of matrices in the chain.",
    average_time: "Triple-loop DP over split positions yields O(n^3).",
    worst_time: "All candidate splits are evaluated for each interval.",
    space: "Stores DP cost table over intervals: O(n^2)."
  },
  naive: {
    best_time: "n = text length, m = pattern length.",
    average_time: "Window-by-window checks produce O(nm).",
    worst_time: "Repeated partial matches can force near-max comparisons.",
    space: "Only pointer/index bookkeeping is required."
  },
  kmp: {
    best_time: "n = text length, m = pattern length.",
    average_time: "LPS preprocessing + linear scan gives O(n + m).",
    worst_time: "Failure links prevent re-checking text characters.",
    space: "Stores LPS table of size m."
  },
  boyer_moore: {
    best_time: "n = text length, m = pattern length.",
    average_time: "Bad-character shifts skip many positions in practice, often near linear.",
    worst_time: "Can degrade toward O(nm) for pathological text-pattern pairs.",
    space: "Stores character-last-occurrence table, typically O(alphabet)."
  },
  z_algorithm: {
    best_time: "n = text length, m = pattern length.",
    average_time: "Builds a Z-array on pattern + separator + text in linear time.",
    worst_time: "Z-box reuse keeps total comparisons linear.",
    space: "Requires O(n + m) array storage."
  },
  rabin_karp: {
    best_time: "n = text length, m = pattern length.",
    average_time: "Rolling hash yields expected O(n + m).",
    worst_time: "Many hash collisions can degrade to O(nm).",
    space: "Uses constant-size hash variables."
  },
  huffman_coding: {
    best_time: "n = input length, k = number of distinct characters.",
    average_time: "Frequency counting is O(n), tree construction is O(k log k).",
    worst_time: "Dominated by heap operations while merging k leaf nodes.",
    space: "Stores frequencies, heap, and code map: O(k)."
  }
};

const baseAlgo = (name, category, complexity, description, howItWorks, keyInsight, whenToUse, whenToAvoid, useCases, limitations, tips) => ({
  name,
  display_name: getAlgorithmDisplayName(name),
  category,
  description,
  complexity,
  howItWorks,
  keyInsight,
  whenToUse,
  whenToAvoid,
  use_cases: useCases,
  limitations,
  optimization_tips: tips,
  nMeaning: complexityNote[name] || {
    best_time: "Variable meanings depend on input dimensions for this algorithm.",
    average_time: "Variable meanings depend on input dimensions for this algorithm.",
    worst_time: "Variable meanings depend on input dimensions for this algorithm.",
    space: "Variable meanings depend on input dimensions for this algorithm."
  },
  codeByLanguage: getCodeBundle(name)
});

const sortingComplexity = {
  bubble_sort: { best_time: "O(n)", average_time: "O(n^2)", worst_time: "O(n^2)", space: "O(1)" },
  cocktail_sort: { best_time: "O(n)", average_time: "O(n^2)", worst_time: "O(n^2)", space: "O(1)" },
  comb_sort: { best_time: "O(n log n)", average_time: "O(n^2)", worst_time: "O(n^2)", space: "O(1)" },
  counting_sort: { best_time: "O(n + k)", average_time: "O(n + k)", worst_time: "O(n + k)", space: "O(n + k)" },
  gnome_sort: { best_time: "O(n)", average_time: "O(n^2)", worst_time: "O(n^2)", space: "O(1)" },
  selection_sort: { best_time: "O(n^2)", average_time: "O(n^2)", worst_time: "O(n^2)", space: "O(1)" },
  insertion_sort: { best_time: "O(n)", average_time: "O(n^2)", worst_time: "O(n^2)", space: "O(1)" },
  merge_sort: { best_time: "O(n log n)", average_time: "O(n log n)", worst_time: "O(n log n)", space: "O(n)" },
  quick_sort: { best_time: "O(n log n)", average_time: "O(n log n)", worst_time: "O(n^2)", space: "O(log n)" },
  heap_sort: { best_time: "O(n log n)", average_time: "O(n log n)", worst_time: "O(n log n)", space: "O(1)" },
  shell_sort: { best_time: "O(n log n)", average_time: "O(n^1.5)", worst_time: "O(n^2)", space: "O(1)" },
  radix_sort: { best_time: "O(nk)", average_time: "O(nk)", worst_time: "O(nk)", space: "O(n + b)" },
  randomized_quick_sort: { best_time: "O(n log n)", average_time: "O(n log n)", worst_time: "O(n^2)", space: "O(log n)" }
};

const graphComplexity = {
  bfs: { best_time: "O(V + E)", average_time: "O(V + E)", worst_time: "O(V + E)", space: "O(V)" },
  dfs: { best_time: "O(V + E)", average_time: "O(V + E)", worst_time: "O(V + E)", space: "O(V)" },
  dijkstra: { best_time: "O((V + E) log V)", average_time: "O((V + E) log V)", worst_time: "O((V + E) log V)", space: "O(V)" },
  bellman_ford: { best_time: "O(VE)", average_time: "O(VE)", worst_time: "O(VE)", space: "O(V)" },
  topological_sort: { best_time: "O(V + E)", average_time: "O(V + E)", worst_time: "O(V + E)", space: "O(V)" },
  floyd_warshall: { best_time: "O(V^3)", average_time: "O(V^3)", worst_time: "O(V^3)", space: "O(V^2)" },
  ford_fulkerson: { best_time: "O(VE^2)", average_time: "O(VE^2)", worst_time: "O(VE^2)", space: "O(V + E)" },
  graph_coloring: { best_time: "O(C^V)", average_time: "O(C^V)", worst_time: "O(C^V)", space: "O(V)" },
  hamiltonian_cycle: { best_time: "O(V!)", average_time: "O(V!)", worst_time: "O(V!)", space: "O(V)" },
  prim: { best_time: "O((V + E) log V)", average_time: "O((V + E) log V)", worst_time: "O((V + E) log V)", space: "O(V + E)" },
  kruskal: { best_time: "O(E log E)", average_time: "O(E log E)", worst_time: "O(E log E)", space: "O(V + E)" },
  tsp_branch_bound: { best_time: "O(n!)", average_time: "O(n!)", worst_time: "O(n!)", space: "O(n^2)" }
};

const dpComplexity = {
  knapsack_01: { best_time: "O(nW)", average_time: "O(nW)", worst_time: "O(nW)", space: "O(nW)" },
  lcs: { best_time: "O(nm)", average_time: "O(nm)", worst_time: "O(nm)", space: "O(nm)" },
  edit_distance: { best_time: "O(nm)", average_time: "O(nm)", worst_time: "O(nm)", space: "O(nm)" },
  longest_common_substring: { best_time: "O(nm)", average_time: "O(nm)", worst_time: "O(nm)", space: "O(nm)" },
  matrix_chain_multiplication: { best_time: "O(n^3)", average_time: "O(n^3)", worst_time: "O(n^3)", space: "O(n^2)" }
};

const stringComplexity = {
  naive: { best_time: "O(nm)", average_time: "O(nm)", worst_time: "O(nm)", space: "O(1)" },
  kmp: { best_time: "O(n + m)", average_time: "O(n + m)", worst_time: "O(n + m)", space: "O(m)" },
  boyer_moore: { best_time: "O(n / m)", average_time: "O(n)", worst_time: "O(nm)", space: "O(alphabet)" },
  z_algorithm: { best_time: "O(n + m)", average_time: "O(n + m)", worst_time: "O(n + m)", space: "O(n + m)" },
  rabin_karp: { best_time: "O(n + m)", average_time: "O(n + m)", worst_time: "O(nm)", space: "O(1)" },
  huffman_coding: { best_time: "O(n log k)", average_time: "O(n log k)", worst_time: "O(n log k)", space: "O(k)" }
};

const structureComplexity = {
  array_stack: { best_time: "O(1)", average_time: "O(1)", worst_time: "O(1)", space: "O(n)" },
  linked_stack: { best_time: "O(1)", average_time: "O(1)", worst_time: "O(1)", space: "O(n)" },
  linear_queue: { best_time: "O(1)", average_time: "O(1)", worst_time: "O(n)", space: "O(n)" },
  circular_queue: { best_time: "O(1)", average_time: "O(1)", worst_time: "O(1)", space: "O(n)" },
  deque: { best_time: "O(1)", average_time: "O(1)", worst_time: "O(1)", space: "O(n)" },
  priority_queue: { best_time: "O(1)", average_time: "O(log n)", worst_time: "O(log n)", space: "O(n)" },
  singly_linked_list: { best_time: "O(1)", average_time: "O(n)", worst_time: "O(n)", space: "O(n)" },
  doubly_linked_list: { best_time: "O(1)", average_time: "O(n)", worst_time: "O(n)", space: "O(n)" },
  circular_singly_linked_list: { best_time: "O(1)", average_time: "O(n)", worst_time: "O(n)", space: "O(n)" },
  circular_doubly_linked_list: { best_time: "O(1)", average_time: "O(n)", worst_time: "O(n)", space: "O(n)" },
  binary_tree: { best_time: "O(1)", average_time: "O(log n)", worst_time: "O(n)", space: "O(n)" },
  binary_search_tree: { best_time: "O(log n)", average_time: "O(log n)", worst_time: "O(n)", space: "O(n)" },
  avl_tree: { best_time: "O(log n)", average_time: "O(log n)", worst_time: "O(log n)", space: "O(n)" },
  b_tree: { best_time: "O(log n)", average_time: "O(log n)", worst_time: "O(log n)", space: "O(n)" },
  b_plus_tree: { best_time: "O(log n)", average_time: "O(log n)", worst_time: "O(log n)", space: "O(n)" },
  min_heap: { best_time: "O(1)", average_time: "O(log n)", worst_time: "O(log n)", space: "O(n)" },
  max_heap: { best_time: "O(1)", average_time: "O(log n)", worst_time: "O(log n)", space: "O(n)" },
  trie: { best_time: "O(1)", average_time: "O(k)", worst_time: "O(k)", space: "O(total_chars)" }
};

export const ALGORITHM_CATALOG = [
  baseAlgo("bubble_sort", "sorting", sortingComplexity.bubble_sort, "Repeatedly compares adjacent values and swaps out-of-order pairs.", "Bubble Sort repeatedly scans adjacent pairs and swaps whenever left > right. The largest unsorted element settles at the end after each pass. An early-exit flag stops when no swaps occur. It performs best on nearly sorted arrays and worst on reverse-sorted arrays. It is used in teaching and tiny data scenarios.", "Local adjacent corrections eventually create global order.", ["Small nearly sorted arrays", "Pedagogical demos", "Low-memory in-place sorts"], ["Large random arrays", "Performance-critical pipelines"], ["Teaching sorting basics", "Visual algorithm demonstrations"], ["Quadratic runtime on large inputs"], ["Use early-exit optimization"]),
  baseAlgo("cocktail_sort", "sorting", sortingComplexity.cocktail_sort, "Bidirectional bubble sort that sweeps left-to-right and right-to-left.", "Cocktail Sort alternates two bubble-style passes. A forward sweep moves the largest remaining element to the end, then a backward sweep moves the smallest remaining element to the front. After each full cycle, the unsorted window shrinks from both sides. It is simple and stable, with best-case linear behavior on nearly sorted arrays.", "Alternating direction bubbles both extremes, shrinking the unsorted range faster than one-way bubble.", ["Nearly sorted arrays", "Small arrays", "Learning/visualization"], ["Large arrays", "Performance-critical sorting"], ["Demonstrating bidirectional passes", "Studying stability and adjacent swaps"], ["Still O(n^2) on average", "Not competitive with O(n log n) algorithms for big inputs"], ["Track last-swap positions to shrink boundaries more aggressively"]),
  baseAlgo("comb_sort", "sorting", sortingComplexity.comb_sort, "Bubble-sort improvement that compares elements at a shrinking gap.", "Comb Sort starts with a large gap and compares items that far apart, swapping them when out of order. The gap shrinks by a constant factor (often ~1.3) on each pass. These early wide-gap passes quickly move small values ('turtles') toward the front. When the gap reaches 1, it finishes like bubble sort with a final cleanup pass.", "Use larger gaps early to fix long-distance inversions before doing adjacent cleanup.", ["Simple improvement over bubble sort", "Educational comparisons"], ["When you need stability", "When you need guaranteed O(n log n)"], ["Showing how gap-based passes reduce inversions"], ["Worst-case remains quadratic", "Not stable due to long swaps"], ["Use shrink factor around 1.3; treat gaps 9/10 as 11 in some implementations"]),
  baseAlgo("gnome_sort", "sorting", sortingComplexity.gnome_sort, "Insertion-like sort that swaps backward until order is restored.", "Gnome Sort walks forward when the current pair is in order. If it finds an inversion, it swaps the inverted pair and steps backward to re-check earlier order. Conceptually it is similar to insertion sort, but it uses swaps instead of shifting blocks. The algorithm is very simple and stable, but tends to do many swaps and is quadratic for large random inputs.", "Fix local inversions by swapping backward until the prefix becomes ordered again.", ["Small arrays", "Teaching insertion-style reasoning"], ["Large arrays", "Write-sensitive environments"], ["Simple stable sorting demos"], ["Quadratic runtime", "Can perform many swaps"], ["Prefer insertion sort when you want fewer writes with a similar idea"]),
  baseAlgo("counting_sort", "sorting", sortingComplexity.counting_sort, "Counts key frequencies and reconstructs a stable sorted output.", "Counting Sort builds a frequency array over the key range and converts it to prefix sums. Those prefix sums map each value to its final stable destination index. It avoids element-to-element comparisons and is excellent for bounded integer keys. Runtime depends on both input size and key range. With offsets, it also handles negative integers.", "Use frequency accumulation + prefix positions to place each item exactly once.", ["Bounded integer inputs", "Histogram-like key distributions", "Stable integer sorting"], ["Huge sparse key ranges", "Arbitrary comparator-based objects"], ["Counting-based ranking", "Digit passes inside radix sort"], ["Extra memory grows with key range k"], ["Use an offset to support negative values safely"]),
  baseAlgo("selection_sort", "sorting", sortingComplexity.selection_sort, "Selects minimum element and places it at the current position.", "Selection Sort divides the list into sorted and unsorted regions. In each pass, it finds the minimum in the unsorted part and swaps it forward. It uses few swaps but many comparisons. Input order has little impact on runtime. It suits write-limited media where swaps are expensive.", "Minimize writes by paying with comparisons.", ["Memory-constrained in-place sorting", "Write-sensitive storage"], ["Large data needing fast runtime", "Adaptive sorting needs"], ["Embedded systems with expensive writes"], ["Always O(n^2) comparisons"], ["Use when swap count matters more than comparisons"]),
  baseAlgo("insertion_sort", "sorting", sortingComplexity.insertion_sort, "Builds sorted prefix by inserting each element into its correct spot.", "Insertion Sort grows a sorted prefix from left to right. Each new value is shifted left until it reaches its insertion point. Nearly sorted data produces very few shifts. Reverse-sorted data produces the most shifts. It is common as a base case in hybrid sorting algorithms.", "Maintain a sorted prefix and insert the next value efficiently.", ["Small arrays", "Nearly sorted data", "Hybrid algorithm base case"], ["Very large random arrays"], ["Interactive sorting demos", "Online insertion tasks"], ["Quadratic in the general case"], ["Use binary insertion variation for fewer comparisons"]),
  baseAlgo("merge_sort", "sorting", sortingComplexity.merge_sort, "Recursively splits the array and merges sorted halves.", "Merge Sort applies divide-and-conquer by splitting the array recursively. Each half is sorted independently, then merged linearly. Its runtime is reliably O(n log n) regardless of input order. It requires extra memory for merging. It is excellent for stable sorting and external storage workflows.", "Balanced splitting plus linear merging yields stable O(n log n).", ["Large datasets", "Stable sorting requirements", "External sorting"], ["Strict in-place memory constraints"], ["Database sorting", "File merge pipelines"], ["Needs auxiliary memory"], ["Use iterative bottom-up merge for better cache behavior"]),
  baseAlgo("quick_sort", "sorting", sortingComplexity.quick_sort, "Partitions around a pivot and recursively sorts both sides.", "Quick Sort chooses a pivot and partitions values into less-than and greater-than regions. It recursively sorts both partitions. Average performance is excellent with good cache behavior. Bad pivots can create unbalanced recursion. It is widely used in in-memory sorting libraries.", "Good partition quality drives fast recursive convergence.", ["Fast in-memory sorting", "Average-case optimized workloads"], ["Adversarial ordered input without pivot strategy"], ["General-purpose array sorting"], ["Worst-case quadratic if partitions are poor"], ["Use median/random pivots to avoid degeneration"]),
  baseAlgo("heap_sort", "sorting", sortingComplexity.heap_sort, "Builds a max heap and repeatedly extracts the maximum.", "Heap Sort first transforms data into a max heap. It repeatedly swaps the root with the last unsorted element and restores heap order. Runtime is deterministic O(n log n). It works in-place and avoids recursion depth issues. Cache locality is typically worse than quick sort.", "Heap property guarantees logarithmic extract-and-fix operations.", ["Need guaranteed O(n log n)", "In-place sorting"], ["Cache-sensitive workloads"], ["Real-time deterministic sorting"], ["Less cache friendly than quick sort"], ["Use when guaranteed bound is mandatory"]),
  baseAlgo("shell_sort", "sorting", sortingComplexity.shell_sort, "Gap-based insertion sorting that progressively reduces disorder.", "Shell Sort starts with a large gap between compared elements and performs insertion-like passes. The gap shrinks until it reaches 1, finishing with a standard insertion pass on a nearly sorted array. Early wide-gap passes move elements long distances, reducing inversions quickly. Performance depends strongly on the selected gap sequence. It is an in-place alternative between insertion sort and O(n log n) methods.", "Shrink the gap to turn long-distance fixes into fast local insertion cleanup.", ["Medium in-memory arrays", "Low-overhead in-place sorting"], ["Workloads requiring strict stability"], ["Embedded sorting with limited memory"], ["Performance varies with gap strategy"], ["Use empirically strong gap sequences like Ciura"]),
  baseAlgo("radix_sort", "sorting", sortingComplexity.radix_sort, "Sorts keys digit-by-digit using a stable counting pass.", "Radix Sort processes digits from least to most significant. Each pass uses a stable counting sort by current digit. It avoids comparison-based lower bounds for fixed-width keys. Runtime depends on digit count and radix, not key ordering. It is effective for integer keys and fixed-length strings.", "Stable per-digit passes compose into globally sorted order.", ["Fixed-width integer keys", "Large numeric datasets"], ["Arbitrary object comparison sorting"], ["Index construction", "Telemetry/event key sorting"], ["Requires digit-friendly key representation"], ["Tune radix/base for cache efficiency"]),
  baseAlgo("randomized_quick_sort", "sorting", sortingComplexity.randomized_quick_sort, "Quick sort variant with random pivot selection.", "Randomized Quick Sort samples pivots randomly before partitioning. This dramatically reduces probability of pathological partition patterns. It keeps quick sort's practical speed with stronger expected guarantees. Worst-case O(n^2) remains theoretically possible. It is robust for mixed and unknown input distributions.", "Randomization neutralizes many adversarial input orders.", ["Unpredictable input distributions", "Competitive programming"], ["Environments requiring strict deterministic traces"], ["General robust in-memory sorting"], ["Non-deterministic behavior between runs"], ["Use seeded RNG for reproducibility"]),
  baseAlgo("bfs", "graph", graphComplexity.bfs, "Level-order graph traversal from a start vertex using a queue.", "BFS explores neighbors level by level from a source node. It uses a queue to process nodes in discovery order. In unweighted graphs, first discovery gives shortest hop count. It scales linearly with vertices plus edges on adjacency lists. It is used in reachability, shortest hops, and layer analysis.", "FIFO exploration guarantees minimal-edge paths in unweighted graphs.", ["Unweighted shortest paths", "Reachability queries", "Level-wise traversal"], ["Weighted shortest-path problems"], ["Social graph hop distance", "Network reachability"], ["Needs queue memory proportional to frontier"], ["Use adjacency lists for O(V + E) traversal"]),
  baseAlgo("dfs", "graph", graphComplexity.dfs, "Depth-first graph traversal via recursion or explicit stack.", "DFS pushes as deep as possible along a branch before backtracking. It naturally supports recursion or manual stack implementations. DFS is foundational for cycle detection, connected components, and topological preprocessing. Runtime is linear in V + E with adjacency lists. It is widely used in graph structure analysis.", "Explore depth first to reveal component and back-edge structure.", ["Connectivity and cycle analysis", "Traversal ordering", "Backtracking frameworks"], ["Unweighted shortest path tasks"], ["Dependency analysis", "Maze exploration"], ["Recursive versions can hit stack limits on deep graphs"], ["Use iterative stack for very deep graphs"]),
  baseAlgo("dijkstra", "graph", graphComplexity.dijkstra, "Single-source shortest paths for non-negative weighted graphs.", "Dijkstra maintains tentative distances from a source vertex. A priority queue always expands the currently closest unsettled node. Each relaxation can improve neighbors' tentative costs. Non-negative weights are required for correctness. It is standard in routing and map navigation engines.", "Greedy extraction of the minimum tentative distance remains globally safe with non-negative edges.", ["Weighted shortest paths", "Routing and navigation"], ["Graphs with negative edge weights"], ["Road-network pathfinding", "Latency minimization"], ["Requires non-negative weights"], ["Use adjacency lists + heap for sparse graphs"]),
  baseAlgo("bellman_ford", "graph", graphComplexity.bellman_ford, "Shortest paths with support for negative edge weights.", "Bellman-Ford relaxes all edges repeatedly for V-1 rounds, progressively improving distance estimates. If a further relaxation is still possible in an extra pass, a negative-weight cycle exists. It is slower than Dijkstra on non-negative graphs but handles negative edges safely. The algorithm is foundational for arbitrage detection and constraint systems.", "Global edge relaxation converges shortest paths while exposing negative cycles.", ["Graphs with negative weights", "Negative-cycle detection", "Constraint graph analysis"], ["Large graphs where only non-negative edges exist"], ["Currency exchange arbitrage", "Difference constraints"], ["O(VE) runtime can be costly for dense graphs"], ["Stop early when an iteration produces no updates"]),
  baseAlgo("topological_sort", "graph", graphComplexity.topological_sort, "Linear ordering of DAG vertices using indegree elimination.", "Topological Sort repeatedly removes nodes with zero indegree and appends them to an output order. Every removal reduces indegree of outgoing neighbors, enabling newly independent nodes. If all vertices are output, the graph is a DAG and the order is valid. If some vertices remain, a cycle exists and no topological order is possible. This algorithm is fundamental in scheduling and dependency resolution.", "Indegree-zero queue processing exposes dependency-safe execution order.", ["Task scheduling", "Build/dependency graphs", "Course prerequisite ordering"], ["Cyclic directed graphs"], ["Compiler pass ordering", "Workflow orchestration"], ["Requires directed acyclic structure"], ["Use cycle checks to explain invalid dependency inputs"]),
  baseAlgo("floyd_warshall", "graph", graphComplexity.floyd_warshall, "All-pairs shortest paths using dynamic programming over intermediates.", "Floyd-Warshall iteratively allows each vertex as an intermediate waypoint. For each (i, j) pair, it checks whether i → k → j improves current distance. This yields all-pairs shortest paths in one cubic pass. It handles negative edges but not negative cycles. It is useful for dense graphs and complete distance matrices.", "Progressively adding intermediate sets transforms local relaxations into global all-pairs optimality.", ["All-pairs shortest path matrices", "Dense graph analysis"], ["Large sparse graphs needing speed"], ["Traffic matrix precomputation", "Graph closure analysis"], ["Cubic runtime can be expensive"], ["Prefer repeated Dijkstra on sparse graphs"]),
  baseAlgo("ford_fulkerson", "graph", graphComplexity.ford_fulkerson, "Max-flow by augmenting paths in a residual network.", "Ford-Fulkerson repeatedly finds source-to-sink augmenting paths. Each path increases flow by its minimum residual capacity. Residual back-edges allow revising earlier flow choices. Edmonds-Karp uses BFS for predictable path selection. It is used in scheduling, bipartite matching, and capacity planning.", "Residual graph updates convert local augmentations into globally increasing feasible flow.", ["Maximum flow and cut problems", "Capacity-limited routing"], ["Very large dense networks with tight latency budgets"], ["Assignment and matching", "Network throughput planning"], ["Can require many augmentations"], ["Use Dinic for higher performance on larger instances"]),
  baseAlgo("graph_coloring", "graph", graphComplexity.graph_coloring, "Assigns colors so adjacent vertices never share the same color.", "Graph coloring commonly uses backtracking with validity checks per assignment. It tries colors for each vertex and backtracks on conflicts. Problem hardness rises quickly with graph size and color limits. Heuristics can prune search significantly. It appears in timetable, register allocation, and frequency assignment tasks.", "Constraint satisfaction with backtracking explores legal color assignments efficiently when pruned.", ["Scheduling conflicts", "Register allocation"], ["Large exact-coloring instances without heuristics"], ["Exam timetable generation", "Frequency planning"], ["NP-hard in general"], ["Order vertices by degree to improve pruning"]),
  baseAlgo("hamiltonian_cycle", "graph", graphComplexity.hamiltonian_cycle, "Backtracking search for a cycle that visits each vertex once.", "Hamiltonian cycle search extends a candidate path one vertex at a time. It ensures adjacency and uniqueness constraints at each step. Dead-end branches are pruned via backtracking. The search is combinatorial and expensive in general. It is useful in route design and graph theory exploration.", "Build candidate tours incrementally and prune invalid partial paths early.", ["Small exact routing problems", "Graph-theory experimentation"], ["Large graphs requiring fast approximate answers"], ["Path/tour feasibility studies"], ["Exponential/factorial growth"], ["Use heuristics or approximations for large instances"]),
  baseAlgo("prim", "graph", graphComplexity.prim, "Minimum spanning tree by growing from a seed vertex.", "Prim starts from any vertex and repeatedly adds the cheapest edge connecting tree to a new node. A min-heap tracks candidate boundary edges efficiently. It builds one connected tree over all reachable vertices. Works very well on dense connected graphs with adjacency structures. It is used for network and infrastructure cost minimization.", "Always extend the current tree with the cheapest frontier edge.", ["MST for connected weighted graphs", "Network design"], ["Disconnected graphs without handling components"], ["Cable and road planning"], ["Requires weighted graph representation"], ["Use adjacency list + heap for scalable performance"]),
  baseAlgo("kruskal", "graph", graphComplexity.kruskal, "Minimum spanning tree by sorted edges + union-find cycle checks.", "Kruskal sorts edges by weight and scans from lightest to heaviest. It adds an edge only if it connects two different components. Union-find efficiently detects whether an addition forms a cycle. This yields an MST for each connected component. It is strong for sparse graphs and edge-list workflows.", "Global edge ordering plus DSU cycle checks yields a minimal forest.", ["Sparse weighted graphs", "Edge-list pipelines"], ["Very dense graphs where Prim with matrix may be simpler"], ["Clustering and segmentation", "Network wiring"], ["Sorting edges dominates runtime"], ["Use path compression + union by rank"]),
  baseAlgo("tsp_branch_bound", "graph", graphComplexity.tsp_branch_bound, "Exact TSP search with pruning via lower bounds.", "Branch-and-bound TSP explores permutations of city visits as a search tree. It computes lower bounds for partial tours to prune impossible winners. The best complete tour so far tightens pruning as search proceeds. Strong bounds can drastically cut explored branches. It is useful for exact solutions on small to medium instances.", "Bound quality controls how aggressively the exponential search tree shrinks.", ["Small/medium exact TSP", "Benchmarking approximate TSP methods"], ["Large city counts requiring real-time response"], ["Route optimization studies"], ["Exponential worst-case complexity"], ["Use nearest-neighbor initial bound to improve pruning"]),
  baseAlgo("knapsack_01", "dp", dpComplexity.knapsack_01, "DP optimization choosing items under a capacity limit.", "0/1 Knapsack builds a table where each state considers include-vs-exclude of the next item. Value transitions depend on remaining capacity. The final state gives maximum achievable value under capacity W. Runtime grows with both number of items and capacity. It is used in budgeting, packing, and resource allocation.", "Each item is a binary decision propagated through capacity states.", ["Budgeted selection", "Cargo/resource planning"], ["Huge capacities with strict memory limits"], ["Portfolio-like constrained choice problems"], ["Pseudo-polynomial dependency on capacity"], ["Use 1D DP when only final value is needed"]),
  baseAlgo("lcs", "dp", dpComplexity.lcs, "DP for longest subsequence common to two strings.", "LCS compares string prefixes and stores best subsequence length per pair. Matching characters extend diagonal states, mismatches take max of top/left states. The completed table encodes both length and reconstruction paths. Complexity is quadratic in two string lengths. It powers diff tools and sequence analysis.", "Optimal subsequences emerge from overlapping prefix subproblems.", ["Version/diff analysis", "Sequence similarity"], ["Very long strings without optimization"], ["Bioinformatics alignment", "Document comparison"], ["O(nm) memory/time can be large"], ["Use Hirschberg-style optimization for lower memory"]),
  baseAlgo("edit_distance", "dp", dpComplexity.edit_distance, "Levenshtein distance using insertion, deletion, and replacement costs.", "Edit Distance fills a dynamic-programming table where each cell stores the minimum edits needed to convert one prefix into another. Every state considers insert, delete, and replace transitions. Matching characters carry diagonal cost unchanged. This formulation is robust for fuzzy matching and typo correction. It can be memory-optimized with rolling rows.", "Minimum edit cost emerges from local insert/delete/replace transitions over prefix pairs.", ["Spell correction", "Approximate matching", "NLP normalization"], ["Very long strings when quadratic memory is unacceptable"], ["Diff scoring", "DNA/protein similarity baselines"], ["Standard DP uses O(nm) memory"], ["Use rolling arrays when full path reconstruction is unnecessary"]),
  baseAlgo("longest_common_substring", "dp", dpComplexity.longest_common_substring, "DP to find the longest contiguous substring shared by two strings.", "Longest Common Substring DP stores contiguous match lengths: if characters match, extend diagonal by 1; otherwise reset to 0. Tracking the maximum cell value gives the best substring length, and its ending index reconstructs the substring. Unlike subsequence DP, mismatches cannot carry forward partial values. This makes contiguity explicit and useful for local similarity detection. It is commonly used in plagiarism heuristics and near-duplicate detection.", "Contiguous-match lengths reset on mismatch, so only uninterrupted runs survive.", ["Near-duplicate text detection", "Local similarity scoring"], ["Very large strings without memory optimization"], ["Plagiarism and overlap analysis", "DNA local motif matching"], ["Quadratic DP table for long strings"], ["Use rolling rows when only length is required"]),
  baseAlgo("matrix_chain_multiplication", "dp", dpComplexity.matrix_chain_multiplication, "DP to find optimal parenthesization minimizing scalar multiplications.", "Matrix-chain DP evaluates subchain costs for every interval length. For each interval, it checks every split point and stores the cheapest cost. Reuse of overlapping subproblems avoids redundant recalculation. Output gives minimal multiplication count, and split table can reconstruct order. It is used in compilers and query optimizers.", "Optimal global order comes from optimal interval split composition.", ["Matrix multiplication planning", "Expression optimization"], ["Tiny chains where brute force is simpler"], ["Database/query plan optimization"], ["Cubic runtime as chain length grows"], ["Store split points to reconstruct parenthesization"]),
  baseAlgo("naive", "string", stringComplexity.naive, "Brute-force pattern matching by checking every alignment.", "Naive matching slides the pattern one position at a time over the text. At each window, it compares characters left to right until mismatch or full match. Simplicity makes it easy to implement and reason about. It can be expensive on long repetitive text. It is useful as a baseline and teaching reference.", "Try every alignment directly; correctness is immediate though not always fast.", ["Small strings", "Baseline correctness checks"], ["Large repetitive corpora"], ["Introductory string matching demos"], ["Can perform many redundant comparisons"], ["Prefer KMP/Rabin-Karp for larger workloads"]),
  baseAlgo("kmp", "string", stringComplexity.kmp, "Linear-time pattern matching using LPS failure function.", "KMP preprocesses the pattern into an LPS array capturing proper prefix/suffix matches. During text scan, mismatches jump pattern index without rewinding text index. This avoids re-checking many characters. Runtime is linear in text + pattern length. It is ideal for repeated searches over long strings.", "Failure links reuse previous match information instead of restarting comparisons.", ["Long text search", "Repeated pattern queries"], ["Very short strings where setup overhead dominates"], ["IDE search", "DNA motif scanning"], ["Needs extra preprocessing for each pattern"], ["Cache and reuse LPS for repeated scans"]),
  baseAlgo("boyer_moore", "string", stringComplexity.boyer_moore, "Right-to-left pattern matching with large mismatch jumps.", "Boyer-Moore compares pattern characters from right to left against the current text window. On mismatch, it uses preprocessed character tables to jump the window forward by more than one position when possible. This often skips large parts of the text in practical workloads. Worst-case remains quadratic, but real-world performance is typically excellent for longer patterns. It is heavily used in text editors and search utilities.", "Mismatch-driven jumps skip many windows, reducing unnecessary comparisons.", ["Large text corpora", "Fast practical substring search"], ["Very short patterns where setup overhead dominates"], ["Editor/search tool engines", "Log scanning"], ["Worst-case can still degrade to O(nm)"], ["Combine bad-character and good-suffix heuristics"]),
  baseAlgo("z_algorithm", "string", stringComplexity.z_algorithm, "Linear-time pattern matching using Z-values over concatenated strings.", "Z Algorithm computes, for each position, the longest substring matching the global prefix. For matching, it runs on pattern + separator + text and checks where Z equals pattern length. Reusing the active Z-box avoids redundant character comparisons. It is elegant for prefix-heavy string analytics and exact search.", "Prefix-match lengths at each index directly encode pattern occurrences.", ["Exact pattern matching", "Prefix query workloads"], ["Extremely memory-constrained environments"], ["Competitive programming", "String preprocessing utilities"], ["Requires auxiliary Z-array over concatenated string"], ["Choose a separator not present in either input string"]),
  baseAlgo("rabin_karp", "string", stringComplexity.rabin_karp, "Rolling-hash based matching with verification on hash hits.", "Rabin-Karp computes hash of pattern and rolling hash of each text window. Most windows are rejected quickly by hash mismatch. Hash collisions are verified with direct character comparison. Expected runtime is linear with good hash parameters. It is effective for multi-pattern and plagiarism detection scenarios.", "Hash windows first, verify only candidate matches.", ["Large text fingerprinting", "Multiple pattern search"], ["Adversarial collision-prone hash settings"], ["Plagiarism and substring indexing"], ["Collision handling can add verification cost"], ["Use larger modulus or double hashing"]),
  baseAlgo("huffman_coding", "string", stringComplexity.huffman_coding, "Builds an optimal prefix code tree from symbol frequencies.", "Huffman coding first counts frequencies for each symbol in the input text. A min-heap repeatedly merges the two least frequent nodes to build a binary tree bottom-up. Left edges represent bit 0 and right edges represent bit 1, producing prefix-free codes for all symbols. Frequent symbols get shorter bit strings, reducing total encoded size. The resulting codebook is then used to transform the input text into a compressed bitstream.", "Greedy merging of least-frequent symbols yields an optimal prefix code.", ["Lossless text compression", "Entropy coding stages"], ["Tiny inputs where codebook overhead dominates"], ["File compressors", "Data transmission with prefix codes"], ["Requires sharing/storing the codebook for decoding"], ["Use canonical Huffman coding for compact codebook storage"])
];

export const DATA_STRUCTURE_CATALOG = [
  baseAlgo("array_stack", "stack", structureComplexity.array_stack, "LIFO stack implemented with fixed-size array storage.", "Array stack stores items in contiguous memory and tracks the top index. Push and pop modify only the tail position, so they are constant-time. Overflow occurs when capacity is reached and underflow occurs when popping from empty stack.", "LIFO access means last inserted element is processed first.", ["Undo history", "Expression evaluation", "Backtracking"], ["Unknown/unbounded workloads without resizing"], ["Call stack modeling", "DFS-like workflows"], ["Fixed capacity may overflow"], ["Use linked stack when size is unpredictable"]),
  baseAlgo("linked_stack", "stack", structureComplexity.linked_stack, "LIFO stack using linked nodes for dynamic growth.", "Linked-list stack keeps top at head or tail pointer and allocates nodes on demand. Push/pop still operate at the same end in O(1), while dynamic memory avoids fixed-capacity overflow.", "Dynamic node allocation trades memory overhead for flexible capacity.", ["Unbounded push/pop streams", "Dynamic workloads"], ["Strict memory overhead constraints"], ["Compiler/interpreter stacks"], ["Pointer overhead per element"], ["Use pooled nodes for lower allocation overhead"]),
  baseAlgo("linear_queue", "queue", structureComplexity.linear_queue, "FIFO queue where enqueue happens at rear and dequeue at front.", "Linear queue serves elements in arrival order. Without circular indexing, repeated dequeues can leave unusable front slots unless elements are shifted or indices are reset.", "FIFO ordering preserves request arrival fairness.", ["Task buffering", "Scheduling"], ["High-throughput cyclic traffic without circular logic"], ["Printer spooling", "Simple request queues"], ["Can waste capacity in naive implementations"], ["Prefer circular queue for fixed arrays"]),
  baseAlgo("circular_queue", "queue", structureComplexity.circular_queue, "FIFO queue with wrap-around indexing.", "Circular queue uses modulo arithmetic for front/rear pointers to reuse freed slots. It avoids wasted capacity found in linear queue implementations and keeps enqueue/dequeue O(1).", "Wrap-around indexing maintains fixed-capacity efficiency.", ["Streaming buffers", "Round-robin systems"], ["Unknown growth where resizing is required"], ["Embedded ring buffers"], ["Needs careful full/empty pointer logic"], ["Track size to disambiguate full vs empty"]),
  baseAlgo("deque", "queue", structureComplexity.deque, "Double-ended queue supporting insert/delete at both ends.", "Deque generalizes queue behavior by allowing front and rear updates. It can emulate both stack and queue operations depending on chosen end actions.", "Two-ended operations provide flexible access patterns.", ["Sliding window algorithms", "Task prioritization by urgency"], ["Random middle updates"], ["Monotonic queue optimizations"], ["No fast arbitrary middle insert"], ["Choose operation discipline to avoid logic drift"]),
  baseAlgo("priority_queue", "queue", structureComplexity.priority_queue, "Queue where item priority decides removal order.", "Priority queue removes the highest-priority item first rather than the oldest item. Heap-backed implementations keep insertion and deletion logarithmic.", "Order is based on priority, not arrival time.", ["Dijkstra/A*", "Schedulers", "Event simulation"], ["Strict FIFO fairness requirements"], ["Operating-system ready queues"], ["Priority inversion if policy is poor"], ["Define clear tie-breaking rules"]),
  baseAlgo("singly_linked_list", "linked_list", structureComplexity.singly_linked_list, "Linear node chain with one next pointer per node.", "Singly linked list is efficient for head insert/delete but requires traversal for random position access. It supports dynamic size without contiguous memory.", "Pointer-based chaining enables cheap local edits.", ["Frequent head updates", "Memory-fragmented environments"], ["Random indexing heavy workloads"], ["Adjacency representation", "Symbol tables"], ["No backward traversal"], ["Maintain tail pointer for faster end inserts"]),
  baseAlgo("doubly_linked_list", "linked_list", structureComplexity.doubly_linked_list, "Linked list with next and previous pointers.", "Doubly linked list supports bidirectional traversal and easier deletion when node reference is known. It uses extra memory per node for the prev pointer.", "Two-way links make local reordering easier.", ["LRU cache internals", "Browser history"], ["Very tight memory budgets"], ["Deque internals", "Playlist editors"], ["Higher per-node memory overhead"], ["Use sentinel nodes to simplify boundary cases"]),
  baseAlgo("circular_singly_linked_list", "linked_list", structureComplexity.circular_singly_linked_list, "Singly linked list whose tail points to head.", "Circular singly linked lists eliminate null tail termination and are useful in cyclic traversal scenarios. Operations must carefully avoid infinite loops during traversal.", "Tail-to-head link naturally models cyclic sequencing.", ["Round-robin scheduling", "Josephus-style problems"], ["Complex random deletions without predecessor"], ["Token ring simulations"], ["Traversal termination needs explicit counters"], ["Track size and tail pointer for safe iteration"]),
  baseAlgo("circular_doubly_linked_list", "linked_list", structureComplexity.circular_doubly_linked_list, "Doubly linked list with circular head-tail linkage.", "Circular doubly linked list supports two-way cyclic traversal and O(1) local insert/delete with node references. It is powerful but pointer updates must stay consistent.", "Bidirectional cyclic links optimize rotational navigation.", ["Media playlists", "OS process rings"], ["Simple linear datasets"], ["Rotation-heavy interfaces"], ["Pointer maintenance complexity"], ["Use helper routines for link updates"]),
  baseAlgo("binary_tree", "tree", structureComplexity.binary_tree, "General binary tree with up to two children per node.", "Binary tree organizes hierarchical data with left/right relationships. Traversal order (in/pre/post/level) determines how structure is observed.", "Traversal choice changes interpretation of the same structure.", ["Expression trees", "Hierarchy modeling"], ["Sorted lookup without BST property"], ["Syntax trees", "File hierarchies"], ["Search may degrade to O(n)"], ["Choose specialized tree variants for lookup-heavy tasks"]),
  baseAlgo("binary_search_tree", "tree", structureComplexity.binary_search_tree, "Ordered binary tree enabling efficient lookup in balanced cases.", "BST keeps left subtree values smaller and right subtree values larger than root. Insert/search/delete depend on tree height and degrade when skewed.", "Ordering invariant enables directed search paths.", ["Ordered sets", "Range queries"], ["Highly sorted insertion streams without balancing"], ["Dictionary-like in-memory indexes"], ["Can become skewed and slow"], ["Use AVL/Red-Black when balance is critical"]),
  baseAlgo("avl_tree", "tree", structureComplexity.avl_tree, "Self-balancing BST maintained via rotations.", "AVL tree tracks height differences and performs rotations after updates to keep balance factor in range. This guarantees logarithmic search/insert/delete complexity.", "Local rotations preserve order while restoring global balance.", ["Search-heavy dynamic sets", "Latency-sensitive lookups"], ["Write-heavy scenarios where rebalancing cost dominates"], ["In-memory symbol tables"], ["More rotation overhead on updates"], ["Batch inserts when possible to reduce rebalance churn"]),
  baseAlgo("b_tree", "tree", structureComplexity.b_tree, "Multi-way balanced search tree storing multiple keys per node.", "B-Tree keeps keys sorted inside each node and rebalances by splitting/merging so tree height stays low. This minimizes path length for insert/search/delete and is a core index structure in storage systems.", "High branching factor keeps depth small, so operations stay logarithmic with fewer levels.", ["Database indexes", "File-system style node indexing"], ["Tiny in-memory sets where simple BST is enough"], ["Block/disk-oriented indexing", "Balanced multi-key search trees"], ["Node split/merge logic is more complex than BST"], ["Tune tree order to block/page size for better locality"]),
  baseAlgo("b_plus_tree", "tree", structureComplexity.b_plus_tree, "B-tree variant where all data keys live in linked leaf nodes.", "B+ Tree stores separator keys in internal nodes while actual records/keys are kept in leaves. Leaves are linked left-to-right, enabling efficient range scans and ordered iteration while preserving logarithmic point lookup.", "Keep navigation in internal levels, keep data in linked leaves for fast sequential access.", ["Range queries", "Ordered scans in databases"], ["Workloads that only need tiny point lookups"], ["SQL index structures", "Pagination and interval lookup"], ["Extra pointer maintenance for leaf links"], ["Choose fan-out based on storage page size and key width"]),
  baseAlgo("min_heap", "tree", structureComplexity.min_heap, "Complete binary tree where each parent is <= its children.", "Min heap supports fast access to the minimum element at root. Insert and delete operations restore heap property via sift operations. Heapify builds a heap in linear time.", "Partial ordering is enough for priority operations.", ["Priority queues", "Top-k smallest extraction"], ["Full sorted traversal requirements"], ["Scheduler queues", "Streaming minimum tracking"], ["No fast arbitrary search"], ["Use indexed heap when key updates are frequent"]),
  baseAlgo("max_heap", "tree", structureComplexity.max_heap, "Complete binary tree where each parent is >= its children.", "Max heap mirrors min heap for maximum-at-root access. It is ideal when repeatedly extracting the largest item is required.", "Root always holds current global maximum.", ["Top-k largest extraction", "Heap sort internals"], ["Exact sorted iteration without repeated pops"], ["Real-time leaderboard updates"], ["No efficient ordered traversal without extra work"], ["Heapify input arrays for linear-time initialization"]),
  baseAlgo("trie", "tree", structureComplexity.trie, "Prefix tree for string keys.", "Trie stores characters along edges from root to terminal word nodes. Search and prefix queries run in time proportional to key length, independent of number of stored words.", "Character-level branching makes prefix lookup natural.", ["Autocomplete", "Dictionary lookups", "Prefix filtering"], ["Very sparse alphabets with large memory constraints"], ["Spell-check suggestions", "Command completion"], ["Memory overhead can be high"], ["Compress single-child chains using radix trie optimization"])
];

export const ANALYZER_ALGORITHM_CATALOG = [...ALGORITHM_CATALOG, ...ANALYZER_STUDY_CATALOG, ...DATA_STRUCTURE_CATALOG];

export const getAlgorithmByName = (name) => ALGORITHM_CATALOG.find((algo) => algo.name === name) || null;

export const getAnalyzerAlgorithmByName = (name) => ANALYZER_ALGORITHM_CATALOG.find((algo) => algo.name === name) || null;

export const getAlgorithmsByCategory = (category) => ALGORITHM_CATALOG.filter((algo) => algo.category === category);

export const enrichAlgorithm = (algorithm) => {
  const local = getAlgorithmByName(algorithm.name);
  if (!local) {
    return {
      ...algorithm,
      display_name: getAlgorithmDisplayName(algorithm.name),
      howItWorks: "Detailed explanation is unavailable for this algorithm.",
      keyInsight: "Core insight unavailable.",
      whenToUse: [],
      whenToAvoid: [],
      nMeaning: {
        best_time: "See complexity variables in algorithm documentation.",
        average_time: "See complexity variables in algorithm documentation.",
        worst_time: "See complexity variables in algorithm documentation.",
        space: "See complexity variables in algorithm documentation."
      },
      codeByLanguage: getCodeBundle(algorithm.name)
    };
  }
  return {
    ...local,
    ...algorithm,
    display_name: local.display_name,
    nMeaning: local.nMeaning,
    howItWorks: local.howItWorks,
    keyInsight: local.keyInsight,
    whenToUse: local.whenToUse,
    whenToAvoid: local.whenToAvoid,
    codeByLanguage: local.codeByLanguage
  };
};

export const enrichAlgorithms = (algorithms) => {
  if (!algorithms || algorithms.length === 0) {
    return ALGORITHM_CATALOG;
  }
  return algorithms.map(enrichAlgorithm);
};

export const getCategoryBadgeClass = (category) => {
  if (category === "sorting") return "border-emerald-300/40 bg-emerald-400/20 text-emerald-100";
  if (category === "search") return "border-cyan-300/40 bg-cyan-400/20 text-cyan-100";
  if (category === "divide_conquer") return "border-indigo-300/40 bg-indigo-400/20 text-indigo-100";
  if (category === "greedy") return "border-amber-300/40 bg-amber-400/20 text-amber-100";
  if (category === "graph") return "border-amber-300/40 bg-amber-400/20 text-amber-100";
  if (category === "dp") return "border-blue-300/40 bg-blue-400/20 text-blue-100";
  if (category === "backtracking") return "border-rose-300/40 bg-rose-400/20 text-rose-100";
  if (category === "string") return "border-pink-300/40 bg-pink-400/20 text-pink-100";
  if (category === "complexity") return "border-slate-300/40 bg-slate-200/10 text-slate-100";
  if (category === "stack") return "border-orange-300/40 bg-orange-400/20 text-orange-100";
  if (category === "queue") return "border-cyan-300/40 bg-cyan-400/20 text-cyan-100";
  if (category === "linked_list") return "border-purple-300/40 bg-purple-400/20 text-purple-100";
  if (category === "tree") return "border-lime-300/40 bg-lime-400/20 text-lime-100";
  return "border-white/20 bg-white/5 text-sky/70";
};

export const attachStepDescriptions = (category, algorithmName, steps = []) => {
  return steps.map((step, index) => ({
    ...step,
    description: step.description || buildStepDescription(category, algorithmName, step, index)
  }));
};

export const buildStepDescription = (category, algorithmName, step, index) => {
  const stepNo = index + 1;
  if (category === "sorting") {
    const left = step?.indices?.[0];
    const right = step?.indices?.[1];
    const arr = step?.array || [];
    const metaBits = [];
    if (step?.gap !== undefined) metaBits.push(`gap=${step.gap}`);
    if (Array.isArray(step?.range) && step.range.length >= 2) metaBits.push(`range=${step.range[0]}..${step.range[1]}`);
    const metaSuffix = metaBits.length ? ` (${metaBits.join(", ")})` : "";

    const fmtIndex = (idx) => {
      if (!Number.isInteger(idx)) return "index ?";
      const value = arr[idx];
      if (value === undefined) return `index ${idx}`;
      return `index ${idx} (val=${value})`;
    };

    if (step?.type === "pivot") {
      const pivotIndex = left;
      const pivotValue = step?.pivot ?? (Number.isInteger(pivotIndex) ? arr[pivotIndex] : undefined);
      return `Step ${stepNo}: Chose pivot at index ${Number.isInteger(pivotIndex) ? pivotIndex : "?"} (val=${pivotValue ?? "-"}).`;
    }
    if (step?.type === "partition") {
      return `Step ${stepNo}: Partitioned array; pivot placed at index ${Number.isInteger(left) ? left : "?"}.`;
    }
    if (step?.type === "swap") {
      return `Step ${stepNo}: Compared ${fmtIndex(left)} and ${fmtIndex(right)} → swapped.${metaSuffix}`;
    }
    if (step?.type === "compare") {
      return `Step ${stepNo}: Compared ${fmtIndex(left)} and ${fmtIndex(right)}.${metaSuffix}`;
    }
    if (step?.type === "select") {
      return `Step ${stepNo}: Selected ${fmtIndex(left)} as the current candidate.${metaSuffix}`;
    }
    if (step?.type === "gap") {
      return `Step ${stepNo}: Continued pass with gap ${step?.gap ?? "-"}.`;
    }
    if (step?.type === "shift") {
      return `Step ${stepNo}: Shifted value toward index ${Number.isInteger(right) ? right : "?"}.${metaSuffix}`;
    }
    if (step?.type === "insert") {
      return `Step ${stepNo}: Inserted value at index ${Number.isInteger(left) ? left : "?"}.${metaSuffix}`;
    }
    if (step?.type === "merge") {
      return `Step ${stepNo}: Merged value ${Number.isInteger(left) ? arr[left] : "-"} into index ${Number.isInteger(left) ? left : "?"}.${metaSuffix}`;
    }
    if (step?.type === "count") {
      return `Step ${stepNo}: Counted value ${step?.value} into bucket ${step?.bucket}.`;
    }
    if (step?.type === "prefix") {
      return `Step ${stepNo}: Built prefix sum at bucket ${step?.bucket}.`;
    }
    if (step?.type === "place") {
      const source = Number.isInteger(step?.source_index) ? ` from source index ${step.source_index}` : "";
      return `Step ${stepNo}: Placed value ${step?.value}${source} at sorted index ${Number.isInteger(left) ? left : "?"}.`;
    }
    if (step?.type === "write") {
      return `Step ${stepNo}: Wrote sorted value ${arr[left]} at index ${left}.`;
    }
    return `Step ${stepNo}: ${step?.type || "Updated sorting state"}.`;
  }

  if (category === "search") {
    const array = step?.array || [];
    const mid = Number.isInteger(step?.mid) && step.mid >= 0 ? step.mid : null;
    const current = Number.isInteger(step?.currentIndex) ? step.currentIndex : null;

    if (algorithmName === "binary_search") {
      if (step?.type === "compare") {
        return `Step ${stepNo}: Compare target ${step?.target} with middle index ${mid} (value ${mid !== null ? array[mid] : "-"}) in range ${step?.low}..${step?.high}.`;
      }
      if (step?.type === "move_left") {
        return `Step ${stepNo}: Target is smaller, so discard the right half and continue left.`;
      }
      if (step?.type === "move_right") {
        return `Step ${stepNo}: Target is larger, so discard the left half and continue right.`;
      }
      if (step?.type === "found") {
        return `Step ${stepNo}: Found target ${step?.target} at index ${step?.result_index}.`;
      }
      if (step?.type === "not_found") {
        return `Step ${stepNo}: Search window is empty, so the target is not present.`;
      }
      return `Step ${stepNo}: Updated binary-search state.`;
    }

    if (step?.type === "initialize") {
      return `Step ${stepNo}: Start with the first value as both current minimum and maximum.`;
    }
    if (step?.type === "inspect") {
      return `Step ${stepNo}: Inspect value ${current !== null ? array[current] : "-"} at index ${current}.`;
    }
    if (step?.type === "new_min") {
      return `Step ${stepNo}: Found a new minimum at index ${step?.minIndex} with value ${array[step?.minIndex]}.`;
    }
    if (step?.type === "new_max") {
      return `Step ${stepNo}: Found a new maximum at index ${step?.maxIndex} with value ${array[step?.maxIndex]}.`;
    }
    if (step?.type === "result") {
      return `Step ${stepNo}: Final answer is min=${step?.minValue} and max=${step?.maxValue}.`;
    }
    return `Step ${stepNo}: Updated search state.`;
  }

  if (category === "graph") {
    if (algorithmName === "graph_coloring") {
      const node = step?.node ?? "-";
      const color = step?.color ?? "-";
      if (step?.type === "try") {
        return `Step ${stepNo}: Try assigning color c${color} to node ${node}.`;
      }
      if (step?.type === "assign") {
        return `Step ${stepNo}: Assigned color c${color} to node ${node}.`;
      }
      if (step?.type === "conflict") {
        return `Step ${stepNo}: Conflict - node ${node} with color c${color} clashes with neighbor ${step?.conflict_with ?? "?"}.`;
      }
      if (step?.type === "backtrack") {
        return `Step ${stepNo}: Backtracked from node ${node}; removed color c${color}.`;
      }
      return `Step ${stepNo}: Updated graph coloring state.`;
    }

    if (step?.type === "iteration") {
      return `Step ${stepNo}: Completed relaxation pass ${step?.iteration} (${step?.updated ? "distances updated" : "no changes"}).`;
    }
    if (step?.type === "negative_cycle") {
      return `Step ${stepNo}: Detected a negative-weight cycle through edge ${step?.edge?.from} -> ${step?.edge?.to}.`;
    }
    if (step?.type === "relax" && algorithmName === "bellman_ford") {
      return `Step ${stepNo}: Relaxed edge ${step?.edge?.from} -> ${step?.edge?.to}, updated distance for ${step?.current}.`;
    }
    const current = step?.current ?? step?.node ?? "-";
    const from = step?.edge?.from ?? step?.from ?? "-";
    const to = step?.edge?.to ?? step?.to ?? current;
    const queue = step?.queue || step?.stack || [];
    const structure = step?.queue ? "queue" : step?.stack ? "stack" : "frontier";
    return `Step ${stepNo}: Visited node ${to} from ${from} → ${structure}: ${Array.isArray(queue) ? queue.join(", ") : "updated"}.`;
  }

  if (category === "dp") {
    const r = step?.row;
    const c = step?.col;
    const v = step?.value;
    if (algorithmName === "knapsack_01") {
      return `Step ${stepNo}: dp[${r}][${c}] updated to ${v} (${step?.choice === "take" ? "item included" : "item excluded"}).`;
    }
    if (algorithmName === "edit_distance") {
      return `Step ${stepNo}: dp[${r}][${c}] = ${v} via ${step?.action || "transition"}.`;
    }
    if (algorithmName === "matrix_chain_multiplication") {
      return `Step ${stepNo}: dp[${r}][${c}] checked with split k=${step?.split}; best cost now ${v}.`;
    }
    return `Step ${stepNo}: dp[${r}][${c}] = ${v} (${step?.action === "match" ? "character match" : "max of neighbors"}).`;
  }

  if (category === "string") {
    if (algorithmName === "huffman_coding") {
      if (step?.type === "frequency") {
        return `Step ${stepNo}: Counted '${step?.char === " " ? "space" : step?.char}' with frequency ${step?.frequency}.`;
      }
      if (step?.type === "sort") {
        return `Step ${stepNo}: Sorted symbols by ascending frequency to initialize the min-heap.`;
      }
      if (step?.type === "merge") {
        return `Step ${stepNo}: Merged ${step?.left?.label} and ${step?.right?.label} into ${step?.parent?.label}.`;
      }
      if (step?.type === "code") {
        return `Step ${stepNo}: Assigned code ${step?.code} to '${step?.char === " " ? "space" : step?.char}'.`;
      }
      if (step?.type === "complete") {
        return `Step ${stepNo}: Encoding complete (${step?.encoded_bits}/${step?.original_bits} bits, ratio ${step?.compression_ratio}).`;
      }
      return `Step ${stepNo}: Updated Huffman coding state.`;
    }

    const ti = step?.text_index ?? step?.index ?? 0;
    const pi = step?.pattern_index ?? 0;
    const t = step?.text?.[ti];
    const p = step?.pattern?.[pi];
    if (step?.type === "match") {
      return `Step ${stepNo}: ✓ Match found at index ${step?.index}.`;
    }
    if (step?.match) {
      return `Step ${stepNo}: text[${ti}]='${t}' matched pattern[${pi}]='${p}' → pointers advance.`;
    }
    return `Step ${stepNo}: text[${ti}]='${t ?? "-"}' mismatched pattern[${pi}]='${p ?? "-"}' → shift window.`;
  }

  if (category === "backtracking") {
    if (step?.type === "try") {
      return `Step ${stepNo}: Try placing a queen at row ${step?.row + 1}, column ${step?.col + 1}.`;
    }
    if (step?.type === "conflict") {
      return `Step ${stepNo}: Placement at row ${step?.row + 1}, column ${step?.col + 1} is invalid because of a ${step?.reason} conflict.`;
    }
    if (step?.type === "place") {
      return `Step ${stepNo}: Place a queen at row ${step?.row + 1}, column ${step?.col + 1} and recurse to the next row.`;
    }
    if (step?.type === "backtrack") {
      return `Step ${stepNo}: Backtrack from row ${step?.row + 1}, column ${step?.col + 1} and try the next column.`;
    }
    if (step?.type === "complete") {
      return `Step ${stepNo}: A full non-attacking queen placement has been found.`;
    }
    return `Step ${stepNo}: Updated backtracking state.`;
  }

  if (["stack", "queue", "linked_list", "tree"].includes(category)) {
    const op = step?.operation || step?.type || "operation";
    const msg = step?.message || "state updated";
    if (step?.status === "error") {
      return `Step ${stepNo}: ${op} failed -> ${msg}`;
    }
    return `Step ${stepNo}: ${op} -> ${msg}`;
  }

  return `Step ${stepNo}: Updated algorithm state.`;
};

function getCodeBundle(name) {
  return {
    python: getPythonCode(name),
    javascript: getJsCode(name),
    c: getCCode(name),
    cpp: getCppCode(name),
    java: getJavaCode(name),
    go: getGoCode(name)
  };
}

function getPythonCode(name) {
  const code = {
    bubble_sort: `def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        swapped = False\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n                swapped = True\n        if not swapped:\n            break\n    return arr`,
    cocktail_sort: `def cocktail_sort(arr):\n    start = 0\n    end = len(arr) - 1\n    swapped = True\n\n    while swapped:\n        swapped = False\n\n        for i in range(start, end):\n            if arr[i] > arr[i + 1]:\n                arr[i], arr[i + 1] = arr[i + 1], arr[i]\n                swapped = True\n\n        if not swapped:\n            break\n\n        swapped = False\n        end -= 1\n\n        for i in range(end, start, -1):\n            if arr[i - 1] > arr[i]:\n                arr[i - 1], arr[i] = arr[i], arr[i - 1]\n                swapped = True\n\n        start += 1\n\n    return arr`,
    comb_sort: `def comb_sort(arr):\n    gap = len(arr)\n    shrink = 1.3\n    swapped = True\n\n    while gap > 1 or swapped:\n        gap = int(gap / shrink)\n        if gap < 1:\n            gap = 1\n\n        swapped = False\n        for i in range(0, len(arr) - gap):\n            j = i + gap\n            if arr[i] > arr[j]:\n                arr[i], arr[j] = arr[j], arr[i]\n                swapped = True\n\n    return arr`,
    gnome_sort: `def gnome_sort(arr):\n    i = 0\n    while i < len(arr):\n        if i == 0 or arr[i] >= arr[i - 1]:\n            i += 1\n        else:\n            arr[i], arr[i - 1] = arr[i - 1], arr[i]\n            i -= 1\n    return arr`,
    counting_sort: `def counting_sort(arr):\n    if not arr:\n        return []\n    lo, hi = min(arr), max(arr)\n    offset = -lo if lo < 0 else 0\n    counts = [0] * (hi + offset + 1)\n    for value in arr:\n        counts[value + offset] += 1\n    for i in range(1, len(counts)):\n        counts[i] += counts[i - 1]\n    out = [0] * len(arr)\n    for i in range(len(arr) - 1, -1, -1):\n        value = arr[i]\n        idx = value + offset\n        counts[idx] -= 1\n        out[counts[idx]] = value\n    return out`,
    selection_sort: `def selection_sort(arr):\n    for i in range(len(arr)):\n        m = i\n        for j in range(i + 1, len(arr)):\n            if arr[j] < arr[m]:\n                m = j\n        arr[i], arr[m] = arr[m], arr[i]\n    return arr`,
    insertion_sort: `def insertion_sort(arr):\n    for i in range(1, len(arr)):\n        key = arr[i]\n        j = i - 1\n        while j >= 0 and arr[j] > key:\n            arr[j + 1] = arr[j]\n            j -= 1\n        arr[j + 1] = key\n    return arr`,
    merge_sort: `def merge_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    m = len(arr) // 2\n    left = merge_sort(arr[:m])\n    right = merge_sort(arr[m:])\n    out = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            out.append(left[i]); i += 1\n        else:\n            out.append(right[j]); j += 1\n    return out + left[i:] + right[j:]`,
    quick_sort: `def quick_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr)//2]\n    left = [x for x in arr if x < pivot]\n    mid = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quick_sort(left) + mid + quick_sort(right)`,
    heap_sort: `import heapq\ndef heap_sort(arr):\n    h = list(arr)\n    heapq.heapify(h)\n    return [heapq.heappop(h) for _ in range(len(h))]`,
    radix_sort: `def radix_sort(arr):\n    exp = 1\n    mx = max(arr) if arr else 0\n    out = list(arr)\n    while mx // exp > 0:\n        cnt = [0] * 10\n        tmp = [0] * len(out)\n        for v in out:\n            cnt[(v // exp) % 10] += 1\n        for i in range(1, 10):\n            cnt[i] += cnt[i - 1]\n        for i in range(len(out) - 1, -1, -1):\n            d = (out[i] // exp) % 10\n            cnt[d] -= 1\n            tmp[cnt[d]] = out[i]\n        out = tmp\n        exp *= 10\n    return out`,
    randomized_quick_sort: `import random\ndef randomized_quick_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = random.choice(arr)\n    left = [x for x in arr if x < pivot]\n    mid = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return randomized_quick_sort(left) + mid + randomized_quick_sort(right)`,
    bfs: `from collections import deque\ndef bfs(graph, start):\n    q = deque([start]); vis = {start}; order = []\n    while q:\n        u = q.popleft(); order.append(u)\n        for v in graph.get(u, []):\n            if v not in vis:\n                vis.add(v); q.append(v)\n    return order`,
    dfs: `def dfs(graph, start):\n    vis, order = set(), []\n    def go(u):\n        vis.add(u); order.append(u)\n        for v in graph.get(u, []):\n            if v not in vis:\n                go(v)\n    go(start)\n    return order`,
    dijkstra: `import heapq\ndef dijkstra(graph, s):\n    dist = {u: float('inf') for u in graph}; dist[s] = 0\n    pq = [(0, s)]\n    while pq:\n        d, u = heapq.heappop(pq)\n        if d != dist[u]:\n            continue\n        for v, w in graph.get(u, []):\n            nd = d + w\n            if nd < dist.get(v, float('inf')):\n                dist[v] = nd\n                heapq.heappush(pq, (nd, v))\n    return dist`,
    bellman_ford: `def bellman_ford(nodes, edges, start):\n    dist = {node: float('inf') for node in nodes}\n    parent = {node: None for node in nodes}\n    dist[start] = 0\n    for _ in range(len(nodes) - 1):\n        updated = False\n        for u, v, w in edges:\n            if dist[u] != float('inf') and dist[u] + w < dist[v]:\n                dist[v] = dist[u] + w\n                parent[v] = u\n                updated = True\n        if not updated:\n            break\n    has_negative_cycle = any(\n        dist[u] != float('inf') and dist[u] + w < dist[v]\n        for u, v, w in edges\n    )\n    return dist, parent, has_negative_cycle`,
    floyd_warshall: `def floyd_warshall(mat):\n    n = len(mat)\n    dist = [row[:] for row in mat]\n    for k in range(n):\n        for i in range(n):\n            for j in range(n):\n                if dist[i][k] + dist[k][j] < dist[i][j]:\n                    dist[i][j] = dist[i][k] + dist[k][j]\n    return dist`,
    ford_fulkerson: `from collections import deque\ndef max_flow(cap, s, t):\n    n = len(cap); flow = 0\n    while True:\n        p = [-1]*n; p[s] = s\n        q = deque([s])\n        while q and p[t] == -1:\n            u = q.popleft()\n            for v in range(n):\n                if p[v] == -1 and cap[u][v] > 0:\n                    p[v] = u; q.append(v)\n        if p[t] == -1:\n            break\n        add = 10**18; v = t\n        while v != s:\n            u = p[v]; add = min(add, cap[u][v]); v = u\n        v = t\n        while v != s:\n            u = p[v]; cap[u][v] -= add; cap[v][u] += add; v = u\n        flow += add\n    return flow`,
    graph_coloring: `def color_graph(adj, m):\n    n = len(adj); col = [0]*n\n    def safe(v, c):\n        return all(not adj[v][u] or col[u] != c for u in range(n))\n    def bt(v):\n        if v == n: return True\n        for c in range(1, m+1):\n            if safe(v, c):\n                col[v] = c\n                if bt(v+1): return True\n                col[v] = 0\n        return False\n    return col if bt(0) else None`,
    hamiltonian_cycle: `def hamiltonian_cycle(adj):\n    n = len(adj); path = [0] + [-1]*(n-1)\n    def valid(v, pos):\n        if not adj[path[pos-1]][v]: return False\n        return v not in path[:pos]\n    def bt(pos):\n        if pos == n: return adj[path[-1]][path[0]]\n        for v in range(1, n):\n            if valid(v, pos):\n                path[pos] = v\n                if bt(pos+1): return True\n                path[pos] = -1\n        return False\n    return path + [path[0]] if bt(1) else None`,
    prim: `import heapq\ndef prim(graph, start=0):\n    vis = set([start]); pq = []\n    for v, w in graph[start]: heapq.heappush(pq, (w, start, v))\n    mst = []\n    while pq and len(vis) < len(graph):\n        w, u, v = heapq.heappop(pq)\n        if v in vis: continue\n        vis.add(v); mst.append((u, v, w))\n        for nv, nw in graph[v]:\n            if nv not in vis: heapq.heappush(pq, (nw, v, nv))\n    return mst`,
    kruskal: `def kruskal(n, edges):\n    p = list(range(n)); r = [0]*n\n    def f(x):\n        while p[x] != x:\n            p[x] = p[p[x]]; x = p[x]\n        return x\n    def u(a,b):\n        ra, rb = f(a), f(b)\n        if ra == rb: return False\n        if r[ra] < r[rb]: ra, rb = rb, ra\n        p[rb] = ra\n        if r[ra] == r[rb]: r[ra] += 1\n        return True\n    mst = []\n    for w,a,b in sorted(edges):\n        if u(a,b): mst.append((a,b,w))\n    return mst`,
    tsp_branch_bound: `def tsp_branch_bound(cost):\n    n = len(cost); best = [float('inf')]\n    vis = [False]*n\n    def lb(path, cur):\n        return cur\n    def bt(u, cnt, cur):\n        if cnt == n:\n            best[0] = min(best[0], cur + cost[u][0]); return\n        if lb([], cur) >= best[0]: return\n        for v in range(n):\n            if not vis[v] and cost[u][v] > 0:\n                vis[v] = True\n                bt(v, cnt+1, cur + cost[u][v])\n                vis[v] = False\n    vis[0] = True\n    bt(0, 1, 0)\n    return best[0]`,
    knapsack_01: `def knapsack_01(weights, values, W):\n    n = len(weights)\n    dp = [[0]*(W+1) for _ in range(n+1)]\n    for i in range(1, n+1):\n        for w in range(W+1):\n            dp[i][w] = dp[i-1][w]\n            if weights[i-1] <= w:\n                dp[i][w] = max(dp[i][w], values[i-1] + dp[i-1][w-weights[i-1]])\n    return dp[n][W]`,
    lcs: `def lcs(a, b):\n    n, m = len(a), len(b)\n    dp = [[0]*(m+1) for _ in range(n+1)]\n    for i in range(1, n+1):\n        for j in range(1, m+1):\n            if a[i-1] == b[j-1]:\n                dp[i][j] = dp[i-1][j-1] + 1\n            else:\n                dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n    return dp[n][m]`,
    edit_distance: `def edit_distance(a, b):\n    n, m = len(a), len(b)\n    dp = [[0] * (m + 1) for _ in range(n + 1)]\n    for i in range(n + 1):\n        dp[i][0] = i\n    for j in range(m + 1):\n        dp[0][j] = j\n    for i in range(1, n + 1):\n        for j in range(1, m + 1):\n            cost = 0 if a[i - 1] == b[j - 1] else 1\n            dp[i][j] = min(\n                dp[i - 1][j] + 1,\n                dp[i][j - 1] + 1,\n                dp[i - 1][j - 1] + cost,\n            )\n    return dp[n][m]`,
    matrix_chain_multiplication: `def matrix_chain(d):\n    n = len(d) - 1\n    dp = [[0]*n for _ in range(n)]\n    for L in range(2, n+1):\n        for i in range(0, n-L+1):\n            j = i + L - 1\n            dp[i][j] = 10**18\n            for k in range(i, j):\n                dp[i][j] = min(dp[i][j], dp[i][k] + dp[k+1][j] + d[i]*d[k+1]*d[j+1])\n    return dp[0][n-1]`,
    naive: `def naive_search(text, pattern):\n    ans = []\n    for i in range(len(text)-len(pattern)+1):\n        if text[i:i+len(pattern)] == pattern:\n            ans.append(i)\n    return ans`,
    kmp: `def kmp(text, pattern):\n    m = len(pattern)\n    lps = [0]*m\n    j = 0\n    for i in range(1, m):\n        while j and pattern[i] != pattern[j]:\n            j = lps[j-1]\n        if pattern[i] == pattern[j]:\n            j += 1\n            lps[i] = j\n    ans = []; j = 0\n    for i, ch in enumerate(text):\n        while j and ch != pattern[j]:\n            j = lps[j-1]\n        if ch == pattern[j]:\n            j += 1\n            if j == m:\n                ans.append(i-m+1); j = lps[j-1]\n    return ans`,
    z_algorithm: `def z_search(text, pattern):\n    if not pattern:\n        return []\n    combined = pattern + '$' + text\n    z = [0] * len(combined)\n    l = r = 0\n    for i in range(1, len(combined)):\n        if i <= r:\n            z[i] = min(r - i + 1, z[i - l])\n        while i + z[i] < len(combined) and combined[z[i]] == combined[i + z[i]]:\n            z[i] += 1\n        if i + z[i] - 1 > r:\n            l, r = i, i + z[i] - 1\n    m = len(pattern)\n    return [i - m - 1 for i in range(m + 1, len(combined)) if z[i] >= m]`,
    rabin_karp: `def rabin_karp(text, pattern):\n    n, m = len(text), len(pattern)\n    if m > n: return []\n    base, mod = 256, 10**9 + 7\n    power = pow(base, m-1, mod)\n    ph = th = 0\n    for i in range(m):\n        ph = (ph*base + ord(pattern[i])) % mod\n        th = (th*base + ord(text[i])) % mod\n    ans = []\n    for i in range(n-m+1):\n        if ph == th and text[i:i+m] == pattern: ans.append(i)\n        if i < n-m:\n            th = (th - ord(text[i])*power) % mod\n            th = (th*base + ord(text[i+m])) % mod\n    return ans`,
    huffman_coding: `import heapq\nfrom collections import Counter\n\ndef huffman_encode(text):\n    freq = Counter(text)\n    heap = [[count, [char, \"\"]] for char, count in freq.items()]\n    heapq.heapify(heap)\n    while len(heap) > 1:\n        lo = heapq.heappop(heap)\n        hi = heapq.heappop(heap)\n        for p in lo[1:]: p[1] = \"0\" + p[1]\n        for p in hi[1:]: p[1] = \"1\" + p[1]\n        heapq.heappush(heap, [lo[0] + hi[0]] + lo[1:] + hi[1:])\n    codes = dict(heap[0][1:])\n    encoded = \"\".join(codes[ch] for ch in text)\n    return encoded, codes`,
    array_stack: `class ArrayStack:\n    def __init__(self, capacity):\n        self.capacity = capacity\n        self.data = []\n\n    def push(self, value):\n        if len(self.data) >= self.capacity:\n            raise OverflowError('stack full')\n        self.data.append(value)\n\n    def pop(self):\n        if not self.data:\n            raise IndexError('stack empty')\n        return self.data.pop()`,
    linked_stack: `class Node:\n    def __init__(self, value, nxt=None):\n        self.value = value\n        self.next = nxt\n\nclass LinkedStack:\n    def __init__(self):\n        self.top = None\n\n    def push(self, value):\n        self.top = Node(value, self.top)\n\n    def pop(self):\n        if self.top is None:\n            raise IndexError('stack empty')\n        val = self.top.value\n        self.top = self.top.next\n        return val`,
    linear_queue: `class LinearQueue:\n    def __init__(self, capacity):\n        self.capacity = capacity\n        self.data = []\n\n    def enqueue(self, value):\n        if len(self.data) >= self.capacity:\n            raise OverflowError('queue full')\n        self.data.append(value)\n\n    def dequeue(self):\n        if not self.data:\n            raise IndexError('queue empty')\n        return self.data.pop(0)`,
    circular_queue: `class CircularQueue:\n    def __init__(self, capacity):\n        self.cap = capacity\n        self.arr = [None] * capacity\n        self.front = 0\n        self.rear = -1\n        self.size = 0\n\n    def enqueue(self, value):\n        if self.size == self.cap:\n            raise OverflowError('queue full')\n        self.rear = (self.rear + 1) % self.cap\n        self.arr[self.rear] = value\n        self.size += 1`,
    deque: `from collections import deque\n\nq = deque()\nq.appendleft(1)\nq.append(2)\nfront = q[0]\nrear = q[-1]\nq.popleft()\nq.pop()`,
    priority_queue: `import heapq\n\npq = []\nheapq.heappush(pq, (-5, 'task-A'))\nheapq.heappush(pq, (-2, 'task-B'))\npriority, value = heapq.heappop(pq)`,
    singly_linked_list: `class Node:\n    def __init__(self, value):\n        self.value = value\n        self.next = None\n\nclass SinglyLinkedList:\n    def __init__(self):\n        self.head = None\n\n    def insert_begin(self, value):\n        node = Node(value)\n        node.next = self.head\n        self.head = node`,
    doubly_linked_list: `class Node:\n    def __init__(self, value):\n        self.value = value\n        self.prev = None\n        self.next = None`,
    circular_singly_linked_list: `# Tail.next always points to head in a circular singly linked list`,
    circular_doubly_linked_list: `# Head.prev points to tail and tail.next points to head`,
    binary_tree: `# Binary tree represented in level-order array form: [root, left, right, ...]`,
    binary_search_tree: `class BSTNode:\n    def __init__(self, value):\n        self.value = value\n        self.left = None\n        self.right = None`,
    avl_tree: `# AVL tree insertion uses rotations (LL, RR, LR, RL) to maintain balance`,
    b_tree: `class BTreeNode:\n    def __init__(self, leaf=False):\n        self.keys = []\n        self.children = []\n        self.leaf = leaf\n\n# B-tree operations split/merge nodes to keep height logarithmic.`,
    b_plus_tree: `class BPlusNode:\n    def __init__(self, leaf=False):\n        self.keys = []\n        self.children = []\n        self.leaf = leaf\n        self.next = None\n\n# B+ tree stores data keys in linked leaves for fast range scans.`,
    min_heap: `import heapq\n\nh = [7, 3, 9]\nheapq.heapify(h)\nheapq.heappush(h, 1)\nsmallest = heapq.heappop(h)`,
    max_heap: `import heapq\n\nh = []\nfor v in [7, 3, 9]:\n    heapq.heappush(h, -v)\nlargest = -heapq.heappop(h)`,
    trie: `class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.terminal = False`
  };
  return code[name] || "# Code unavailable";
}

function getJsCode(name) {
  const code = {
    bubble_sort: `function bubbleSort(arr){const a=[...arr];for(let i=0;i<a.length;i++){let sw=false;for(let j=0;j<a.length-i-1;j++){if(a[j]>a[j+1]){[a[j],a[j+1]]=[a[j+1],a[j]];sw=true;}}if(!sw)break;}return a;}`,
    cocktail_sort: `function cocktailSort(arr){const a=[...arr];let start=0,end=a.length-1,sw=true;while(sw){sw=false;for(let i=start;i<end;i++){if(a[i]>a[i+1]){[a[i],a[i+1]]=[a[i+1],a[i]];sw=true;}}if(!sw)break;sw=false;end--;for(let i=end;i>start;i--){if(a[i-1]>a[i]){[a[i-1],a[i]]=[a[i],a[i-1]];sw=true;}}start++;}return a;}`,
    comb_sort: `function combSort(arr){const a=[...arr];let gap=a.length,shrink=1.3,sw=true;while(gap>1||sw){gap=Math.floor(gap/shrink);if(gap<1)gap=1;sw=false;for(let i=0;i+gap<a.length;i++){const j=i+gap;if(a[i]>a[j]){[a[i],a[j]]=[a[j],a[i]];sw=true;}}}return a;}`,
    gnome_sort: `function gnomeSort(arr){const a=[...arr];let i=0;while(i<a.length){if(i===0||a[i]>=a[i-1])i++;else{[a[i],a[i-1]]=[a[i-1],a[i]];i--;}}return a;}`,
    counting_sort: `function countingSort(arr){if(!arr.length)return[];const lo=Math.min(...arr),hi=Math.max(...arr),offset=lo<0?-lo:0;const cnt=Array(hi+offset+1).fill(0);for(const v of arr)cnt[v+offset]++;for(let i=1;i<cnt.length;i++)cnt[i]+=cnt[i-1];const out=Array(arr.length);for(let i=arr.length-1;i>=0;i--){const v=arr[i],idx=v+offset;cnt[idx]--;out[cnt[idx]]=v;}return out;}`,
    selection_sort: `function selectionSort(arr){const a=[...arr];for(let i=0;i<a.length;i++){let m=i;for(let j=i+1;j<a.length;j++)if(a[j]<a[m])m=j;[a[i],a[m]]=[a[m],a[i]];}return a;}`,
    insertion_sort: `function insertionSort(arr){const a=[...arr];for(let i=1;i<a.length;i++){const key=a[i];let j=i-1;while(j>=0&&a[j]>key){a[j+1]=a[j];j--;}a[j+1]=key;}return a;}`,
    merge_sort: `function mergeSort(a){if(a.length<=1)return a;const m=a.length>>1,l=mergeSort(a.slice(0,m)),r=mergeSort(a.slice(m));const o=[];let i=0,j=0;while(i<l.length&&j<r.length)o.push(l[i]<=r[j]?l[i++]:r[j++]);return o.concat(l.slice(i),r.slice(j));}`,
    quick_sort: `function quickSort(a){if(a.length<=1)return a;const p=a[a.length>>1],l=a.filter(x=>x<p),m=a.filter(x=>x===p),r=a.filter(x=>x>p);return [...quickSort(l),...m,...quickSort(r)];}`,
    heap_sort: `function heapSort(arr){const a=[...arr];const down=(i,n)=>{for(;;){let l=2*i+1,r=l+1,m=i;if(l<n&&a[l]>a[m])m=l;if(r<n&&a[r]>a[m])m=r;if(m===i)break;[a[i],a[m]]=[a[m],a[i]];i=m;}};for(let i=(a.length>>1)-1;i>=0;i--)down(i,a.length);for(let i=a.length-1;i>0;i--){[a[0],a[i]]=[a[i],a[0]];down(0,i);}return a;}`,
    radix_sort: `function radixSort(arr){let a=[...arr],exp=1,m=Math.max(0,...a);while(Math.floor(m/exp)>0){const out=new Array(a.length),cnt=Array(10).fill(0);for(const v of a)cnt[Math.floor(v/exp)%10]++;for(let i=1;i<10;i++)cnt[i]+=cnt[i-1];for(let i=a.length-1;i>=0;i--){const d=Math.floor(a[i]/exp)%10;out[--cnt[d]]=a[i];}a=out;exp*=10;}return a;}`,
    randomized_quick_sort: `function randomizedQuickSort(a){if(a.length<=1)return a;const p=a[Math.floor(Math.random()*a.length)],l=a.filter(x=>x<p),m=a.filter(x=>x===p),r=a.filter(x=>x>p);return [...randomizedQuickSort(l),...m,...randomizedQuickSort(r)];}`,
    bfs: `function bfs(graph,start){const q=[start],vis=new Set([start]),order=[];while(q.length){const u=q.shift();order.push(u);for(const v of(graph[u]||[])){if(!vis.has(v)){vis.add(v);q.push(v);}}}return order;}`,
    dfs: `function dfs(graph,start){const vis=new Set(),order=[];const go=u=>{vis.add(u);order.push(u);for(const v of(graph[u]||[]))if(!vis.has(v))go(v);};go(start);return order;}`,
    dijkstra: `function dijkstra(graph,s){const dist={};for(const k in graph)dist[k]=Infinity;dist[s]=0;const pq=[[0,s]];while(pq.length){pq.sort((a,b)=>a[0]-b[0]);const[d,u]=pq.shift();if(d!==dist[u])continue;for(const[v,w]of(graph[u]||[])){const nd=d+w;if(nd<dist[v]){dist[v]=nd;pq.push([nd,v]);}}}return dist;}`,
    bellman_ford: `function bellmanFord(nodes,edges,start){const dist=Object.fromEntries(nodes.map(n=>[n,Infinity]));const parent=Object.fromEntries(nodes.map(n=>[n,null]));dist[start]=0;for(let i=0;i<nodes.length-1;i++){let updated=false;for(const[u,v,w]of edges){if(dist[u]!==Infinity&&dist[u]+w<dist[v]){dist[v]=dist[u]+w;parent[v]=u;updated=true;}}if(!updated)break;}const hasNegativeCycle=edges.some(([u,v,w])=>dist[u]!==Infinity&&dist[u]+w<dist[v]);return{dist,parent,hasNegativeCycle};}`,
    floyd_warshall: `function floydWarshall(mat){const d=mat.map(r=>[...r]);for(let k=0;k<d.length;k++)for(let i=0;i<d.length;i++)for(let j=0;j<d.length;j++)if(d[i][k]+d[k][j]<d[i][j])d[i][j]=d[i][k]+d[k][j];return d;}`,
    ford_fulkerson: `function maxFlow(cap,s,t){const n=cap.length;let flow=0;for(;;){const p=Array(n).fill(-1);p[s]=s;const q=[s];for(let qi=0;qi<q.length&&p[t]===-1;qi++){const u=q[qi];for(let v=0;v<n;v++)if(p[v]===-1&&cap[u][v]>0){p[v]=u;q.push(v);}}if(p[t]===-1)break;let add=1e18;for(let v=t;v!==s;v=p[v])add=Math.min(add,cap[p[v]][v]);for(let v=t;v!==s;v=p[v]){cap[p[v]][v]-=add;cap[v][p[v]]+=add;}flow+=add;}return flow;}`,
    graph_coloring: `function graphColoring(adj,m){const n=adj.length,col=Array(n).fill(0);const ok=(v,c)=>{for(let u=0;u<n;u++)if(adj[v][u]&&col[u]===c)return false;return true;};const bt=v=>{if(v===n)return true;for(let c=1;c<=m;c++){if(ok(v,c)){col[v]=c;if(bt(v+1))return true;col[v]=0;}}return false;};return bt(0)?col:null;}`,
    hamiltonian_cycle: `function hamiltonianCycle(adj){const n=adj.length,path=[0,...Array(n-1).fill(-1)];const valid=(v,pos)=>adj[path[pos-1]][v]&&!path.slice(0,pos).includes(v);const bt=pos=>{if(pos===n)return !!adj[path[n-1]][path[0]];for(let v=1;v<n;v++){if(valid(v,pos)){path[pos]=v;if(bt(pos+1))return true;path[pos]=-1;}}return false;};return bt(1)?[...path,path[0]]:null;}`,
    prim: `function prim(graph,start=0){const vis=new Set([start]),pq=[];for(const[v,w]of graph[start])pq.push([w,start,v]);const mst=[];while(pq.length&&vis.size<graph.length){pq.sort((a,b)=>a[0]-b[0]);const[w,u,v]=pq.shift();if(vis.has(v))continue;vis.add(v);mst.push([u,v,w]);for(const[nv,nw]of graph[v])if(!vis.has(nv))pq.push([nw,v,nv]);}return mst;}`,
    kruskal: `function kruskal(n,edges){const p=Array.from({length:n},(_,i)=>i),r=Array(n).fill(0);const f=x=>p[x]===x?x:(p[x]=f(p[x]));const u=(a,b)=>{a=f(a);b=f(b);if(a===b)return false;if(r[a]<r[b])[a,b]=[b,a];p[b]=a;if(r[a]===r[b])r[a]++;return true;};const mst=[];for(const[w,a,b]of [...edges].sort((x,y)=>x[0]-y[0]))if(u(a,b))mst.push([a,b,w]);return mst;}`,
    tsp_branch_bound: `function tspBranchBound(cost){const n=cost.length,vis=Array(n).fill(false);let best=Infinity;const bt=(u,cnt,cur)=>{if(cnt===n){best=Math.min(best,cur+cost[u][0]);return;}if(cur>=best)return;for(let v=0;v<n;v++)if(!vis[v]&&cost[u][v]>0){vis[v]=true;bt(v,cnt+1,cur+cost[u][v]);vis[v]=false;}};vis[0]=true;bt(0,1,0);return best;}`,
    knapsack_01: `function knapsack01(wt,val,W){const n=wt.length,dp=Array.from({length:n+1},()=>Array(W+1).fill(0));for(let i=1;i<=n;i++)for(let w=0;w<=W;w++){dp[i][w]=dp[i-1][w];if(wt[i-1]<=w)dp[i][w]=Math.max(dp[i][w],val[i-1]+dp[i-1][w-wt[i-1]]);}return dp[n][W];}`,
    lcs: `function lcs(a,b){const n=a.length,m=b.length,dp=Array.from({length:n+1},()=>Array(m+1).fill(0));for(let i=1;i<=n;i++)for(let j=1;j<=m;j++)dp[i][j]=a[i-1]===b[j-1]?dp[i-1][j-1]+1:Math.max(dp[i-1][j],dp[i][j-1]);return dp[n][m];}`,
    edit_distance: `function editDistance(a,b){const n=a.length,m=b.length,dp=Array.from({length:n+1},()=>Array(m+1).fill(0));for(let i=0;i<=n;i++)dp[i][0]=i;for(let j=0;j<=m;j++)dp[0][j]=j;for(let i=1;i<=n;i++)for(let j=1;j<=m;j++){const cost=a[i-1]===b[j-1]?0:1;dp[i][j]=Math.min(dp[i-1][j]+1,dp[i][j-1]+1,dp[i-1][j-1]+cost);}return dp[n][m];}`,
    matrix_chain_multiplication: `function matrixChain(d){const n=d.length-1,dp=Array.from({length:n},()=>Array(n).fill(0));for(let L=2;L<=n;L++)for(let i=0;i+L-1<n;i++){const j=i+L-1;dp[i][j]=Infinity;for(let k=i;k<j;k++)dp[i][j]=Math.min(dp[i][j],dp[i][k]+dp[k+1][j]+d[i]*d[k+1]*d[j+1]);}return dp[0][n-1];}`,
    naive: `function naiveSearch(text,pattern){const out=[];for(let i=0;i<=text.length-pattern.length;i++)if(text.slice(i,i+pattern.length)===pattern)out.push(i);return out;}`,
    kmp: `function kmp(text,pattern){const m=pattern.length,lps=Array(m).fill(0);for(let i=1,j=0;i<m;i++){while(j&&pattern[i]!==pattern[j])j=lps[j-1];if(pattern[i]===pattern[j])lps[i]=++j;}const ans=[];for(let i=0,j=0;i<text.length;i++){while(j&&text[i]!==pattern[j])j=lps[j-1];if(text[i]===pattern[j])j++;if(j===m){ans.push(i-m+1);j=lps[j-1];}}return ans;}`,
    z_algorithm: `function zSearch(text,pattern){if(!pattern.length)return[];const s=pattern+'$'+text,z=Array(s.length).fill(0);let l=0,r=0;for(let i=1;i<s.length;i++){if(i<=r)z[i]=Math.min(r-i+1,z[i-l]);while(i+z[i]<s.length&&s[z[i]]===s[i+z[i]])z[i]++;if(i+z[i]-1>r){l=i;r=i+z[i]-1;}}const out=[];for(let i=pattern.length+1;i<s.length;i++)if(z[i]>=pattern.length)out.push(i-pattern.length-1);return out;}`,
    rabin_karp: `function rabinKarp(text,pattern){const n=text.length,m=pattern.length;if(m>n)return[];const base=256,mod=1000000007;let ph=0,th=0,p=1;for(let i=0;i<m-1;i++)p=(p*base)%mod;for(let i=0;i<m;i++){ph=(ph*base+pattern.charCodeAt(i))%mod;th=(th*base+text.charCodeAt(i))%mod;}const out=[];for(let i=0;i<=n-m;i++){if(ph===th&&text.slice(i,i+m)===pattern)out.push(i);if(i<n-m){th=(th-text.charCodeAt(i)*p)%mod;if(th<0)th+=mod;th=(th*base+text.charCodeAt(i+m))%mod;}}return out;}`,
    huffman_coding: `function huffmanEncode(text){const freq={};for(const ch of text)freq[ch]=(freq[ch]||0)+1;let heap=Object.entries(freq).map(([ch,f])=>({f,node:{ch,left:null,right:null}}));const popMin=()=>{heap.sort((a,b)=>a.f-b.f);return heap.shift();};while(heap.length>1){const a=popMin(),b=popMin();heap.push({f:a.f+b.f,node:{ch:null,left:a.node,right:b.node}});}const root=heap[0]?.node;const codes={};const dfs=(n,p)=>{if(!n)return;if(n.ch!==null){codes[n.ch]=p||"0";return;}dfs(n.left,p+"0");dfs(n.right,p+"1");};dfs(root,"");return {codes,encoded:[...text].map(ch=>codes[ch]).join("")};}`
    ,
    b_tree: `class BTreeNode{constructor(leaf=false){this.keys=[];this.children=[];this.leaf=leaf;}}\n\n// B-tree keeps multiple sorted keys per node and balances with node splits.`
    ,
    b_plus_tree: `class BPlusNode{constructor(leaf=false){this.keys=[];this.children=[];this.leaf=leaf;this.next=null;}}\n\n// B+ tree links leaf nodes for ordered range traversal.`
  };
  return code[name] || "function run(){ return null; }";
}

function getCppCode(name) {
  const code = {
    bubble_sort: `#include <vector>\nusing namespace std;\nvector<int> bubbleSort(vector<int> a){for(int i=0;i<(int)a.size();++i){bool sw=false;for(int j=0;j+1<(int)a.size()-i;++j){if(a[j]>a[j+1]){swap(a[j],a[j+1]);sw=true;}}if(!sw)break;}return a;}`,
    counting_sort: `#include <vector>\n#include <algorithm>\nusing namespace std;\nvector<int> countingSort(vector<int> a){if(a.empty())return a;int lo=*min_element(a.begin(),a.end()),hi=*max_element(a.begin(),a.end());int off=lo<0?-lo:0;vector<int> cnt(hi+off+1,0),out(a.size());for(int v:a)cnt[v+off]++;for(int i=1;i<(int)cnt.size();++i)cnt[i]+=cnt[i-1];for(int i=(int)a.size()-1;i>=0;--i){int idx=a[i]+off;out[--cnt[idx]]=a[i];}return out;}`,
    selection_sort: `#include <vector>\nusing namespace std;\nvector<int> selectionSort(vector<int> a){for(int i=0;i<(int)a.size();++i){int m=i;for(int j=i+1;j<(int)a.size();++j)if(a[j]<a[m])m=j;swap(a[i],a[m]);}return a;}`,
    insertion_sort: `#include <vector>\nusing namespace std;\nvector<int> insertionSort(vector<int> a){for(int i=1;i<(int)a.size();++i){int key=a[i],j=i-1;while(j>=0&&a[j]>key){a[j+1]=a[j];--j;}a[j+1]=key;}return a;}`,
    merge_sort: `#include <vector>\nusing namespace std;\nvector<int> mergeSort(vector<int> a){if(a.size()<=1)return a;int m=a.size()/2;vector<int> l(a.begin(),a.begin()+m),r(a.begin()+m,a.end());l=mergeSort(l);r=mergeSort(r);vector<int> o;int i=0,j=0;while(i<(int)l.size()&&j<(int)r.size())o.push_back(l[i]<=r[j]?l[i++]:r[j++]);while(i<(int)l.size())o.push_back(l[i++]);while(j<(int)r.size())o.push_back(r[j++]);return o;}`,
    quick_sort: `#include <vector>\nusing namespace std;\nvector<int> quickSort(vector<int> a){if(a.size()<=1)return a;int p=a[a.size()/2];vector<int> l,m,r;for(int x:a){if(x<p)l.push_back(x);else if(x==p)m.push_back(x);else r.push_back(x);}l=quickSort(l);r=quickSort(r);l.insert(l.end(),m.begin(),m.end());l.insert(l.end(),r.begin(),r.end());return l;}`,
    heap_sort: `#include <vector>\n#include <algorithm>\nusing namespace std;\nvector<int> heapSort(vector<int> a){make_heap(a.begin(),a.end());sort_heap(a.begin(),a.end());return a;}`,
    radix_sort: `#include <vector>\nusing namespace std;\nvector<int> radixSort(vector<int> a){int mx=0;for(int v:a)mx=max(mx,v);for(int exp=1;mx/exp>0;exp*=10){vector<int> out(a.size());int c[10]={0};for(int v:a)c[(v/exp)%10]++;for(int i=1;i<10;i++)c[i]+=c[i-1];for(int i=(int)a.size()-1;i>=0;i--){int d=(a[i]/exp)%10;out[--c[d]]=a[i];}a.swap(out);}return a;}`,
    randomized_quick_sort: `#include <vector>\n#include <cstdlib>\nusing namespace std;\nvector<int> randomizedQuickSort(vector<int> a){if(a.size()<=1)return a;int p=a[rand()%a.size()];vector<int> l,m,r;for(int x:a){if(x<p)l.push_back(x);else if(x==p)m.push_back(x);else r.push_back(x);}l=randomizedQuickSort(l);r=randomizedQuickSort(r);l.insert(l.end(),m.begin(),m.end());l.insert(l.end(),r.begin(),r.end());return l;}`,
    bfs: `#include <vector>\n#include <queue>\nusing namespace std;\nvector<int> bfs(const vector<vector<int>>& g,int s){vector<int> vis(g.size()),ord;queue<int> q;q.push(s);vis[s]=1;while(!q.empty()){int u=q.front();q.pop();ord.push_back(u);for(int v:g[u])if(!vis[v]){vis[v]=1;q.push(v);}}return ord;}`,
    dfs: `#include <vector>\nusing namespace std;\nvoid dfsGo(int u,const vector<vector<int>>& g,vector<int>& vis,vector<int>& ord){vis[u]=1;ord.push_back(u);for(int v:g[u])if(!vis[v])dfsGo(v,g,vis,ord);}vector<int> dfs(const vector<vector<int>>& g,int s){vector<int> vis(g.size()),ord;dfsGo(s,g,vis,ord);return ord;}`,
    dijkstra: `#include <vector>\n#include <queue>\nusing namespace std;\nvector<long long> dijkstra(const vector<vector<pair<int,int>>>& g,int s){const long long INF=4e18;vector<long long>d(g.size(),INF);priority_queue<pair<long long,int>,vector<pair<long long,int>>,greater<pair<long long,int>>>pq;d[s]=0;pq.push({0,s});while(!pq.empty()){auto [du,u]=pq.top();pq.pop();if(du!=d[u])continue;for(auto [v,w]:g[u])if(du+w<d[v]){d[v]=du+w;pq.push({d[v],v});}}return d;}`,
    bellman_ford: `#include <vector>\n#include <tuple>\nusing namespace std;\nvector<long long> bellmanFord(int n,const vector<tuple<int,int,int>>& edges,int s){const long long INF=4e18;vector<long long>d(n,INF);d[s]=0;for(int i=0;i<n-1;i++){bool upd=false;for(auto [u,v,w]:edges){if(d[u]!=INF&&d[u]+w<d[v]){d[v]=d[u]+w;upd=true;}}if(!upd)break;}return d;}`,
    floyd_warshall: `#include <vector>\nusing namespace std;\nvector<vector<long long>> floydWarshall(vector<vector<long long>> d){int n=d.size();for(int k=0;k<n;k++)for(int i=0;i<n;i++)for(int j=0;j<n;j++)if(d[i][k]+d[k][j]<d[i][j])d[i][j]=d[i][k]+d[k][j];return d;}`,
    ford_fulkerson: `#include <vector>\n#include <queue>\nusing namespace std;\nint maxFlow(vector<vector<int>> cap,int s,int t){int n=cap.size(),flow=0;while(true){vector<int> p(n,-1);p[s]=s;queue<int> q;q.push(s);while(!q.empty()&&p[t]==-1){int u=q.front();q.pop();for(int v=0;v<n;v++)if(p[v]==-1&&cap[u][v]>0){p[v]=u;q.push(v);}}if(p[t]==-1)break;int add=1e9;for(int v=t;v!=s;v=p[v])add=min(add,cap[p[v]][v]);for(int v=t;v!=s;v=p[v]){cap[p[v]][v]-=add;cap[v][p[v]]+=add;}flow+=add;}return flow;}`,
    graph_coloring: `#include <vector>\nusing namespace std;\nbool gcBt(int v,vector<int>& c,const vector<vector<int>>& a,int m){if(v==(int)a.size())return true;for(int col=1;col<=m;col++){bool ok=true;for(int u=0;u<(int)a.size();u++)if(a[v][u]&&c[u]==col)ok=false;if(ok){c[v]=col;if(gcBt(v+1,c,a,m))return true;c[v]=0;}}return false;}vector<int> graphColoring(const vector<vector<int>>& a,int m){vector<int> c(a.size(),0);if(gcBt(0,c,a,m))return c;return {};}`,
    hamiltonian_cycle: `#include <vector>\nusing namespace std;\nbool hBt(int pos,vector<int>& path,const vector<vector<int>>& a){int n=a.size();if(pos==n)return a[path[n-1]][path[0]];for(int v=1;v<n;v++){bool used=false;for(int i=0;i<pos;i++)if(path[i]==v)used=true;if(!used&&a[path[pos-1]][v]){path[pos]=v;if(hBt(pos+1,path,a))return true;path[pos]=-1;}}return false;}vector<int> hamiltonianCycle(const vector<vector<int>>& a){vector<int> path(a.size(),-1);path[0]=0;if(hBt(1,path,a)){path.push_back(0);return path;}return {};}`,
    prim: `#include <vector>\n#include <queue>\nusing namespace std;\nvector<tuple<int,int,int>> prim(const vector<vector<pair<int,int>>>& g,int s=0){vector<int> vis(g.size());priority_queue<tuple<int,int,int>,vector<tuple<int,int,int>>,greater<tuple<int,int,int>>> pq;vis[s]=1;for(auto [v,w]:g[s])pq.push({w,s,v});vector<tuple<int,int,int>> mst;while(!pq.empty()){auto [w,u,v]=pq.top();pq.pop();if(vis[v])continue;vis[v]=1;mst.push_back({u,v,w});for(auto [nv,nw]:g[v])if(!vis[nv])pq.push({nw,v,nv});}return mst;}`,
    kruskal: `#include <vector>\n#include <algorithm>\nusing namespace std;\nstruct DSU{vector<int> p,r;DSU(int n):p(n),r(n){for(int i=0;i<n;i++)p[i]=i;}int f(int x){return p[x]==x?x:p[x]=f(p[x]);}bool u(int a,int b){a=f(a);b=f(b);if(a==b)return false;if(r[a]<r[b])swap(a,b);p[b]=a;if(r[a]==r[b])r[a]++;return true;}};vector<tuple<int,int,int>> kruskal(int n,vector<tuple<int,int,int>> e){sort(e.begin(),e.end());DSU d(n);vector<tuple<int,int,int>> out;for(auto [w,a,b]:e)if(d.u(a,b))out.push_back({a,b,w});return out;}`,
    tsp_branch_bound: `#include <vector>\nusing namespace std;\nint tspBranchBound(const vector<vector<int>>& c){int n=c.size(),best=1e9;vector<int> vis(n);function<void(int,int,int)> bt=[&](int u,int cnt,int cur){if(cnt==n){best=min(best,cur+c[u][0]);return;}if(cur>=best)return;for(int v=0;v<n;v++)if(!vis[v]&&c[u][v]>0){vis[v]=1;bt(v,cnt+1,cur+c[u][v]);vis[v]=0;}};vis[0]=1;bt(0,1,0);return best;}`,
    knapsack_01: `#include <vector>\nusing namespace std;\nint knapsack01(const vector<int>& w,const vector<int>& val,int W){int n=w.size();vector<vector<int>> dp(n+1,vector<int>(W+1));for(int i=1;i<=n;i++)for(int c=0;c<=W;c++){dp[i][c]=dp[i-1][c];if(w[i-1]<=c)dp[i][c]=max(dp[i][c],val[i-1]+dp[i-1][c-w[i-1]]);}return dp[n][W];}`,
    lcs: `#include <vector>\n#include <string>\nusing namespace std;\nint lcs(const string& a,const string& b){vector<vector<int>> dp(a.size()+1,vector<int>(b.size()+1));for(int i=1;i<=a.size();i++)for(int j=1;j<=b.size();j++)dp[i][j]=a[i-1]==b[j-1]?dp[i-1][j-1]+1:max(dp[i-1][j],dp[i][j-1]);return dp[a.size()][b.size()];}`,
    edit_distance: `#include <vector>\n#include <string>\nusing namespace std;\nint editDistance(const string& a,const string& b){vector<vector<int>> dp(a.size()+1,vector<int>(b.size()+1));for(int i=0;i<=a.size();i++)dp[i][0]=i;for(int j=0;j<=b.size();j++)dp[0][j]=j;for(int i=1;i<=a.size();i++)for(int j=1;j<=b.size();j++){int c=a[i-1]==b[j-1]?0:1;dp[i][j]=min({dp[i-1][j]+1,dp[i][j-1]+1,dp[i-1][j-1]+c});}return dp[a.size()][b.size()];}`,
    matrix_chain_multiplication: `#include <vector>\nusing namespace std;\nint matrixChain(const vector<int>& d){int n=d.size()-1;vector<vector<int>> dp(n,vector<int>(n,0));for(int L=2;L<=n;L++)for(int i=0;i+L-1<n;i++){int j=i+L-1;dp[i][j]=1e9;for(int k=i;k<j;k++)dp[i][j]=min(dp[i][j],dp[i][k]+dp[k+1][j]+d[i]*d[k+1]*d[j+1]);}return dp[0][n-1];}`,
    naive: `#include <vector>\n#include <string>\nusing namespace std;\nvector<int> naiveSearch(const string& t,const string& p){vector<int> out;for(int i=0;i+(int)p.size()<=(int)t.size();i++)if(t.substr(i,p.size())==p)out.push_back(i);return out;}`,
    kmp: `#include <vector>\n#include <string>\nusing namespace std;\nvector<int> kmp(const string& t,const string& p){int m=p.size();vector<int> lps(m),out;for(int i=1,j=0;i<m;i++){while(j&&p[i]!=p[j])j=lps[j-1];if(p[i]==p[j])lps[i]=++j;}for(int i=0,j=0;i<(int)t.size();i++){while(j&&t[i]!=p[j])j=lps[j-1];if(t[i]==p[j])j++;if(j==m){out.push_back(i-m+1);j=lps[j-1];}}return out;}`,
    z_algorithm: `#include <vector>\n#include <string>\nusing namespace std;\nvector<int> zSearch(const string& t,const string& p){if(p.empty())return{};string s=p+"$"+t;vector<int> z(s.size()),out;int l=0,r=0;for(int i=1;i<(int)s.size();i++){if(i<=r)z[i]=min(r-i+1,z[i-l]);while(i+z[i]<(int)s.size()&&s[z[i]]==s[i+z[i]])z[i]++;if(i+z[i]-1>r){l=i;r=i+z[i]-1;}}for(int i=(int)p.size()+1;i<(int)s.size();i++)if(z[i]>=(int)p.size())out.push_back(i-(int)p.size()-1);return out;}`,
    rabin_karp: `#include <vector>\n#include <string>\nusing namespace std;\nvector<int> rabinKarp(const string& t,const string& p){int n=t.size(),m=p.size();if(m>n)return {};const long long B=256,M=1000000007;long long ph=0,th=0,pow=1;for(int i=0;i<m-1;i++)pow=(pow*B)%M;for(int i=0;i<m;i++){ph=(ph*B+p[i])%M;th=(th*B+t[i])%M;}vector<int> out;for(int i=0;i<=n-m;i++){if(ph==th&&t.substr(i,m)==p)out.push_back(i);if(i<n-m){th=(th-t[i]*pow)%M;if(th<0)th+=M;th=(th*B+t[i+m])%M;}}return out;}`,
    huffman_coding: `#include <queue>\n#include <unordered_map>\n#include <string>\nusing namespace std;\nstruct Node{char ch;int f;Node*l,*r;Node(char c,int fr):ch(c),f(fr),l(nullptr),r(nullptr){}Node(Node*a,Node*b):ch(0),f(a->f+b->f),l(a),r(b){}};\nstruct Cmp{bool operator()(Node*a,Node*b){return a->f>b->f;}};\nvoid build(Node*n,string p,unordered_map<char,string>& code){if(!n)return;if(n->ch){code[n->ch]=p.empty()?"0":p;return;}build(n->l,p+"0",code);build(n->r,p+"1",code);} `
  };
  return code[name] || "#include <vector>\nusing namespace std;\nint run(){return 0;}";
}

function getCCode(name) {
  const code = {
    bubble_sort: `#include <stdio.h>\nvoid bubble_sort(int a[], int n){for(int i=0;i<n-1;i++){int sw=0;for(int j=0;j<n-i-1;j++){if(a[j]>a[j+1]){int t=a[j];a[j]=a[j+1];a[j+1]=t;sw=1;}}if(!sw)break;}}`,
    counting_sort: `#include <stdio.h>\nvoid counting_sort(int a[],int n){if(n<=0)return;int lo=a[0],hi=a[0];for(int i=1;i<n;i++){if(a[i]<lo)lo=a[i];if(a[i]>hi)hi=a[i];}int off=lo<0?-lo:0;int k=hi+off+1;int cnt[k];for(int i=0;i<k;i++)cnt[i]=0;for(int i=0;i<n;i++)cnt[a[i]+off]++;for(int i=1;i<k;i++)cnt[i]+=cnt[i-1];int out[n];for(int i=n-1;i>=0;i--){int idx=a[i]+off;out[--cnt[idx]]=a[i];}for(int i=0;i<n;i++)a[i]=out[i];}`,
    selection_sort: `#include <stdio.h>\nvoid selection_sort(int a[], int n){for(int i=0;i<n-1;i++){int m=i;for(int j=i+1;j<n;j++)if(a[j]<a[m])m=j;int t=a[i];a[i]=a[m];a[m]=t;}}`,
    insertion_sort: `#include <stdio.h>\nvoid insertion_sort(int a[], int n){for(int i=1;i<n;i++){int key=a[i],j=i-1;while(j>=0&&a[j]>key){a[j+1]=a[j];j--;}a[j+1]=key;}}`,
    merge_sort: `#include <stdio.h>\nvoid merge(int a[],int l,int m,int r){int n1=m-l+1,n2=r-m;int L[n1],R[n2];for(int i=0;i<n1;i++)L[i]=a[l+i];for(int j=0;j<n2;j++)R[j]=a[m+1+j];int i=0,j=0,k=l;while(i<n1&&j<n2)a[k++]=(L[i]<=R[j])?L[i++]:R[j++];while(i<n1)a[k++]=L[i++];while(j<n2)a[k++]=R[j++];}\nvoid merge_sort(int a[],int l,int r){if(l>=r)return;int m=l+(r-l)/2;merge_sort(a,l,m);merge_sort(a,m+1,r);merge(a,l,m,r);}`,
    quick_sort: `#include <stdio.h>\nint part(int a[],int l,int r){int p=a[r],i=l-1;for(int j=l;j<r;j++)if(a[j]<=p){i++;int t=a[i];a[i]=a[j];a[j]=t;}int t=a[i+1];a[i+1]=a[r];a[r]=t;return i+1;}\nvoid quick_sort(int a[],int l,int r){if(l<r){int pi=part(a,l,r);quick_sort(a,l,pi-1);quick_sort(a,pi+1,r);}}`,
    heap_sort: `#include <stdio.h>\nvoid heapify(int a[],int n,int i){int m=i,l=2*i+1,r=2*i+2;if(l<n&&a[l]>a[m])m=l;if(r<n&&a[r]>a[m])m=r;if(m!=i){int t=a[i];a[i]=a[m];a[m]=t;heapify(a,n,m);}}\nvoid heap_sort(int a[],int n){for(int i=n/2-1;i>=0;i--)heapify(a,n,i);for(int i=n-1;i>0;i--){int t=a[0];a[0]=a[i];a[i]=t;heapify(a,i,0);}}`,
    radix_sort: `#include <stdio.h>\nint get_max(int a[],int n){int m=a[0];for(int i=1;i<n;i++)if(a[i]>m)m=a[i];return m;}\nvoid count_sort(int a[],int n,int exp){int out[n],cnt[10]={0};for(int i=0;i<n;i++)cnt[(a[i]/exp)%10]++;for(int i=1;i<10;i++)cnt[i]+=cnt[i-1];for(int i=n-1;i>=0;i--){int d=(a[i]/exp)%10;out[--cnt[d]]=a[i];}for(int i=0;i<n;i++)a[i]=out[i];}\nvoid radix_sort(int a[],int n){for(int exp=1,m=get_max(a,n);m/exp>0;exp*=10)count_sort(a,n,exp);}`,
    bfs: `#include <stdio.h>\n#define MAX 100\nvoid bfs(int n,int g[MAX][MAX],int start){int q[MAX],f=0,r=0,vis[MAX]={0};vis[start]=1;q[r++]=start;while(f<r){int u=q[f++];for(int v=0;v<n;v++)if(g[u][v]&&!vis[v]){vis[v]=1;q[r++]=v;}}}`,
    dfs: `#include <stdio.h>\n#define MAX 100\nvoid dfs(int n,int g[MAX][MAX],int u,int vis[MAX]){vis[u]=1;for(int v=0;v<n;v++)if(g[u][v]&&!vis[v])dfs(n,g,v,vis);}`,
    dijkstra: `#include <stdio.h>\n#define INF 1000000000\n#define MAX 100\nint min_idx(int d[],int vis[],int n){int m=INF,idx=-1;for(int i=0;i<n;i++)if(!vis[i]&&d[i]<m){m=d[i];idx=i;}return idx;}\nvoid dijkstra(int n,int g[MAX][MAX],int s,int dist[MAX]){int vis[MAX]={0};for(int i=0;i<n;i++)dist[i]=INF;dist[s]=0;for(int c=0;c<n-1;c++){int u=min_idx(dist,vis,n);if(u==-1)break;vis[u]=1;for(int v=0;v<n;v++)if(!vis[v]&&g[u][v]>0&&dist[u]+g[u][v]<dist[v])dist[v]=dist[u]+g[u][v];}}`,
    bellman_ford: `#include <stdio.h>\n#define INF 1000000000\nvoid bellman_ford(int n,int m,int edges[][3],int s,int dist[]){for(int i=0;i<n;i++)dist[i]=INF;dist[s]=0;for(int i=0;i<n-1;i++){int upd=0;for(int e=0;e<m;e++){int u=edges[e][0],v=edges[e][1],w=edges[e][2];if(dist[u]!=INF&&dist[u]+w<dist[v]){dist[v]=dist[u]+w;upd=1;}}if(!upd)break;}}`,
    floyd_warshall: `#include <stdio.h>\n#define INF 1000000000\n#define MAX 100\nvoid floyd_warshall(int n,int d[MAX][MAX]){for(int k=0;k<n;k++)for(int i=0;i<n;i++)for(int j=0;j<n;j++)if(d[i][k]<INF&&d[k][j]<INF&&d[i][k]+d[k][j]<d[i][j])d[i][j]=d[i][k]+d[k][j];}`,
    knapsack_01: `#include <stdio.h>\nint knapsack_01(int w[],int val[],int n,int W){int dp[n+1][W+1];for(int i=0;i<=n;i++)for(int c=0;c<=W;c++)dp[i][c]=(i==0||c==0)?0:dp[i-1][c];for(int i=1;i<=n;i++)for(int c=0;c<=W;c++)if(w[i-1]<=c){int take=val[i-1]+dp[i-1][c-w[i-1]];if(take>dp[i][c])dp[i][c]=take;}return dp[n][W];}`,
    lcs: `#include <stdio.h>\n#include <string.h>\nint lcs(const char* a,const char* b){int n=strlen(a),m=strlen(b);int dp[n+1][m+1];for(int i=0;i<=n;i++)for(int j=0;j<=m;j++)dp[i][j]=(i==0||j==0)?0:0;for(int i=1;i<=n;i++)for(int j=1;j<=m;j++)dp[i][j]=(a[i-1]==b[j-1])?dp[i-1][j-1]+1:((dp[i-1][j]>dp[i][j-1])?dp[i-1][j]:dp[i][j-1]);return dp[n][m];}`,
    edit_distance: `#include <stdio.h>\n#include <string.h>\nint edit_distance(const char* a,const char* b){int n=strlen(a),m=strlen(b);int dp[n+1][m+1];for(int i=0;i<=n;i++)dp[i][0]=i;for(int j=0;j<=m;j++)dp[0][j]=j;for(int i=1;i<=n;i++)for(int j=1;j<=m;j++){int c=a[i-1]==b[j-1]?0:1;int x=dp[i-1][j]+1,y=dp[i][j-1]+1,z=dp[i-1][j-1]+c;int best=x<y?x:y;dp[i][j]=best<z?best:z;}return dp[n][m];}`,
    matrix_chain_multiplication: `#include <stdio.h>\n#define INF 1000000000\nint matrix_chain(int d[],int n){int dp[n][n];for(int i=0;i<n;i++)dp[i][i]=0;for(int L=2;L<=n;L++)for(int i=0;i+L-1<n;i++){int j=i+L-1;dp[i][j]=INF;for(int k=i;k<j;k++){int c=dp[i][k]+dp[k+1][j]+d[i]*d[k+1]*d[j+1];if(c<dp[i][j])dp[i][j]=c;}}return dp[0][n-1];}`,
    naive: `#include <stdio.h>\n#include <string.h>\nvoid naive_search(const char* text,const char* pattern){int n=strlen(text),m=strlen(pattern);for(int i=0;i<=n-m;i++){int j=0;while(j<m&&text[i+j]==pattern[j])j++;if(j==m)printf("%d ",i);}}`,
    kmp: `#include <stdio.h>\n#include <string.h>\nvoid build_lps(const char* p,int m,int lps[]){int len=0;lps[0]=0;for(int i=1;i<m;){if(p[i]==p[len])lps[i++]=++len;else if(len)len=lps[len-1];else lps[i++]=0;}}\nvoid kmp(const char* t,const char* p){int n=strlen(t),m=strlen(p),lps[m];build_lps(p,m,lps);for(int i=0,j=0;i<n;){if(t[i]==p[j]){i++;j++;}if(j==m){printf("%d ",i-j);j=lps[j-1];}else if(i<n&&t[i]!=p[j])j? (j=lps[j-1]) : i++;}}`,
    z_algorithm: `#include <stdio.h>\n#include <string.h>\nvoid z_search(const char* text,const char* pat){int n=strlen(text),m=strlen(pat);if(m==0)return;char s[n+m+2];sprintf(s,"%s$%s",pat,text);int N=strlen(s),z[N];for(int i=0;i<N;i++)z[i]=0;int l=0,r=0;for(int i=1;i<N;i++){if(i<=r)z[i]=(r-i+1<z[i-l]?r-i+1:z[i-l]);while(i+z[i]<N&&s[z[i]]==s[i+z[i]])z[i]++;if(i+z[i]-1>r){l=i;r=i+z[i]-1;}}for(int i=m+1;i<N;i++)if(z[i]>=m)printf("%d ",i-m-1);}`,
    rabin_karp: `#include <stdio.h>\n#include <string.h>\n#define D 256\n#define MOD 1000000007\nvoid rabin_karp(const char* t,const char* p){int n=strlen(t),m=strlen(p);if(m>n)return;long long h=1,ph=0,th=0;for(int i=0;i<m-1;i++)h=(h*D)%MOD;for(int i=0;i<m;i++){ph=(D*ph+p[i])%MOD;th=(D*th+t[i])%MOD;}for(int i=0;i<=n-m;i++){if(ph==th){int ok=1;for(int j=0;j<m;j++)if(t[i+j]!=p[j]){ok=0;break;}if(ok)printf("%d ",i);}if(i<n-m){th=(D*(th-t[i]*h)+t[i+m])%MOD;if(th<0)th+=MOD;}}}`,
    huffman_coding: `#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#define MAXC 256\nstruct Node{char ch;int f;struct Node*l,*r;};\nvoid build_codes(struct Node*n,char path[],int d,char* codes[MAXC]){if(!n)return;if(!n->l&&!n->r){path[d]='\\0';codes[(unsigned char)n->ch]=strdup(d?path:"0");return;}path[d]='0';build_codes(n->l,path,d+1,codes);path[d]='1';build_codes(n->r,path,d+1,codes);}`,
    array_stack: `#include <stdio.h>\n#define CAP 100\nint st[CAP],top=-1;\nvoid push(int x){if(top<CAP-1)st[++top]=x;}\nint pop(){return top>=0?st[top--]:-1;}`,
    linear_queue: `#include <stdio.h>\n#define CAP 100\nint q[CAP],front=0,rear=-1;\nvoid enqueue(int x){if(rear<CAP-1)q[++rear]=x;}\nint dequeue(){return front<=rear?q[front++]:-1;}`,
    singly_linked_list: `#include <stdio.h>\n#include <stdlib.h>\nstruct Node{int v;struct Node*next;};\nvoid insert_begin(struct Node**head,int v){struct Node*n=(struct Node*)malloc(sizeof(struct Node));n->v=v;n->next=*head;*head=n;}`,
    binary_search_tree: `#include <stdio.h>\n#include <stdlib.h>\nstruct Node{int v;struct Node*l,*r;};\nstruct Node* insert(struct Node* root,int v){if(!root){root=(struct Node*)malloc(sizeof(struct Node));root->v=v;root->l=root->r=NULL;return root;}if(v<root->v)root->l=insert(root->l,v);else root->r=insert(root->r,v);return root;}`
  };
  return code[name] || "#include <stdio.h>\n/* C implementation is not yet available for this algorithm. */\nint main(void){return 0;}";
}

function getGoCode(name) {
  const code = {
    bubble_sort: `package algo

func BubbleSort(values []int) []int {
  out := append([]int(nil), values...)
  n := len(out)

  for i := 0; i < n; i++ {
    swapped := false
    for j := 0; j+1 < n-i; j++ {
      if out[j] > out[j+1] {
        out[j], out[j+1] = out[j+1], out[j]
        swapped = true
      }
    }
    if !swapped {
      break
    }
  }

  return out
}`,
    selection_sort: `package algo

func SelectionSort(values []int) []int {
  out := append([]int(nil), values...)
  for i := 0; i < len(out); i++ {
    minIndex := i
    for j := i + 1; j < len(out); j++ {
      if out[j] < out[minIndex] {
        minIndex = j
      }
    }
    out[i], out[minIndex] = out[minIndex], out[i]
  }
  return out
}`,
    insertion_sort: `package algo

func InsertionSort(values []int) []int {
  out := append([]int(nil), values...)
  for i := 1; i < len(out); i++ {
    key := out[i]
    j := i - 1
    for j >= 0 && out[j] > key {
      out[j+1] = out[j]
      j--
    }
    out[j+1] = key
  }
  return out
}`,
    merge_sort: `package algo

func MergeSort(values []int) []int {
  if len(values) <= 1 {
    return append([]int(nil), values...)
  }

  mid := len(values) / 2
  left := MergeSort(values[:mid])
  right := MergeSort(values[mid:])

  merged := make([]int, 0, len(values))
  i, j := 0, 0
  for i < len(left) && j < len(right) {
    if left[i] <= right[j] {
      merged = append(merged, left[i])
      i++
    } else {
      merged = append(merged, right[j])
      j++
    }
  }

  merged = append(merged, left[i:]...)
  merged = append(merged, right[j:]...)
  return merged
}`,
    quick_sort: `package algo

func QuickSort(values []int) []int {
  if len(values) <= 1 {
    return append([]int(nil), values...)
  }

  pivot := values[len(values)/2]
  left := make([]int, 0)
  middle := make([]int, 0)
  right := make([]int, 0)

  for _, value := range values {
    switch {
    case value < pivot:
      left = append(left, value)
    case value > pivot:
      right = append(right, value)
    default:
      middle = append(middle, value)
    }
  }

  left = QuickSort(left)
  right = QuickSort(right)
  result := append(left, middle...)
  result = append(result, right...)
  return result
}`,
    bfs: `package algo

func BFS(graph map[int][]int, start int) []int {
  queue := []int{start}
  visited := map[int]bool{start: true}
  order := make([]int, 0, len(graph))

  for len(queue) > 0 {
    node := queue[0]
    queue = queue[1:]
    order = append(order, node)

    for _, next := range graph[node] {
      if visited[next] {
        continue
      }
      visited[next] = true
      queue = append(queue, next)
    }
  }

  return order
}`,
    dfs: `package algo

func DFS(graph map[int][]int, start int) []int {
  visited := map[int]bool{}
  order := []int{}

  var walk func(node int)
  walk = func(node int) {
    visited[node] = true
    order = append(order, node)

    for _, next := range graph[node] {
      if !visited[next] {
        walk(next)
      }
    }
  }

  walk(start)
  return order
}`,
    dijkstra: `package algo

import "container/heap"

type Edge struct {
  to     int
  weight int
}

type Item struct {
  dist int
  node int
}

type PriorityQueue []Item

func (pq PriorityQueue) Len() int           { return len(pq) }
func (pq PriorityQueue) Less(i, j int) bool { return pq[i].dist < pq[j].dist }
func (pq PriorityQueue) Swap(i, j int)      { pq[i], pq[j] = pq[j], pq[i] }
func (pq *PriorityQueue) Push(x any)        { *pq = append(*pq, x.(Item)) }
func (pq *PriorityQueue) Pop() any {
  old := *pq
  item := old[len(old)-1]
  *pq = old[:len(old)-1]
  return item
}

func Dijkstra(graph map[int][]Edge, start int) map[int]int {
  const inf = int(1e9)
  dist := map[int]int{}
  for node := range graph {
    dist[node] = inf
  }
  dist[start] = 0

  pq := &PriorityQueue{{dist: 0, node: start}}
  heap.Init(pq)

  for pq.Len() > 0 {
    item := heap.Pop(pq).(Item)
    if item.dist != dist[item.node] {
      continue
    }

    for _, edge := range graph[item.node] {
      nextDist := item.dist + edge.weight
      if cur, ok := dist[edge.to]; !ok || nextDist < cur {
        dist[edge.to] = nextDist
        heap.Push(pq, Item{dist: nextDist, node: edge.to})
      }
    }
  }

  return dist
}`,
    knapsack_01: `package algo

func Knapsack01(weights []int, values []int, capacity int) int {
  n := len(weights)
  dp := make([][]int, n+1)
  for i := range dp {
    dp[i] = make([]int, capacity+1)
  }

  for i := 1; i <= n; i++ {
    for c := 0; c <= capacity; c++ {
      dp[i][c] = dp[i-1][c]
      if weights[i-1] <= c {
        candidate := values[i-1] + dp[i-1][c-weights[i-1]]
        if candidate > dp[i][c] {
          dp[i][c] = candidate
        }
      }
    }
  }

  return dp[n][capacity]
}`,
    lcs: `package algo

func LCS(a string, b string) int {
  n := len(a)
  m := len(b)
  dp := make([][]int, n+1)
  for i := range dp {
    dp[i] = make([]int, m+1)
  }

  for i := 1; i <= n; i++ {
    for j := 1; j <= m; j++ {
      if a[i-1] == b[j-1] {
        dp[i][j] = dp[i-1][j-1] + 1
      } else if dp[i-1][j] > dp[i][j-1] {
        dp[i][j] = dp[i-1][j]
      } else {
        dp[i][j] = dp[i][j-1]
      }
    }
  }

  return dp[n][m]
}`,
    edit_distance: `package algo

func EditDistance(a string, b string) int {
  n := len(a)
  m := len(b)
  dp := make([][]int, n+1)
  for i := range dp {
    dp[i] = make([]int, m+1)
  }

  for i := 0; i <= n; i++ {
    dp[i][0] = i
  }
  for j := 0; j <= m; j++ {
    dp[0][j] = j
  }

  for i := 1; i <= n; i++ {
    for j := 1; j <= m; j++ {
      cost := 0
      if a[i-1] != b[j-1] {
        cost = 1
      }

      insertCost := dp[i][j-1] + 1
      deleteCost := dp[i-1][j] + 1
      replaceCost := dp[i-1][j-1] + cost

      best := insertCost
      if deleteCost < best {
        best = deleteCost
      }
      if replaceCost < best {
        best = replaceCost
      }

      dp[i][j] = best
    }
  }

  return dp[n][m]
}`,
    kmp: `package algo

func KMP(text string, pattern string) []int {
  if len(pattern) == 0 {
    return []int{}
  }

  lps := make([]int, len(pattern))
  for i, j := 1, 0; i < len(pattern); i++ {
    for j > 0 && pattern[i] != pattern[j] {
      j = lps[j-1]
    }
    if pattern[i] == pattern[j] {
      j++
      lps[i] = j
    }
  }

  result := []int{}
  for i, j := 0, 0; i < len(text); i++ {
    for j > 0 && text[i] != pattern[j] {
      j = lps[j-1]
    }
    if text[i] == pattern[j] {
      j++
      if j == len(pattern) {
        result = append(result, i-len(pattern)+1)
        j = lps[j-1]
      }
    }
  }

  return result
}`,
    rabin_karp: `package algo

func RabinKarp(text string, pattern string) []int {
  n := len(text)
  m := len(pattern)
  if m == 0 || m > n {
    return []int{}
  }

  const base = int64(256)
  const mod = int64(1000000007)

  power := int64(1)
  for i := 0; i < m-1; i++ {
    power = (power * base) % mod
  }

  var patternHash int64
  var textHash int64
  for i := 0; i < m; i++ {
    patternHash = (patternHash*base + int64(pattern[i])) % mod
    textHash = (textHash*base + int64(text[i])) % mod
  }

  matches := []int{}
  for i := 0; i <= n-m; i++ {
    if patternHash == textHash && text[i:i+m] == pattern {
      matches = append(matches, i)
    }

    if i < n-m {
      textHash = (textHash - int64(text[i])*power) % mod
      if textHash < 0 {
        textHash += mod
      }
      textHash = (textHash*base + int64(text[i+m])) % mod
    }
  }

  return matches
}`,
  };

  return code[name] || "package algo\n\nfunc Run() {\n  // Go implementation is not yet available for this algorithm.\n}";
}

function getJavaCode(name) {
  const code = {
    bubble_sort: `import java.util.*;\nclass BubbleSort{static int[] run(int[] a){int[] b=a.clone();for(int i=0;i<b.length;i++){boolean sw=false;for(int j=0;j+1<b.length-i;j++){if(b[j]>b[j+1]){int t=b[j];b[j]=b[j+1];b[j+1]=t;sw=true;}}if(!sw)break;}return b;}}`,
    counting_sort: `import java.util.*;\nclass CountingSort{static int[] run(int[] a){if(a.length==0)return a;int lo=Integer.MAX_VALUE,hi=Integer.MIN_VALUE;for(int v:a){lo=Math.min(lo,v);hi=Math.max(hi,v);}int off=lo<0?-lo:0;int[] cnt=new int[hi+off+1];for(int v:a)cnt[v+off]++;for(int i=1;i<cnt.length;i++)cnt[i]+=cnt[i-1];int[] out=new int[a.length];for(int i=a.length-1;i>=0;i--){int idx=a[i]+off;out[--cnt[idx]]=a[i];}return out;}}`,
    selection_sort: `class SelectionSort{static int[] run(int[] a){int[] b=a.clone();for(int i=0;i<b.length;i++){int m=i;for(int j=i+1;j<b.length;j++)if(b[j]<b[m])m=j;int t=b[i];b[i]=b[m];b[m]=t;}return b;}}`,
    insertion_sort: `class InsertionSort{static int[] run(int[] a){int[] b=a.clone();for(int i=1;i<b.length;i++){int key=b[i],j=i-1;while(j>=0&&b[j]>key){b[j+1]=b[j];j--;}b[j+1]=key;}return b;}}`,
    merge_sort: `import java.util.*;\nclass MergeSort{static int[] run(int[] a){if(a.length<=1)return a;int m=a.length/2;int[] l=run(Arrays.copyOfRange(a,0,m)),r=run(Arrays.copyOfRange(a,m,a.length));int[] o=new int[a.length];int i=0,j=0,k=0;while(i<l.length&&j<r.length)o[k++]=l[i]<=r[j]?l[i++]:r[j++];while(i<l.length)o[k++]=l[i++];while(j<r.length)o[k++]=r[j++];return o;}}`,
    quick_sort: `import java.util.*;\nclass QuickSort{static int[] run(int[] a){if(a.length<=1)return a;int p=a[a.length/2];List<Integer> l=new ArrayList<>(),m=new ArrayList<>(),r=new ArrayList<>();for(int x:a){if(x<p)l.add(x);else if(x==p)m.add(x);else r.add(x);}int[] la=run(l.stream().mapToInt(Integer::intValue).toArray());int[] ra=run(r.stream().mapToInt(Integer::intValue).toArray());int[] out=new int[a.length];int k=0;for(int x:la)out[k++]=x;for(int x:m)out[k++]=x;for(int x:ra)out[k++]=x;return out;}}`,
    heap_sort: `import java.util.*;\nclass HeapSort{static int[] run(int[] a){PriorityQueue<Integer> pq=new PriorityQueue<>();for(int x:a)pq.add(x);int[] out=new int[a.length];for(int i=0;i<a.length;i++)out[i]=pq.poll();return out;}}`,
    radix_sort: `class RadixSort{static int[] run(int[] a){int[] b=a.clone();int mx=0;for(int v:b)mx=Math.max(mx,v);for(int exp=1;mx/exp>0;exp*=10){int[] out=new int[b.length],cnt=new int[10];for(int v:b)cnt[(v/exp)%10]++;for(int i=1;i<10;i++)cnt[i]+=cnt[i-1];for(int i=b.length-1;i>=0;i--){int d=(b[i]/exp)%10;out[--cnt[d]]=b[i];}b=out;}return b;}}`,
    randomized_quick_sort: `import java.util.*;\nclass RandomizedQuickSort{static Random R=new Random();static int[] run(int[] a){if(a.length<=1)return a;int p=a[R.nextInt(a.length)];ArrayList<Integer> l=new ArrayList<>(),m=new ArrayList<>(),r=new ArrayList<>();for(int x:a){if(x<p)l.add(x);else if(x==p)m.add(x);else r.add(x);}int[] la=run(l.stream().mapToInt(Integer::intValue).toArray());int[] ra=run(r.stream().mapToInt(Integer::intValue).toArray());int[] o=new int[a.length];int k=0;for(int x:la)o[k++]=x;for(int x:m)o[k++]=x;for(int x:ra)o[k++]=x;return o;}}`,
    bfs: `import java.util.*;\nclass BFS{static List<Integer> run(List<List<Integer>> g,int s){Queue<Integer> q=new ArrayDeque<>();boolean[] vis=new boolean[g.size()];List<Integer> out=new ArrayList<>();q.add(s);vis[s]=true;while(!q.isEmpty()){int u=q.poll();out.add(u);for(int v:g.get(u))if(!vis[v]){vis[v]=true;q.add(v);}}return out;}}`,
    dfs: `import java.util.*;\nclass DFS{static void go(int u,List<List<Integer>> g,boolean[] vis,List<Integer> out){vis[u]=true;out.add(u);for(int v:g.get(u))if(!vis[v])go(v,g,vis,out);}static List<Integer> run(List<List<Integer>> g,int s){boolean[] vis=new boolean[g.size()];List<Integer> out=new ArrayList<>();go(s,g,vis,out);return out;}}`,
    dijkstra: `import java.util.*;\nclass Dijkstra{static long[] run(List<List<int[]>> g,int s){long INF=(long)4e18;long[] d=new long[g.size()];Arrays.fill(d,INF);d[s]=0;PriorityQueue<long[]> pq=new PriorityQueue<>(Comparator.comparingLong(a->a[0]));pq.add(new long[]{0,s});while(!pq.isEmpty()){long[] cur=pq.poll();long du=cur[0];int u=(int)cur[1];if(du!=d[u])continue;for(int[] e:g.get(u)){int v=e[0],w=e[1];if(du+w<d[v]){d[v]=du+w;pq.add(new long[]{d[v],v});}}}return d;}}`,
    bellman_ford: `import java.util.*;\nclass BellmanFord{static long[] run(int n,List<int[]> edges,int s){long INF=(long)4e18;long[] d=new long[n];Arrays.fill(d,INF);d[s]=0;for(int i=0;i<n-1;i++){boolean upd=false;for(int[] e:edges){int u=e[0],v=e[1],w=e[2];if(d[u]!=INF&&d[u]+w<d[v]){d[v]=d[u]+w;upd=true;}}if(!upd)break;}return d;}}`,
    floyd_warshall: `class FloydWarshall{static long[][] run(long[][] d){int n=d.length;long[][] a=new long[n][n];for(int i=0;i<n;i++)a[i]=d[i].clone();for(int k=0;k<n;k++)for(int i=0;i<n;i++)for(int j=0;j<n;j++)if(a[i][k]+a[k][j]<a[i][j])a[i][j]=a[i][k]+a[k][j];return a;}}`,
    ford_fulkerson: `import java.util.*;\nclass MaxFlow{static int run(int[][] cap,int s,int t){int n=cap.length,flow=0;for(;;){int[] p=new int[n];Arrays.fill(p,-1);p[s]=s;Queue<Integer> q=new ArrayDeque<>();q.add(s);while(!q.isEmpty()&&p[t]==-1){int u=q.poll();for(int v=0;v<n;v++)if(p[v]==-1&&cap[u][v]>0){p[v]=u;q.add(v);}}if(p[t]==-1)break;int add=Integer.MAX_VALUE;for(int v=t;v!=s;v=p[v])add=Math.min(add,cap[p[v]][v]);for(int v=t;v!=s;v=p[v]){cap[p[v]][v]-=add;cap[v][p[v]]+=add;}flow+=add;}return flow;}}`,
    graph_coloring: `class GraphColoring{static boolean bt(int v,int[] c,int[][] a,int m){if(v==a.length)return true;for(int col=1;col<=m;col++){boolean ok=true;for(int u=0;u<a.length;u++)if(a[v][u]==1&&c[u]==col)ok=false;if(ok){c[v]=col;if(bt(v+1,c,a,m))return true;c[v]=0;}}return false;}static int[] run(int[][] a,int m){int[] c=new int[a.length];return bt(0,c,a,m)?c:new int[0];}}`,
    hamiltonian_cycle: `class Hamiltonian{static boolean bt(int pos,int[] path,int[][] a){int n=a.length;if(pos==n)return a[path[n-1]][path[0]]==1;for(int v=1;v<n;v++){boolean used=false;for(int i=0;i<pos;i++)if(path[i]==v)used=true;if(!used&&a[path[pos-1]][v]==1){path[pos]=v;if(bt(pos+1,path,a))return true;path[pos]=-1;}}return false;}static int[] run(int[][] a){int[] path=new int[a.length];java.util.Arrays.fill(path,-1);path[0]=0;if(bt(1,path,a)){int[] out=new int[a.length+1];for(int i=0;i<a.length;i++)out[i]=path[i];out[a.length]=0;return out;}return new int[0];}}`,
    prim: `import java.util.*;\nclass Prim{static List<int[]> run(List<List<int[]>> g,int s){boolean[] vis=new boolean[g.size()];PriorityQueue<int[]> pq=new PriorityQueue<>(Comparator.comparingInt(a->a[0]));vis[s]=true;for(int[] e:g.get(s))pq.add(new int[]{e[1],s,e[0]});List<int[]> out=new ArrayList<>();while(!pq.isEmpty()){int[] cur=pq.poll();int w=cur[0],u=cur[1],v=cur[2];if(vis[v])continue;vis[v]=true;out.add(new int[]{u,v,w});for(int[] e:g.get(v))if(!vis[e[0]])pq.add(new int[]{e[1],v,e[0]});}return out;}}`,
    kruskal: `import java.util.*;\nclass Kruskal{static class DSU{int[] p,r;DSU(int n){p=new int[n];r=new int[n];for(int i=0;i<n;i++)p[i]=i;}int f(int x){return p[x]==x?x:(p[x]=f(p[x]));}boolean u(int a,int b){a=f(a);b=f(b);if(a==b)return false;if(r[a]<r[b]){int t=a;a=b;b=t;}p[b]=a;if(r[a]==r[b])r[a]++;return true;}}static List<int[]> run(int n,List<int[]> edges){edges.sort(Comparator.comparingInt(e->e[0]));DSU d=new DSU(n);List<int[]> out=new ArrayList<>();for(int[] e:edges)if(d.u(e[1],e[2]))out.add(new int[]{e[1],e[2],e[0]});return out;}}`,
    tsp_branch_bound: `class TSPBranchBound{static int best;static void bt(int u,int cnt,int cur,int[][] c,boolean[] vis){int n=c.length;if(cnt==n){best=Math.min(best,cur+c[u][0]);return;}if(cur>=best)return;for(int v=0;v<n;v++)if(!vis[v]&&c[u][v]>0){vis[v]=true;bt(v,cnt+1,cur+c[u][v],c,vis);vis[v]=false;}}static int run(int[][] c){best=Integer.MAX_VALUE;boolean[] vis=new boolean[c.length];vis[0]=true;bt(0,1,0,c,vis);return best;}}`,
    knapsack_01: `class Knapsack01{static int run(int[] w,int[] val,int W){int n=w.length;int[][] dp=new int[n+1][W+1];for(int i=1;i<=n;i++)for(int c=0;c<=W;c++){dp[i][c]=dp[i-1][c];if(w[i-1]<=c)dp[i][c]=Math.max(dp[i][c],val[i-1]+dp[i-1][c-w[i-1]]);}return dp[n][W];}}`,
    lcs: `class LCS{static int run(String a,String b){int n=a.length(),m=b.length();int[][] dp=new int[n+1][m+1];for(int i=1;i<=n;i++)for(int j=1;j<=m;j++)dp[i][j]=a.charAt(i-1)==b.charAt(j-1)?dp[i-1][j-1]+1:Math.max(dp[i-1][j],dp[i][j-1]);return dp[n][m];}}`,
    edit_distance: `class EditDistance{static int run(String a,String b){int n=a.length(),m=b.length();int[][] dp=new int[n+1][m+1];for(int i=0;i<=n;i++)dp[i][0]=i;for(int j=0;j<=m;j++)dp[0][j]=j;for(int i=1;i<=n;i++)for(int j=1;j<=m;j++){int c=a.charAt(i-1)==b.charAt(j-1)?0:1;dp[i][j]=Math.min(dp[i-1][j]+1,Math.min(dp[i][j-1]+1,dp[i-1][j-1]+c));}return dp[n][m];}}`,
    matrix_chain_multiplication: `class MatrixChain{static int run(int[] d){int n=d.length-1;int[][] dp=new int[n][n];for(int L=2;L<=n;L++)for(int i=0;i+L-1<n;i++){int j=i+L-1;dp[i][j]=Integer.MAX_VALUE;for(int k=i;k<j;k++)dp[i][j]=Math.min(dp[i][j],dp[i][k]+dp[k+1][j]+d[i]*d[k+1]*d[j+1]);}return dp[0][n-1];}}`,
    naive: `import java.util.*;\nclass NaiveSearch{static List<Integer> run(String t,String p){List<Integer> out=new ArrayList<>();for(int i=0;i+p.length()<=t.length();i++)if(t.substring(i,i+p.length()).equals(p))out.add(i);return out;}}`,
    kmp: `import java.util.*;\nclass KMP{static List<Integer> run(String t,String p){int m=p.length();int[] lps=new int[m];for(int i=1,j=0;i<m;i++){while(j>0&&p.charAt(i)!=p.charAt(j))j=lps[j-1];if(p.charAt(i)==p.charAt(j))lps[i]=++j;}List<Integer> out=new ArrayList<>();for(int i=0,j=0;i<t.length();i++){while(j>0&&t.charAt(i)!=p.charAt(j))j=lps[j-1];if(t.charAt(i)==p.charAt(j))j++;if(j==m){out.add(i-m+1);j=lps[j-1];}}return out;}}`,
    z_algorithm: `import java.util.*;\nclass ZAlgorithm{static List<Integer> run(String text,String pattern){List<Integer> out=new ArrayList<>();if(pattern.isEmpty())return out;String s=pattern+"$"+text;int[] z=new int[s.length()];int l=0,r=0;for(int i=1;i<s.length();i++){if(i<=r)z[i]=Math.min(r-i+1,z[i-l]);while(i+z[i]<s.length()&&s.charAt(z[i])==s.charAt(i+z[i]))z[i]++;if(i+z[i]-1>r){l=i;r=i+z[i]-1;}}for(int i=pattern.length()+1;i<s.length();i++)if(z[i]>=pattern.length())out.add(i-pattern.length()-1);return out;}}`,
    rabin_karp: `import java.util.*;\nclass RabinKarp{static List<Integer> run(String t,String p){int n=t.length(),m=p.length();List<Integer> out=new ArrayList<>();if(m>n)return out;long B=256,M=1_000_000_007L,ph=0,th=0,pow=1;for(int i=0;i<m-1;i++)pow=(pow*B)%M;for(int i=0;i<m;i++){ph=(ph*B+p.charAt(i))%M;th=(th*B+t.charAt(i))%M;}for(int i=0;i<=n-m;i++){if(ph==th&&t.substring(i,i+m).equals(p))out.add(i);if(i<n-m){th=(th-t.charAt(i)*pow)%M;if(th<0)th+=M;th=(th*B+t.charAt(i+m))%M;}}return out;}}`,
    huffman_coding: `import java.util.*;\nclass Huffman{static class Node{char ch;int f;Node l,r;Node(char c,int f){this.ch=c;this.f=f;}Node(Node a,Node b){this.ch='\\0';this.f=a.f+b.f;this.l=a;this.r=b;}}\nstatic void build(Node n,String p,Map<Character,String> code){if(n==null)return;if(n.ch!='\\0'){code.put(n.ch,p.isEmpty()?"0":p);return;}build(n.l,p+"0",code);build(n.r,p+"1",code);}}`
  };
  return code[name] || "class Runner{static int run(){return 0;}}";
}

