import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight, vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import AlgorithmSelector from "../components/AlgorithmSelector.jsx";
import InputPanel from "../components/InputPanel.jsx";
import ControlPanel from "../components/ControlPanel.jsx";
import MetricsPanel from "../components/MetricsPanel.jsx";
import VisualizationCanvas from "../components/VisualizationCanvas.jsx";
import { useTheme } from "../hooks/useTheme.js";
import { runAlgorithm } from "../services/api.js";
import { runLocalAnalyzer } from "../utils/localAnalyzers.js";
import { buildPayloadAndValidate } from "../utils/validators.js";
import {
  attachStepDescriptions,
  formatCategoryOptions,
  getAlgorithmDisplayName,
  getLanguageLabel,
  getLanguages,
  LANGUAGE_TAB_WIDTHS,
  normalizeCategoryLabel
} from "../data/algorithms.js";
import { buildUnifiedMetadataMap } from "../data/algorithmMetadata.js";
import {
  generateRandomBacktrackingInput,
  generateRandomDpInput,
  generateRandomDataStructureInput,
  generateRandomGraphInput,
  generateRandomSearchInput,
  generateRandomSortingInput,
  generateRandomStringInput
} from "../utils/randomGenerators.js";
import { graphPresets, sortingPresets, dpPresets, stringPresets } from "../data/presets.js";

const toJsonString = (value) => {
  try {
    return JSON.stringify(value ?? {});
  } catch {
    return "{}";
  }
};

const toPrettyJsonString = (value) => {
  try {
    return JSON.stringify(value ?? {}, null, 2);
  } catch {
    return "{}";
  }
};

const escapeForDoubleQuotes = (text) => String(text)
  .replace(/\\/g, "\\\\")
  .replace(/"/g, '\\"')
  .replace(/\r/g, "\\r")
  .replace(/\n/g, "\\n");

const toEscapedCStringLiteral = (text, indent = "  ") => {
  const lines = String(text || "").split("\n");
  return lines
    .map((line, index) => {
      const escapedLine = String(line).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
      const suffix = index < lines.length - 1 ? "\\n" : "";
      return `${indent}"${escapedLine}${suffix}"`;
    })
    .join("\n");
};

const toJavaStringExpression = (text, indent = "      ") => {
  const lines = String(text || "").split("\n");
  return lines
    .map((line, index) => {
      const escapedLine = String(line).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
      const suffix = index < lines.length - 1 ? "\\n" : "";
      const concat = index < lines.length - 1 ? " +" : "";
      return `${indent}"${escapedLine}${suffix}"${concat}`;
    })
    .join("\n");
};

const formatBraceCode = (source) => {
  let output = "";
  let parenDepth = 0;
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let escapeNext = false;

  for (const char of source) {
    if (escapeNext) {
      output += char;
      escapeNext = false;
      continue;
    }

    if (char === "\\" && (inSingleQuote || inDoubleQuote)) {
      output += char;
      escapeNext = true;
      continue;
    }

    if (!inDoubleQuote && char === "'") {
      inSingleQuote = !inSingleQuote;
      output += char;
      continue;
    }

    if (!inSingleQuote && char === '"') {
      inDoubleQuote = !inDoubleQuote;
      output += char;
      continue;
    }

    if (inSingleQuote || inDoubleQuote) {
      output += char;
      continue;
    }

    if (char === "(") {
      parenDepth += 1;
      output += char;
      continue;
    }

    if (char === ")") {
      parenDepth = Math.max(0, parenDepth - 1);
      output += char;
      continue;
    }

    if (char === "{") {
      output += "{\n";
      continue;
    }

    if (char === "}") {
      output += "\n}\n";
      continue;
    }

    if (char === ";" && parenDepth === 0) {
      output += ";\n";
      continue;
    }

    output += char;
  }

  const lines = output
    .split("\n")
    .map((line) => line.trim())
    .filter((line, index, array) => line.length || (index > 0 && array[index - 1].length));

  const formatted = [];
  let indent = 0;
  for (const line of lines) {
    if (line.startsWith("}")) {
      indent = Math.max(indent - 1, 0);
    }
    const prefix = line.startsWith("#") ? "" : "  ".repeat(indent);
    formatted.push(`${prefix}${line}`);
    if (line.endsWith("{")) {
      indent += 1;
    }
  }

  return formatted.join("\n");
};

const formatCodeForDisplay = (sourceCode, language) => {
  const source = String(sourceCode || "").trim();
  if (!source) return "";
  if (!["javascript", "c", "cpp", "java", "go"].includes(language)) return source;

  const hasManyLines = source.split("\n").length >= 8;
  if (hasManyLines) return source;

  return formatBraceCode(source);
};

const getCompleteCode = (language, algorithm, snippet, payload) => {
  const body = (snippet || "").trim();
  if (!body) return "";

  const payloadJson = toJsonString(payload);
  const payloadPrettyJson = toPrettyJsonString(payload);
  const escapedPayload = escapeForDoubleQuotes(payloadPrettyJson);
  const cLikePayloadLiteral = toEscapedCStringLiteral(payloadPrettyJson, "  ");
  const javaPayloadExpression = toJavaStringExpression(payloadPrettyJson, "      ");

  if (language === "python") {
    if (/if\s+__name__\s*==\s*["']__main__["']\s*:/.test(body)) {
      return body;
    }

    return `${body}

import json
import sys


def read_input_payload():
    raw = sys.stdin.read().strip()
    if raw:
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            return {"raw": raw}
    return json.loads("${escapedPayload}")


if __name__ == "__main__":
    user_input = read_input_payload()
    print("Input payload for ${algorithm}:", user_input)`;
  }

  if (language === "javascript") {
    const hasMain = /(^|\n)\s*(function\s+main\s*\(|const\s+main\s*=|let\s+main\s*=|var\s+main\s*=)/m.test(body);
    if (hasMain) {
      return body;
    }

    return `${body}

const fs = require("fs");
const payloadText = ${JSON.stringify(payloadPrettyJson)};

function main() {
  const raw = fs.readFileSync(0, "utf8").trim();
  let inputPayload = JSON.parse(payloadText);

  if (raw) {
    try {
      inputPayload = JSON.parse(raw);
    } catch {
      inputPayload = { raw };
    }
  }

  console.log("Input payload for ${algorithm}:");
  console.log(JSON.stringify(inputPayload, null, 2));
}

main();`;
  }

  if (language === "c") {
    if (/\bint\s+main\s*\(/.test(body)) {
      return body;
    }

    const includeStdio = /#include\s*<stdio\.h>/.test(body) ? "" : "#include <stdio.h>\n\n";
    return `${includeStdio}${body}

int main(void) {
    const char *fallback_payload =
  ${cLikePayloadLiteral};

  char input_buffer[32768];
  size_t bytes_read = fread(input_buffer, 1, sizeof(input_buffer) - 1, stdin);

  if (bytes_read == 0) {
      puts(fallback_payload);
    return 0;
  }

  input_buffer[bytes_read] = '\\0';
  puts(input_buffer);
  return 0;
}`;
  }

  if (language === "cpp") {
    if (/\bint\s+main\s*\(/.test(body)) {
      return body;
    }

    const includeIostream = /#include\s*<iostream>/.test(body) ? "" : "#include <iostream>\n";
    const includeString = /#include\s*<string>/.test(body) ? "" : "#include <string>\n";
    return `${includeIostream}${includeString}${body}

int main() {
    const char *fallback_payload =
  ${cLikePayloadLiteral};

  std::string input_data;
  std::string line;

  while (std::getline(std::cin, line)) {
    if (!input_data.empty()) {
      input_data += "\\n";
    }
    input_data += line;
  }

  if (input_data.empty()) {
    std::cout << fallback_payload << "\\n";
    return 0;
  }

  std::cout << input_data;
  return 0;
}`;
  }

  if (language === "java") {
    if (/public\s+static\s+void\s+main\s*\(/.test(body)) {
      return body;
    }

    return `${body}

public class Main {
  public static void main(String[] args) throws Exception {
    String fallbackPayload =
${javaPayloadExpression};

    java.io.BufferedReader reader = new java.io.BufferedReader(new java.io.InputStreamReader(System.in));
    StringBuilder inputData = new StringBuilder();
    String line;

    while ((line = reader.readLine()) != null) {
      if (inputData.length() > 0) {
        inputData.append("\\n");
      }
      inputData.append(line);
    }

    if (inputData.length() == 0) {
      System.out.println(fallbackPayload);
      return;
    }

    System.out.print(inputData.toString());
  }
}`;
  }

  if (language === "go") {
    return `${body}

// Input payload snapshot from Analyzer:
// ${payloadPrettyJson}`;
  }

  return body;
};

const normalizeComparableLine = (line) => String(line || "").replace(/\s+/g, " ").trim();

const findLineByPatterns = (code, patterns = []) => {
  if (!code || !patterns.length) return null;
  const lines = String(code).split("\n");
  let best = null;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const normalizedLine = normalizeComparableLine(line);
    if (!normalizedLine) continue;

    let score = 0;
    for (const pattern of patterns) {
      if (pattern instanceof RegExp) {
        pattern.lastIndex = 0;
        if (pattern.test(line)) {
          score += 3;
        }
        continue;
      }

      if (typeof pattern === "string") {
        const normalizedPattern = normalizeComparableLine(pattern);
        if (line.includes(pattern) || (normalizedPattern && normalizedLine.includes(normalizedPattern))) {
          score += 2;
        }
      }
    }

    if (score === 0) continue;

    if (/\b(if|for|while|return|def|function|class|switch|case|else)\b/.test(normalizedLine)) {
      score += 0.4;
    }

    // Prefer earlier semantic matches slightly when scores tie.
    const rankedScore = score - index * 0.0001;
    if (!best || rankedScore > best.score) {
      best = { lineNumber: index + 1, score: rankedScore };
    }
  }

  return best?.lineNumber ?? null;
};

const resolveExplicitStepLine = (step = {}) => {
  const explicitLineKeys = ["line", "line_number", "lineNumber", "code_line", "codeLine", "current_line", "currentLine"];
  for (const key of explicitLineKeys) {
    const value = Number(step?.[key]);
    if (Number.isInteger(value) && value > 0) {
      return value;
    }
  }
  return null;
};

const mapBaseLineToRenderedCode = (baseCode, renderedCode, baseLineNumber) => {
  if (!Number.isInteger(baseLineNumber) || baseLineNumber <= 0) return null;
  if (!baseCode || !renderedCode) return baseLineNumber;

  const baseLines = String(baseCode).split("\n");
  const renderedLines = String(renderedCode).split("\n");
  const baseLineCount = baseLines.length;
  const renderedLineCount = renderedLines.length;

  if (baseLineNumber > baseLineCount) {
    return Math.max(1, Math.min(renderedLineCount, baseLineNumber));
  }

  const baseIndex = Math.max(0, Math.min(baseLines.length - 1, baseLineNumber - 1));
  const preferredAnchor = normalizeComparableLine(baseLines[baseIndex]);
  const fallbackAnchor = normalizeComparableLine(baseLines.find((line) => normalizeComparableLine(line).length > 0));
  const anchor = preferredAnchor && preferredAnchor.length ? preferredAnchor : fallbackAnchor;

  if (!anchor) return baseLineNumber;

  const exactSameLine = normalizeComparableLine(renderedLines[baseIndex]) === anchor;
  if (exactSameLine) {
    return baseIndex + 1;
  }

  const candidateIndexes = renderedLines
    .map((line, index) => ({ index, normalized: normalizeComparableLine(line) }))
    .filter((item) => item.normalized === anchor)
    .map((item) => item.index);

  if (!candidateIndexes.length) {
    return Math.max(1, Math.min(renderedLineCount, baseLineNumber));
  }

  const basePrev = normalizeComparableLine(baseLines[baseIndex - 1] || "");
  const baseNext = normalizeComparableLine(baseLines[baseIndex + 1] || "");

  let bestIndex = candidateIndexes[0];
  let bestScore = -Infinity;
  for (const candidate of candidateIndexes) {
    let score = -Math.abs(candidate - baseIndex);
    const renderedPrev = normalizeComparableLine(renderedLines[candidate - 1] || "");
    const renderedNext = normalizeComparableLine(renderedLines[candidate + 1] || "");

    if (basePrev && renderedPrev === basePrev) score += 2;
    if (baseNext && renderedNext === baseNext) score += 2;

    if (score > bestScore) {
      bestScore = score;
      bestIndex = candidate;
    }
  }

  return Math.max(1, Math.min(renderedLineCount, bestIndex + 1));
};

const ensureSentence = (text) => {
  const cleaned = String(text || "").replace(/\s+/g, " ").trim();
  if (!cleaned) return "";
  return /[.!?]$/.test(cleaned) ? cleaned : `${cleaned}.`;
};

const firstSentence = (text) => {
  const normalized = ensureSentence(text);
  const match = normalized.match(/^.*?[.!?](\s|$)/);
  return match ? match[0].trim() : normalized;
};

const humanizeToken = (value) => String(value || "").replace(/_/g, " ").trim();
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const pickByStep = (options = [], seed = 0) => {
  if (!Array.isArray(options) || options.length === 0) return "";
  const index = Math.abs(seed) % options.length;
  return options[index];
};

const getNarrationProsodyProfile = ({ stepType, category, mode, length, rate, pitch, stepIndex = 0 }) => {
  const normalizedStepType = String(stepType || "").toLowerCase();
  const normalizedCategory = String(category || "").toLowerCase();
  const normalizedMode = String(mode || "beginner").toLowerCase();
  const normalizedLength = String(length || "detailed").toLowerCase();

  const baseByMode = {
    beginner: { rateOffset: -0.05, pitchOffset: 0.08, volume: 1 },
    intermediate: { rateOffset: -0.01, pitchOffset: 0.04, volume: 0.99 },
    interview: { rateOffset: 0.04, pitchOffset: -0.02, volume: 0.98 },
  };

  const profile = { ...(baseByMode[normalizedMode] || baseByMode.beginner) };

  if (["augment", "select", "assign", "match", "best", "relax", "enqueue", "visit", "extract", "complete"].includes(normalizedStepType)) {
    profile.rateOffset += 0.06;
    profile.pitchOffset += 0.08;
    profile.volume += 0.02;
  }

  if (["backtrack", "negative_cycle", "conflict", "skip", "error", "not_found"].includes(normalizedStepType)) {
    profile.rateOffset -= 0.06;
    profile.pitchOffset -= 0.05;
    profile.volume -= 0.02;
  }

  if (normalizedCategory === "graph" && ["visit", "dequeue", "extract", "enqueue", "push", "augment"].includes(normalizedStepType)) {
    profile.rateOffset += 0.02;
  }

  if (normalizedCategory === "sorting" && ["compare", "swap", "merge", "pivot"].includes(normalizedStepType)) {
    profile.pitchOffset += 0.02;
  }

  if (normalizedLength === "short") {
    profile.rateOffset += 0.03;
  }

  if (stepIndex === 0) {
    profile.rateOffset -= 0.03;
    profile.pitchOffset += 0.02;
  }

  return {
    rate: clamp(rate + profile.rateOffset, 0.72, 1.55),
    pitch: clamp(pitch + profile.pitchOffset, 0.82, 1.45),
    volume: clamp(profile.volume, 0.92, 1),
  };
};

const EXPLANATION_MODE_OPTIONS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "interview", label: "Interview" },
];

const NARRATION_LENGTH_OPTIONS = [
  { value: "short", label: "Short" },
  { value: "detailed", label: "Detailed" },
];

const pickPreferredVoiceURI = (voices = []) => {
  if (!Array.isArray(voices) || !voices.length) return "";

  const scoreVoice = (voice) => {
    const name = String(voice?.name || "").toLowerCase();
    const lang = String(voice?.lang || "").toLowerCase();
    let score = 0;

    if (lang.startsWith("en")) score += 10;
    if (name.includes("natural") || name.includes("neural")) score += 20;
    if (name.includes("microsoft")) score += 8;
    if (name.includes("google")) score += 7;
    if (["samantha", "zira", "aria", "jenny", "guy", "sonia", "libby", "mark", "sara", "ryan"].some((token) => name.includes(token))) {
      score += 10;
    }
    if (voice?.default) score += 4;
    if (voice?.localService) score += 2;
    if (name.includes("david")) score -= 2;
    if (name.includes("espeak") || name.includes("robot")) score -= 10;

    return score;
  };

  const ranked = [...voices].sort((left, right) => scoreVoice(right) - scoreVoice(left));
  return ranked[0]?.voiceURI || voices[0]?.voiceURI || "";
};

const getStepLinePatterns = (category, algorithm, step = {}) => {
  const type = String(step?.type || "").toLowerCase();
  const algo = String(algorithm || "").toLowerCase();

  if (algo === "huffman_coding") {
    if (type === "frequency") return [/Counter\(|freq\s*=|freq\[/, /for .*text/, /for .*freq\.items/];
    if (type === "sort") return [/sorted\(/, /heapify\(/, /heapq\.heappush/];
    if (type === "merge") return [/while .*heap/, /heappop\(/, /heappush\(/];
    if (type === "code") return [/build\(|_collect_codes|dfs\(/, /code|codes/];
    if (type === "complete") return [/encoded\s*=|encoded_text/, /compression|return/];
  }

  if (category === "graph") {
    if (algo === "bfs") {
      if (["visit", "dequeue", "process", "extract"].includes(type)) {
        return [/popleft|dequeue|queue\.shift|queue\[front\+\+\]|while\s*\(/, /order|append|visit|current/];
      }
      if (["enqueue", "discover", "start"].includes(type)) {
        return [/append\(|enqueue|queue\.push|queue\[rear\+\+\]/, /visited|vis|if\s+.*not in/];
      }
      return [/queue|visited|for\s+neighbor|for\s*\(|while\s*\(/];
    }

    if (algo === "dfs") {
      if (["visit", "process"].includes(type)) {
        return [/go\(|dfs\(|vis\.add|visited\.add|visited\[.*\]\s*=\s*1|order\.append/, /for\s+neighbor|for\s*\(/];
      }
      if (["push", "advance"].includes(type)) {
        return [/stack\.append|stack\.push|push\(|go\(|dfs\(/, /if\s+.*not in vis|if\s*\(.*!visited/];
      }
      if (["backtrack", "pop"].includes(type)) {
        return [/stack\.pop|path\.pop|return\s+False|return\s+false|backtrack/];
      }
      return [/stack|visited|dfs\(|for\s*\(/];
    }

    if (algo === "dijkstra") {
      if (type === "extract") {
        return [/heappop|extract|min.*distance|priority|pq\.poll|queue\.poll/, /dist|distance/];
      }
      if (type === "relax") {
        return [/new_dist|nd\s*=|dist\[.*\]\s*=\s*|relax/, /heappush|push|priority|if\s+.*<\s*dist/];
      }
      return [/dist|priority|heap|for\s+neighbor|for\s*\(/];
    }

    if (algo === "floyd_warshall") {
      if (type === "relax") {
        return [
          /through_k|dist\[i\]\[k\]\s*\+\s*dist\[k\]\[j\]|min\(dist\[i\]\[j\],\s*dist\[i\]\[k\]\s*\+\s*dist\[k\]\[j\]\)|dist\[i\]\[j\]\s*=\s*through_k/,
          /for\s+k\s+in\s+range|for\s+i\s+in\s+range|for\s+j\s+in\s+range|for\s*\(.*k.*\)|for\s*\(.*i.*\)|for\s*\(.*j.*\)/,
        ];
      }
      return [/dist\s*=|for\s+k\s+in\s+range|for\s+i\s+in\s+range|for\s+j\s+in\s+range/, /idx|index|edges/];
    }

    if (algo === "bellman_ford") {
      if (type === "relax") {
        return [/dist\[.*\]\s*\+\s*.*<\s*dist|if\s+.*<\s*dist|relax/, /parent|updated|for\s+.*edges/];
      }
      if (type === "iteration") {
        return [/for\s+_?\s*in\s+range\(len\(nodes\)\s*-\s*1\)|for\s*\(.*<\s*nodes\.length|updated|break/];
      }
      if (type === "negative_cycle") {
        return [/negative.*cycle|has_negative_cycle|if\s+.*<\s*dist/, /for\s+.*edges|for\s*\(/];
      }
      return [/dist|parent|edges|for\s*\(/];
    }

    if (algo === "topological_sort") {
      if (type === "dequeue") {
        return [/popleft|dequeue|queue\.shift|q\.pop\(0\)|queue\[front\+\+\]/, /order\.append|order\.push/];
      }
      if (type === "edge_remove") {
        return [/indegree\[.*\]\s*-=|in_degree|indegree.*--/, /for\s+neighbor|for\s*\(/];
      }
      if (type === "enqueue") {
        return [/indegree\[.*\]\s*==\s*0|if\s*\(.*indegree.*==\s*0/, /queue\.append|enqueue|queue\.push/];
      }
      return [/indegree|queue|for\s*\(|while\s*\(/];
    }

    if (algo === "prim") {
      if (type === "select") {
        return [/heappop|priority|mst\.append|select/, /visited\.add|vis\.add/];
      }
      return [/heap|visited|mst|for\s*\(/];
    }

    if (algo === "kruskal") {
      if (["select", "skip"].includes(type)) {
        return [/sorted\(edges|edges\.sort|for\s+.*sorted|for\s*\(.*edges/, /union|find|parent|rank/];
      }
      return [/union|find|parent|edges/];
    }

    if (algo === "ford_fulkerson") {
      if (type === "augment") {
        return [/bottleneck|max_flow|flow\s*\+=|capacity\[.*\]\[.*\]\s*-=|residual/, /parent|while\s+q|for\s+v.*cap/];
      }
      return [/capacity|residual|parent|while\s+q|for\s*\(/];
    }

    if (algo === "graph_coloring") {
      if (type === "try") {
        return [/for\s+color|range\(1,\s*max_colors|is_safe|safe\(/, /assignment|colors/];
      }
      if (type === "assign") {
        return [/assignment\[|colors\[|backtrack\(/, /if\s+.*safe|if\s*\(.*safe/];
      }
      if (type === "conflict") {
        return [/assignment\[neighbor\]\s*==\s*color|is_safe|return\s+False|return\s+false/, /for\s+neighbor|for\s*\(/];
      }
      if (type === "backtrack") {
        return [/assignment\[.*\]\s*=\s*0|colors\[.*\]\s*=\s*0|backtrack/, /return\s+False|return\s+false/];
      }
      return [/assignment|colors|backtrack|for\s*\(/];
    }

    if (algo === "hamiltonian_cycle") {
      if (type === "advance") {
        return [/path\.append|used\.add|for\s+nxt|for\s*\(/, /backtrack\(/];
      }
      if (type === "backtrack") {
        return [/path\.pop|used\.remove|return\s+False|return\s+false|backtrack/];
      }
      if (type === "close") {
        return [/len\(path\)\s*==\s*len\(nodes\)|path\[0\]|adj\[path\[-1\]\]/, /return/];
      }
      return [/path|used|backtrack|for\s*\(/];
    }

    if (algo === "tsp_branch_bound") {
      if (type === "expand") {
        return [/heappop|pq|cost|visited|path/, /if\s+cost\s*>=\s*best|continue/];
      }
      if (type === "best") {
        return [/best_cost|best_path|total|return/, /if\s+total\s*<\s*best/];
      }
      return [/heap|best|path|cost/];
    }
  }

  if (category === "sorting") {
    if (type === "compare") return [/if\s*\(.*[<>]=?.*\)|if .*>/, /for\s*\(/];
    if (type === "swap") return [/swap|temp|\[a\[j\],\s*a\[j \+ 1\]\]/, /if\s*\(.*[<>]=?.*\)/];
    if (type === "pivot") return [/pivot|partition|part\(/];
    return [/for\s*\(|for\s+\w+\s+in/, /while\s*\(|while\s+\w+/];
  }

  if (category === "graph") {
    if (["enqueue", "push", "discover", "visit", "start"].includes(type)) {
      return [/enqueue|push|queue|stack|visited|vis\[/, /for\s*\(|for\s+\w+\s+in/, /while\s*\(|while\s+\w+/];
    }
    if (["dequeue", "pop", "process"].includes(type)) {
      return [/dequeue|pop|queue|stack/, /while\s*\(|while\s+\w+/, /visited/];
    }
    if (type.includes("relax") || type.includes("distance") || step?.edge || step?.distances) {
      return [/dist|distance|relax|weight|cost/, /if\s*\(.*[<>]=?.*\)|if\s+.*<|if\s+.*>/, /for\s*\(|for\s+\w+\s+in/];
    }
    if (type.includes("topological") || step?.indegree) {
      return [/indegree|in_degree|queue|topo/, /for\s*\(|for\s+\w+\s+in/, /while\s*\(|while\s+\w+/];
    }
    if (type.includes("mst") || type.includes("edge")) {
      return [/edge|weight|union|find|parent|key|min/, /for\s*\(|for\s+\w+\s+in/, /if\s*\(|if\s+\w+/];
    }
    return [/queue|stack|visited|dist|indegree|edge|path/, /for\s*\(|for\s+\w+\s+in/, /while\s*\(|while\s+\w+/];
  }

  if (category === "dp") {
    return [/dp\[|table|max\(|min\(/, /for\s*\(|for\s+\w+\s+in/];
  }

  if (category === "string") {
    if (type === "match") return [/return|append\(|push\(/, /if\s*\(|if\s+\w+/];
    return [/pattern|text|lps|hash/, /while\s*\(|while\s+\w+/];
  }

  if (["stack", "queue", "linked_list", "tree"].includes(category)) {
    return [/push|pop|enqueue|dequeue|insert|delete|search|traverse/, /if\s*\(|if\s+\w+/];
  }

  return [];
};

const Analyzer = ({ algorithmsData = [] }) => {
  const DEFAULT_LEFT_PANE_WIDTH = 320;
  const DEFAULT_VISUAL_RATIO = 0.62;
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const syntaxTheme = isLightTheme ? oneLight : vscDarkPlus;
  const codeSurfaceClass = isLightTheme ? "bg-[#f8fafc]" : "bg-[#1E1E1E]";
  const activeCodeLineBackground = isLightTheme ? "rgba(8, 145, 178, 0.12)" : "rgba(34, 211, 238, 0.22)";
  const activeCodeLineBorder = isLightTheme ? "3px solid rgba(14, 116, 144, 0.82)" : "3px solid rgba(34, 211, 238, 0.95)";
  const resizeHandleClass = isLightTheme
    ? "hidden w-2 cursor-col-resize rounded bg-slate-200/90 transition hover:bg-emerald-300/70 lg:block"
    : "hidden w-2 cursor-col-resize rounded bg-white/5 transition hover:bg-emerald-300/30 lg:block";
  const voiceControlClass = isLightTheme
    ? "inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 shadow-sm"
    : "inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sky/80";
  const voiceSelectClass = isLightTheme
    ? "max-w-[220px] rounded border border-slate-200 bg-white px-2 py-1 text-slate-700 outline-none shadow-sm"
    : "max-w-[220px] rounded border border-white/15 bg-slate-950/60 px-2 py-1 text-cyan-100 outline-none";
  const voiceCompactSelectClass = isLightTheme
    ? "rounded border border-slate-200 bg-white px-2 py-1 text-slate-700 outline-none shadow-sm"
    : "rounded border border-white/15 bg-slate-950/60 px-2 py-1 text-cyan-100 outline-none";
  const voiceAccentValueClass = isLightTheme ? "text-cyan-700" : "text-cyan-100";
  const voiceInfoChipClass = isLightTheme
    ? "rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-[11px] text-cyan-700"
    : "rounded-lg border border-cyan-300/25 bg-cyan-400/10 px-3 py-1.5 text-[11px] text-cyan-100";
  const secondaryActionClass = isLightTheme
    ? "rounded-lg border border-cyan-200 bg-white px-3 py-1.5 text-cyan-700 shadow-sm transition hover:border-cyan-300 hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-50"
    : "rounded-lg border border-cyan-300/40 bg-cyan-400/10 px-3 py-1.5 text-cyan-100 transition hover:bg-cyan-300/15 disabled:cursor-not-allowed disabled:opacity-50";
  const visualizationHintChipClass = isLightTheme
    ? "rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-600 shadow-sm"
    : "rounded-full bg-white/5 px-3 py-1";
  const executionLogClass = isLightTheme
    ? "mt-4 rounded-xl border border-slate-200 bg-slate-50/90 p-4"
    : "mt-4 rounded-xl border border-white/10 bg-slate-950/35 p-4";
  const executionLogIdleClass = isLightTheme
    ? "border-transparent bg-white text-slate-600 shadow-sm"
    : "border-transparent bg-white/5";
  const inactiveCodeTabClass = isLightTheme
    ? "border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300"
    : "border-white/15 bg-white/5 text-sky/70 hover:border-white/30";
  const activeAlgorithmCodeTabClass = isLightTheme
    ? "border-emerald-300 bg-emerald-50 text-emerald-700"
    : "border-emerald-300/50 bg-emerald-400/15 text-emerald-100";
  const activeLanguageTabClass = isLightTheme
    ? "border-cyan-300 bg-cyan-50 text-cyan-700"
    : "border-cyan-300/50 bg-cyan-400/15 text-cyan-100";
  const liveHighlightClass = isLightTheme
    ? "mt-3 rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-2 text-xs text-cyan-700"
    : "mt-3 rounded-lg border border-cyan-300/30 bg-cyan-400/10 px-3 py-2 text-xs text-cyan-100";
  const focusShellClass = isLightTheme
    ? "fixed inset-0 z-50 bg-slate-100/96 backdrop-blur-sm"
    : "fixed inset-0 z-50 bg-slate-950/96 backdrop-blur-md";
  const focusCardClass = isLightTheme
    ? "rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.12)]"
    : "rounded-2xl border border-white/10 bg-slate-900/75 p-4 shadow-[0_20px_60px_rgba(2,6,23,0.45)]";
  const focusHeaderClass = isLightTheme
    ? "mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
    : "mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/78 px-4 py-3 shadow-[0_18px_40px_rgba(2,6,23,0.32)]";
  const focusMutedTextClass = isLightTheme ? "text-slate-500" : "text-sky/45";
  const focusStepBadgeClass = isLightTheme
    ? "rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-500"
    : "rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-sky/55";
  const focusInfoBannerClass = isLightTheme
    ? "rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-2 text-xs text-cyan-700"
    : "rounded-lg border border-cyan-300/35 bg-cyan-400/10 px-3 py-2 text-xs text-cyan-100";
  const focusFallbackBannerClass = isLightTheme
    ? "rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500"
    : "rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-sky/60";

  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "sorting";
  const initialAlgorithm = searchParams.get("algorithm") || "bubble_sort";

  const [algorithms] = useState(algorithmsData);
  const [selectedCategory, setSelectedCategory] = useState("sorting");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("bubble_sort");
  const [inputData, setInputData] = useState({});
  const [steps, setSteps] = useState([]);
  const [metrics, setMetrics] = useState({
    comparisons: 0,
    swaps: 0,
    execution_time_ms: 0,
    recursion_depth: 0,
    space_estimate: "O(1)",
    input_size: 0
  });
  const [complexity, setComplexity] = useState(null);
  const [status, setStatus] = useState("idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [speed, setSpeed] = useState(600);
  const [codeLanguage, setCodeLanguage] = useState(() => localStorage.getItem("algovision-code-language") || "python");
  const [codeMode, setCodeMode] = useState("algorithm");
  const [howItWorksOpen, setHowItWorksOpen] = useState(() => window.innerWidth >= 768);
  const [inputError, setInputError] = useState("");
  const [leftPaneWidth, setLeftPaneWidth] = useState(DEFAULT_LEFT_PANE_WIDTH);
  const [visualPaneRatio, setVisualPaneRatio] = useState(DEFAULT_VISUAL_RATIO);
  const [focusMode, setFocusMode] = useState(false);
  const [voiceNarrationEnabled, setVoiceNarrationEnabled] = useState(false);
  const [voiceSyncEnabled, setVoiceSyncEnabled] = useState(true);
  const [voiceRate, setVoiceRate] = useState(() => Number(localStorage.getItem("algovision-voice-rate") || "1.02"));
  const [voicePitch, setVoicePitch] = useState(() => Number(localStorage.getItem("algovision-voice-pitch") || "1.08"));
  const [voiceExplanationMode, setVoiceExplanationMode] = useState(() => localStorage.getItem("algovision-voice-mode") || "beginner");
  const [voiceNarrationLength, setVoiceNarrationLength] = useState(() => localStorage.getItem("algovision-voice-length") || "detailed");
  const [voiceTeachingPauseMs, setVoiceTeachingPauseMs] = useState(
    () => Number(localStorage.getItem("algovision-voice-pause-ms") || "900")
  );
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState(() => localStorage.getItem("algovision-voice-uri") || "");
  const intervalRef = useRef(null);
  const narrationUtteranceRef = useRef(null);
  const narrationAdvanceTimeoutRef = useRef(null);
  const lastNarratedStepRef = useRef(-1);
  const focusOverlayRef = useRef(null);

  const speechSupported = useMemo(
    () => typeof window !== "undefined" && "speechSynthesis" in window && typeof window.SpeechSynthesisUtterance !== "undefined",
    []
  );

  const categories = useMemo(() => {
    const unique = new Set(algorithms.map((algo) => algo.category));
    const values = unique.size ? Array.from(unique) : ["sorting", "graph", "dp", "string", "stack", "queue", "linked_list", "tree"];
    return formatCategoryOptions(values);
  }, [algorithms]);

  const metadataMap = useMemo(() => buildUnifiedMetadataMap(algorithms), [algorithms]);

  const selectedVoice = useMemo(
    () => availableVoices.find((voice) => voice.voiceURI === selectedVoiceURI) || availableVoices[0] || null,
    [availableVoices, selectedVoiceURI]
  );

  const filteredAlgorithms = useMemo(() => {
    return algorithms.filter((algo) => algo.category === selectedCategory);
  }, [algorithms, selectedCategory]);

  const activeAlgorithm = useMemo(
    () => algorithms.find((algo) => algo.name === selectedAlgorithm) || null,
    [algorithms, selectedAlgorithm]
  );
  const executionMode = activeAlgorithm?.executionMode || "remote";
  const isRunnable = activeAlgorithm?.interactive !== false;

  useEffect(() => {
    const existingCategory = categories.find((item) => item.value === initialCategory)?.value;
    setSelectedCategory(existingCategory || "sorting");
  }, [categories, initialCategory]);

  useEffect(() => {
    if (filteredAlgorithms.length) {
      const initialInCategory = filteredAlgorithms.find((algo) => algo.name === initialAlgorithm)?.name;
      setSelectedAlgorithm(initialInCategory || filteredAlgorithms[0].name);
    }
  }, [filteredAlgorithms, initialAlgorithm]);

  useEffect(() => {
    const active = algorithms.find((algo) => algo.name === selectedAlgorithm);
    if (active) {
      setComplexity(active.complexity || metadataMap[active.name]?.complexity || null);
    }
  }, [algorithms, metadataMap, selectedAlgorithm]);

  useEffect(() => {
    localStorage.setItem("algovision-code-language", codeLanguage);
  }, [codeLanguage]);

  useEffect(() => {
    localStorage.setItem("algovision-voice-rate", String(voiceRate));
  }, [voiceRate]);

  useEffect(() => {
    localStorage.setItem("algovision-voice-pitch", String(voicePitch));
  }, [voicePitch]);

  useEffect(() => {
    localStorage.setItem("algovision-voice-mode", voiceExplanationMode);
  }, [voiceExplanationMode]);

  useEffect(() => {
    localStorage.setItem("algovision-voice-length", voiceNarrationLength);
  }, [voiceNarrationLength]);

  useEffect(() => {
    localStorage.setItem("algovision-voice-pause-ms", String(voiceTeachingPauseMs));
  }, [voiceTeachingPauseMs]);

  useEffect(() => {
    if (!selectedVoiceURI) return;
    localStorage.setItem("algovision-voice-uri", selectedVoiceURI);
  }, [selectedVoiceURI]);

  useEffect(() => {
    setMetrics({
      comparisons: 0,
      swaps: 0,
      execution_time_ms: 0,
      recursion_depth: 0,
      space_estimate: "O(1)",
      input_size: 0
    });
    setSteps([]);
    setStepIndex(0);
    setStatus("idle");
    setHowItWorksOpen(window.innerWidth >= 768);
    setFocusMode(false);
    lastNarratedStepRef.current = -1;
    if (narrationAdvanceTimeoutRef.current) {
      window.clearTimeout(narrationAdvanceTimeoutRef.current);
      narrationAdvanceTimeoutRef.current = null;
    }
    if (speechSupported) {
      window.speechSynthesis.cancel();
    }
    setInputError("");
  }, [selectedCategory, selectedAlgorithm]);

  useEffect(() => {
    if (selectedCategory === "sorting") {
      setInputData({ arrayText: sortingPresets[0].array.join(","), arraySize: 10 });
    }
    if (selectedCategory === "search") {
      setInputData({
        arrayText: "3,7,12,18,24,31,45",
        targetValue: 18
      });
    }
    if (selectedCategory === "graph") {
      const preset = graphPresets[0];
      setInputData({
        nodesText: preset.nodes.join(","),
        edgesText: preset.edges.map((e) => `${e.from},${e.to},${e.weight}`).join("\n"),
        directed: preset.directed,
        weighted: true,
        startNode: preset.start,
        sinkNode: preset.sink,
        maxColors: selectedAlgorithm === "graph_coloring" ? 3 : undefined
      });
    }
    if (selectedCategory === "dp") {
      setInputData({
        weightsText: dpPresets.knapsack.weights.join(","),
        valuesText: dpPresets.knapsack.values.join(","),
        capacity: dpPresets.knapsack.capacity,
        dimensionsText: dpPresets.matrixChain.dimensions.join(","),
        textA: dpPresets.lcs.textA,
        textB: dpPresets.lcs.textB
      });
    }
    if (selectedCategory === "string") {
      setInputData({ text: stringPresets.huffmanText || stringPresets.text, pattern: stringPresets.pattern });
    }
    if (selectedCategory === "backtracking") {
      setInputData({ boardSize: 8 });
    }
    if (selectedCategory === "stack") {
      setInputData({
        initialValuesText: "10,20,30",
        capacity: 8,
        operationType: "push",
        operationTraversal: "inorder",
        operationsText: "push 40\npeek\npop\nisEmpty"
      });
    }
    if (selectedCategory === "queue") {
      setInputData({
        initialValuesText: "1,2,3",
        capacity: 8,
        operationType: "enqueue",
        operationTraversal: "inorder",
        operationsText: "enqueue 4\nfront\ndequeue\nrear"
      });
    }
    if (selectedCategory === "linked_list") {
      setInputData({
        initialValuesText: "5,8,13",
        operationType: "insert_begin",
        operationTraversal: "inorder",
        operationsText: "insert_begin 3\ninsert_end 21\ninsert_pos 34 2\nsearch 13\nreverse\ntraverse"
      });
    }
    if (selectedCategory === "tree") {
      setInputData({
        initialValuesText: "50,30,70,20,40,60,80",
        order: 4,
        operationType: "insert",
        operationTraversal: "inorder",
        operationsText: "insert 65\nsearch 40\ntraverse inorder\ndelete 20\ntraverse levelorder"
      });
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (status !== "playing" || (voiceNarrationEnabled && voiceSyncEnabled && speechSupported)) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }
    intervalRef.current = setInterval(() => {
      setStepIndex((prev) => {
        const next = prev + 1;
        if (next >= steps.length) {
          clearInterval(intervalRef.current);
          setStatus("completed");
          return prev;
        }
        return next;
      });
    }, speed);
    return () => clearInterval(intervalRef.current);
  }, [status, steps.length, speed, voiceNarrationEnabled, voiceSyncEnabled, speechSupported]);

  useEffect(() => {
    if (!speechSupported) return undefined;

    const synth = window.speechSynthesis;
    const syncVoices = () => {
      const voices = synth.getVoices() || [];
      setAvailableVoices(voices);
      if (!voices.length) return;

      const currentExists = selectedVoiceURI && voices.some((voice) => voice.voiceURI === selectedVoiceURI);
      if (!currentExists) {
        setSelectedVoiceURI(pickPreferredVoiceURI(voices));
      }
    };

    syncVoices();
    if (typeof synth.addEventListener === "function") {
      synth.addEventListener("voiceschanged", syncVoices);
    } else {
      synth.onvoiceschanged = syncVoices;
    }

    return () => {
      if (typeof synth.removeEventListener === "function") {
        synth.removeEventListener("voiceschanged", syncVoices);
      } else if (synth.onvoiceschanged === syncVoices) {
        synth.onvoiceschanged = null;
      }
      window.speechSynthesis.cancel();
    };
  }, [selectedVoiceURI, speechSupported]);

  useEffect(() => {
    if (!focusMode) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [focusMode]);

  useEffect(() => {
    if (!focusMode) return undefined;
    const target = focusOverlayRef.current;
    if (!target || typeof target.requestFullscreen !== "function" || document.fullscreenElement === target) {
      return undefined;
    }

    Promise.resolve(target.requestFullscreen()).catch(() => undefined);
    return undefined;
  }, [focusMode]);

  useEffect(() => {
    if (!focusMode) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        if (document.fullscreenElement && typeof document.exitFullscreen === "function") {
          Promise.resolve(document.exitFullscreen()).catch(() => undefined);
          return;
        }
        setFocusMode(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [focusMode]);

  useEffect(() => {
    const onFullscreenChange = () => {
      if (document.fullscreenElement === focusOverlayRef.current) {
        return;
      }
      if (!document.fullscreenElement) {
        setFocusMode(false);
      }
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    if (!speechSupported || !voiceNarrationEnabled) return;
    if (status !== "playing") {
      window.speechSynthesis.cancel();
    }
  }, [speechSupported, status, voiceNarrationEnabled]);

  useEffect(() => {
    if (status === "playing") return;
    if (narrationAdvanceTimeoutRef.current) {
      window.clearTimeout(narrationAdvanceTimeoutRef.current);
      narrationAdvanceTimeoutRef.current = null;
    }
  }, [status]);

  useEffect(() => {
    if (!voiceNarrationEnabled) return;
    lastNarratedStepRef.current = -1;
  }, [voiceNarrationEnabled, voiceSyncEnabled]);

  const handleRun = async () => {
    if (!isRunnable) {
      setInputError(activeAlgorithm?.studyNote || "Interactive execution is not implemented for this topic yet.");
      setStatus("idle");
      return;
    }
    if (narrationAdvanceTimeoutRef.current) {
      window.clearTimeout(narrationAdvanceTimeoutRef.current);
      narrationAdvanceTimeoutRef.current = null;
    }
    setStatus("running");
    setInputError("");
    try {
      const payload = buildPayloadAndValidate(selectedCategory, selectedAlgorithm, inputData);
      const response = executionMode === "local"
        ? runLocalAnalyzer(selectedAlgorithm, payload, activeAlgorithm?.complexity || null)
        : await runAlgorithm({
            category: selectedCategory,
            algorithm: selectedAlgorithm,
            input: payload,
            options: { track_steps: true }
          });
      const describedSteps = attachStepDescriptions(selectedCategory, selectedAlgorithm, response.steps || []);
      setSteps(describedSteps);
      setMetrics(response.metrics || {
        comparisons: 0,
        swaps: 0,
        execution_time_ms: 0,
        recursion_depth: 0,
        space_estimate: "O(1)",
        input_size: 0
      });
      setComplexity(response.complexity || activeAlgorithm?.complexity || null);
      lastNarratedStepRef.current = -1;
      setStepIndex(0);
      setStatus("playing");
      const history = JSON.parse(localStorage.getItem("algovision-history") || "[]");
      history.unshift({
        timestamp: new Date().toISOString(),
        algorithm: selectedAlgorithm,
        category: selectedCategory,
        metrics: response.metrics
      });
      localStorage.setItem("algovision-history", JSON.stringify(history.slice(0, 10)));
    } catch (error) {
      const message = error?.response?.data?.detail || error?.message || "Invalid input.";
      setInputError(message);
      setStatus("error");
    }
  };

  const handlePause = () => {
    if (narrationAdvanceTimeoutRef.current) {
      window.clearTimeout(narrationAdvanceTimeoutRef.current);
      narrationAdvanceTimeoutRef.current = null;
    }
    if (speechSupported) {
      window.speechSynthesis.cancel();
    }
    setStatus("paused");
  };
  const handleResume = () => {
    lastNarratedStepRef.current = -1;
    setStatus("playing");
  };
  const handleReset = () => {
    if (narrationAdvanceTimeoutRef.current) {
      window.clearTimeout(narrationAdvanceTimeoutRef.current);
      narrationAdvanceTimeoutRef.current = null;
    }
    if (speechSupported) {
      window.speechSynthesis.cancel();
    }
    lastNarratedStepRef.current = -1;
    setStatus("idle");
    setStepIndex(0);
  };
  const handleStepForward = () => setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  const handleStepBackward = () => setStepIndex((prev) => Math.max(prev - 1, 0));

  const handleVoicePreview = () => {
    if (!speechSupported) return;
    const previewText = voiceExplanationMode === "interview"
      ? "Interview mode preview. Crisp, confident, and to the point. I will spotlight the invariant, the dominant move, and the reason this transition is valid."
      : voiceExplanationMode === "intermediate"
        ? "Intermediate mode preview. I will explain what changed, why it matters, and which code line is driving the transition."
        : "Beginner mode preview. Warm pacing, plain language, and clear links between the visual state, the next move, and the highlighted code line.";
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(previewText);
    const previewProsody = getNarrationProsodyProfile({
      stepType: "preview",
      category: selectedCategory,
      mode: voiceExplanationMode,
      length: voiceNarrationLength,
      rate: voiceRate,
      pitch: voicePitch,
      stepIndex,
    });
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang || "en-US";
    }
    utterance.rate = previewProsody.rate;
    utterance.pitch = previewProsody.pitch;
    utterance.volume = previewProsody.volume;
    synth.speak(utterance);
  };

  const handleRandomInput = () => {
    if (!isRunnable) {
      return;
    }
    if (selectedCategory === "sorting") {
      setInputData((prev) => ({ ...prev, ...generateRandomSortingInput(prev.arraySize || 10) }));
      return;
    }
    if (selectedCategory === "search") {
      setInputData((prev) => ({ ...prev, ...generateRandomSearchInput(selectedAlgorithm) }));
      return;
    }
    if (selectedCategory === "graph") {
      const randomGraph = generateRandomGraphInput();
      setInputData((prev) => ({
        ...randomGraph,
        maxColors: selectedAlgorithm === "graph_coloring"
          ? Math.max(3, Number(prev?.maxColors || randomGraph.maxColors || 3))
          : prev?.maxColors
      }));
      return;
    }
    if (selectedCategory === "dp") {
      setInputData((prev) => ({ ...prev, ...generateRandomDpInput(selectedAlgorithm) }));
      return;
    }
    if (selectedCategory === "string") {
      setInputData((prev) => ({ ...prev, ...generateRandomStringInput(selectedAlgorithm) }));
      return;
    }
    if (selectedCategory === "backtracking") {
      setInputData((prev) => ({ ...prev, ...generateRandomBacktrackingInput(selectedAlgorithm) }));
      return;
    }
    if (["stack", "queue", "linked_list", "tree"].includes(selectedCategory)) {
      setInputData((prev) => ({ ...prev, ...generateRandomDataStructureInput(selectedCategory, selectedAlgorithm) }));
    }
  };

  const currentPayload = (() => {
    try {
      if (!isRunnable) {
        return {};
      }
      return buildPayloadAndValidate(selectedCategory, selectedAlgorithm, inputData);
    } catch {
      return {};
    }
  })();

  const activeMetadata = activeAlgorithm ? metadataMap[activeAlgorithm.name] : null;
  const baseCode = activeAlgorithm?.codeByLanguage?.[codeLanguage] || activeAlgorithm?.code || "";
  const displayBaseCode = useMemo(() => formatCodeForDisplay(baseCode, codeLanguage), [baseCode, codeLanguage]);
  const activeCode = codeMode === "complete"
    ? getCompleteCode(codeLanguage, selectedAlgorithm, displayBaseCode, currentPayload)
    : displayBaseCode;
  const currentStep = steps?.[stepIndex] || {};
  const currentStepType = String(currentStep?.type || "").toLowerCase();

  const useKeyIdeaTeachingPause = useMemo(() => {
    if (selectedCategory !== "graph") return false;
    if (selectedAlgorithm === "bfs") {
      return ["visit", "enqueue"].includes(currentStepType);
    }
    if (selectedAlgorithm === "dfs") {
      return ["visit", "push"].includes(currentStepType);
    }
    if (selectedAlgorithm === "dijkstra") {
      return ["extract", "relax"].includes(currentStepType);
    }
    return false;
  }, [currentStepType, selectedAlgorithm, selectedCategory]);

  const activeCodeLine = useMemo(() => {
    if (!steps.length) return null;
    const explicitLine = resolveExplicitStepLine(currentStep);
    if (explicitLine) {
      if (codeMode !== "complete") return explicitLine;
      return mapBaseLineToRenderedCode(displayBaseCode, activeCode, explicitLine);
    }

    const patterns = getStepLinePatterns(selectedCategory, selectedAlgorithm, currentStep);
    const baseLine = displayBaseCode ? findLineByPatterns(displayBaseCode, patterns) : null;
    if (baseLine) {
      if (codeMode !== "complete") return baseLine;
      return mapBaseLineToRenderedCode(displayBaseCode, activeCode, baseLine);
    }

    return activeCode ? findLineByPatterns(activeCode, patterns) : null;
  }, [activeCode, codeMode, currentStep, displayBaseCode, selectedAlgorithm, selectedCategory, steps.length]);

  const narrationText = useMemo(() => {
    if (!steps.length) return "";

    const stepType = currentStepType || "update";
    const currentNode = currentStep?.current ?? currentStep?.node;
    const edge = currentStep?.edge;
    const queue = Array.isArray(currentStep?.queue) ? currentStep.queue : null;
    const stack = Array.isArray(currentStep?.stack) ? currentStep.stack : null;
    const visited = Array.isArray(currentStep?.visited) ? currentStep.visited : null;
    const distances = currentStep?.distances && typeof currentStep.distances === "object"
      ? currentStep.distances
      : null;
    const currentStepPath = Array.isArray(currentStep?.path)
      ? currentStep.path.map((node) => String(node)).filter(Boolean)
      : [];

    const formatFrontierItem = (item) => {
      if (Array.isArray(item) && item.length >= 2) {
        return `${String(item[1])}(${String(item[0])})`;
      }
      return String(item);
    };

    const previewList = (list, limit = 4) => {
      if (!Array.isArray(list) || list.length === 0) {
        return "empty";
      }
      const shown = list.slice(0, limit).map(formatFrontierItem).join(", ");
      return list.length > limit ? `${shown}, and more` : shown;
    };

    const explainGraphStep = () => {
      if (selectedAlgorithm === "bfs") {
        if (stepType === "visit") {
          return currentNode
            ? `We are now processing node ${String(currentNode)}. In BFS, the queue is first-in first-out, so this node appears now because it was discovered earlier. After this, we inspect its neighbors and enqueue unseen nodes.`
            : "We process the next node from the front of the queue to preserve BFS level order.";
        }
        if (stepType === "enqueue" && edge) {
          return `From node ${String(edge.from)}, we discover ${String(edge.to)} and place it at the back of the queue. We mark it visited right away to avoid duplicate inserts.`;
        }
      }

      if (selectedAlgorithm === "dfs") {
        if (stepType === "visit") {
          return currentNode
            ? `We now visit node ${String(currentNode)}. DFS follows a depth-first strategy, so it keeps going deeper before backtracking.`
            : "We visit the node on top of the stack and continue along the current depth path.";
        }
        if (stepType === "push" && edge) {
          return `We push ${String(edge.to)} from ${String(edge.from)} onto the stack. That means this branch becomes a candidate for the next deep move.`;
        }
      }

      if (selectedAlgorithm === "dijkstra") {
        if (stepType === "extract") {
          return currentNode
            ? `We extract node ${String(currentNode)} because it has the smallest tentative distance in the priority queue. This is the safest node to expand next.`
            : "We extract the node with the smallest known distance from the priority queue.";
        }
        if (stepType === "relax" && edge) {
          return `We test edge ${String(edge.from)} to ${String(edge.to)} for relaxation. If this route is cheaper, we update the destination distance and push it back into the priority queue.`;
        }
      }

      if (selectedAlgorithm === "floyd_warshall") {
        if (stepType === "relax") {
          const row = Number.isInteger(currentStep?.row) ? currentStep.row : null;
          const col = Number.isInteger(currentStep?.col) ? currentStep.col : null;
          const via = currentStep?.via !== undefined && currentStep?.via !== null ? String(currentStep.via) : null;
          const nextValue = currentStep?.value !== undefined && currentStep?.value !== null ? String(currentStep.value) : null;
          if (row !== null && col !== null) {
            return `Floyd-Warshall improves matrix cell [${row}, ${col}]${via ? ` using intermediate node ${via}` : ""}${nextValue ? `, setting it to ${nextValue}` : ""}. This means we found a shorter indirect route than the current direct estimate.`;
          }
          return "Floyd-Warshall applies a relaxation update by checking whether a path through the current intermediate node gives a shorter all-pairs distance.";
        }
        return "Floyd-Warshall evaluates every source-destination pair through each possible intermediate node to refine the all-pairs shortest-path matrix.";
      }

      if (selectedAlgorithm === "bellman_ford") {
        if (stepType === "relax" && edge) {
          return `In this Bellman-Ford pass, edge ${String(edge.from)} to ${String(edge.to)} improves the best-known distance, so we update the destination estimate.`;
        }
        if (stepType === "iteration") {
          const iteration = currentStep?.iteration ? `pass ${currentStep.iteration}` : "this pass";
          return `We finish ${iteration} over all edges and check if any value changed. If nothing changes, Bellman-Ford can terminate early.`;
        }
        if (stepType === "negative_cycle") {
          return "A further relaxation is still possible after all passes, which signals a negative-weight cycle reachable from the start node.";
        }
      }

      if (selectedAlgorithm === "topological_sort") {
        if (stepType === "dequeue") {
          return currentNode
            ? `Node ${String(currentNode)} has indegree zero, so we safely output it next in topological order.`
            : "We dequeue an indegree-zero node and append it to the topological order.";
        }
        if (stepType === "edge_remove" && edge) {
          return `We remove dependency edge ${String(edge.from)} to ${String(edge.to)}, so indegree of ${String(edge.to)} decreases by one.`;
        }
        if (stepType === "enqueue" && edge) {
          return `Node ${String(edge.to)} now has indegree zero, so it becomes ready and is enqueued.`;
        }
      }

      if (selectedAlgorithm === "prim") {
        if (stepType === "select" && edge) {
          return `Prim selects edge ${String(edge.from)} to ${String(edge.to)} because it is the cheapest safe edge that expands the tree.`;
        }
      }

      if (selectedAlgorithm === "kruskal") {
        if (stepType === "select" && edge) {
          return `Kruskal accepts edge ${String(edge.from)} to ${String(edge.to)} because it connects different components without creating a cycle.`;
        }
        if (stepType === "skip" && edge) {
          return `Edge ${String(edge.from)} to ${String(edge.to)} is skipped because both endpoints are already in the same component, so it would form a cycle.`;
        }
      }

      if (selectedAlgorithm === "ford_fulkerson") {
        if (stepType === "augment") {
          const pathLabel = currentStepPath.length > 1 ? currentStepPath.join(" to ") : "the discovered residual path";
          const bottleneck = Number.isFinite(Number(currentStep?.bottleneck)) ? String(currentStep.bottleneck) : "the path bottleneck";
          const flow = Number.isFinite(Number(currentStep?.flow)) ? String(currentStep.flow) : null;
          return flow
            ? `Great update. We augment along ${pathLabel}, push ${bottleneck} units of flow, and raise total flow to ${flow}.`
            : `Great update. We augment along ${pathLabel} with bottleneck ${bottleneck}, then update residual capacities.`;
        }
        return "Ford-Fulkerson keeps searching for source-to-sink augmenting paths in the residual graph.";
      }

      if (selectedAlgorithm === "hamiltonian_cycle") {
        if (stepType === "advance") {
          return currentStepPath.length
            ? `We extend the candidate Hamiltonian path: ${currentStepPath.join(" to ")}.`
            : "We extend the current candidate path by one valid unused neighbor.";
        }
        if (stepType === "backtrack") {
          return currentStepPath.length
            ? `This branch cannot close a full cycle, so we backtrack to path ${currentStepPath.join(" to ")} and try the next option.`
            : "This branch failed, so we backtrack and test another neighbor.";
        }
        if (stepType === "close") {
          return "All vertices are included, so we now check whether the last node reconnects to the start and closes a valid Hamiltonian cycle.";
        }
      }

      if (selectedAlgorithm === "tsp_branch_bound") {
        if (stepType === "expand") {
          const pathLabel = currentStepPath.length ? currentStepPath.join(" to ") : "the current partial tour";
          const cost = Number.isFinite(Number(currentStep?.cost)) ? ` with partial cost ${String(currentStep.cost)}` : "";
          return `We expand ${pathLabel}${cost}, then compare it against the current best bound.`;
        }
        if (stepType === "best") {
          const pathLabel = currentStepPath.length ? currentStepPath.join(" to ") : "this tour";
          const cost = Number.isFinite(Number(currentStep?.cost)) ? String(currentStep.cost) : "a lower total";
          return `New best tour found: ${pathLabel}. Its cost is ${cost}, so future branches must beat this bound.`;
        }
      }

      if (selectedAlgorithm === "graph_coloring") {
        if (stepType === "try") {
          return `We test whether color c${String(currentStep?.color ?? "?")} is valid for node ${String(currentStep?.node ?? "?")}.`;
        }
        if (stepType === "assign") {
          return `Color c${String(currentStep?.color ?? "?")} is safe, so node ${String(currentStep?.node ?? "?")} is assigned and we move forward.`;
        }
        if (stepType === "conflict") {
          return `This color choice conflicts with neighbor ${String(currentStep?.conflict_with ?? "?")}, so we reject it and try a different color.`;
        }
        if (stepType === "backtrack") {
          return `No valid color extension from this branch, so we backtrack and revise an earlier assignment.`;
        }
      }

      if (stepType === "relax" && edge) {
        return `We test whether edge ${String(edge.from)} to ${String(edge.to)} gives a better path estimate.`;
      }

      return currentStep?.description || `We are processing a ${humanizeToken(stepType || "update")} step.`;
    };

    const explainSortingStep = () => {
      const left = Number.isInteger(currentStep?.indices?.[0]) ? currentStep.indices[0] : null;
      const right = Number.isInteger(currentStep?.indices?.[1]) ? currentStep.indices[1] : null;
      const arr = Array.isArray(currentStep?.array) ? currentStep.array : [];
      const leftValue = left !== null ? arr[left] : undefined;
      const rightValue = right !== null ? arr[right] : undefined;

      if (stepType.includes("compare")) {
        if (left !== null && right !== null) {
          return `We compare positions ${left} and ${right}${leftValue !== undefined && rightValue !== undefined ? `, values ${leftValue} and ${rightValue}` : ""}, to decide if this pair is already in sorted order.`;
        }
        return "We compare two values to decide whether they are already in the correct order.";
      }
      if (stepType.includes("swap")) {
        if (left !== null && right !== null) {
          return `This pair is out of order, so we swap indices ${left} and ${right} to reduce local disorder.`;
        }
        return "A swap occurs because this pair violates the sorting rule at this point.";
      }
      if (stepType.includes("pivot")) {
        return "A pivot is chosen to split values into lower and higher partitions before recursive refinement.";
      }
      if (stepType.includes("merge")) {
        return "We merge sorted subarrays while preserving global order and stability.";
      }
      return currentStep?.description || "The sorting algorithm is refining the array order.";
    };

    const explainDpStep = () => {
      const row = Number.isInteger(currentStep?.row) ? currentStep.row : null;
      const col = Number.isInteger(currentStep?.col) ? currentStep.col : null;
      const value = currentStep?.value;
      if (stepType.includes("table") || stepType.includes("update")) {
        return row !== null && col !== null
          ? `We update DP cell [${row}, ${col}]${value !== undefined ? ` to ${String(value)}` : ""} using already-solved smaller subproblems.`
          : "We update a DP state using answers from smaller subproblems that were solved earlier.";
      }
      if (stepType.includes("match")) {
        return "A match transition extends a compatible solution from the diagonal predecessor state.";
      }
      if (stepType.includes("skip") || stepType.includes("choose")) {
        return "This transition compares alternatives and keeps the better subproblem outcome.";
      }
      return currentStep?.description || "The DP table is being updated with a better subproblem result.";
    };

    const explainStringStep = () => {
      const textIndex = Number.isInteger(currentStep?.text_index) ? currentStep.text_index : Number.isInteger(currentStep?.index) ? currentStep.index : null;
      const patternIndex = Number.isInteger(currentStep?.pattern_index) ? currentStep.pattern_index : null;
      if (stepType.includes("match")) {
        return textIndex !== null
          ? `Pattern match confirmed at text index ${textIndex}.`
          : "We confirm a full alignment between pattern and text window.";
      }
      if (stepType.includes("compare")) {
        return textIndex !== null && patternIndex !== null
          ? `We compare text index ${textIndex} with pattern index ${patternIndex} to decide whether to advance or shift.`
          : "We compare current text and pattern characters to decide the next shift.";
      }
      return currentStep?.description || "The string matcher shifts or confirms based on the current character check.";
    };

    const explainDataStructureStep = () => {
      const operation = currentStep?.operation || stepType;
      if (stepType.includes("push") || stepType.includes("enqueue") || stepType.includes("insert")) {
        return `Operation ${humanizeToken(operation)} inserts data while preserving the data structure invariant.`;
      }
      if (stepType.includes("pop") || stepType.includes("dequeue") || stepType.includes("delete")) {
        return `Operation ${humanizeToken(operation)} removes data, then updates pointers or indexes to keep structure consistency.`;
      }
      return currentStep?.description || "The data structure state changes according to the selected operation.";
    };

    const categoryExplanation = (() => {
      if (selectedCategory === "graph") return explainGraphStep();
      if (selectedCategory === "sorting") return explainSortingStep();
      if (selectedCategory === "dp") return explainDpStep();
      if (selectedCategory === "string") return explainStringStep();
      return explainDataStructureStep();
    })();

    const narrationStyleByMode = {
      beginner: [
        "Nice, that was a meaningful move.",
        "Here comes a step worth noticing.",
        "Good, the algorithm just revealed something important.",
      ],
      intermediate: [
        "Now the state shifts in a measurable way.",
        "Here is the precise transition to watch.",
        "This is the step where the invariant earns its keep.",
      ],
      interview: [
        "Here is the interview-ready takeaway.",
        "This is the sharp version you could say out loud.",
        "Frame this step around the invariant and the payoff.",
      ],
    };

    const explanationLeadByMode = {
      beginner: [
        "In plain language:",
        "The big idea is this:",
        "Notice what changed here:",
      ],
      intermediate: [
        "Mechanically:",
        "From the algorithm's point of view:",
        "The important detail is this:",
      ],
      interview: [
        "A concise way to frame it is this:",
        "The clean justification is:",
        "Say it like this:",
      ],
    };

    const endingByMode = {
      beginner: [
        "That sets up the next move cleanly.",
        "Keep that picture in mind for what comes next.",
        "We can build on that in the next step.",
      ],
      intermediate: [
        "The next step should preserve the same structure.",
        "That keeps the state consistent for the next transition.",
        "The following move extends this same logic.",
      ],
      interview: [
        "Next, restate the invariant and move on.",
        "Carry the same invariant into the next step.",
        "Keep the next explanation short and invariant-focused.",
      ],
    };

    const livelyCues = {
      relax: "Excellent update.",
      select: "Great selection.",
      augment: "Strong flow move.",
      enqueue: "Good frontier expansion.",
      push: "Nice depth extension.",
      assign: "Great assignment.",
      match: "Perfect match.",
      best: "New best found.",
      backtrack: "Smart backtrack.",
      conflict: "Constraint detected.",
      negative_cycle: "Critical detection.",
    };

    const intros = narrationStyleByMode[voiceExplanationMode] || narrationStyleByMode.beginner;
    const leads = explanationLeadByMode[voiceExplanationMode] || explanationLeadByMode.beginner;
    const endings = endingByMode[voiceExplanationMode] || endingByMode.beginner;
    const cue = livelyCues[stepType] || "Good momentum.";
    const intro = stepIndex === 0
      ? `Welcome. Let us walk through ${getAlgorithmDisplayName(selectedAlgorithm)} together.`
      : `${cue} ${pickByStep(intros, stepIndex)}`;

    const coachingNotes = [];
    if (queue) {
      coachingNotes.push(`Right now the queue holds ${previewList(queue)}.`);
    }
    if (stack) {
      coachingNotes.push(`At this moment the stack reads ${previewList(stack)}.`);
    }
    if (visited) {
      const visitedPreview = visited.slice(0, 4).map((node) => String(node)).join(", ");
      coachingNotes.push(
        visited.length <= 4
          ? `Visited so far: ${visitedPreview}.`
          : `Visited so far: ${visitedPreview}, and more.`
      );
    }
    if (distances) {
      const finite = Object.entries(distances).filter(([, value]) => value !== null && value !== undefined);
      if (finite.length) {
        const preview = finite.slice(0, 3).map(([node, value]) => `${String(node)}=${String(value)}`).join(", ");
        coachingNotes.push(`Current best distances include ${preview}.`);
      }
    }
    if (currentStepPath.length > 1) {
      coachingNotes.push(`The active path now reads ${currentStepPath.join(" to ")}.`);
    }
    if (Number.isFinite(Number(currentStep?.bottleneck))) {
      coachingNotes.push(`The bottleneck for this move is ${String(currentStep.bottleneck)}.`);
    }
    if (Number.isFinite(Number(currentStep?.flow))) {
      coachingNotes.push(`Total flow has climbed to ${String(currentStep.flow)}.`);
    }
    if (activeCodeLine) {
      coachingNotes.push(`The highlighted code line is ${activeCodeLine}, and it is doing the work for this step.`);
    }

    if (voiceExplanationMode === "interview") {
      if (selectedCategory === "graph") {
        coachingNotes.push("Interview note: mention visited structure and frontier choice as your correctness argument.");
      } else if (selectedCategory === "dp") {
        coachingNotes.push("Interview note: explain subproblem state and transition relation in one sentence.");
      } else if (selectedCategory === "sorting") {
        coachingNotes.push("Interview note: mention loop invariant and why each pass reduces disorder.");
      }
    }

    const noteCount = voiceNarrationLength === "short"
      ? 1
      : voiceExplanationMode === "beginner"
        ? 2
        : 3;

    const endingNote = stepIndex + 1 >= steps.length
      ? "That wraps the walkthrough for this run."
      : pickByStep(endings, stepIndex + noteCount);

    const explanationFrame = `${pickByStep(leads, stepIndex + 1)} ${categoryExplanation}`;
    const explanationCore = voiceNarrationLength === "short"
      ? firstSentence(explanationFrame)
      : ensureSentence(explanationFrame);

    return `${intro} ${explanationCore} ${coachingNotes.slice(0, noteCount).map(ensureSentence).join(" ")} ${endingNote}`
      .replace(/\s+/g, " ")
      .trim();
  }, [
    activeCodeLine,
    currentStep,
    currentStepType,
    selectedAlgorithm,
    selectedCategory,
    stepIndex,
    steps.length,
    voiceExplanationMode,
    voiceNarrationLength,
  ]);

  const narrationProsody = useMemo(
    () => getNarrationProsodyProfile({
      stepType: currentStepType,
      category: selectedCategory,
      mode: voiceExplanationMode,
      length: voiceNarrationLength,
      rate: voiceRate,
      pitch: voicePitch,
      stepIndex,
    }),
    [currentStepType, selectedCategory, stepIndex, voiceExplanationMode, voiceNarrationLength, voicePitch, voiceRate]
  );

  const currentStepExplanation = narrationText || currentStep?.description || "State updated.";

  const languages = getLanguages();
  const visualizationZoom = focusMode
    ? (selectedCategory === "graph" ? 1.28 : selectedCategory === "backtracking" ? 1.2 : selectedCategory === "dp" ? 1 : 1.08)
    : 1;

  useEffect(() => {
    if (!speechSupported || !voiceNarrationEnabled) {
      if (speechSupported) {
        window.speechSynthesis.cancel();
      }
      lastNarratedStepRef.current = -1;
      return;
    }

    if (!steps.length || status === "idle") return;
    if (stepIndex === lastNarratedStepRef.current) return;

    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(narrationText);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang || "en-US";
    }
    utterance.rate = narrationProsody.rate;
    utterance.pitch = narrationProsody.pitch;
    utterance.volume = narrationProsody.volume;
    narrationUtteranceRef.current = utterance;
    lastNarratedStepRef.current = stepIndex;

    const shouldAdvanceAfterSpeech = status === "playing" && voiceSyncEnabled;
    const advanceStep = () => {
      if (!shouldAdvanceAfterSpeech) return;
      setStepIndex((prev) => {
        const next = prev + 1;
        if (next >= steps.length) {
          setStatus("completed");
          return prev;
        }
        return next;
      });
    };

    const advanceWithPause = () => {
      if (!shouldAdvanceAfterSpeech) return;
      if (narrationAdvanceTimeoutRef.current) {
        window.clearTimeout(narrationAdvanceTimeoutRef.current);
        narrationAdvanceTimeoutRef.current = null;
      }

      const pauseMs = useKeyIdeaTeachingPause ? Math.max(0, voiceTeachingPauseMs) : 0;
      if (pauseMs > 0) {
        narrationAdvanceTimeoutRef.current = window.setTimeout(() => {
          narrationAdvanceTimeoutRef.current = null;
          advanceStep();
        }, pauseMs);
        return;
      }
      advanceStep();
    };

    utterance.onend = advanceWithPause;
    utterance.onerror = advanceWithPause;
    synth.speak(utterance);

    return () => {
      if (narrationAdvanceTimeoutRef.current) {
        window.clearTimeout(narrationAdvanceTimeoutRef.current);
        narrationAdvanceTimeoutRef.current = null;
      }
      utterance.onend = null;
      utterance.onerror = null;
    };
  }, [
    narrationText,
    narrationProsody,
    narrationAdvanceTimeoutRef,
    selectedVoice,
    speechSupported,
    status,
    stepIndex,
    steps.length,
    useKeyIdeaTeachingPause,
    voiceNarrationEnabled,
    voiceTeachingPauseMs,
    voiceExplanationMode,
    voiceNarrationLength,
    voiceSyncEnabled,
  ]);

  const startLeftPaneResize = (event) => {
    const startX = event.clientX;
    const startWidth = leftPaneWidth;

    const onMouseMove = (moveEvent) => {
      const next = Math.min(500, Math.max(280, startWidth + (moveEvent.clientX - startX)));
      setLeftPaneWidth(next);
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const startMiddlePaneResize = (event) => {
    const container = event.currentTarget.parentElement;
    if (!container) return;
    const bounds = container.getBoundingClientRect();

    const onMouseMove = (moveEvent) => {
      const ratio = (moveEvent.clientX - bounds.left) / bounds.width;
      setVisualPaneRatio(Math.min(0.78, Math.max(0.38, ratio)));
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const resetLayout = () => {
    setLeftPaneWidth(DEFAULT_LEFT_PANE_WIDTH);
    setVisualPaneRatio(DEFAULT_VISUAL_RATIO);
  };

  const openFocusMode = () => {
    if (!steps.length) return;
    setFocusMode(true);
  };

  const closeFocusMode = () => {
    if (document.fullscreenElement && typeof document.exitFullscreen === "function") {
      Promise.resolve(document.exitFullscreen()).catch(() => undefined);
    }
    setFocusMode(false);
  };

  return (
    <div className="flex gap-4">
      <aside className="space-y-6" style={{ width: leftPaneWidth }}>
        <div className="rounded-2xl panel p-5">
          <AlgorithmSelector
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            algorithms={filteredAlgorithms}
            selectedAlgorithm={selectedAlgorithm}
            setSelectedAlgorithm={setSelectedAlgorithm}
          />
          {activeAlgorithm && (
            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
              <button
                type="button"
                onClick={() => setHowItWorksOpen((prev) => !prev)}
                className="flex w-full items-center justify-between text-left text-sm font-medium text-sky/90"
              >
                <span>How It Works</span>
                <span className="text-sky/60">{howItWorksOpen ? "▲" : "▼"}</span>
              </button>
              {howItWorksOpen && (
                <p className="mt-3 text-xs leading-6 text-sky/75">{activeAlgorithm.howItWorks}</p>
              )}
            </div>
          )}
        </div>
        <div className="rounded-2xl panel p-5">
          <InputPanel
            category={selectedCategory}
            algorithm={selectedAlgorithm}
            inputData={inputData}
            setInputData={setInputData}
            onRandomInput={handleRandomInput}
            interactive={isRunnable}
            studyNote={activeAlgorithm?.studyNote}
          />
          {inputError && (
            <p className="mt-3 rounded-lg border border-red-300/30 bg-red-400/10 px-3 py-2 text-sm text-red-200">
              {inputError}
            </p>
          )}
        </div>
        <div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-4 text-xs text-cyan-100">
          Need offline challenges with difficulty levels?
          <Link to="/practice" className="ml-2 font-semibold text-cyan-100 underline underline-offset-2 hover:text-white">
            Open Practice Lab
          </Link>
        </div>
        <div className="rounded-2xl panel p-5">
          <MetricsPanel metrics={metrics} complexity={complexity} nMeaning={activeAlgorithm?.nMeaning} metadata={activeMetadata} />
        </div>
      </aside>

      <div
        className={resizeHandleClass}
        onMouseDown={startLeftPaneResize}
      />

      <section className="flex-1 space-y-6">
        <div className="rounded-2xl panel p-5">
          <h2 className="text-lg font-semibold text-sky">Execution Controls</h2>
          <div className="mt-4">
            <ControlPanel
              status={status}
              onRun={handleRun}
              onPause={handlePause}
              onResume={handleResume}
              onReset={handleReset}
              onStepForward={handleStepForward}
              onStepBackward={handleStepBackward}
              speed={speed}
              setSpeed={setSpeed}
              canRun={isRunnable}
            />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
            <label className={voiceControlClass}>
              <input
                type="checkbox"
                checked={voiceNarrationEnabled}
                onChange={(event) => setVoiceNarrationEnabled(event.target.checked)}
                disabled={!speechSupported}
                className="accent-cyan-300"
              />
              Voice Narration
            </label>

            <label className={voiceControlClass}>
              <input
                type="checkbox"
                checked={voiceSyncEnabled}
                onChange={(event) => setVoiceSyncEnabled(event.target.checked)}
                disabled={!speechSupported || !voiceNarrationEnabled}
                className="accent-cyan-300"
              />
              Sync With Steps
            </label>

            <label className={voiceControlClass}>
              <span>Voice Rate</span>
              <input
                type="range"
                min={0.7}
                max={1.4}
                step={0.1}
                value={voiceRate}
                onChange={(event) => setVoiceRate(Number(event.target.value))}
                disabled={!speechSupported}
                className="w-24 accent-cyan-300"
              />
              <span className={voiceAccentValueClass}>{voiceRate.toFixed(1)}x</span>
            </label>

            <label className={voiceControlClass}>
              <span>Voice Pitch</span>
              <input
                type="range"
                min={0.8}
                max={1.2}
                step={0.05}
                value={voicePitch}
                onChange={(event) => setVoicePitch(Number(event.target.value))}
                disabled={!speechSupported}
                className="w-24 accent-cyan-300"
              />
              <span className={voiceAccentValueClass}>{voicePitch.toFixed(2)}</span>
            </label>

            <label className={voiceControlClass}>
              <span>Voice</span>
              <select
                value={selectedVoiceURI}
                onChange={(event) => setSelectedVoiceURI(event.target.value)}
                disabled={!speechSupported || !availableVoices.length}
                className={voiceSelectClass}
              >
                {availableVoices.map((voice) => (
                  <option key={voice.voiceURI} value={voice.voiceURI}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </label>

            <label className={voiceControlClass}>
              <span>Explain Like</span>
              <select
                value={voiceExplanationMode}
                onChange={(event) => setVoiceExplanationMode(event.target.value)}
                className={voiceCompactSelectClass}
              >
                {EXPLANATION_MODE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>

            <label className={voiceControlClass}>
              <span>Narration</span>
              <select
                value={voiceNarrationLength}
                onChange={(event) => setVoiceNarrationLength(event.target.value)}
                className={voiceCompactSelectClass}
              >
                {NARRATION_LENGTH_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>

            <label className={voiceControlClass}>
              <span>Key Pause</span>
              <input
                type="range"
                min={0}
                max={2500}
                step={100}
                value={voiceTeachingPauseMs}
                onChange={(event) => setVoiceTeachingPauseMs(Number(event.target.value))}
                disabled={!speechSupported || !voiceNarrationEnabled || !voiceSyncEnabled}
                className="w-24 accent-cyan-300"
              />
              <span className={voiceAccentValueClass}>{(voiceTeachingPauseMs / 1000).toFixed(1)}s</span>
            </label>

            <span className={voiceInfoChipClass}>
              Key-step pause applies to BFS, DFS, and Dijkstra when Sync is on.
            </span>

            <button
              type="button"
              onClick={handleVoicePreview}
              disabled={!speechSupported}
              className={secondaryActionClass}
            >
              Preview Voice
            </button>

            {!speechSupported && (
              <span className="rounded-lg border border-amber-300/30 bg-amber-400/10 px-3 py-1.5 text-amber-100">
                Speech is not supported in this browser.
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-4 overflow-x-hidden">
          <div className="rounded-2xl panel p-5 overflow-x-hidden" style={{ width: `${visualPaneRatio * 100}%` }}>
            <div className="space-y-3 overflow-x-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 overflow-x-hidden">
                <h2 className="text-lg font-semibold text-sky">Visualization</h2>
                <div className="flex w-full flex-wrap gap-2 text-xs sm:w-auto">
                  <button
                    onClick={resetLayout}
                    className="rounded border border-emerald-300/40 bg-emerald-400/10 px-3 py-1.5 text-emerald-100 transition hover:bg-emerald-300/15"
                  >
                    Reset Layout
                  </button>
                  <button
                      onClick={openFocusMode}
                    disabled={!steps.length}
                    className="rounded border border-cyan-300/40 bg-cyan-400/10 px-3 py-1.5 text-cyan-100 transition hover:bg-cyan-300/15 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Full Screen
                  </button>
                </div>
              </div>

              <div className="flex min-w-0 flex-wrap items-center gap-2 text-xs text-sky/60">
                <span className={visualizationHintChipClass}>Top actions: reset layout and full screen</span>
                <span className={visualizationHintChipClass}>Full screen auto-fits the visualization</span>
              </div>
            </div>
            <div className="mt-4 overflow-x-hidden">
              <VisualizationCanvas
                category={selectedCategory}
                algorithm={selectedAlgorithm}
                steps={steps}
                stepIndex={stepIndex}
                input={currentPayload}
                zoom={visualizationZoom}
                status={status}
                emptyStateMessage={isRunnable
                  ? undefined
                  : (activeAlgorithm?.studyNote || "This syllabus topic is available in study mode. Review the notes, complexity, and pseudocode instead of running a trace.")}
              />
            </div>

            {steps.length > 0 && (
              <div className={executionLogClass}>
                <div className="mb-3 flex items-center justify-between text-sm">
                  <h3 className="font-semibold text-sky">Execution Log</h3>
                  <span className="text-sky/60">Step {stepIndex + 1} / {steps.length}</span>
                </div>
                <ul className="max-h-[220px] space-y-2 overflow-y-auto pr-2 text-xs text-sky/75">
                  {steps.map((item, idx) => (
                    <li
                      key={`log-${idx}`}
                      className={`rounded-md border-l-2 px-3 py-2 ${
                        idx === stepIndex
                          ? "border-teal-300 bg-teal-400/10 font-semibold text-teal-100"
                          : executionLogIdleClass
                      }`}
                    >
                      • {item.description || `Step ${idx + 1}: Updated state.`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div
            className={resizeHandleClass}
            onMouseDown={startMiddlePaneResize}
          />

          <div className="rounded-2xl panel p-5" style={{ width: `${(1 - visualPaneRatio) * 100}%` }}>
            <h2 className="text-lg font-semibold text-sky">Algorithm Code</h2>
            <div className="mt-3 flex gap-2 text-xs">
              <button
                type="button"
                onClick={() => setCodeMode("algorithm")}
                className={`rounded-lg border px-3 py-1.5 transition ${
                  codeMode === "algorithm"
                    ? activeAlgorithmCodeTabClass
                    : inactiveCodeTabClass
                }`}
              >
                Algorithm Only
              </button>
              <button
                type="button"
                onClick={() => setCodeMode("complete")}
                className={`rounded-lg border px-3 py-1.5 transition ${
                  codeMode === "complete"
                    ? activeAlgorithmCodeTabClass
                    : inactiveCodeTabClass
                }`}
              >
                Full Complete Code
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {languages.map((language) => {
                const active = codeLanguage === language;
                return (
                  <button
                    key={language}
                    type="button"
                    onClick={() => setCodeLanguage(language)}
                    className={`rounded-lg border px-3 py-1.5 text-xs transition ${
                      active
                        ? activeLanguageTabClass
                        : inactiveCodeTabClass
                    }`}
                    style={{ minWidth: LANGUAGE_TAB_WIDTHS[language] }}
                  >
                    {getLanguageLabel(language)}
                  </button>
                );
              })}
            </div>
            {activeCodeLine && status !== "idle" && (
              <p className={liveHighlightClass}>
                Live highlight: line {activeCodeLine} reflects the current visualization step.
              </p>
            )}
            <div className={`mt-4 h-80 min-h-80 overflow-y-auto overflow-x-auto rounded-xl border border-white/10 ${codeSurfaceClass}`}>
              <SyntaxHighlighter
                language={codeLanguage === "cpp" ? "cpp" : codeLanguage}
                style={syntaxTheme}
                customStyle={{
                  margin: 0,
                  minHeight: "20rem",
                  overflowX: "auto",
                  whiteSpace: "pre",
                  wordBreak: "keep-all",
                  fontSize: "12px",
                  background: "transparent"
                }}
                wrapLines
                lineProps={(lineNumber) => ({
                  style: {
                    display: "block",
                    backgroundColor: lineNumber === activeCodeLine ? activeCodeLineBackground : "transparent",
                    borderLeft: lineNumber === activeCodeLine ? activeCodeLineBorder : "3px solid transparent",
                    transition: "background-color 160ms ease"
                  }
                })}
                wrapLongLines={false}
                showLineNumbers
              >
                {activeCode}
              </SyntaxHighlighter>
            </div>
            {activeAlgorithm && (
              <p className="mt-3 text-xs text-sky/50">
                {activeAlgorithm.description} Category: {normalizeCategoryLabel(activeAlgorithm.category)}.
              </p>
            )}
            {activeAlgorithm && (
              <Link
                to={`/theory?algorithm=${activeAlgorithm.name}`}
                className="mt-2 inline-flex text-xs text-cyan-200 transition hover:text-cyan-100"
              >
                Open deep theory for {getAlgorithmDisplayName(activeAlgorithm.name)}
              </Link>
            )}
          </div>
        </div>
      </section>

      {focusMode && steps.length > 0 && (
        <div ref={focusOverlayRef} className={focusShellClass}>
          <div className="flex h-full flex-col p-3 sm:p-5">
            <div className={focusHeaderClass}>
              <div className="min-w-0">
                <p className={`text-xs uppercase tracking-[0.2em] ${focusMutedTextClass}`}>Analyzer Full Screen</p>
                <p className="truncate text-sm font-semibold text-sky">
                  {getAlgorithmDisplayName(selectedAlgorithm)} • Step {stepIndex + 1} / {steps.length}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleStepBackward}
                  className="rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-xs text-sky/80 transition hover:border-white/35"
                >
                  Prev
                </button>
                {status === "playing" ? (
                  <button
                    type="button"
                    onClick={handlePause}
                    className="rounded-lg border border-amber-300/40 bg-amber-400/10 px-3 py-1.5 text-xs font-semibold text-amber-100 transition hover:bg-amber-300/15"
                  >
                    Pause
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleResume}
                    className="rounded-lg border border-emerald-300/40 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-300/15"
                  >
                    Play
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleStepForward}
                  className="rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-xs text-sky/80 transition hover:border-white/35"
                >
                  Next
                </button>
                <select
                  value={codeLanguage}
                  onChange={(event) => setCodeLanguage(event.target.value)}
                  className="rounded-lg border border-cyan-300/35 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-100"
                >
                  {languages.map((language) => (
                    <option key={`focus-lang-${language}`} value={language} className="bg-slate-900 text-sky">
                      {getLanguageLabel(language)}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setVoiceNarrationEnabled((prev) => !prev)}
                  disabled={!speechSupported}
                  className={secondaryActionClass}
                >
                  {voiceNarrationEnabled ? "Voice On" : "Voice Off"}
                </button>
                <button
                  type="button"
                  onClick={closeFocusMode}
                  className="rounded-lg border border-red-300/40 bg-red-400/10 px-3 py-1.5 text-xs font-semibold text-red-100 transition hover:bg-red-300/15"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,1fr)]">
              <div className="grid min-h-0 gap-4" style={{ gridTemplateRows: "minmax(0,1fr) minmax(160px,auto)" }}>
                <div className={`${focusCardClass} min-h-[58vh] overflow-auto`}>
                  <VisualizationCanvas
                    category={selectedCategory}
                    algorithm={selectedAlgorithm}
                    steps={steps}
                    stepIndex={stepIndex}
                    input={currentPayload}
                    zoom={visualizationZoom}
                    status={status}
                    minimalView
                  />
                </div>

                <div className={focusCardClass}>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-sky">Current Step</h3>
                    <span className={focusStepBadgeClass}>
                      Only active step is shown here
                    </span>
                  </div>
                  <p className={`mt-3 ${focusInfoBannerClass}`}>
                    Step {stepIndex + 1}: {currentStepExplanation}
                  </p>
                  {currentStep?.type && (
                    <p className="mt-2 text-xs text-sky/65">
                      Type: <span className="font-semibold text-sky/85">{currentStep.type}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className={`${focusCardClass} min-h-0`}>
                  <div className="flex h-full min-h-0 flex-col">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold text-sky">Code (Right Side)</h3>
                      <span className="rounded-full border border-cyan-300/35 bg-cyan-400/10 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.15em] text-cyan-100">
                        {getLanguageLabel(codeLanguage)}
                      </span>
                    </div>
                    {activeCodeLine ? (
                      <p className={`mt-2 ${focusInfoBannerClass}`}>
                        Executing line: {activeCodeLine}
                      </p>
                    ) : (
                      <p className={`mt-2 ${focusFallbackBannerClass}`}>
                        Live line mapping is unavailable for this step type.
                      </p>
                    )}

                    <div className={`mt-3 min-h-0 flex-1 overflow-auto rounded-xl border border-white/10 ${codeSurfaceClass}`}>
                      <SyntaxHighlighter
                        language={codeLanguage === "cpp" ? "cpp" : codeLanguage}
                        style={syntaxTheme}
                        customStyle={{
                          margin: 0,
                          minHeight: "100%",
                          background: "transparent",
                          fontSize: "12px"
                        }}
                        wrapLines
                        lineProps={(lineNumber) => ({
                          style: {
                            display: "block",
                            backgroundColor: lineNumber === activeCodeLine ? activeCodeLineBackground : "transparent",
                            borderLeft: lineNumber === activeCodeLine ? activeCodeLineBorder : "3px solid transparent",
                            transition: "background-color 160ms ease"
                          }
                        })}
                        showLineNumbers
                        wrapLongLines={false}
                      >
                        {activeCode}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analyzer;
