export const CATEGORY_LABELS = {
  sorting: "Sorting",
  graph: "Graph",
  dp: "Dynamic Programming",
  string: "String Matching"
};

const CATEGORY_ORDER = ["sorting", "graph", "dp", "string"];

export const ALGO_DISPLAY_NAMES = {
  bubble_sort: "Bubble Sort",
  selection_sort: "Selection Sort",
  insertion_sort: "Insertion Sort",
  merge_sort: "Merge Sort",
  quick_sort: "Quick Sort",
  heap_sort: "Heap Sort",
  radix_sort: "Radix Sort",
  randomized_quick_sort: "Randomized Quick Sort",
  randomized_quick: "Randomized Quick Sort",
  bfs: "Breadth-First Search",
  dfs: "Depth-First Search",
  dijkstra: "Dijkstra's Algorithm",
  floyd_warshall: "Floyd-Warshall",
  ford_fulkerson: "Ford-Fulkerson (Edmonds-Karp)",
  graph_coloring: "Graph Coloring",
  hamiltonian_cycle: "Hamiltonian Cycle",
  hamiltonian: "Hamiltonian Cycle",
  prim: "Prim's MST",
  kruskal: "Kruskal's MST",
  tsp_branch_bound: "TSP (Branch & Bound)",
  tsp: "TSP (Branch & Bound)",
  knapsack_01: "0/1 Knapsack",
  lcs: "Longest Common Subsequence",
  matrix_chain_multiplication: "Matrix Chain Multiplication",
  matrix_chain: "Matrix Chain Multiplication",
  naive: "Naive Pattern Matching",
  kmp: "KMP Algorithm",
  rabin_karp: "Rabin-Karp"
};

export const LANGUAGE_LABELS = {
  python: "Python",
  javascript: "JavaScript",
  cpp: "C++",
  java: "Java"
};

export const LANGUAGE_TAB_WIDTHS = {
  python: "70px",
  javascript: "95px",
  cpp: "55px",
  java: "60px"
};

export const getLanguages = () => ["python", "javascript", "cpp", "java"];

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
  rabin_karp: {
    best_time: "n = text length, m = pattern length.",
    average_time: "Rolling hash yields expected O(n + m).",
    worst_time: "Many hash collisions can degrade to O(nm).",
    space: "Uses constant-size hash variables."
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
  selection_sort: { best_time: "O(n^2)", average_time: "O(n^2)", worst_time: "O(n^2)", space: "O(1)" },
  insertion_sort: { best_time: "O(n)", average_time: "O(n^2)", worst_time: "O(n^2)", space: "O(1)" },
  merge_sort: { best_time: "O(n log n)", average_time: "O(n log n)", worst_time: "O(n log n)", space: "O(n)" },
  quick_sort: { best_time: "O(n log n)", average_time: "O(n log n)", worst_time: "O(n^2)", space: "O(log n)" },
  heap_sort: { best_time: "O(n log n)", average_time: "O(n log n)", worst_time: "O(n log n)", space: "O(1)" },
  radix_sort: { best_time: "O(nk)", average_time: "O(nk)", worst_time: "O(nk)", space: "O(n + b)" },
  randomized_quick_sort: { best_time: "O(n log n)", average_time: "O(n log n)", worst_time: "O(n^2)", space: "O(log n)" }
};

const graphComplexity = {
  bfs: { best_time: "O(V + E)", average_time: "O(V + E)", worst_time: "O(V + E)", space: "O(V)" },
  dfs: { best_time: "O(V + E)", average_time: "O(V + E)", worst_time: "O(V + E)", space: "O(V)" },
  dijkstra: { best_time: "O((V + E) log V)", average_time: "O((V + E) log V)", worst_time: "O((V + E) log V)", space: "O(V)" },
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
  matrix_chain_multiplication: { best_time: "O(n^3)", average_time: "O(n^3)", worst_time: "O(n^3)", space: "O(n^2)" }
};

const stringComplexity = {
  naive: { best_time: "O(nm)", average_time: "O(nm)", worst_time: "O(nm)", space: "O(1)" },
  kmp: { best_time: "O(n + m)", average_time: "O(n + m)", worst_time: "O(n + m)", space: "O(m)" },
  rabin_karp: { best_time: "O(n + m)", average_time: "O(n + m)", worst_time: "O(nm)", space: "O(1)" }
};

export const ALGORITHM_CATALOG = [
  baseAlgo("bubble_sort", "sorting", sortingComplexity.bubble_sort, "Repeatedly compares adjacent values and swaps out-of-order pairs.", "Bubble Sort repeatedly scans adjacent pairs and swaps whenever left > right. The largest unsorted element settles at the end after each pass. An early-exit flag stops when no swaps occur. It performs best on nearly sorted arrays and worst on reverse-sorted arrays. It is used in teaching and tiny data scenarios.", "Local adjacent corrections eventually create global order.", ["Small nearly sorted arrays", "Pedagogical demos", "Low-memory in-place sorts"], ["Large random arrays", "Performance-critical pipelines"], ["Teaching sorting basics", "Visual algorithm demonstrations"], ["Quadratic runtime on large inputs"], ["Use early-exit optimization"]),
  baseAlgo("selection_sort", "sorting", sortingComplexity.selection_sort, "Selects minimum element and places it at the current position.", "Selection Sort divides the list into sorted and unsorted regions. In each pass, it finds the minimum in the unsorted part and swaps it forward. It uses few swaps but many comparisons. Input order has little impact on runtime. It suits write-limited media where swaps are expensive.", "Minimize writes by paying with comparisons.", ["Memory-constrained in-place sorting", "Write-sensitive storage"], ["Large data needing fast runtime", "Adaptive sorting needs"], ["Embedded systems with expensive writes"], ["Always O(n^2) comparisons"], ["Use when swap count matters more than comparisons"]),
  baseAlgo("insertion_sort", "sorting", sortingComplexity.insertion_sort, "Builds sorted prefix by inserting each element into its correct spot.", "Insertion Sort grows a sorted prefix from left to right. Each new value is shifted left until it reaches its insertion point. Nearly sorted data produces very few shifts. Reverse-sorted data produces the most shifts. It is common as a base case in hybrid sorting algorithms.", "Maintain a sorted prefix and insert the next value efficiently.", ["Small arrays", "Nearly sorted data", "Hybrid algorithm base case"], ["Very large random arrays"], ["Interactive sorting demos", "Online insertion tasks"], ["Quadratic in the general case"], ["Use binary insertion variation for fewer comparisons"]),
  baseAlgo("merge_sort", "sorting", sortingComplexity.merge_sort, "Recursively splits the array and merges sorted halves.", "Merge Sort applies divide-and-conquer by splitting the array recursively. Each half is sorted independently, then merged linearly. Its runtime is reliably O(n log n) regardless of input order. It requires extra memory for merging. It is excellent for stable sorting and external storage workflows.", "Balanced splitting plus linear merging yields stable O(n log n).", ["Large datasets", "Stable sorting requirements", "External sorting"], ["Strict in-place memory constraints"], ["Database sorting", "File merge pipelines"], ["Needs auxiliary memory"], ["Use iterative bottom-up merge for better cache behavior"]),
  baseAlgo("quick_sort", "sorting", sortingComplexity.quick_sort, "Partitions around a pivot and recursively sorts both sides.", "Quick Sort chooses a pivot and partitions values into less-than and greater-than regions. It recursively sorts both partitions. Average performance is excellent with good cache behavior. Bad pivots can create unbalanced recursion. It is widely used in in-memory sorting libraries.", "Good partition quality drives fast recursive convergence.", ["Fast in-memory sorting", "Average-case optimized workloads"], ["Adversarial ordered input without pivot strategy"], ["General-purpose array sorting"], ["Worst-case quadratic if partitions are poor"], ["Use median/random pivots to avoid degeneration"]),
  baseAlgo("heap_sort", "sorting", sortingComplexity.heap_sort, "Builds a max heap and repeatedly extracts the maximum.", "Heap Sort first transforms data into a max heap. It repeatedly swaps the root with the last unsorted element and restores heap order. Runtime is deterministic O(n log n). It works in-place and avoids recursion depth issues. Cache locality is typically worse than quick sort.", "Heap property guarantees logarithmic extract-and-fix operations.", ["Need guaranteed O(n log n)", "In-place sorting"], ["Cache-sensitive workloads"], ["Real-time deterministic sorting"], ["Less cache friendly than quick sort"], ["Use when guaranteed bound is mandatory"]),
  baseAlgo("radix_sort", "sorting", sortingComplexity.radix_sort, "Sorts keys digit-by-digit using a stable counting pass.", "Radix Sort processes digits from least to most significant. Each pass uses a stable counting sort by current digit. It avoids comparison-based lower bounds for fixed-width keys. Runtime depends on digit count and radix, not key ordering. It is effective for integer keys and fixed-length strings.", "Stable per-digit passes compose into globally sorted order.", ["Fixed-width integer keys", "Large numeric datasets"], ["Arbitrary object comparison sorting"], ["Index construction", "Telemetry/event key sorting"], ["Requires digit-friendly key representation"], ["Tune radix/base for cache efficiency"]),
  baseAlgo("randomized_quick_sort", "sorting", sortingComplexity.randomized_quick_sort, "Quick sort variant with random pivot selection.", "Randomized Quick Sort samples pivots randomly before partitioning. This dramatically reduces probability of pathological partition patterns. It keeps quick sort's practical speed with stronger expected guarantees. Worst-case O(n^2) remains theoretically possible. It is robust for mixed and unknown input distributions.", "Randomization neutralizes many adversarial input orders.", ["Unpredictable input distributions", "Competitive programming"], ["Environments requiring strict deterministic traces"], ["General robust in-memory sorting"], ["Non-deterministic behavior between runs"], ["Use seeded RNG for reproducibility"]),
  baseAlgo("bfs", "graph", graphComplexity.bfs, "Level-order graph traversal from a start vertex using a queue.", "BFS explores neighbors level by level from a source node. It uses a queue to process nodes in discovery order. In unweighted graphs, first discovery gives shortest hop count. It scales linearly with vertices plus edges on adjacency lists. It is used in reachability, shortest hops, and layer analysis.", "FIFO exploration guarantees minimal-edge paths in unweighted graphs.", ["Unweighted shortest paths", "Reachability queries", "Level-wise traversal"], ["Weighted shortest-path problems"], ["Social graph hop distance", "Network reachability"], ["Needs queue memory proportional to frontier"], ["Use adjacency lists for O(V + E) traversal"]),
  baseAlgo("dfs", "graph", graphComplexity.dfs, "Depth-first graph traversal via recursion or explicit stack.", "DFS pushes as deep as possible along a branch before backtracking. It naturally supports recursion or manual stack implementations. DFS is foundational for cycle detection, connected components, and topological preprocessing. Runtime is linear in V + E with adjacency lists. It is widely used in graph structure analysis.", "Explore depth first to reveal component and back-edge structure.", ["Connectivity and cycle analysis", "Traversal ordering", "Backtracking frameworks"], ["Unweighted shortest path tasks"], ["Dependency analysis", "Maze exploration"], ["Recursive versions can hit stack limits on deep graphs"], ["Use iterative stack for very deep graphs"]),
  baseAlgo("dijkstra", "graph", graphComplexity.dijkstra, "Single-source shortest paths for non-negative weighted graphs.", "Dijkstra maintains tentative distances from a source vertex. A priority queue always expands the currently closest unsettled node. Each relaxation can improve neighbors' tentative costs. Non-negative weights are required for correctness. It is standard in routing and map navigation engines.", "Greedy extraction of the minimum tentative distance remains globally safe with non-negative edges.", ["Weighted shortest paths", "Routing and navigation"], ["Graphs with negative edge weights"], ["Road-network pathfinding", "Latency minimization"], ["Requires non-negative weights"], ["Use adjacency lists + heap for sparse graphs"]),
  baseAlgo("floyd_warshall", "graph", graphComplexity.floyd_warshall, "All-pairs shortest paths using dynamic programming over intermediates.", "Floyd-Warshall iteratively allows each vertex as an intermediate waypoint. For each (i, j) pair, it checks whether i → k → j improves current distance. This yields all-pairs shortest paths in one cubic pass. It handles negative edges but not negative cycles. It is useful for dense graphs and complete distance matrices.", "Progressively adding intermediate sets transforms local relaxations into global all-pairs optimality.", ["All-pairs shortest path matrices", "Dense graph analysis"], ["Large sparse graphs needing speed"], ["Traffic matrix precomputation", "Graph closure analysis"], ["Cubic runtime can be expensive"], ["Prefer repeated Dijkstra on sparse graphs"]),
  baseAlgo("ford_fulkerson", "graph", graphComplexity.ford_fulkerson, "Max-flow by augmenting paths in a residual network.", "Ford-Fulkerson repeatedly finds source-to-sink augmenting paths. Each path increases flow by its minimum residual capacity. Residual back-edges allow revising earlier flow choices. Edmonds-Karp uses BFS for predictable path selection. It is used in scheduling, bipartite matching, and capacity planning.", "Residual graph updates convert local augmentations into globally increasing feasible flow.", ["Maximum flow and cut problems", "Capacity-limited routing"], ["Very large dense networks with tight latency budgets"], ["Assignment and matching", "Network throughput planning"], ["Can require many augmentations"], ["Use Dinic for higher performance on larger instances"]),
  baseAlgo("graph_coloring", "graph", graphComplexity.graph_coloring, "Assigns colors so adjacent vertices never share the same color.", "Graph coloring commonly uses backtracking with validity checks per assignment. It tries colors for each vertex and backtracks on conflicts. Problem hardness rises quickly with graph size and color limits. Heuristics can prune search significantly. It appears in timetable, register allocation, and frequency assignment tasks.", "Constraint satisfaction with backtracking explores legal color assignments efficiently when pruned.", ["Scheduling conflicts", "Register allocation"], ["Large exact-coloring instances without heuristics"], ["Exam timetable generation", "Frequency planning"], ["NP-hard in general"], ["Order vertices by degree to improve pruning"]),
  baseAlgo("hamiltonian_cycle", "graph", graphComplexity.hamiltonian_cycle, "Backtracking search for a cycle that visits each vertex once.", "Hamiltonian cycle search extends a candidate path one vertex at a time. It ensures adjacency and uniqueness constraints at each step. Dead-end branches are pruned via backtracking. The search is combinatorial and expensive in general. It is useful in route design and graph theory exploration.", "Build candidate tours incrementally and prune invalid partial paths early.", ["Small exact routing problems", "Graph-theory experimentation"], ["Large graphs requiring fast approximate answers"], ["Path/tour feasibility studies"], ["Exponential/factorial growth"], ["Use heuristics or approximations for large instances"]),
  baseAlgo("prim", "graph", graphComplexity.prim, "Minimum spanning tree by growing from a seed vertex.", "Prim starts from any vertex and repeatedly adds the cheapest edge connecting tree to a new node. A min-heap tracks candidate boundary edges efficiently. It builds one connected tree over all reachable vertices. Works very well on dense connected graphs with adjacency structures. It is used for network and infrastructure cost minimization.", "Always extend the current tree with the cheapest frontier edge.", ["MST for connected weighted graphs", "Network design"], ["Disconnected graphs without handling components"], ["Cable and road planning"], ["Requires weighted graph representation"], ["Use adjacency list + heap for scalable performance"]),
  baseAlgo("kruskal", "graph", graphComplexity.kruskal, "Minimum spanning tree by sorted edges + union-find cycle checks.", "Kruskal sorts edges by weight and scans from lightest to heaviest. It adds an edge only if it connects two different components. Union-find efficiently detects whether an addition forms a cycle. This yields an MST for each connected component. It is strong for sparse graphs and edge-list workflows.", "Global edge ordering plus DSU cycle checks yields a minimal forest.", ["Sparse weighted graphs", "Edge-list pipelines"], ["Very dense graphs where Prim with matrix may be simpler"], ["Clustering and segmentation", "Network wiring"], ["Sorting edges dominates runtime"], ["Use path compression + union by rank"]),
  baseAlgo("tsp_branch_bound", "graph", graphComplexity.tsp_branch_bound, "Exact TSP search with pruning via lower bounds.", "Branch-and-bound TSP explores permutations of city visits as a search tree. It computes lower bounds for partial tours to prune impossible winners. The best complete tour so far tightens pruning as search proceeds. Strong bounds can drastically cut explored branches. It is useful for exact solutions on small to medium instances.", "Bound quality controls how aggressively the exponential search tree shrinks.", ["Small/medium exact TSP", "Benchmarking approximate TSP methods"], ["Large city counts requiring real-time response"], ["Route optimization studies"], ["Exponential worst-case complexity"], ["Use nearest-neighbor initial bound to improve pruning"]),
  baseAlgo("knapsack_01", "dp", dpComplexity.knapsack_01, "DP optimization choosing items under a capacity limit.", "0/1 Knapsack builds a table where each state considers include-vs-exclude of the next item. Value transitions depend on remaining capacity. The final state gives maximum achievable value under capacity W. Runtime grows with both number of items and capacity. It is used in budgeting, packing, and resource allocation.", "Each item is a binary decision propagated through capacity states.", ["Budgeted selection", "Cargo/resource planning"], ["Huge capacities with strict memory limits"], ["Portfolio-like constrained choice problems"], ["Pseudo-polynomial dependency on capacity"], ["Use 1D DP when only final value is needed"]),
  baseAlgo("lcs", "dp", dpComplexity.lcs, "DP for longest subsequence common to two strings.", "LCS compares string prefixes and stores best subsequence length per pair. Matching characters extend diagonal states, mismatches take max of top/left states. The completed table encodes both length and reconstruction paths. Complexity is quadratic in two string lengths. It powers diff tools and sequence analysis.", "Optimal subsequences emerge from overlapping prefix subproblems.", ["Version/diff analysis", "Sequence similarity"], ["Very long strings without optimization"], ["Bioinformatics alignment", "Document comparison"], ["O(nm) memory/time can be large"], ["Use Hirschberg-style optimization for lower memory"]),
  baseAlgo("matrix_chain_multiplication", "dp", dpComplexity.matrix_chain_multiplication, "DP to find optimal parenthesization minimizing scalar multiplications.", "Matrix-chain DP evaluates subchain costs for every interval length. For each interval, it checks every split point and stores the cheapest cost. Reuse of overlapping subproblems avoids redundant recalculation. Output gives minimal multiplication count, and split table can reconstruct order. It is used in compilers and query optimizers.", "Optimal global order comes from optimal interval split composition.", ["Matrix multiplication planning", "Expression optimization"], ["Tiny chains where brute force is simpler"], ["Database/query plan optimization"], ["Cubic runtime as chain length grows"], ["Store split points to reconstruct parenthesization"]),
  baseAlgo("naive", "string", stringComplexity.naive, "Brute-force pattern matching by checking every alignment.", "Naive matching slides the pattern one position at a time over the text. At each window, it compares characters left to right until mismatch or full match. Simplicity makes it easy to implement and reason about. It can be expensive on long repetitive text. It is useful as a baseline and teaching reference.", "Try every alignment directly; correctness is immediate though not always fast.", ["Small strings", "Baseline correctness checks"], ["Large repetitive corpora"], ["Introductory string matching demos"], ["Can perform many redundant comparisons"], ["Prefer KMP/Rabin-Karp for larger workloads"]),
  baseAlgo("kmp", "string", stringComplexity.kmp, "Linear-time pattern matching using LPS failure function.", "KMP preprocesses the pattern into an LPS array capturing proper prefix/suffix matches. During text scan, mismatches jump pattern index without rewinding text index. This avoids re-checking many characters. Runtime is linear in text + pattern length. It is ideal for repeated searches over long strings.", "Failure links reuse previous match information instead of restarting comparisons.", ["Long text search", "Repeated pattern queries"], ["Very short strings where setup overhead dominates"], ["IDE search", "DNA motif scanning"], ["Needs extra preprocessing for each pattern"], ["Cache and reuse LPS for repeated scans"]),
  baseAlgo("rabin_karp", "string", stringComplexity.rabin_karp, "Rolling-hash based matching with verification on hash hits.", "Rabin-Karp computes hash of pattern and rolling hash of each text window. Most windows are rejected quickly by hash mismatch. Hash collisions are verified with direct character comparison. Expected runtime is linear with good hash parameters. It is effective for multi-pattern and plagiarism detection scenarios.", "Hash windows first, verify only candidate matches.", ["Large text fingerprinting", "Multiple pattern search"], ["Adversarial collision-prone hash settings"], ["Plagiarism and substring indexing"], ["Collision handling can add verification cost"], ["Use larger modulus or double hashing"])
];

export const getAlgorithmByName = (name) => ALGORITHM_CATALOG.find((algo) => algo.name === name) || null;

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
  if (category === "graph") return "border-amber-300/40 bg-amber-400/20 text-amber-100";
  if (category === "dp") return "border-blue-300/40 bg-blue-400/20 text-blue-100";
  if (category === "string") return "border-pink-300/40 bg-pink-400/20 text-pink-100";
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
    if (step?.type === "swap") {
      return `Step ${stepNo}: Compared index ${left} (val=${arr[left]}) and index ${right} (val=${arr[right]}) → swapped.`;
    }
    if (step?.type === "compare") {
      return `Step ${stepNo}: Compared index ${left} (val=${arr[left]}) and index ${right} (val=${arr[right]}).`;
    }
    return `Step ${stepNo}: ${step?.type || "Updated sorting state"}.`;
  }

  if (category === "graph") {
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
    if (algorithmName === "matrix_chain_multiplication") {
      return `Step ${stepNo}: dp[${r}][${c}] checked with split k=${step?.split}; best cost now ${v}.`;
    }
    return `Step ${stepNo}: dp[${r}][${c}] = ${v} (${step?.action === "match" ? "character match" : "max of neighbors"}).`;
  }

  if (category === "string") {
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

  return `Step ${stepNo}: Updated algorithm state.`;
};

function getCodeBundle(name) {
  return {
    python: getPythonCode(name),
    javascript: getJsCode(name),
    cpp: getCppCode(name),
    java: getJavaCode(name)
  };
}

function getPythonCode(name) {
  const code = {
    bubble_sort: `def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        swapped = False\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n                swapped = True\n        if not swapped:\n            break\n    return arr`,
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
    floyd_warshall: `def floyd_warshall(mat):\n    n = len(mat)\n    dist = [row[:] for row in mat]\n    for k in range(n):\n        for i in range(n):\n            for j in range(n):\n                if dist[i][k] + dist[k][j] < dist[i][j]:\n                    dist[i][j] = dist[i][k] + dist[k][j]\n    return dist`,
    ford_fulkerson: `from collections import deque\ndef max_flow(cap, s, t):\n    n = len(cap); flow = 0\n    while True:\n        p = [-1]*n; p[s] = s\n        q = deque([s])\n        while q and p[t] == -1:\n            u = q.popleft()\n            for v in range(n):\n                if p[v] == -1 and cap[u][v] > 0:\n                    p[v] = u; q.append(v)\n        if p[t] == -1:\n            break\n        add = 10**18; v = t\n        while v != s:\n            u = p[v]; add = min(add, cap[u][v]); v = u\n        v = t\n        while v != s:\n            u = p[v]; cap[u][v] -= add; cap[v][u] += add; v = u\n        flow += add\n    return flow`,
    graph_coloring: `def color_graph(adj, m):\n    n = len(adj); col = [0]*n\n    def safe(v, c):\n        return all(not adj[v][u] or col[u] != c for u in range(n))\n    def bt(v):\n        if v == n: return True\n        for c in range(1, m+1):\n            if safe(v, c):\n                col[v] = c\n                if bt(v+1): return True\n                col[v] = 0\n        return False\n    return col if bt(0) else None`,
    hamiltonian_cycle: `def hamiltonian_cycle(adj):\n    n = len(adj); path = [0] + [-1]*(n-1)\n    def valid(v, pos):\n        if not adj[path[pos-1]][v]: return False\n        return v not in path[:pos]\n    def bt(pos):\n        if pos == n: return adj[path[-1]][path[0]]\n        for v in range(1, n):\n            if valid(v, pos):\n                path[pos] = v\n                if bt(pos+1): return True\n                path[pos] = -1\n        return False\n    return path + [path[0]] if bt(1) else None`,
    prim: `import heapq\ndef prim(graph, start=0):\n    vis = set([start]); pq = []\n    for v, w in graph[start]: heapq.heappush(pq, (w, start, v))\n    mst = []\n    while pq and len(vis) < len(graph):\n        w, u, v = heapq.heappop(pq)\n        if v in vis: continue\n        vis.add(v); mst.append((u, v, w))\n        for nv, nw in graph[v]:\n            if nv not in vis: heapq.heappush(pq, (nw, v, nv))\n    return mst`,
    kruskal: `def kruskal(n, edges):\n    p = list(range(n)); r = [0]*n\n    def f(x):\n        while p[x] != x:\n            p[x] = p[p[x]]; x = p[x]\n        return x\n    def u(a,b):\n        ra, rb = f(a), f(b)\n        if ra == rb: return False\n        if r[ra] < r[rb]: ra, rb = rb, ra\n        p[rb] = ra\n        if r[ra] == r[rb]: r[ra] += 1\n        return True\n    mst = []\n    for w,a,b in sorted(edges):\n        if u(a,b): mst.append((a,b,w))\n    return mst`,
    tsp_branch_bound: `def tsp_branch_bound(cost):\n    n = len(cost); best = [float('inf')]\n    vis = [False]*n\n    def lb(path, cur):\n        return cur\n    def bt(u, cnt, cur):\n        if cnt == n:\n            best[0] = min(best[0], cur + cost[u][0]); return\n        if lb([], cur) >= best[0]: return\n        for v in range(n):\n            if not vis[v] and cost[u][v] > 0:\n                vis[v] = True\n                bt(v, cnt+1, cur + cost[u][v])\n                vis[v] = False\n    vis[0] = True\n    bt(0, 1, 0)\n    return best[0]`,
    knapsack_01: `def knapsack_01(weights, values, W):\n    n = len(weights)\n    dp = [[0]*(W+1) for _ in range(n+1)]\n    for i in range(1, n+1):\n        for w in range(W+1):\n            dp[i][w] = dp[i-1][w]\n            if weights[i-1] <= w:\n                dp[i][w] = max(dp[i][w], values[i-1] + dp[i-1][w-weights[i-1]])\n    return dp[n][W]`,
    lcs: `def lcs(a, b):\n    n, m = len(a), len(b)\n    dp = [[0]*(m+1) for _ in range(n+1)]\n    for i in range(1, n+1):\n        for j in range(1, m+1):\n            if a[i-1] == b[j-1]:\n                dp[i][j] = dp[i-1][j-1] + 1\n            else:\n                dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n    return dp[n][m]`,
    matrix_chain_multiplication: `def matrix_chain(d):\n    n = len(d) - 1\n    dp = [[0]*n for _ in range(n)]\n    for L in range(2, n+1):\n        for i in range(0, n-L+1):\n            j = i + L - 1\n            dp[i][j] = 10**18\n            for k in range(i, j):\n                dp[i][j] = min(dp[i][j], dp[i][k] + dp[k+1][j] + d[i]*d[k+1]*d[j+1])\n    return dp[0][n-1]`,
    naive: `def naive_search(text, pattern):\n    ans = []\n    for i in range(len(text)-len(pattern)+1):\n        if text[i:i+len(pattern)] == pattern:\n            ans.append(i)\n    return ans`,
    kmp: `def kmp(text, pattern):\n    m = len(pattern)\n    lps = [0]*m\n    j = 0\n    for i in range(1, m):\n        while j and pattern[i] != pattern[j]:\n            j = lps[j-1]\n        if pattern[i] == pattern[j]:\n            j += 1\n            lps[i] = j\n    ans = []; j = 0\n    for i, ch in enumerate(text):\n        while j and ch != pattern[j]:\n            j = lps[j-1]\n        if ch == pattern[j]:\n            j += 1\n            if j == m:\n                ans.append(i-m+1); j = lps[j-1]\n    return ans`,
    rabin_karp: `def rabin_karp(text, pattern):\n    n, m = len(text), len(pattern)\n    if m > n: return []\n    base, mod = 256, 10**9 + 7\n    power = pow(base, m-1, mod)\n    ph = th = 0\n    for i in range(m):\n        ph = (ph*base + ord(pattern[i])) % mod\n        th = (th*base + ord(text[i])) % mod\n    ans = []\n    for i in range(n-m+1):\n        if ph == th and text[i:i+m] == pattern: ans.append(i)\n        if i < n-m:\n            th = (th - ord(text[i])*power) % mod\n            th = (th*base + ord(text[i+m])) % mod\n    return ans`
  };
  return code[name] || "# Code unavailable";
}

function getJsCode(name) {
  const code = {
    bubble_sort: `function bubbleSort(arr){const a=[...arr];for(let i=0;i<a.length;i++){let sw=false;for(let j=0;j<a.length-i-1;j++){if(a[j]>a[j+1]){[a[j],a[j+1]]=[a[j+1],a[j]];sw=true;}}if(!sw)break;}return a;}`,
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
    floyd_warshall: `function floydWarshall(mat){const d=mat.map(r=>[...r]);for(let k=0;k<d.length;k++)for(let i=0;i<d.length;i++)for(let j=0;j<d.length;j++)if(d[i][k]+d[k][j]<d[i][j])d[i][j]=d[i][k]+d[k][j];return d;}`,
    ford_fulkerson: `function maxFlow(cap,s,t){const n=cap.length;let flow=0;for(;;){const p=Array(n).fill(-1);p[s]=s;const q=[s];for(let qi=0;qi<q.length&&p[t]===-1;qi++){const u=q[qi];for(let v=0;v<n;v++)if(p[v]===-1&&cap[u][v]>0){p[v]=u;q.push(v);}}if(p[t]===-1)break;let add=1e18;for(let v=t;v!==s;v=p[v])add=Math.min(add,cap[p[v]][v]);for(let v=t;v!==s;v=p[v]){cap[p[v]][v]-=add;cap[v][p[v]]+=add;}flow+=add;}return flow;}`,
    graph_coloring: `function graphColoring(adj,m){const n=adj.length,col=Array(n).fill(0);const ok=(v,c)=>{for(let u=0;u<n;u++)if(adj[v][u]&&col[u]===c)return false;return true;};const bt=v=>{if(v===n)return true;for(let c=1;c<=m;c++){if(ok(v,c)){col[v]=c;if(bt(v+1))return true;col[v]=0;}}return false;};return bt(0)?col:null;}`,
    hamiltonian_cycle: `function hamiltonianCycle(adj){const n=adj.length,path=[0,...Array(n-1).fill(-1)];const valid=(v,pos)=>adj[path[pos-1]][v]&&!path.slice(0,pos).includes(v);const bt=pos=>{if(pos===n)return !!adj[path[n-1]][path[0]];for(let v=1;v<n;v++){if(valid(v,pos)){path[pos]=v;if(bt(pos+1))return true;path[pos]=-1;}}return false;};return bt(1)?[...path,path[0]]:null;}`,
    prim: `function prim(graph,start=0){const vis=new Set([start]),pq=[];for(const[v,w]of graph[start])pq.push([w,start,v]);const mst=[];while(pq.length&&vis.size<graph.length){pq.sort((a,b)=>a[0]-b[0]);const[w,u,v]=pq.shift();if(vis.has(v))continue;vis.add(v);mst.push([u,v,w]);for(const[nv,nw]of graph[v])if(!vis.has(nv))pq.push([nw,v,nv]);}return mst;}`,
    kruskal: `function kruskal(n,edges){const p=Array.from({length:n},(_,i)=>i),r=Array(n).fill(0);const f=x=>p[x]===x?x:(p[x]=f(p[x]));const u=(a,b)=>{a=f(a);b=f(b);if(a===b)return false;if(r[a]<r[b])[a,b]=[b,a];p[b]=a;if(r[a]===r[b])r[a]++;return true;};const mst=[];for(const[w,a,b]of [...edges].sort((x,y)=>x[0]-y[0]))if(u(a,b))mst.push([a,b,w]);return mst;}`,
    tsp_branch_bound: `function tspBranchBound(cost){const n=cost.length,vis=Array(n).fill(false);let best=Infinity;const bt=(u,cnt,cur)=>{if(cnt===n){best=Math.min(best,cur+cost[u][0]);return;}if(cur>=best)return;for(let v=0;v<n;v++)if(!vis[v]&&cost[u][v]>0){vis[v]=true;bt(v,cnt+1,cur+cost[u][v]);vis[v]=false;}};vis[0]=true;bt(0,1,0);return best;}`,
    knapsack_01: `function knapsack01(wt,val,W){const n=wt.length,dp=Array.from({length:n+1},()=>Array(W+1).fill(0));for(let i=1;i<=n;i++)for(let w=0;w<=W;w++){dp[i][w]=dp[i-1][w];if(wt[i-1]<=w)dp[i][w]=Math.max(dp[i][w],val[i-1]+dp[i-1][w-wt[i-1]]);}return dp[n][W];}`,
    lcs: `function lcs(a,b){const n=a.length,m=b.length,dp=Array.from({length:n+1},()=>Array(m+1).fill(0));for(let i=1;i<=n;i++)for(let j=1;j<=m;j++)dp[i][j]=a[i-1]===b[j-1]?dp[i-1][j-1]+1:Math.max(dp[i-1][j],dp[i][j-1]);return dp[n][m];}`,
    matrix_chain_multiplication: `function matrixChain(d){const n=d.length-1,dp=Array.from({length:n},()=>Array(n).fill(0));for(let L=2;L<=n;L++)for(let i=0;i+L-1<n;i++){const j=i+L-1;dp[i][j]=Infinity;for(let k=i;k<j;k++)dp[i][j]=Math.min(dp[i][j],dp[i][k]+dp[k+1][j]+d[i]*d[k+1]*d[j+1]);}return dp[0][n-1];}`,
    naive: `function naiveSearch(text,pattern){const out=[];for(let i=0;i<=text.length-pattern.length;i++)if(text.slice(i,i+pattern.length)===pattern)out.push(i);return out;}`,
    kmp: `function kmp(text,pattern){const m=pattern.length,lps=Array(m).fill(0);for(let i=1,j=0;i<m;i++){while(j&&pattern[i]!==pattern[j])j=lps[j-1];if(pattern[i]===pattern[j])lps[i]=++j;}const ans=[];for(let i=0,j=0;i<text.length;i++){while(j&&text[i]!==pattern[j])j=lps[j-1];if(text[i]===pattern[j])j++;if(j===m){ans.push(i-m+1);j=lps[j-1];}}return ans;}`,
    rabin_karp: `function rabinKarp(text,pattern){const n=text.length,m=pattern.length;if(m>n)return[];const base=256,mod=1000000007;let ph=0,th=0,p=1;for(let i=0;i<m-1;i++)p=(p*base)%mod;for(let i=0;i<m;i++){ph=(ph*base+pattern.charCodeAt(i))%mod;th=(th*base+text.charCodeAt(i))%mod;}const out=[];for(let i=0;i<=n-m;i++){if(ph===th&&text.slice(i,i+m)===pattern)out.push(i);if(i<n-m){th=(th-text.charCodeAt(i)*p)%mod;if(th<0)th+=mod;th=(th*base+text.charCodeAt(i+m))%mod;}}return out;}`
  };
  return code[name] || "function run(){ return null; }";
}

function getCppCode(name) {
  const code = {
    bubble_sort: `#include <vector>\nusing namespace std;\nvector<int> bubbleSort(vector<int> a){for(int i=0;i<(int)a.size();++i){bool sw=false;for(int j=0;j+1<(int)a.size()-i;++j){if(a[j]>a[j+1]){swap(a[j],a[j+1]);sw=true;}}if(!sw)break;}return a;}`,
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
    floyd_warshall: `#include <vector>\nusing namespace std;\nvector<vector<long long>> floydWarshall(vector<vector<long long>> d){int n=d.size();for(int k=0;k<n;k++)for(int i=0;i<n;i++)for(int j=0;j<n;j++)if(d[i][k]+d[k][j]<d[i][j])d[i][j]=d[i][k]+d[k][j];return d;}`,
    ford_fulkerson: `#include <vector>\n#include <queue>\nusing namespace std;\nint maxFlow(vector<vector<int>> cap,int s,int t){int n=cap.size(),flow=0;while(true){vector<int> p(n,-1);p[s]=s;queue<int> q;q.push(s);while(!q.empty()&&p[t]==-1){int u=q.front();q.pop();for(int v=0;v<n;v++)if(p[v]==-1&&cap[u][v]>0){p[v]=u;q.push(v);}}if(p[t]==-1)break;int add=1e9;for(int v=t;v!=s;v=p[v])add=min(add,cap[p[v]][v]);for(int v=t;v!=s;v=p[v]){cap[p[v]][v]-=add;cap[v][p[v]]+=add;}flow+=add;}return flow;}`,
    graph_coloring: `#include <vector>\nusing namespace std;\nbool gcBt(int v,vector<int>& c,const vector<vector<int>>& a,int m){if(v==(int)a.size())return true;for(int col=1;col<=m;col++){bool ok=true;for(int u=0;u<(int)a.size();u++)if(a[v][u]&&c[u]==col)ok=false;if(ok){c[v]=col;if(gcBt(v+1,c,a,m))return true;c[v]=0;}}return false;}vector<int> graphColoring(const vector<vector<int>>& a,int m){vector<int> c(a.size(),0);if(gcBt(0,c,a,m))return c;return {};}`,
    hamiltonian_cycle: `#include <vector>\nusing namespace std;\nbool hBt(int pos,vector<int>& path,const vector<vector<int>>& a){int n=a.size();if(pos==n)return a[path[n-1]][path[0]];for(int v=1;v<n;v++){bool used=false;for(int i=0;i<pos;i++)if(path[i]==v)used=true;if(!used&&a[path[pos-1]][v]){path[pos]=v;if(hBt(pos+1,path,a))return true;path[pos]=-1;}}return false;}vector<int> hamiltonianCycle(const vector<vector<int>>& a){vector<int> path(a.size(),-1);path[0]=0;if(hBt(1,path,a)){path.push_back(0);return path;}return {};}`,
    prim: `#include <vector>\n#include <queue>\nusing namespace std;\nvector<tuple<int,int,int>> prim(const vector<vector<pair<int,int>>>& g,int s=0){vector<int> vis(g.size());priority_queue<tuple<int,int,int>,vector<tuple<int,int,int>>,greater<tuple<int,int,int>>> pq;vis[s]=1;for(auto [v,w]:g[s])pq.push({w,s,v});vector<tuple<int,int,int>> mst;while(!pq.empty()){auto [w,u,v]=pq.top();pq.pop();if(vis[v])continue;vis[v]=1;mst.push_back({u,v,w});for(auto [nv,nw]:g[v])if(!vis[nv])pq.push({nw,v,nv});}return mst;}`,
    kruskal: `#include <vector>\n#include <algorithm>\nusing namespace std;\nstruct DSU{vector<int> p,r;DSU(int n):p(n),r(n){for(int i=0;i<n;i++)p[i]=i;}int f(int x){return p[x]==x?x:p[x]=f(p[x]);}bool u(int a,int b){a=f(a);b=f(b);if(a==b)return false;if(r[a]<r[b])swap(a,b);p[b]=a;if(r[a]==r[b])r[a]++;return true;}};vector<tuple<int,int,int>> kruskal(int n,vector<tuple<int,int,int>> e){sort(e.begin(),e.end());DSU d(n);vector<tuple<int,int,int>> out;for(auto [w,a,b]:e)if(d.u(a,b))out.push_back({a,b,w});return out;}`,
    tsp_branch_bound: `#include <vector>\nusing namespace std;\nint tspBranchBound(const vector<vector<int>>& c){int n=c.size(),best=1e9;vector<int> vis(n);function<void(int,int,int)> bt=[&](int u,int cnt,int cur){if(cnt==n){best=min(best,cur+c[u][0]);return;}if(cur>=best)return;for(int v=0;v<n;v++)if(!vis[v]&&c[u][v]>0){vis[v]=1;bt(v,cnt+1,cur+c[u][v]);vis[v]=0;}};vis[0]=1;bt(0,1,0);return best;}`,
    knapsack_01: `#include <vector>\nusing namespace std;\nint knapsack01(const vector<int>& w,const vector<int>& val,int W){int n=w.size();vector<vector<int>> dp(n+1,vector<int>(W+1));for(int i=1;i<=n;i++)for(int c=0;c<=W;c++){dp[i][c]=dp[i-1][c];if(w[i-1]<=c)dp[i][c]=max(dp[i][c],val[i-1]+dp[i-1][c-w[i-1]]);}return dp[n][W];}`,
    lcs: `#include <vector>\n#include <string>\nusing namespace std;\nint lcs(const string& a,const string& b){vector<vector<int>> dp(a.size()+1,vector<int>(b.size()+1));for(int i=1;i<=a.size();i++)for(int j=1;j<=b.size();j++)dp[i][j]=a[i-1]==b[j-1]?dp[i-1][j-1]+1:max(dp[i-1][j],dp[i][j-1]);return dp[a.size()][b.size()];}`,
    matrix_chain_multiplication: `#include <vector>\nusing namespace std;\nint matrixChain(const vector<int>& d){int n=d.size()-1;vector<vector<int>> dp(n,vector<int>(n,0));for(int L=2;L<=n;L++)for(int i=0;i+L-1<n;i++){int j=i+L-1;dp[i][j]=1e9;for(int k=i;k<j;k++)dp[i][j]=min(dp[i][j],dp[i][k]+dp[k+1][j]+d[i]*d[k+1]*d[j+1]);}return dp[0][n-1];}`,
    naive: `#include <vector>\n#include <string>\nusing namespace std;\nvector<int> naiveSearch(const string& t,const string& p){vector<int> out;for(int i=0;i+(int)p.size()<=(int)t.size();i++)if(t.substr(i,p.size())==p)out.push_back(i);return out;}`,
    kmp: `#include <vector>\n#include <string>\nusing namespace std;\nvector<int> kmp(const string& t,const string& p){int m=p.size();vector<int> lps(m),out;for(int i=1,j=0;i<m;i++){while(j&&p[i]!=p[j])j=lps[j-1];if(p[i]==p[j])lps[i]=++j;}for(int i=0,j=0;i<(int)t.size();i++){while(j&&t[i]!=p[j])j=lps[j-1];if(t[i]==p[j])j++;if(j==m){out.push_back(i-m+1);j=lps[j-1];}}return out;}`,
    rabin_karp: `#include <vector>\n#include <string>\nusing namespace std;\nvector<int> rabinKarp(const string& t,const string& p){int n=t.size(),m=p.size();if(m>n)return {};const long long B=256,M=1000000007;long long ph=0,th=0,pow=1;for(int i=0;i<m-1;i++)pow=(pow*B)%M;for(int i=0;i<m;i++){ph=(ph*B+p[i])%M;th=(th*B+t[i])%M;}vector<int> out;for(int i=0;i<=n-m;i++){if(ph==th&&t.substr(i,m)==p)out.push_back(i);if(i<n-m){th=(th-t[i]*pow)%M;if(th<0)th+=M;th=(th*B+t[i+m])%M;}}return out;}`
  };
  return code[name] || "#include <vector>\nusing namespace std;\nint run(){return 0;}";
}

function getJavaCode(name) {
  const code = {
    bubble_sort: `import java.util.*;\nclass BubbleSort{static int[] run(int[] a){int[] b=a.clone();for(int i=0;i<b.length;i++){boolean sw=false;for(int j=0;j+1<b.length-i;j++){if(b[j]>b[j+1]){int t=b[j];b[j]=b[j+1];b[j+1]=t;sw=true;}}if(!sw)break;}return b;}}`,
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
    floyd_warshall: `class FloydWarshall{static long[][] run(long[][] d){int n=d.length;long[][] a=new long[n][n];for(int i=0;i<n;i++)a[i]=d[i].clone();for(int k=0;k<n;k++)for(int i=0;i<n;i++)for(int j=0;j<n;j++)if(a[i][k]+a[k][j]<a[i][j])a[i][j]=a[i][k]+a[k][j];return a;}}`,
    ford_fulkerson: `import java.util.*;\nclass MaxFlow{static int run(int[][] cap,int s,int t){int n=cap.length,flow=0;for(;;){int[] p=new int[n];Arrays.fill(p,-1);p[s]=s;Queue<Integer> q=new ArrayDeque<>();q.add(s);while(!q.isEmpty()&&p[t]==-1){int u=q.poll();for(int v=0;v<n;v++)if(p[v]==-1&&cap[u][v]>0){p[v]=u;q.add(v);}}if(p[t]==-1)break;int add=Integer.MAX_VALUE;for(int v=t;v!=s;v=p[v])add=Math.min(add,cap[p[v]][v]);for(int v=t;v!=s;v=p[v]){cap[p[v]][v]-=add;cap[v][p[v]]+=add;}flow+=add;}return flow;}}`,
    graph_coloring: `class GraphColoring{static boolean bt(int v,int[] c,int[][] a,int m){if(v==a.length)return true;for(int col=1;col<=m;col++){boolean ok=true;for(int u=0;u<a.length;u++)if(a[v][u]==1&&c[u]==col)ok=false;if(ok){c[v]=col;if(bt(v+1,c,a,m))return true;c[v]=0;}}return false;}static int[] run(int[][] a,int m){int[] c=new int[a.length];return bt(0,c,a,m)?c:new int[0];}}`,
    hamiltonian_cycle: `class Hamiltonian{static boolean bt(int pos,int[] path,int[][] a){int n=a.length;if(pos==n)return a[path[n-1]][path[0]]==1;for(int v=1;v<n;v++){boolean used=false;for(int i=0;i<pos;i++)if(path[i]==v)used=true;if(!used&&a[path[pos-1]][v]==1){path[pos]=v;if(bt(pos+1,path,a))return true;path[pos]=-1;}}return false;}static int[] run(int[][] a){int[] path=new int[a.length];java.util.Arrays.fill(path,-1);path[0]=0;if(bt(1,path,a)){int[] out=new int[a.length+1];for(int i=0;i<a.length;i++)out[i]=path[i];out[a.length]=0;return out;}return new int[0];}}`,
    prim: `import java.util.*;\nclass Prim{static List<int[]> run(List<List<int[]>> g,int s){boolean[] vis=new boolean[g.size()];PriorityQueue<int[]> pq=new PriorityQueue<>(Comparator.comparingInt(a->a[0]));vis[s]=true;for(int[] e:g.get(s))pq.add(new int[]{e[1],s,e[0]});List<int[]> out=new ArrayList<>();while(!pq.isEmpty()){int[] cur=pq.poll();int w=cur[0],u=cur[1],v=cur[2];if(vis[v])continue;vis[v]=true;out.add(new int[]{u,v,w});for(int[] e:g.get(v))if(!vis[e[0]])pq.add(new int[]{e[1],v,e[0]});}return out;}}`,
    kruskal: `import java.util.*;\nclass Kruskal{static class DSU{int[] p,r;DSU(int n){p=new int[n];r=new int[n];for(int i=0;i<n;i++)p[i]=i;}int f(int x){return p[x]==x?x:(p[x]=f(p[x]));}boolean u(int a,int b){a=f(a);b=f(b);if(a==b)return false;if(r[a]<r[b]){int t=a;a=b;b=t;}p[b]=a;if(r[a]==r[b])r[a]++;return true;}}static List<int[]> run(int n,List<int[]> edges){edges.sort(Comparator.comparingInt(e->e[0]));DSU d=new DSU(n);List<int[]> out=new ArrayList<>();for(int[] e:edges)if(d.u(e[1],e[2]))out.add(new int[]{e[1],e[2],e[0]});return out;}}`,
    tsp_branch_bound: `class TSPBranchBound{static int best;static void bt(int u,int cnt,int cur,int[][] c,boolean[] vis){int n=c.length;if(cnt==n){best=Math.min(best,cur+c[u][0]);return;}if(cur>=best)return;for(int v=0;v<n;v++)if(!vis[v]&&c[u][v]>0){vis[v]=true;bt(v,cnt+1,cur+c[u][v],c,vis);vis[v]=false;}}static int run(int[][] c){best=Integer.MAX_VALUE;boolean[] vis=new boolean[c.length];vis[0]=true;bt(0,1,0,c,vis);return best;}}`,
    knapsack_01: `class Knapsack01{static int run(int[] w,int[] val,int W){int n=w.length;int[][] dp=new int[n+1][W+1];for(int i=1;i<=n;i++)for(int c=0;c<=W;c++){dp[i][c]=dp[i-1][c];if(w[i-1]<=c)dp[i][c]=Math.max(dp[i][c],val[i-1]+dp[i-1][c-w[i-1]]);}return dp[n][W];}}`,
    lcs: `class LCS{static int run(String a,String b){int n=a.length(),m=b.length();int[][] dp=new int[n+1][m+1];for(int i=1;i<=n;i++)for(int j=1;j<=m;j++)dp[i][j]=a.charAt(i-1)==b.charAt(j-1)?dp[i-1][j-1]+1:Math.max(dp[i-1][j],dp[i][j-1]);return dp[n][m];}}`,
    matrix_chain_multiplication: `class MatrixChain{static int run(int[] d){int n=d.length-1;int[][] dp=new int[n][n];for(int L=2;L<=n;L++)for(int i=0;i+L-1<n;i++){int j=i+L-1;dp[i][j]=Integer.MAX_VALUE;for(int k=i;k<j;k++)dp[i][j]=Math.min(dp[i][j],dp[i][k]+dp[k+1][j]+d[i]*d[k+1]*d[j+1]);}return dp[0][n-1];}}`,
    naive: `import java.util.*;\nclass NaiveSearch{static List<Integer> run(String t,String p){List<Integer> out=new ArrayList<>();for(int i=0;i+p.length()<=t.length();i++)if(t.substring(i,i+p.length()).equals(p))out.add(i);return out;}}`,
    kmp: `import java.util.*;\nclass KMP{static List<Integer> run(String t,String p){int m=p.length();int[] lps=new int[m];for(int i=1,j=0;i<m;i++){while(j>0&&p.charAt(i)!=p.charAt(j))j=lps[j-1];if(p.charAt(i)==p.charAt(j))lps[i]=++j;}List<Integer> out=new ArrayList<>();for(int i=0,j=0;i<t.length();i++){while(j>0&&t.charAt(i)!=p.charAt(j))j=lps[j-1];if(t.charAt(i)==p.charAt(j))j++;if(j==m){out.add(i-m+1);j=lps[j-1];}}return out;}}`,
    rabin_karp: `import java.util.*;\nclass RabinKarp{static List<Integer> run(String t,String p){int n=t.length(),m=p.length();List<Integer> out=new ArrayList<>();if(m>n)return out;long B=256,M=1_000_000_007L,ph=0,th=0,pow=1;for(int i=0;i<m-1;i++)pow=(pow*B)%M;for(int i=0;i<m;i++){ph=(ph*B+p.charAt(i))%M;th=(th*B+t.charAt(i))%M;}for(int i=0;i<=n-m;i++){if(ph==th&&t.substring(i,i+m).equals(p))out.add(i);if(i<n-m){th=(th-t.charAt(i)*pow)%M;if(th<0)th+=M;th=(th*B+t.charAt(i+m))%M;}}return out;}}`
  };
  return code[name] || "class Runner{static int run(){return 0;}}";
}

