import { useMemo, useState } from "react";
import Editor from "@monaco-editor/react";
import {
  Bot,
  CircleCheckBig,
  CircleX,
  Code2,
  Loader2,
  Play,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { judgePracticeCode } from "../services/api.js";
import {
  generatePracticeChallenge,
  PRACTICE_DIFFICULTIES,
  PRACTICE_DIFFICULTY_LABELS,
  PRACTICE_TOPICS,
  PRACTICE_TOPIC_LABELS,
  PRACTICE_LANGUAGES,
  PRACTICE_LANGUAGE_LABELS,
} from "../utils/problemGenerators.js";

const DIFFICULTY_BADGES = {
  easy: "border-emerald-300/35 bg-emerald-400/15 text-emerald-100",
  medium: "border-amber-300/35 bg-amber-400/15 text-amber-100",
  hard: "border-rose-300/35 bg-rose-400/15 text-rose-100",
};

const TOPIC_BADGES = {
  any: "border-violet-300/35 bg-violet-400/15 text-violet-100",
  prefix_sum: "border-cyan-300/35 bg-cyan-400/15 text-cyan-100",
  greedy: "border-emerald-300/35 bg-emerald-400/15 text-emerald-100",
  sliding_window: "border-amber-300/35 bg-amber-400/15 text-amber-100",
  two_pointers: "border-rose-300/35 bg-rose-400/15 text-rose-100",
};

const LANGUAGE_BADGES = {
  python: "border-emerald-300/35 bg-emerald-400/15 text-emerald-100",
  c: "border-sky-300/35 bg-sky-400/15 text-sky-100",
  cpp: "border-blue-300/35 bg-blue-400/15 text-blue-100",
  java: "border-orange-300/35 bg-orange-400/15 text-orange-100",
  go: "border-cyan-300/35 bg-cyan-400/15 text-cyan-100",
  javascript: "border-yellow-300/35 bg-yellow-400/15 text-yellow-100",
};

const monacoLanguage = (language) => {
  if (language === "cpp") return "cpp";
  if (language === "java") return "java";
  if (language === "go") return "go";
  if (language === "javascript") return "javascript";
  if (language === "c") return "c";
  return "python";
};

const toErrorText = (error) => {
  if (!error) return "";
  return error?.response?.data?.detail || error.message || "Judge request failed";
};

const Practice = () => {
  const initialChallenge = useMemo(() => generatePracticeChallenge("medium", "any"), []);

  const [difficulty, setDifficulty] = useState("medium");
  const [topic, setTopic] = useState("any");
  const [challenge, setChallenge] = useState(initialChallenge);
  const [language, setLanguage] = useState("python");
  const [codeByLanguage, setCodeByLanguage] = useState(() => ({ ...initialChallenge.starterCode }));
  const [judgeResponse, setJudgeResponse] = useState(null);
  const [judgeError, setJudgeError] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const currentCode = codeByLanguage[language] ?? "";

  const visibleCount = challenge?.visibleTests?.length || 0;
  const hiddenCount = challenge?.hiddenTests?.length || 0;

  const regenerateChallenge = (nextDifficulty = difficulty, nextTopic = topic) => {
    const generated = generatePracticeChallenge(nextDifficulty, nextTopic);
    setChallenge(generated);
    setLanguage("python");
    setCodeByLanguage({ ...generated.starterCode });
    setJudgeResponse(null);
    setJudgeError("");
  };

  const handleGenerateChallenge = () => {
    regenerateChallenge(difficulty, topic);
  };

  const handleDifficultyChange = (nextDifficulty) => {
    setDifficulty(nextDifficulty);
    regenerateChallenge(nextDifficulty, topic);
  };

  const handleTopicChange = (nextTopic) => {
    setTopic(nextTopic);
    regenerateChallenge(difficulty, nextTopic);
  };

  const handleLanguageChange = (nextLanguage) => {
    setLanguage(nextLanguage);
    setJudgeError("");
    setJudgeResponse(null);

    setCodeByLanguage((previous) => {
      if (previous[nextLanguage] !== undefined) return previous;
      return {
        ...previous,
        [nextLanguage]: challenge?.starterCode?.[nextLanguage] || "",
      };
    });
  };

  const handleCodeChange = (value) => {
    setCodeByLanguage((previous) => ({
      ...previous,
      [language]: value || "",
    }));
  };

  const handleResetStarter = () => {
    const starter = challenge?.starterCode?.[language] || "";
    setCodeByLanguage((previous) => ({
      ...previous,
      [language]: starter,
    }));
    setJudgeResponse(null);
    setJudgeError("");
  };

  const handleRun = async () => {
    if (!challenge) return;
    if (!currentCode.trim()) {
      setJudgeError("Code editor is empty.");
      return;
    }

    setIsRunning(true);
    setJudgeError("");
    setJudgeResponse(null);

    const allTests = [...(challenge.visibleTests || []), ...(challenge.hiddenTests || [])];

    try {
      const response = await judgePracticeCode({
        code: currentCode,
        language,
        test_cases: allTests,
      });

      setJudgeResponse(response);
      if (response?.compile_error) {
        setJudgeError(response.compile_error);
      }
    } catch (error) {
      setJudgeError(toErrorText(error));
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl panel p-6">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
        <div className="pointer-events-none absolute -left-16 top-0 h-44 w-44 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-12 -bottom-10 h-52 w-52 rounded-full bg-orange-400/15 blur-3xl" />

        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-sky">
              <Sparkles size={22} className="text-cyan-200" />
              Practice Arena
            </h1>
            <p className="mt-1 text-sm text-sky/60">
              Original challenge statements inspired by interview-style patterns, generated offline by Q++.
            </p>
          </div>

          <div className="flex max-w-3xl flex-wrap gap-2">
            {PRACTICE_DIFFICULTIES.map((level) => {
              const isActive = level === difficulty;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => handleDifficultyChange(level)}
                  className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                    isActive
                      ? DIFFICULTY_BADGES[level]
                      : "border-white/15 bg-white/5 text-sky/70 hover:border-white/30"
                  }`}
                >
                  {PRACTICE_DIFFICULTY_LABELS[level]}
                </button>
              );
            })}

            {PRACTICE_TOPICS.map((topicKey) => {
              const isActive = topicKey === topic;
              return (
                <button
                  key={topicKey}
                  type="button"
                  onClick={() => handleTopicChange(topicKey)}
                  className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                    isActive
                      ? TOPIC_BADGES[topicKey]
                      : "border-white/15 bg-white/5 text-sky/70 hover:border-white/30"
                  }`}
                >
                  {PRACTICE_TOPIC_LABELS[topicKey]}
                </button>
              );
            })}

            <button
              type="button"
              onClick={handleGenerateChallenge}
              className="inline-flex items-center gap-2 rounded-lg border border-cyan-300/35 bg-cyan-400/15 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:-translate-y-0.5 hover:bg-cyan-300/25"
            >
              <RefreshCw size={15} />
              New Challenge
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
        <section className="space-y-5">
          <article className="rounded-2xl panel p-5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold text-sky">{challenge.title}</h2>
              <span
                className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${DIFFICULTY_BADGES[challenge.difficulty]}`}
              >
                {challenge.difficultyLabel}
              </span>
              <span
                className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${TOPIC_BADGES[challenge.topic] || TOPIC_BADGES.any}`}
              >
                {challenge.topicLabel}
              </span>
            </div>

            <p className="mt-3 text-sm text-sky/70">{challenge.story}</p>
            <p className="mt-3 rounded-xl border border-cyan-300/20 bg-cyan-400/10 p-3 text-sm leading-6 text-cyan-100">
              {challenge.statement}
            </p>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-sky/50">Input Format</h3>
                <ul className="mt-2 space-y-1 text-xs text-sky/70">
                  {(challenge.inputFormat || []).map((line, index) => (
                    <li key={`input-${index}`}>• {line}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-sky/50">Output Format</h3>
                <p className="mt-2 text-xs text-sky/70">{challenge.outputFormat}</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/35 p-3">
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-sky/50">Constraints</h3>
              <ul className="mt-2 space-y-1 text-xs text-sky/70">
                {(challenge.constraints || []).map((line, index) => (
                  <li key={`constraint-${index}`}>• {line}</li>
                ))}
              </ul>
            </div>

            <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/35 p-3">
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-sky/50">Examples</h3>
              <div className="mt-2 space-y-3">
                {(challenge.examples || []).map((example, index) => (
                  <div key={`example-${index}`} className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sky/45">
                      Example {index + 1}
                    </p>
                    <div className="mt-2 grid gap-2 md:grid-cols-2">
                      <pre className="max-h-32 overflow-auto rounded-lg border border-white/10 bg-slate-950/35 p-2 text-[11px] text-sky/75">
{example.input}
                      </pre>
                      <pre className="max-h-32 overflow-auto rounded-lg border border-white/10 bg-slate-950/35 p-2 text-[11px] text-sky/75">
{example.output}
                      </pre>
                    </div>
                    <p className="mt-2 text-xs text-sky/65">{example.explanation}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-emerald-300/20 bg-emerald-400/10 p-3 text-xs text-emerald-100">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} />
                <span className="font-semibold">{challenge.engine?.name}</span>
              </div>
              <p className="mt-1">{challenge.originalityNote}</p>
              <p className="mt-1">{challenge.judgeInstructions}</p>
            </div>

            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-sky/70">
              <p className="font-semibold text-sky/85">Evaluation Set</p>
              <p className="mt-1">Visible: {visibleCount} cases | Hidden: {hiddenCount} cases | Total: {challenge.totalTests}</p>
            </div>
          </article>
        </section>

        <section className="space-y-5">
          <article className="rounded-2xl panel p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-sky">
                <Code2 size={18} className="text-cyan-200" />
                Solution Editor
              </h2>

              <button
                type="button"
                onClick={handleResetStarter}
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-sky/75 transition hover:border-white/30 hover:text-sky"
              >
                Reset Starter
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {PRACTICE_LANGUAGES.map((lang) => {
                const active = language === lang;
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => handleLanguageChange(lang)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                      active
                        ? LANGUAGE_BADGES[lang]
                        : "border-white/15 bg-white/5 text-sky/70 hover:border-white/30"
                    }`}
                  >
                    {PRACTICE_LANGUAGE_LABELS[lang]}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-[#0f172a]">
              <Editor
                height="420px"
                language={monacoLanguage(language)}
                value={currentCode}
                onChange={handleCodeChange}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbersMinChars: 3,
                  scrollBeyondLastLine: false,
                  tabSize: 2,
                }}
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleRun}
                disabled={isRunning}
                className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/35 bg-gradient-to-r from-cyan-500/20 to-sky-500/20 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55"
              >
                {isRunning ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                {isRunning ? "Running Tests..." : "Run Against Tests"}
              </button>

              <p className="text-xs text-sky/55">
                Run checks visible and hidden testcases just like coding platforms.
              </p>
            </div>
          </article>

          <article className="rounded-2xl panel p-5">
            <div className="flex items-center gap-2 text-sky/90">
              <Bot size={16} />
              <h2 className="text-lg font-semibold text-sky">Judge Result</h2>
            </div>

            {!judgeResponse && !judgeError && (
              <p className="mt-3 text-sm text-sky/60">Run your solution to see pass/fail details for each testcase.</p>
            )}

            {judgeError && (
              <div className="mt-3 rounded-xl border border-rose-300/30 bg-rose-500/10 p-3 text-xs text-rose-100">
                <p className="font-semibold">Compile/Execution Error</p>
                <pre className="mt-2 max-h-44 overflow-auto whitespace-pre-wrap text-[11px] leading-5">
{judgeError}
                </pre>
              </div>
            )}

            {judgeResponse && (
              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {judgeResponse.all_passed ? (
                      <CircleCheckBig size={16} className="text-emerald-300" />
                    ) : (
                      <CircleX size={16} className="text-rose-300" />
                    )}
                    <p className="text-sm font-semibold text-sky">
                      {judgeResponse.passed_count} / {judgeResponse.total_count} passed
                    </p>
                    <span className="rounded-full border border-white/15 px-2 py-0.5 text-[11px] text-sky/70">
                      {PRACTICE_LANGUAGE_LABELS[judgeResponse.language] || judgeResponse.language}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {(judgeResponse.results || []).map((item, index) => (
                    <div
                      key={`${item.case_id}-${index}`}
                      className={`rounded-xl border p-3 ${
                        item.passed
                          ? "border-emerald-300/25 bg-emerald-500/10"
                          : "border-rose-300/25 bg-rose-500/10"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-sky">
                          Case {index + 1} • {item.is_sample ? "Sample" : "Hidden"}
                        </p>
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className={item.passed ? "text-emerald-200" : "text-rose-200"}>
                            {item.passed ? "Passed" : "Failed"}
                          </span>
                          <span className="text-sky/65">{item.runtime_ms} ms</span>
                        </div>
                      </div>

                      {!item.passed && (
                        <div className="mt-2 grid gap-2 md:grid-cols-2">
                          <div className="rounded-lg border border-white/10 bg-slate-950/45 p-2">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-sky/45">
                              Expected
                            </p>
                            <pre className="mt-1 max-h-28 overflow-auto whitespace-pre-wrap text-[11px] text-sky/80">
{item.expected_output}
                            </pre>
                          </div>

                          <div className="rounded-lg border border-white/10 bg-slate-950/45 p-2">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-sky/45">
                              Actual
                            </p>
                            <pre className="mt-1 max-h-28 overflow-auto whitespace-pre-wrap text-[11px] text-sky/80">
{item.actual_output || "(no output)"}
                            </pre>
                          </div>
                        </div>
                      )}

                      {!item.passed && item.error && (
                        <pre className="mt-2 max-h-28 overflow-auto whitespace-pre-wrap rounded-lg border border-rose-300/20 bg-rose-500/10 p-2 text-[11px] text-rose-100">
{item.error}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>
        </section>
      </div>
    </div>
  );
};

export default Practice;
