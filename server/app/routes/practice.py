"""Practice judge endpoint: run user code against generated challenge test cases."""

from __future__ import annotations

import os
import re
import shutil
import subprocess
import sys
import tempfile
import time
from pathlib import Path

from fastapi import APIRouter, HTTPException

from app.schemas import (
    PracticeJudgeCaseResult,
    PracticeJudgeRequest,
    PracticeJudgeResponse,
)

router = APIRouter()

MAX_CODE_CHARS = 120_000
MAX_TEST_CASES = 24
MAX_EXECUTION_SECONDS = 4
MAX_COMPILE_SECONDS = 12
MAX_TEXT_CHARS = 40_000

LANGUAGE_ALIASES = {
    "py": "python",
    "js": "javascript",
    "node": "javascript",
    "c++": "cpp",
    "golang": "go",
}

SUPPORTED_LANGUAGES = {"python", "c", "cpp", "javascript", "java", "go"}

PYTHON_BANNED = [
    "import subprocess",
    "import socket",
    "import http",
    "import urllib",
    "os.system(",
    "eval(",
    "exec(",
    "__import__(",
]

C_BANNED = [
    "system(",
    "popen(",
    "fork(",
    "execve(",
    "execvp(",
    "#include <sys/socket.h>",
    "#include <arpa/inet.h>",
]

JS_BANNED = [
    "require('child_process')",
    'require("child_process")',
    "from 'child_process'",
    'from "child_process"',
    "require('net')",
    'require("net")',
    "require('http')",
    'require("http")',
    "require('https')",
    'require("https")',
    "process.kill(",
]

JAVA_BANNED = [
    "Runtime.getRuntime().exec",
    "ProcessBuilder",
    "java.net.",
    "java.nio.file.",
    "java.lang.reflect",
]

GO_BANNED = [
    '"os/exec"',
    "`os/exec`",
    '"net/http"',
    "`net/http`",
    '"net"',
    "`net`",
    '"syscall"',
    "`syscall`",
]


class CompileFailed(RuntimeError):
    """Raised when compilation fails for compiled languages."""


def _clip(text: str) -> str:
    return (text or "")[:MAX_TEXT_CHARS]


def _normalize_output(text: str) -> str:
    lines = (text or "").strip().splitlines()
    return "\n".join(line.rstrip() for line in lines).strip()


def _normalize_language(language: str | None) -> str:
    key = (language or "python").strip().lower()
    return LANGUAGE_ALIASES.get(key, key)


def _contains_blocked_token(code: str, blocked_tokens: list[str]) -> str | None:
    lowered = code.lower()
    for token in blocked_tokens:
        if token.lower() in lowered:
            return token
    return None


def _resolve_compiler(candidates: list[str]) -> str | None:
    for command in candidates:
        path = shutil.which(command)
        if path:
            return path
    return None


def _prepare_solution(language: str, code: str, workdir: Path) -> list[str]:
    if language == "python":
        blocked = _contains_blocked_token(code, PYTHON_BANNED)
        if blocked:
            raise ValueError(f"Blocked token in Python code: '{blocked}'")

        source_path = workdir / "solution.py"
        source_path.write_text(code, encoding="utf-8")
        return [sys.executable, str(source_path)]

    if language == "javascript":
        blocked = _contains_blocked_token(code, JS_BANNED)
        if blocked:
            raise ValueError(f"Blocked token in JavaScript code: '{blocked}'")

        node_path = _resolve_compiler(["node"])
        if not node_path:
            raise ValueError("Node.js runtime was not found. Install Node.js to run JavaScript solutions.")

        source_path = workdir / "solution.js"
        source_path.write_text(code, encoding="utf-8")
        return [node_path, str(source_path)]

    if language == "java":
        blocked = _contains_blocked_token(code, JAVA_BANNED)
        if blocked:
            raise ValueError(f"Blocked token in Java code: '{blocked}'")

        javac_path = _resolve_compiler(["javac"])
        java_path = _resolve_compiler(["java"])
        if not javac_path or not java_path:
            raise ValueError("Java toolchain was not found. Install JDK to run Java solutions.")

        class_match = re.search(r"\bpublic\s+class\s+([A-Za-z_]\w*)", code)
        if not class_match:
            class_match = re.search(r"\bclass\s+([A-Za-z_]\w*)", code)
        class_name = class_match.group(1) if class_match else "Main"

        source_path = workdir / f"{class_name}.java"
        source_path.write_text(code, encoding="utf-8")

        compile_cmd = [javac_path, str(source_path)]

        try:
            compile_result = subprocess.run(
                compile_cmd,
                capture_output=True,
                text=True,
                timeout=MAX_COMPILE_SECONDS,
                cwd=workdir,
            )
        except subprocess.TimeoutExpired as exc:
            raise CompileFailed(
                f"Compilation timed out after {MAX_COMPILE_SECONDS} seconds."
            ) from exc

        if compile_result.returncode != 0:
            details = _clip(compile_result.stderr or compile_result.stdout or "Unknown compiler error.")
            raise CompileFailed(details)

        return [java_path, "-cp", str(workdir), class_name]

    if language == "go":
        blocked = _contains_blocked_token(code, GO_BANNED)
        if blocked:
            raise ValueError(f"Blocked token in Go code: '{blocked}'")

        go_path = _resolve_compiler(["go"])
        if not go_path:
            raise ValueError("Go toolchain was not found. Install Go to run Go solutions.")

        source_path = workdir / "main.go"
        executable_path = workdir / ("solution.exe" if os.name == "nt" else "solution.out")
        source_path.write_text(code, encoding="utf-8")

        compile_cmd = [go_path, "build", "-o", str(executable_path), str(source_path)]

        try:
            compile_result = subprocess.run(
                compile_cmd,
                capture_output=True,
                text=True,
                timeout=MAX_COMPILE_SECONDS,
                cwd=workdir,
            )
        except subprocess.TimeoutExpired as exc:
            raise CompileFailed(
                f"Compilation timed out after {MAX_COMPILE_SECONDS} seconds."
            ) from exc

        if compile_result.returncode != 0:
            details = _clip(compile_result.stderr or compile_result.stdout or "Unknown compiler error.")
            raise CompileFailed(details)

        return [str(executable_path)]

    if language in {"c", "cpp"}:
        blocked = _contains_blocked_token(code, C_BANNED)
        if blocked:
            raise ValueError(f"Blocked token in {language.upper()} code: '{blocked}'")

        if language == "c":
            compiler_path = _resolve_compiler(["gcc", "clang"])
            extension = ".c"
            compile_args = ["-O2", "-std=c11"]
        else:
            compiler_path = _resolve_compiler(["g++", "clang++"])
            extension = ".cpp"
            compile_args = ["-O2", "-std=c++17"]

        if not compiler_path:
            raise ValueError(
                f"No {language.upper()} compiler found. Install GCC/Clang to run {language.upper()} solutions."
            )

        source_path = workdir / f"solution{extension}"
        executable_path = workdir / ("solution.exe" if os.name == "nt" else "solution.out")
        source_path.write_text(code, encoding="utf-8")

        compile_cmd = [compiler_path, str(source_path), "-o", str(executable_path), *compile_args]

        try:
            compile_result = subprocess.run(
                compile_cmd,
                capture_output=True,
                text=True,
                timeout=MAX_COMPILE_SECONDS,
                cwd=workdir,
            )
        except subprocess.TimeoutExpired as exc:
            raise CompileFailed(
                f"Compilation timed out after {MAX_COMPILE_SECONDS} seconds."
            ) from exc

        if compile_result.returncode != 0:
            details = _clip(compile_result.stderr or compile_result.stdout or "Unknown compiler error.")
            raise CompileFailed(details)

        return [str(executable_path)]

    raise ValueError(f"Unsupported language: {language}")


@router.post("/practice/judge", response_model=PracticeJudgeResponse)
def judge_practice_solution(payload: PracticeJudgeRequest) -> PracticeJudgeResponse:
    language = _normalize_language(payload.language)

    if language not in SUPPORTED_LANGUAGES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported language '{language}'. Supported: {', '.join(sorted(SUPPORTED_LANGUAGES))}",
        )

    code = payload.code or ""
    if not code.strip():
        raise HTTPException(status_code=400, detail="No code provided.")
    if len(code) > MAX_CODE_CHARS:
        raise HTTPException(status_code=400, detail="Code is too large for sandbox execution.")

    test_cases = payload.test_cases or []
    if not test_cases:
        raise HTTPException(status_code=400, detail="At least one test case is required.")
    if len(test_cases) > MAX_TEST_CASES:
        raise HTTPException(status_code=400, detail=f"Too many test cases. Maximum is {MAX_TEST_CASES}.")

    with tempfile.TemporaryDirectory(prefix="algovision_practice_") as temp_dir:
        workdir = Path(temp_dir)

        try:
            run_command = _prepare_solution(language, code, workdir)
        except CompileFailed as exc:
            return PracticeJudgeResponse(
                language=language,
                all_passed=False,
                passed_count=0,
                total_count=len(test_cases),
                compile_error=_clip(str(exc)),
                results=[],
            )
        except ValueError as exc:
            return PracticeJudgeResponse(
                language=language,
                all_passed=False,
                passed_count=0,
                total_count=len(test_cases),
                compile_error=_clip(str(exc)),
                results=[],
            )

        results: list[PracticeJudgeCaseResult] = []

        for case in test_cases:
            try:
                start = time.perf_counter()
                run_result = subprocess.run(
                    run_command,
                    input=case.input_data,
                    capture_output=True,
                    text=True,
                    timeout=MAX_EXECUTION_SECONDS,
                    cwd=workdir,
                )
                runtime_ms = round((time.perf_counter() - start) * 1000, 3)

                actual_output = _clip(run_result.stdout or "")
                error_output = _clip(run_result.stderr or "")

                if run_result.returncode != 0:
                    results.append(
                        PracticeJudgeCaseResult(
                            case_id=case.case_id,
                            is_sample=case.is_sample,
                            passed=False,
                            runtime_ms=runtime_ms,
                            expected_output=_clip(case.expected_output),
                            actual_output=actual_output,
                            error=error_output or f"Process exited with code {run_result.returncode}.",
                        )
                    )
                    continue

                expected_normalized = _normalize_output(case.expected_output)
                actual_normalized = _normalize_output(actual_output)
                passed = actual_normalized == expected_normalized

                results.append(
                    PracticeJudgeCaseResult(
                        case_id=case.case_id,
                        is_sample=case.is_sample,
                        passed=passed,
                        runtime_ms=runtime_ms,
                        expected_output=_clip(case.expected_output),
                        actual_output=actual_output,
                        error="",
                    )
                )
            except subprocess.TimeoutExpired:
                results.append(
                    PracticeJudgeCaseResult(
                        case_id=case.case_id,
                        is_sample=case.is_sample,
                        passed=False,
                        runtime_ms=MAX_EXECUTION_SECONDS * 1000,
                        expected_output=_clip(case.expected_output),
                        actual_output="",
                        error=f"Execution timed out after {MAX_EXECUTION_SECONDS} seconds.",
                    )
                )

    passed_count = sum(1 for item in results if item.passed)
    total_count = len(results)

    return PracticeJudgeResponse(
        language=language,
        all_passed=passed_count == total_count,
        passed_count=passed_count,
        total_count=total_count,
        compile_error="",
        results=results,
    )
