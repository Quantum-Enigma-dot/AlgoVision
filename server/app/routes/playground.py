"""Playground endpoint — execute user-submitted code in a sandboxed subprocess."""

from __future__ import annotations

import os
import subprocess
import sys
import tempfile
import time

from fastapi import APIRouter, HTTPException

from app.schemas import PlaygroundRequest, PlaygroundResponse

router = APIRouter()

MAX_EXECUTION_SECONDS = 10
MAX_OUTPUT_CHARS = 50_000

# Common banned tokens for safety (Python-specific)
PYTHON_BANNED = [
    "import os", "import sys", "import subprocess", "import shutil",
    "open(", "__import__", "exec(", "eval(", "compile(",
    "import socket", "import http", "import urllib",
]

# Banned C patterns
C_BANNED = [
    "system(", "popen(", "execve(", "execvp(", "fork(",
    "unlink(", "remove(", "rename(",
    "#include <sys/socket.h>", "#include <arpa/inet.h>",
]


def _find_c_compiler() -> str | None:
    """Try to find a working C compiler on the system."""
    for compiler in ["gcc", "cc", "cl"]:
        try:
            result = subprocess.run(
                [compiler, "--version"],
                capture_output=True, text=True, timeout=5,
            )
            if result.returncode == 0:
                return compiler
        except (FileNotFoundError, subprocess.TimeoutExpired):
            continue
    return None


def _run_python(code: str) -> PlaygroundResponse:
    """Execute Python code."""
    for token in PYTHON_BANNED:
        if token in code:
            return PlaygroundResponse(
                output="",
                error=f"Blocked: '{token}' is not allowed in the playground for safety.",
                execution_time_ms=0,
            )

    with tempfile.NamedTemporaryFile(
        mode="w", suffix=".py", delete=False, encoding="utf-8"
    ) as tmp:
        tmp.write(code)
        tmp_path = tmp.name

    try:
        start = time.perf_counter()
        result = subprocess.run(
            [sys.executable, tmp_path],
            capture_output=True, text=True,
            timeout=MAX_EXECUTION_SECONDS,
        )
        elapsed = (time.perf_counter() - start) * 1000

        return PlaygroundResponse(
            output=(result.stdout or "")[:MAX_OUTPUT_CHARS],
            error=(result.stderr or "")[:MAX_OUTPUT_CHARS],
            execution_time_ms=round(elapsed, 3),
        )
    except subprocess.TimeoutExpired:
        return PlaygroundResponse(
            output="",
            error=f"Execution timed out after {MAX_EXECUTION_SECONDS} seconds.",
            execution_time_ms=MAX_EXECUTION_SECONDS * 1000,
        )
    finally:
        try:
            os.unlink(tmp_path)
        except OSError:
            pass


def _run_c(code: str) -> PlaygroundResponse:
    """Compile and execute C code."""
    compiler = _find_c_compiler()
    if not compiler:
        return PlaygroundResponse(
            output="",
            error="No C compiler found on this system. Please install GCC (gcc) to enable C execution.",
            execution_time_ms=0,
        )

    for token in C_BANNED:
        if token in code:
            return PlaygroundResponse(
                output="",
                error=f"Blocked: '{token}' is not allowed in the playground for safety.",
                execution_time_ms=0,
            )

    src_fd, src_path = tempfile.mkstemp(suffix=".c", text=True)
    exe_path = src_path.replace(".c", ".exe") if sys.platform == "win32" else src_path.replace(".c", "")

    try:
        with os.fdopen(src_fd, "w", encoding="utf-8") as f:
            f.write(code)

        # Compile
        compile_result = subprocess.run(
            [compiler, src_path, "-o", exe_path, "-lm"],
            capture_output=True, text=True,
            timeout=MAX_EXECUTION_SECONDS,
        )

        if compile_result.returncode != 0:
            return PlaygroundResponse(
                output="",
                error=f"Compilation Error:\n{(compile_result.stderr or compile_result.stdout or 'Unknown error')[:MAX_OUTPUT_CHARS]}",
                execution_time_ms=0,
            )

        # Execute
        start = time.perf_counter()
        run_result = subprocess.run(
            [exe_path],
            capture_output=True, text=True,
            timeout=MAX_EXECUTION_SECONDS,
        )
        elapsed = (time.perf_counter() - start) * 1000

        return PlaygroundResponse(
            output=(run_result.stdout or "")[:MAX_OUTPUT_CHARS],
            error=(run_result.stderr or "")[:MAX_OUTPUT_CHARS],
            execution_time_ms=round(elapsed, 3),
        )
    except subprocess.TimeoutExpired:
        return PlaygroundResponse(
            output="",
            error=f"Execution timed out after {MAX_EXECUTION_SECONDS} seconds.",
            execution_time_ms=MAX_EXECUTION_SECONDS * 1000,
        )
    finally:
        for path in [src_path, exe_path]:
            try:
                os.unlink(path)
            except OSError:
                pass


SUPPORTED_LANGUAGES = {"python", "c"}


@router.post("/playground/run", response_model=PlaygroundResponse)
def playground_run_endpoint(payload: PlaygroundRequest) -> PlaygroundResponse:
    language = (payload.language or "python").lower().strip()

    if language not in SUPPORTED_LANGUAGES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported language '{language}'. Supported: {', '.join(sorted(SUPPORTED_LANGUAGES))}",
        )

    code = payload.code
    if not code.strip():
        return PlaygroundResponse(output="", error="No code provided.", execution_time_ms=0)

    if language == "python":
        return _run_python(code)
    elif language == "c":
        return _run_c(code)

    return PlaygroundResponse(output="", error="Unknown language.", execution_time_ms=0)
