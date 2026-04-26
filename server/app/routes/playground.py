"""Playground endpoint — execute user-submitted code in a sandboxed subprocess."""

from __future__ import annotations

import os
import re
import shutil
import subprocess
import sys
import tempfile
import time

from fastapi import APIRouter, HTTPException

from app.schemas import PlaygroundRequest, PlaygroundResponse

router = APIRouter()

MAX_EXECUTION_SECONDS = 10
MAX_COMPILE_SECONDS = 12
MAX_OUTPUT_CHARS = 50_000

LANGUAGE_ALIASES = {
    "py": "python",
    "js": "javascript",
    "node": "javascript",
    "c++": "cpp",
    "golang": "go",
}

SUPPORTED_LANGUAGES = {"python", "c", "cpp", "java", "javascript", "go"}

PYTHON_BANNED = [
    "import os",
    "import subprocess",
    "import shutil",
    "open(",
    "__import__",
    "exec(",
    "eval(",
    "import socket",
    "import urllib",
]

C_FAMILY_BANNED = [
    "system(",
    "popen(",
    "execve(",
    "execvp(",
    "fork(",
    "unlink(",
    "remove(",
    "rename(",
    "#include <sys/socket.h>",
    "#include <arpa/inet.h>",
]

JAVASCRIPT_BANNED = [
    "require('fs')",
    'require("fs")',
    "require('child_process')",
    'require("child_process")',
    "process.exit",
]

JAVA_BANNED = [
    "ProcessBuilder",
    "Runtime.getRuntime().exec",
    "java.net",
    "java.nio.file",
]

GO_BANNED = [
    '"os/exec"',
    '"net"',
    '"net/http"',
    '"syscall"',
    '"unsafe"',
]


def _normalize_language(language: str | None) -> str:
    key = (language or "python").strip().lower()
    return LANGUAGE_ALIASES.get(key, key)


def _clip(text: str | None) -> str:
    return (text or "")[:MAX_OUTPUT_CHARS]


def _resolve_binary(candidates: list[str]) -> str | None:
    for name in candidates:
        resolved = shutil.which(name)
        if resolved:
            return resolved
    return None


def _contains_banned_token(code: str, blocked_tokens: list[str]) -> str | None:
    lowered = code.lower()
    for token in blocked_tokens:
        if token.lower() in lowered:
            return token
    return None


def _execution_timeout_response() -> PlaygroundResponse:
    return PlaygroundResponse(
        output="",
        error=f"Execution timed out after {MAX_EXECUTION_SECONDS} seconds.",
        execution_time_ms=MAX_EXECUTION_SECONDS * 1000,
    )


def _run_command(
    command: list[str],
    *,
    cwd: str | None = None,
    timeout: int,
) -> tuple[subprocess.CompletedProcess[str] | None, float, bool, str]:
    start = time.perf_counter()
    try:
        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            timeout=timeout,
            cwd=cwd,
        )
        elapsed = (time.perf_counter() - start) * 1000
        return result, elapsed, False, ""
    except subprocess.TimeoutExpired:
        elapsed = timeout * 1000
        return None, elapsed, True, ""
    except Exception as exc:  # pragma: no cover
        elapsed = (time.perf_counter() - start) * 1000
        return None, elapsed, False, str(exc)


def _run_python(code: str) -> PlaygroundResponse:
    blocked = _contains_banned_token(code, PYTHON_BANNED)
    if blocked:
        return PlaygroundResponse(
            output="",
            error=f"Blocked: '{blocked}' is not allowed in the playground for safety.",
            execution_time_ms=0,
        )

    with tempfile.TemporaryDirectory() as workdir:
        source_path = os.path.join(workdir, "main.py")
        with open(source_path, "w", encoding="utf-8") as handle:
            handle.write(code)

        result, elapsed, timed_out, system_error = _run_command(
            [sys.executable, source_path], cwd=workdir, timeout=MAX_EXECUTION_SECONDS
        )
        if timed_out:
            return _execution_timeout_response()
        if system_error:
            return PlaygroundResponse(output="", error=system_error, execution_time_ms=round(elapsed, 3))

        return PlaygroundResponse(
            output=_clip(result.stdout),
            error=_clip(result.stderr),
            execution_time_ms=round(elapsed, 3),
        )


def _run_javascript(code: str) -> PlaygroundResponse:
    blocked = _contains_banned_token(code, JAVASCRIPT_BANNED)
    if blocked:
        return PlaygroundResponse(
            output="",
            error=f"Blocked: '{blocked}' is not allowed in the playground for safety.",
            execution_time_ms=0,
        )

    node_binary = _resolve_binary(["node"])
    if not node_binary:
        return PlaygroundResponse(
            output="",
            error="Node.js is not installed or not in PATH. Install Node.js to run JavaScript code.",
            execution_time_ms=0,
        )

    with tempfile.TemporaryDirectory() as workdir:
        source_path = os.path.join(workdir, "main.js")
        with open(source_path, "w", encoding="utf-8") as handle:
            handle.write(code)

        result, elapsed, timed_out, system_error = _run_command(
            [node_binary, source_path], cwd=workdir, timeout=MAX_EXECUTION_SECONDS
        )
        if timed_out:
            return _execution_timeout_response()
        if system_error:
            return PlaygroundResponse(output="", error=system_error, execution_time_ms=round(elapsed, 3))

        return PlaygroundResponse(
            output=_clip(result.stdout),
            error=_clip(result.stderr),
            execution_time_ms=round(elapsed, 3),
        )


def _run_go(code: str) -> PlaygroundResponse:
    blocked = _contains_banned_token(code, GO_BANNED)
    if blocked:
        return PlaygroundResponse(
            output="",
            error=f"Blocked: '{blocked}' is not allowed in the playground for safety.",
            execution_time_ms=0,
        )

    go_binary = _resolve_binary(["go"])
    if not go_binary:
        return PlaygroundResponse(
            output="",
            error="Go is not installed or not in PATH. Install Go to run Go code.",
            execution_time_ms=0,
        )

    with tempfile.TemporaryDirectory() as workdir:
        source_path = os.path.join(workdir, "main.go")
        with open(source_path, "w", encoding="utf-8") as handle:
            handle.write(code)

        result, elapsed, timed_out, system_error = _run_command(
            [go_binary, "run", source_path], cwd=workdir, timeout=MAX_EXECUTION_SECONDS
        )
        if timed_out:
            return _execution_timeout_response()
        if system_error:
            return PlaygroundResponse(output="", error=system_error, execution_time_ms=round(elapsed, 3))

        return PlaygroundResponse(
            output=_clip(result.stdout),
            error=_clip(result.stderr),
            execution_time_ms=round(elapsed, 3),
        )


def _run_c_family(code: str, language: str) -> PlaygroundResponse:
    blocked = _contains_banned_token(code, C_FAMILY_BANNED)
    if blocked:
        return PlaygroundResponse(
            output="",
            error=f"Blocked: '{blocked}' is not allowed in the playground for safety.",
            execution_time_ms=0,
        )

    compiler_candidates = ["g++"] if language == "cpp" else ["gcc"]
    compiler = _resolve_binary(compiler_candidates)
    if not compiler:
        compiler_name = "g++" if language == "cpp" else "gcc"
        return PlaygroundResponse(
            output="",
            error=f"No {compiler_name} compiler found on this system. Install GCC toolchain to run {language.upper()} code.",
            execution_time_ms=0,
        )

    extension = ".cpp" if language == "cpp" else ".c"
    standard = "-std=c++17" if language == "cpp" else "-std=c11"

    with tempfile.TemporaryDirectory() as workdir:
        source_path = os.path.join(workdir, f"main{extension}")
        executable_name = "program.exe" if sys.platform == "win32" else "program"
        executable_path = os.path.join(workdir, executable_name)

        with open(source_path, "w", encoding="utf-8") as handle:
            handle.write(code)

        compile_cmd = [compiler, source_path, standard, "-O2", "-o", executable_path]
        compile_result, _, compile_timeout, compile_error = _run_command(
            compile_cmd, cwd=workdir, timeout=MAX_COMPILE_SECONDS
        )

        if compile_timeout:
            return PlaygroundResponse(
                output="",
                error=f"Compilation timed out after {MAX_COMPILE_SECONDS} seconds.",
                execution_time_ms=0,
            )

        if compile_error:
            return PlaygroundResponse(output="", error=compile_error, execution_time_ms=0)

        if compile_result.returncode != 0:
            return PlaygroundResponse(
                output="",
                error=f"Compilation Error:\n{_clip(compile_result.stderr or compile_result.stdout or 'Unknown error')}",
                execution_time_ms=0,
            )

        run_result, elapsed, timed_out, system_error = _run_command(
            [executable_path], cwd=workdir, timeout=MAX_EXECUTION_SECONDS
        )
        if timed_out:
            return _execution_timeout_response()
        if system_error:
            return PlaygroundResponse(output="", error=system_error, execution_time_ms=round(elapsed, 3))

        return PlaygroundResponse(
            output=_clip(run_result.stdout),
            error=_clip(run_result.stderr),
            execution_time_ms=round(elapsed, 3),
        )


def _extract_java_target(code: str) -> tuple[str | None, str | None]:
    package_match = re.search(r"^\s*package\s+([A-Za-z_]\w*(?:\.[A-Za-z_]\w*)*)\s*;", code, re.MULTILINE)
    class_match = re.search(r"\bpublic\s+class\s+([A-Za-z_]\w*)", code)
    if class_match is None:
        class_match = re.search(r"\bclass\s+([A-Za-z_]\w*)", code)

    package_name = package_match.group(1) if package_match else None
    class_name = class_match.group(1) if class_match else None
    return package_name, class_name


def _run_java(code: str) -> PlaygroundResponse:
    blocked = _contains_banned_token(code, JAVA_BANNED)
    if blocked:
        return PlaygroundResponse(
            output="",
            error=f"Blocked: '{blocked}' is not allowed in the playground for safety.",
            execution_time_ms=0,
        )

    javac_binary = _resolve_binary(["javac"])
    java_binary = _resolve_binary(["java"])
    if not javac_binary or not java_binary:
        return PlaygroundResponse(
            output="",
            error="Java compiler/runtime not found. Install JDK and ensure javac/java are in PATH.",
            execution_time_ms=0,
        )

    package_name, class_name = _extract_java_target(code)
    if not class_name:
        return PlaygroundResponse(
            output="",
            error="Could not find a Java class declaration.",
            execution_time_ms=0,
        )

    with tempfile.TemporaryDirectory() as workdir:
        source_path = os.path.join(workdir, f"{class_name}.java")
        with open(source_path, "w", encoding="utf-8") as handle:
            handle.write(code)

        compile_result, _, compile_timeout, compile_error = _run_command(
            [javac_binary, "-d", workdir, source_path],
            cwd=workdir,
            timeout=MAX_COMPILE_SECONDS,
        )

        if compile_timeout:
            return PlaygroundResponse(
                output="",
                error=f"Compilation timed out after {MAX_COMPILE_SECONDS} seconds.",
                execution_time_ms=0,
            )

        if compile_error:
            return PlaygroundResponse(output="", error=compile_error, execution_time_ms=0)

        if compile_result.returncode != 0:
            return PlaygroundResponse(
                output="",
                error=f"Compilation Error:\n{_clip(compile_result.stderr or compile_result.stdout or 'Unknown error')}",
                execution_time_ms=0,
            )

        main_class = f"{package_name}.{class_name}" if package_name else class_name
        run_result, elapsed, timed_out, system_error = _run_command(
            [java_binary, "-cp", workdir, main_class], cwd=workdir, timeout=MAX_EXECUTION_SECONDS
        )

        if timed_out:
            return _execution_timeout_response()

        if system_error:
            return PlaygroundResponse(output="", error=system_error, execution_time_ms=round(elapsed, 3))

        return PlaygroundResponse(
            output=_clip(run_result.stdout),
            error=_clip(run_result.stderr),
            execution_time_ms=round(elapsed, 3),
        )


def _execute_by_language(language: str, code: str) -> PlaygroundResponse:
    if language == "python":
        return _run_python(code)
    if language == "javascript":
        return _run_javascript(code)
    if language == "go":
        return _run_go(code)
    if language in {"c", "cpp"}:
        return _run_c_family(code, language)
    if language == "java":
        return _run_java(code)

    return PlaygroundResponse(output="", error="Unknown language.", execution_time_ms=0)


@router.post("/playground/run", response_model=PlaygroundResponse)
def playground_run_endpoint(payload: PlaygroundRequest) -> PlaygroundResponse:
    language = _normalize_language(payload.language)

    if language not in SUPPORTED_LANGUAGES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported language '{language}'. Supported: {', '.join(sorted(SUPPORTED_LANGUAGES))}",
        )

    code = payload.code
    if not code.strip():
        return PlaygroundResponse(output="", error="No code provided.", execution_time_ms=0)

    return _execute_by_language(language, code)
