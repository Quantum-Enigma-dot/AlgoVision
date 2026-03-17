from __future__ import annotations

from typing import Any, Dict, List, Optional


def add_step(
    steps: List[Dict[str, Any]],
    array: List[int],
    action: str,
    indices: Optional[List[int]] = None,
    meta: Optional[Dict[str, Any]] = None,
) -> None:
    payload = {
        "type": action,
        "array": list(array),
        "indices": indices or [],
    }
    if meta:
        payload.update(meta)
    steps.append(payload)
