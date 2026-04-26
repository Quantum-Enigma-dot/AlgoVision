import { randomInt } from "./randomGenerators.js";

export const PRACTICE_DIFFICULTIES = ["easy", "medium", "hard"];

export const PRACTICE_DIFFICULTY_LABELS = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard"
};

export const PRACTICE_TOPICS = ["any", "prefix_sum", "greedy", "sliding_window", "two_pointers"];

export const PRACTICE_TOPIC_LABELS = {
  any: "Any Topic",
  prefix_sum: "Prefix Sum",
  greedy: "Greedy + Heap",
  sliding_window: "Sliding Window",
  two_pointers: "Two Pointers"
};

export const PRACTICE_LANGUAGES = ["python", "c", "cpp", "java", "go", "javascript"];

export const PRACTICE_LANGUAGE_LABELS = {
  python: "Python",
  c: "C",
  cpp: "C++",
  java: "Java",
  go: "Go",
  javascript: "JavaScript"
};

const CITY_ZONES = ["Lakeside", "Greenline", "Harbor", "Skyblock", "Metro Core", "Riverspan"];
const FACILITIES = ["residential towers", "micro-warehouses", "food kiosks", "health pods", "charging hubs"];
const TRAFFIC_THEMES = ["festival weekend", "rain disruption", "peak office hours", "night shift", "sports event"];

const pick = (items) => items[randomInt(0, items.length - 1)];

const normalizeDifficulty = (difficulty) => {
  const key = String(difficulty || "medium").toLowerCase();
  return PRACTICE_DIFFICULTIES.includes(key) ? key : "medium";
};

const normalizeTopic = (topic) => {
  const key = String(topic || "any").toLowerCase();
  return PRACTICE_TOPICS.includes(key) ? key : "any";
};

const makeCase = (prefix, index, inputData, expectedOutput, isSample = false) => ({
  case_id: `${prefix}-${Date.now()}-${index}-${randomInt(100, 999)}`,
  input_data: inputData,
  expected_output: expectedOutput,
  is_sample: isSample
});

const toInputLine = (numbers) => numbers.join(" ");

const maxHeapPush = (heap, value) => {
  heap.push(value);
  let i = heap.length - 1;
  while (i > 0) {
    const parent = Math.floor((i - 1) / 2);
    if (heap[parent] >= heap[i]) break;
    [heap[parent], heap[i]] = [heap[i], heap[parent]];
    i = parent;
  }
};

const maxHeapPop = (heap) => {
  if (!heap.length) return 0;
  const top = heap[0];
  const end = heap.pop();
  if (!heap.length) return top;

  heap[0] = end;
  let i = 0;
  while (true) {
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    let largest = i;

    if (left < heap.length && heap[left] > heap[largest]) largest = left;
    if (right < heap.length && heap[right] > heap[largest]) largest = right;
    if (largest === i) break;

    [heap[i], heap[largest]] = [heap[largest], heap[i]];
    i = largest;
  }

  return top;
};

const solveWaterReserve = (changes) => {
  let running = 0;
  let minimumPrefix = 0;
  for (const delta of changes) {
    running += delta;
    minimumPrefix = Math.min(minimumPrefix, running);
  }
  return Math.max(0, -minimumPrefix);
};

const solveCourierDeadline = (orders) => {
  const sorted = [...orders].sort((a, b) => a.deadline - b.deadline);
  const heap = [];
  let totalMinutes = 0;

  for (const order of sorted) {
    totalMinutes += order.duration;
    maxHeapPush(heap, order.duration);
    if (totalMinutes > order.deadline) {
      totalMinutes -= maxHeapPop(heap);
    }
  }

  return heap.length;
};

const solveSensorWindow = (readings, budget) => {
  let left = 0;
  let sum = 0;
  let best = 0;

  for (let right = 0; right < readings.length; right += 1) {
    sum += readings[right];
    while (left <= right && sum > budget) {
      sum -= readings[left];
      left += 1;
    }
    best = Math.max(best, right - left + 1);
  }

  return best;
};

const solveFloodBarrier = (heights) => {
  if (!heights.length) return 0;

  let left = 0;
  let right = heights.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let trapped = 0;

  while (left < right) {
    if (heights[left] <= heights[right]) {
      leftMax = Math.max(leftMax, heights[left]);
      trapped += leftMax - heights[left];
      left += 1;
    } else {
      rightMax = Math.max(rightMax, heights[right]);
      trapped += rightMax - heights[right];
      right -= 1;
    }
  }

  return trapped;
};

const waterReserveStarter = {
  python: `import sys


def min_initial_reserve(changes):
    # TODO: implement
    return 0


def main():
    data = list(map(int, sys.stdin.read().strip().split()))
    if not data:
        return

    n = data[0]
    changes = data[1:1 + n]
    print(min_initial_reserve(changes))


if __name__ == "__main__":
    main()
`,
  c: `#include <stdio.h>

long long min_initial_reserve(long long changes[], int n) {
    // TODO: implement
    return 0;
}

int main(void) {
    int n;
    if (scanf("%d", &n) != 1) {
        return 0;
    }

    long long changes[200005];
    for (int i = 0; i < n; ++i) {
        scanf("%lld", &changes[i]);
    }

    printf("%lld\n", min_initial_reserve(changes, n));
    return 0;
}
`,
  cpp: `#include <bits/stdc++.h>
using namespace std;

long long minInitialReserve(const vector<long long>& changes) {
    // TODO: implement
    return 0;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) {
        return 0;
    }

    vector<long long> changes(n);
    for (int i = 0; i < n; ++i) {
        cin >> changes[i];
    }

    cout << minInitialReserve(changes) << "\n";
    return 0;
}
`,
  java: `import java.util.Scanner;

public class Main {
    static long minInitialReserve(long[] changes) {
        // TODO: implement
        return 0L;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) {
            sc.close();
            return;
        }

        int n = sc.nextInt();
        long[] changes = new long[n];
        for (int i = 0; i < n; i++) {
            changes[i] = sc.nextLong();
        }

        System.out.println(minInitialReserve(changes));
        sc.close();
    }
}
`,
  go: `package main

import (
    "bufio"
    "fmt"
    "os"
)

func minInitialReserve(changes []int64) int64 {
    // TODO: implement
    return 0
}

func main() {
    reader := bufio.NewReader(os.Stdin)

    var n int
    if _, err := fmt.Fscan(reader, &n); err != nil {
        return
    }

    changes := make([]int64, n)
    for i := 0; i < n; i++ {
        fmt.Fscan(reader, &changes[i])
    }

    fmt.Println(minInitialReserve(changes))
}
`,
  javascript: `const fs = require("fs");

function minInitialReserve(changes) {
  // TODO: implement
  return 0;
}

const tokens = fs.readFileSync(0, "utf8").trim().split(/\s+/).map(Number);
if (!tokens.length || Number.isNaN(tokens[0])) {
  process.exit(0);
}

const n = tokens[0];
const changes = tokens.slice(1, 1 + n);
console.log(minInitialReserve(changes).toString());
`
};

const courierStarter = {
  python: `import sys
import heapq


def max_orders(orders):
    # TODO: implement
    return 0


def main():
    tokens = list(map(int, sys.stdin.read().strip().split()))
    if not tokens:
        return

    n = tokens[0]
    orders = []
    p = 1
    for _ in range(n):
        duration = tokens[p]
        deadline = tokens[p + 1]
        orders.append((duration, deadline))
        p += 2

    print(max_orders(orders))


if __name__ == "__main__":
    main()
`,
  c: `#include <stdio.h>

typedef struct {
    long long duration;
    long long deadline;
} Order;

int max_orders(Order orders[], int n) {
    // TODO: implement
    return 0;
}

int main(void) {
    int n;
    if (scanf("%d", &n) != 1) {
        return 0;
    }

    Order orders[200005];
    for (int i = 0; i < n; ++i) {
        scanf("%lld %lld", &orders[i].duration, &orders[i].deadline);
    }

    printf("%d\n", max_orders(orders, n));
    return 0;
}
`,
  cpp: `#include <bits/stdc++.h>
using namespace std;

int maxOrders(vector<pair<long long, long long>> orders) {
    // TODO: implement
    return 0;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) {
        return 0;
    }

    vector<pair<long long, long long>> orders(n);
    for (int i = 0; i < n; ++i) {
        cin >> orders[i].first >> orders[i].second;
    }

    cout << maxOrders(orders) << "\n";
    return 0;
}
`,
  java: `import java.util.Arrays;
import java.util.Comparator;
import java.util.Scanner;

public class Main {
    static int maxOrders(long[][] orders) {
        // TODO: implement
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) {
            sc.close();
            return;
        }

        int n = sc.nextInt();
        long[][] orders = new long[n][2];
        for (int i = 0; i < n; i++) {
            orders[i][0] = sc.nextLong();
            orders[i][1] = sc.nextLong();
        }

        Arrays.sort(orders, Comparator.comparingLong(a -> a[1]));
        System.out.println(maxOrders(orders));
        sc.close();
    }
}
`,
  go: `package main

import (
    "bufio"
    "fmt"
    "os"
)

type Order struct {
    duration int64
    deadline int64
}

func maxOrders(orders []Order) int {
    // TODO: implement
    return 0
}

func main() {
    reader := bufio.NewReader(os.Stdin)

    var n int
    if _, err := fmt.Fscan(reader, &n); err != nil {
        return
    }

    orders := make([]Order, n)
    for i := 0; i < n; i++ {
        fmt.Fscan(reader, &orders[i].duration, &orders[i].deadline)
    }

    fmt.Println(maxOrders(orders))
}
`,
  javascript: `const fs = require("fs");

function maxOrders(orders) {
  // TODO: implement
  return 0;
}

const nums = fs.readFileSync(0, "utf8").trim().split(/\s+/).map(Number);
if (!nums.length || Number.isNaN(nums[0])) {
  process.exit(0);
}

const n = nums[0];
let p = 1;
const orders = [];
for (let i = 0; i < n; i += 1) {
  orders.push([nums[p], nums[p + 1]]);
  p += 2;
}

console.log(maxOrders(orders).toString());
`
};

const sensorWindowStarter = {
  python: `import sys


def longest_window(arr, budget):
    # TODO: implement
    return 0


def main():
    vals = list(map(int, sys.stdin.read().strip().split()))
    if not vals:
        return

    n, budget = vals[0], vals[1]
    arr = vals[2:2 + n]
    print(longest_window(arr, budget))


if __name__ == "__main__":
    main()
`,
  c: `#include <stdio.h>

int longest_window(long long arr[], int n, long long budget) {
    // TODO: implement
    return 0;
}

int main(void) {
    int n;
    long long budget;
    if (scanf("%d %lld", &n, &budget) != 2) {
        return 0;
    }

    long long arr[200005];
    for (int i = 0; i < n; ++i) {
        scanf("%lld", &arr[i]);
    }

    printf("%d\n", longest_window(arr, n, budget));
    return 0;
}
`,
  cpp: `#include <bits/stdc++.h>
using namespace std;

int longestWindow(const vector<long long>& arr, long long budget) {
    // TODO: implement
    return 0;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    long long budget;
    if (!(cin >> n >> budget)) {
        return 0;
    }

    vector<long long> arr(n);
    for (int i = 0; i < n; ++i) {
        cin >> arr[i];
    }

    cout << longestWindow(arr, budget) << "\n";
    return 0;
}
`,
  java: `import java.util.Scanner;

public class Main {
    static int longestWindow(long[] arr, long budget) {
        // TODO: implement
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) {
            sc.close();
            return;
        }

        int n = sc.nextInt();
        long budget = sc.nextLong();
        long[] arr = new long[n];
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextLong();
        }

        System.out.println(longestWindow(arr, budget));
        sc.close();
    }
}
`,
  go: `package main

import (
    "bufio"
    "fmt"
    "os"
)

func longestWindow(arr []int64, budget int64) int {
    // TODO: implement
    return 0
}

func main() {
    reader := bufio.NewReader(os.Stdin)

    var n int
    var budget int64
    if _, err := fmt.Fscan(reader, &n, &budget); err != nil {
        return
    }

    arr := make([]int64, n)
    for i := 0; i < n; i++ {
        fmt.Fscan(reader, &arr[i])
    }

    fmt.Println(longestWindow(arr, budget))
}
`,
  javascript: `const fs = require("fs");

function longestWindow(arr, budget) {
  // TODO: implement
  return 0;
}

const nums = fs.readFileSync(0, "utf8").trim().split(/\s+/).map(Number);
if (!nums.length || Number.isNaN(nums[0])) {
  process.exit(0);
}

const n = nums[0];
const budget = nums[1];
const arr = nums.slice(2, 2 + n);
console.log(longestWindow(arr, budget).toString());
`
};

const floodBarrierStarter = {
  python: `import sys


def trapped_water(heights):
    # TODO: implement
    return 0


def main():
    vals = list(map(int, sys.stdin.read().strip().split()))
    if not vals:
        return

    n = vals[0]
    heights = vals[1:1 + n]
    print(trapped_water(heights))


if __name__ == "__main__":
    main()
`,
  c: `#include <stdio.h>

long long trapped_water(long long heights[], int n) {
    // TODO: implement
    return 0;
}

int main(void) {
    int n;
    if (scanf("%d", &n) != 1) {
        return 0;
    }

    long long heights[200005];
    for (int i = 0; i < n; ++i) {
        scanf("%lld", &heights[i]);
    }

    printf("%lld\n", trapped_water(heights, n));
    return 0;
}
`,
  cpp: `#include <bits/stdc++.h>
using namespace std;

long long trappedWater(const vector<long long>& heights) {
    // TODO: implement
    return 0;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) {
        return 0;
    }

    vector<long long> heights(n);
    for (int i = 0; i < n; ++i) {
        cin >> heights[i];
    }

    cout << trappedWater(heights) << "\n";
    return 0;
}
`,
  java: `import java.util.Scanner;

public class Main {
    static long trappedWater(long[] heights) {
        // TODO: implement
        return 0L;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) {
            sc.close();
            return;
        }

        int n = sc.nextInt();
        long[] heights = new long[n];
        for (int i = 0; i < n; i++) {
            heights[i] = sc.nextLong();
        }

        System.out.println(trappedWater(heights));
        sc.close();
    }
}
`,
  go: `package main

import (
    "bufio"
    "fmt"
    "os"
)

func trappedWater(heights []int64) int64 {
    // TODO: implement
    return 0
}

func main() {
    reader := bufio.NewReader(os.Stdin)

    var n int
    if _, err := fmt.Fscan(reader, &n); err != nil {
        return
    }

    heights := make([]int64, n)
    for i := 0; i < n; i++ {
        fmt.Fscan(reader, &heights[i])
    }

    fmt.Println(trappedWater(heights))
}
`,
  javascript: `const fs = require("fs");

function trappedWater(heights) {
  // TODO: implement
  return 0;
}

const vals = fs.readFileSync(0, "utf8").trim().split(/\s+/).map(Number);
if (!vals.length || Number.isNaN(vals[0])) {
  process.exit(0);
}

const n = vals[0];
const heights = vals.slice(1, 1 + n);
console.log(trappedWater(heights).toString());
`
};

const buildWaterReserveChallenge = (difficulty) => {
  const profile = {
    easy: { size: [6, 10], delta: 8, hidden: 4 },
    medium: { size: [12, 20], delta: 15, hidden: 5 },
    hard: { size: [20, 35], delta: 30, hidden: 6 }
  }[difficulty];

  const createInput = () => {
    const n = randomInt(profile.size[0], profile.size[1]);
    const changes = Array.from({ length: n }, () => randomInt(-profile.delta, profile.delta));
    if (!changes.some((value) => value < 0)) {
      changes[randomInt(0, n - 1)] = -randomInt(1, profile.delta);
    }
    return {
      input: `${n}\n${toInputLine(changes)}`,
      expected: `${solveWaterReserve(changes)}`
    };
  };

  const sampleA = { input: "6\n4 -6 2 -3 -4 5", expected: "7" };
  const sampleB = { input: "5\n3 -1 -1 2 -2", expected: "0" };
  const zone = pick(CITY_ZONES);
  const facility = pick(FACILITIES);

  return {
    topic: "prefix_sum",
    slug: "water-reserve",
    title: `Emergency Water Reserve in ${zone}`,
    story: `A control team manages ${facility} in ${zone}. Every hour changes the tank level by a positive or negative value.`,
    statement:
      "Find the minimum initial water reserve needed so the running tank level never becomes negative at any point.",
    inputFormat: [
      "Line 1: integer n (number of hourly changes)",
      "Line 2: n space-separated integers delta[i]"
    ],
    outputFormat: "Print one integer: minimum initial reserve.",
    constraints: [
      difficulty === "easy" ? "1 <= n <= 20" : difficulty === "hard" ? "1 <= n <= 200000" : "1 <= n <= 100000",
      difficulty === "easy" ? "-20 <= delta[i] <= 20" : "-10^9 <= delta[i] <= 10^9"
    ],
    hints: [
      "Track prefix sums and remember the smallest prefix encountered.",
      "If the minimum prefix is -x, reserve must be at least x."
    ],
    examples: [
      {
        input: sampleA.input,
        output: sampleA.expected,
        explanation: "Prefix sums are [4, -2, 0, -3, -7, -2], so reserve 7 keeps every state non-negative."
      },
      {
        input: sampleB.input,
        output: sampleB.expected,
        explanation: "Prefix never drops below 0, so no emergency reserve is required."
      }
    ],
    visibleTests: [
      makeCase("water-reserve", 1, sampleA.input, sampleA.expected, true),
      makeCase("water-reserve", 2, sampleB.input, sampleB.expected, true)
    ],
    hiddenTests: Array.from({ length: profile.hidden }, (_, index) => {
      const generated = createInput();
      return makeCase("water-reserve-h", index + 1, generated.input, generated.expected, false);
    }),
    starterCode: waterReserveStarter
  };
};

const buildCourierDeadlineChallenge = (difficulty) => {
  const profile = {
    easy: { size: [4, 8], duration: [1, 8], slack: [2, 10], hidden: 4 },
    medium: { size: [10, 16], duration: [1, 20], slack: [4, 18], hidden: 5 },
    hard: { size: [18, 30], duration: [1, 35], slack: [5, 30], hidden: 6 }
  }[difficulty];

  const createOrderSet = () => {
    const n = randomInt(profile.size[0], profile.size[1]);
    const orders = [];
    for (let i = 0; i < n; i += 1) {
      const duration = randomInt(profile.duration[0], profile.duration[1]);
      const deadline = duration + randomInt(profile.slack[0], profile.slack[1]) + i;
      orders.push({ duration, deadline });
    }

    const inputLines = [`${n}`];
    for (const order of orders) {
      inputLines.push(`${order.duration} ${order.deadline}`);
    }

    return {
      input: inputLines.join("\n"),
      expected: `${solveCourierDeadline(orders)}`
    };
  };

  const sampleA = { input: "4\n3 4\n2 6\n4 8\n3 10", expected: "3" };
  const sampleB = { input: "5\n2 3\n3 5\n1 6\n4 7\n2 8", expected: "3" };
  const zone = pick(CITY_ZONES);
  const theme = pick(TRAFFIC_THEMES);

  return {
    topic: "greedy",
    slug: "courier-deadline",
    title: `Last-Mile Courier Windows (${zone})`,
    story: `A same-day dispatch desk in ${zone} is overloaded during ${theme}. Each order has a duration and hard deadline.`,
    statement:
      "Choose the maximum number of orders that can be completed by one courier, processing one order at a time.",
    inputFormat: [
      "Line 1: integer n (number of orders)",
      "Next n lines: duration_i deadline_i"
    ],
    outputFormat: "Print one integer: maximum orders that finish on or before deadline.",
    constraints: [
      difficulty === "easy" ? "1 <= n <= 20" : difficulty === "hard" ? "1 <= n <= 200000" : "1 <= n <= 100000",
      "1 <= duration_i, deadline_i <= 10^9"
    ],
    hints: [
      "Sort by deadline and keep chosen durations in a max structure.",
      "If total time exceeds current deadline, remove the longest selected order."
    ],
    examples: [
      {
        input: sampleA.input,
        output: sampleA.expected,
        explanation: "The optimal set is of size 3 after replacing one long order."
      },
      {
        input: sampleB.input,
        output: sampleB.expected,
        explanation: "Greedy by deadline with replacement keeps only feasible work."
      }
    ],
    visibleTests: [
      makeCase("courier", 1, sampleA.input, sampleA.expected, true),
      makeCase("courier", 2, sampleB.input, sampleB.expected, true)
    ],
    hiddenTests: Array.from({ length: profile.hidden }, (_, index) => {
      const generated = createOrderSet();
      return makeCase("courier-h", index + 1, generated.input, generated.expected, false);
    }),
    starterCode: courierStarter
  };
};

const buildSensorWindowChallenge = (difficulty) => {
  const profile = {
    easy: { size: [6, 12], value: [1, 9], hidden: 4 },
    medium: { size: [12, 24], value: [1, 20], hidden: 5 },
    hard: { size: [24, 45], value: [1, 40], hidden: 6 }
  }[difficulty];

  const generateCase = () => {
    const n = randomInt(profile.size[0], profile.size[1]);
    const readings = Array.from({ length: n }, () => randomInt(profile.value[0], profile.value[1]));
    const total = readings.reduce((acc, value) => acc + value, 0);
    const budget = randomInt(Math.max(1, Math.floor(total * 0.25)), Math.max(2, Math.floor(total * 0.55)));
    return {
      input: `${n} ${budget}\n${toInputLine(readings)}`,
      expected: `${solveSensorWindow(readings, budget)}`
    };
  };

  const sampleA = { input: "8 15\n2 1 5 1 3 2 1 1", expected: "7" };
  const sampleB = { input: "5 7\n8 1 1 1 1", expected: "4" };

  return {
    topic: "sliding_window",
    slug: "sensor-window",
    title: "Energy Budget Window for Smart Grid",
    story: "A city monitor tracks hourly energy draw from distributed sensors and needs the longest stable interval under budget.",
    statement:
      "Given positive readings and budget B, return the maximum length of a contiguous segment whose sum is at most B.",
    inputFormat: [
      "Line 1: n B",
      "Line 2: n space-separated positive integers"
    ],
    outputFormat: "Print one integer: longest valid segment length.",
    constraints: [
      difficulty === "easy" ? "1 <= n <= 200" : difficulty === "hard" ? "1 <= n <= 200000" : "1 <= n <= 100000",
      "1 <= reading[i] <= 10^9",
      "1 <= B <= 10^14"
    ],
    hints: [
      "All numbers are positive, so a sliding window works in linear time.",
      "Shrink from the left whenever window sum exceeds B."
    ],
    examples: [
      {
        input: sampleA.input,
        output: sampleA.expected,
        explanation: "Segment [1, 5, 1, 3, 2, 1, 1] sums to 14 and has length 7."
      },
      {
        input: sampleB.input,
        output: sampleB.expected,
        explanation: "The first element alone breaks budget, but the last four values fit."
      }
    ],
    visibleTests: [
      makeCase("sensor-window", 1, sampleA.input, sampleA.expected, true),
      makeCase("sensor-window", 2, sampleB.input, sampleB.expected, true)
    ],
    hiddenTests: Array.from({ length: profile.hidden }, (_, index) => {
      const generated = generateCase();
      return makeCase("sensor-window-h", index + 1, generated.input, generated.expected, false);
    }),
    starterCode: sensorWindowStarter
  };
};

const buildFloodBarrierChallenge = (difficulty) => {
  const profile = {
    easy: { size: [8, 14], height: [0, 6], hidden: 4 },
    medium: { size: [14, 24], height: [0, 10], hidden: 5 },
    hard: { size: [24, 45], height: [0, 20], hidden: 6 }
  }[difficulty];

  const generateCase = () => {
    const n = randomInt(profile.size[0], profile.size[1]);
    const heights = Array.from({ length: n }, () => randomInt(profile.height[0], profile.height[1]));
    return {
      input: `${n}\n${toInputLine(heights)}`,
      expected: `${solveFloodBarrier(heights)}`
    };
  };

  const sampleA = { input: "12\n0 1 0 2 1 0 1 3 2 1 2 1", expected: "6" };
  const sampleB = { input: "6\n4 2 0 3 2 5", expected: "9" };
  const zone = pick(CITY_ZONES);

  return {
    topic: "two_pointers",
    slug: "flood-barrier",
    title: `Stormwater Barrier Planning (${zone})`,
    story: `Urban planning in ${zone} uses elevation readings to estimate trapped rainwater after heavy storms.`,
    statement:
      "Given bar heights, compute how many units of water remain trapped between bars after rainfall.",
    inputFormat: [
      "Line 1: integer n",
      "Line 2: n space-separated non-negative integers h[i]"
    ],
    outputFormat: "Print one integer: total trapped water units.",
    constraints: [
      difficulty === "easy" ? "1 <= n <= 200" : difficulty === "hard" ? "1 <= n <= 200000" : "1 <= n <= 100000",
      "0 <= h[i] <= 10^9"
    ],
    hints: [
      "Two-pointer approach can solve this in O(n) time and O(1) extra space.",
      "Track best wall seen from both sides while pointers move inward."
    ],
    examples: [
      {
        input: sampleA.input,
        output: sampleA.expected,
        explanation: "Classic terrain profile traps 6 units in total."
      },
      {
        input: sampleB.input,
        output: sampleB.expected,
        explanation: "Intermediate valleys trap 9 units."
      }
    ],
    visibleTests: [
      makeCase("flood", 1, sampleA.input, sampleA.expected, true),
      makeCase("flood", 2, sampleB.input, sampleB.expected, true)
    ],
    hiddenTests: Array.from({ length: profile.hidden }, (_, index) => {
      const generated = generateCase();
      return makeCase("flood-h", index + 1, generated.input, generated.expected, false);
    }),
    starterCode: floodBarrierStarter
  };
};

const CHALLENGE_BUILDERS = [
  { topic: "prefix_sum", build: buildWaterReserveChallenge },
  { topic: "greedy", build: buildCourierDeadlineChallenge },
  { topic: "sliding_window", build: buildSensorWindowChallenge },
  { topic: "two_pointers", build: buildFloodBarrierChallenge }
];

export const generatePracticeChallenge = (difficulty = "medium", topic = "any") => {
  const normalizedDifficulty = normalizeDifficulty(difficulty);
  const normalizedTopic = normalizeTopic(topic);

  const pool = normalizedTopic === "any"
    ? CHALLENGE_BUILDERS
    : CHALLENGE_BUILDERS.filter((item) => item.topic === normalizedTopic);

  const selected = pick(pool.length ? pool : CHALLENGE_BUILDERS);
  const challenge = selected.build(normalizedDifficulty);

  const visibleTests = challenge.visibleTests || [];
  const hiddenTests = challenge.hiddenTests || [];

  return {
    id: `challenge-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    difficulty: normalizedDifficulty,
    difficultyLabel: PRACTICE_DIFFICULTY_LABELS[normalizedDifficulty],
    topic: challenge.topic || selected.topic,
    topicLabel: PRACTICE_TOPIC_LABELS[challenge.topic || selected.topic] || "Custom",
    originalityNote:
      "Generated by Q++ Local Challenge Synthesizer. Problems are original templates inspired by common algorithmic patterns, not copied statements.",
    judgeInstructions:
      "Read from standard input and print only the required output to standard output.",
    engine: {
      name: "Q++ Local Challenge Synthesizer",
      mode: "offline-local",
      usesExternalApi: false
    },
    ...challenge,
    visibleTests,
    hiddenTests,
    totalTests: visibleTests.length + hiddenTests.length,
    starterCode: challenge.starterCode
  };
};
