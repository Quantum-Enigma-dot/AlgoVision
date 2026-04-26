from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, List, Optional, Tuple


def _clone_list(values: List[Any]) -> List[Any]:
    return list(values)


def _normalize_ops(input_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    ops = input_data.get("operations", [])
    if not isinstance(ops, list):
        return []
    out: List[Dict[str, Any]] = []
    for item in ops:
        if not isinstance(item, dict):
            continue
        op = str(item.get("op", "")).strip().lower()
        out.append({
            "op": op,
            "value": item.get("value"),
            "position": item.get("position"),
            "priority": item.get("priority"),
            "prefix": item.get("prefix"),
            "traversal": str(item.get("traversal", "inorder")).lower(),
        })
    return out


def _int_or_none(value: Any) -> Optional[int]:
    if value is None:
        return None
    try:
        return int(value)
    except Exception:
        return None


def _to_number_or_text(value: Any) -> Any:
    if isinstance(value, (int, float)):
        return value
    if value is None:
        return None
    text = str(value).strip()
    if text == "":
        return ""
    try:
        if "." in text:
            return float(text)
        return int(text)
    except Exception:
        return text


def _sort_key(value: Any) -> Tuple[int, Any]:
    if isinstance(value, (int, float)):
        return (0, float(value))
    return (1, str(value))


def _base_metrics(input_size: int, operation_count: int) -> Dict[str, Any]:
    return {
        "comparisons": operation_count,
        "swaps": 0,
        "recursion_depth": 0,
        "space_estimate": "O(n)",
        "input_size": input_size,
    }


def _append_step(steps: List[Dict[str, Any]], op: str, status: str, message: str, state: Dict[str, Any], meta: Optional[Dict[str, Any]] = None) -> None:
    payload = {
        "type": op,
        "operation": op,
        "status": status,
        "message": message,
        "state": state,
    }
    if meta:
        payload.update(meta)
    steps.append(payload)


def _linear_state(kind: str, variant: str, values: List[Any], capacity: Optional[int], extra: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    state = {
        "kind": kind,
        "variant": variant,
        "values": _clone_list(values),
        "capacity": capacity,
        "size": len(values),
    }
    if extra:
        state.update(extra)
    return state


def run_array_stack(input_data: Dict[str, Any], _options: Dict[str, Any]) -> Dict[str, Any]:
    capacity = max(1, _int_or_none(input_data.get("capacity")) or 8)
    stack = [_to_number_or_text(v) for v in input_data.get("initial_values", [])][:capacity]
    ops = _normalize_ops(input_data)
    steps: List[Dict[str, Any]] = []

    _append_step(
        steps,
        "init",
        "ok",
        f"Initialized array stack with capacity {capacity} and {len(stack)} item(s).",
        _linear_state("stack", "array", stack, capacity, {
            "top": stack[-1] if stack else None,
            "is_empty": len(stack) == 0,
            "is_full": len(stack) >= capacity,
        }),
    )

    for idx, op in enumerate(ops, start=1):
        name = op["op"]
        if name == "push":
            value = _to_number_or_text(op.get("value"))
            if len(stack) >= capacity:
                _append_step(
                    steps,
                    name,
                    "error",
                    f"Overflow at operation {idx}: cannot push into a full stack.",
                    _linear_state("stack", "array", stack, capacity, {
                        "top": stack[-1] if stack else None,
                        "is_empty": len(stack) == 0,
                        "is_full": True,
                    }),
                )
                continue
            stack.append(value)
            _append_step(
                steps,
                name,
                "ok",
                f"Pushed {value}. Top is now {stack[-1]}.",
                _linear_state("stack", "array", stack, capacity, {
                    "top": stack[-1],
                    "is_empty": False,
                    "is_full": len(stack) >= capacity,
                }),
            )
            continue

        if name == "pop":
            if not stack:
                _append_step(
                    steps,
                    name,
                    "error",
                    f"Underflow at operation {idx}: cannot pop from an empty stack.",
                    _linear_state("stack", "array", stack, capacity, {
                        "top": None,
                        "is_empty": True,
                        "is_full": False,
                    }),
                )
                continue
            removed = stack.pop()
            _append_step(
                steps,
                name,
                "ok",
                f"Popped {removed}.",
                _linear_state("stack", "array", stack, capacity, {
                    "top": stack[-1] if stack else None,
                    "is_empty": len(stack) == 0,
                    "is_full": len(stack) >= capacity,
                }),
                {"removed": removed},
            )
            continue

        if name in {"peek", "top"}:
            if not stack:
                _append_step(
                    steps,
                    name,
                    "error",
                    "Cannot peek: stack is empty.",
                    _linear_state("stack", "array", stack, capacity, {
                        "top": None,
                        "is_empty": True,
                        "is_full": False,
                    }),
                )
                continue
            _append_step(
                steps,
                name,
                "ok",
                f"Top element is {stack[-1]}.",
                _linear_state("stack", "array", stack, capacity, {
                    "top": stack[-1],
                    "is_empty": False,
                    "is_full": len(stack) >= capacity,
                }),
            )
            continue

        if name == "isempty":
            empty = len(stack) == 0
            _append_step(
                steps,
                name,
                "ok",
                f"isEmpty -> {empty}",
                _linear_state("stack", "array", stack, capacity, {
                    "top": stack[-1] if stack else None,
                    "is_empty": empty,
                    "is_full": len(stack) >= capacity,
                }),
            )
            continue

        if name == "isfull":
            full = len(stack) >= capacity
            _append_step(
                steps,
                name,
                "ok",
                f"isFull -> {full}",
                _linear_state("stack", "array", stack, capacity, {
                    "top": stack[-1] if stack else None,
                    "is_empty": len(stack) == 0,
                    "is_full": full,
                }),
            )
            continue

        _append_step(
            steps,
            name or "unknown",
            "error",
            f"Unsupported stack operation: '{name}'.",
            _linear_state("stack", "array", stack, capacity, {
                "top": stack[-1] if stack else None,
                "is_empty": len(stack) == 0,
                "is_full": len(stack) >= capacity,
            }),
        )

    return {
        "result": {"stack": stack},
        "steps": steps,
        "metrics": _base_metrics(len(stack), len(ops)),
    }


def run_linked_stack(input_data: Dict[str, Any], _options: Dict[str, Any]) -> Dict[str, Any]:
    stack = [_to_number_or_text(v) for v in input_data.get("initial_values", [])]
    ops = _normalize_ops(input_data)
    steps: List[Dict[str, Any]] = []

    _append_step(
        steps,
        "init",
        "ok",
        f"Initialized linked-list stack with {len(stack)} item(s).",
        _linear_state("stack", "linked", stack, None, {
            "top": stack[-1] if stack else None,
            "is_empty": len(stack) == 0,
            "is_full": False,
        }),
    )

    for op in ops:
        name = op["op"]
        if name == "push":
            value = _to_number_or_text(op.get("value"))
            stack.append(value)
            _append_step(
                steps,
                name,
                "ok",
                f"Pushed {value}.",
                _linear_state("stack", "linked", stack, None, {
                    "top": stack[-1],
                    "is_empty": False,
                    "is_full": False,
                }),
            )
            continue

        if name == "pop":
            if not stack:
                _append_step(
                    steps,
                    name,
                    "error",
                    "Underflow: cannot pop from an empty stack.",
                    _linear_state("stack", "linked", stack, None, {
                        "top": None,
                        "is_empty": True,
                        "is_full": False,
                    }),
                )
                continue
            removed = stack.pop()
            _append_step(
                steps,
                name,
                "ok",
                f"Popped {removed}.",
                _linear_state("stack", "linked", stack, None, {
                    "top": stack[-1] if stack else None,
                    "is_empty": len(stack) == 0,
                    "is_full": False,
                }),
                {"removed": removed},
            )
            continue

        if name in {"peek", "top"}:
            top = stack[-1] if stack else None
            status = "ok" if top is not None else "error"
            msg = f"Top element is {top}." if top is not None else "Cannot peek: stack is empty."
            _append_step(
                steps,
                name,
                status,
                msg,
                _linear_state("stack", "linked", stack, None, {
                    "top": top,
                    "is_empty": len(stack) == 0,
                    "is_full": False,
                }),
            )
            continue

        if name == "isempty":
            _append_step(
                steps,
                name,
                "ok",
                f"isEmpty -> {len(stack) == 0}",
                _linear_state("stack", "linked", stack, None, {
                    "top": stack[-1] if stack else None,
                    "is_empty": len(stack) == 0,
                    "is_full": False,
                }),
            )
            continue

        if name == "isfull":
            _append_step(
                steps,
                name,
                "ok",
                "isFull -> False (linked stack grows dynamically).",
                _linear_state("stack", "linked", stack, None, {
                    "top": stack[-1] if stack else None,
                    "is_empty": len(stack) == 0,
                    "is_full": False,
                }),
            )
            continue

        _append_step(
            steps,
            name or "unknown",
            "error",
            f"Unsupported stack operation: '{name}'.",
            _linear_state("stack", "linked", stack, None, {
                "top": stack[-1] if stack else None,
                "is_empty": len(stack) == 0,
                "is_full": False,
            }),
        )

    return {
        "result": {"stack": stack},
        "steps": steps,
        "metrics": _base_metrics(len(stack), len(ops)),
    }


def run_linear_queue(input_data: Dict[str, Any], _options: Dict[str, Any]) -> Dict[str, Any]:
    capacity = max(1, _int_or_none(input_data.get("capacity")) or 8)
    queue = [_to_number_or_text(v) for v in input_data.get("initial_values", [])][:capacity]
    ops = _normalize_ops(input_data)
    steps: List[Dict[str, Any]] = []

    _append_step(
        steps,
        "init",
        "ok",
        f"Initialized linear queue with capacity {capacity}.",
        _linear_state("queue", "linear", queue, capacity, {
            "front": queue[0] if queue else None,
            "rear": queue[-1] if queue else None,
            "is_empty": len(queue) == 0,
            "is_full": len(queue) >= capacity,
        }),
    )

    for op in ops:
        name = op["op"]
        if name == "enqueue":
            value = _to_number_or_text(op.get("value"))
            if len(queue) >= capacity:
                _append_step(
                    steps,
                    name,
                    "error",
                    "Overflow: linear queue is full.",
                    _linear_state("queue", "linear", queue, capacity, {
                        "front": queue[0] if queue else None,
                        "rear": queue[-1] if queue else None,
                        "is_empty": len(queue) == 0,
                        "is_full": True,
                    }),
                )
                continue
            queue.append(value)
            _append_step(
                steps,
                name,
                "ok",
                f"Enqueued {value}.",
                _linear_state("queue", "linear", queue, capacity, {
                    "front": queue[0],
                    "rear": queue[-1],
                    "is_empty": False,
                    "is_full": len(queue) >= capacity,
                }),
            )
            continue

        if name == "dequeue":
            if not queue:
                _append_step(
                    steps,
                    name,
                    "error",
                    "Underflow: queue is empty.",
                    _linear_state("queue", "linear", queue, capacity, {
                        "front": None,
                        "rear": None,
                        "is_empty": True,
                        "is_full": False,
                    }),
                )
                continue
            removed = queue.pop(0)
            _append_step(
                steps,
                name,
                "ok",
                f"Dequeued {removed}.",
                _linear_state("queue", "linear", queue, capacity, {
                    "front": queue[0] if queue else None,
                    "rear": queue[-1] if queue else None,
                    "is_empty": len(queue) == 0,
                    "is_full": len(queue) >= capacity,
                }),
                {"removed": removed},
            )
            continue

        if name == "front":
            if not queue:
                _append_step(
                    steps,
                    name,
                    "error",
                    "Queue is empty: no front element.",
                    _linear_state("queue", "linear", queue, capacity, {
                        "front": None,
                        "rear": None,
                        "is_empty": True,
                        "is_full": False,
                    }),
                )
                continue
            _append_step(
                steps,
                name,
                "ok",
                f"Front element is {queue[0]}.",
                _linear_state("queue", "linear", queue, capacity, {
                    "front": queue[0],
                    "rear": queue[-1],
                    "is_empty": False,
                    "is_full": len(queue) >= capacity,
                }),
            )
            continue

        if name == "rear":
            if not queue:
                _append_step(
                    steps,
                    name,
                    "error",
                    "Queue is empty: no rear element.",
                    _linear_state("queue", "linear", queue, capacity, {
                        "front": None,
                        "rear": None,
                        "is_empty": True,
                        "is_full": False,
                    }),
                )
                continue
            _append_step(
                steps,
                name,
                "ok",
                f"Rear element is {queue[-1]}.",
                _linear_state("queue", "linear", queue, capacity, {
                    "front": queue[0],
                    "rear": queue[-1],
                    "is_empty": False,
                    "is_full": len(queue) >= capacity,
                }),
            )
            continue

        if name == "isempty":
            _append_step(
                steps,
                name,
                "ok",
                f"isEmpty -> {len(queue) == 0}",
                _linear_state("queue", "linear", queue, capacity, {
                    "front": queue[0] if queue else None,
                    "rear": queue[-1] if queue else None,
                    "is_empty": len(queue) == 0,
                    "is_full": len(queue) >= capacity,
                }),
            )
            continue

        if name == "isfull":
            full = len(queue) >= capacity
            _append_step(
                steps,
                name,
                "ok",
                f"isFull -> {full}",
                _linear_state("queue", "linear", queue, capacity, {
                    "front": queue[0] if queue else None,
                    "rear": queue[-1] if queue else None,
                    "is_empty": len(queue) == 0,
                    "is_full": full,
                }),
            )
            continue

        _append_step(
            steps,
            name or "unknown",
            "error",
            f"Unsupported queue operation: '{name}'.",
            _linear_state("queue", "linear", queue, capacity, {
                "front": queue[0] if queue else None,
                "rear": queue[-1] if queue else None,
                "is_empty": len(queue) == 0,
                "is_full": len(queue) >= capacity,
            }),
        )

    return {
        "result": {"queue": queue},
        "steps": steps,
        "metrics": _base_metrics(len(queue), len(ops)),
    }


def run_circular_queue(input_data: Dict[str, Any], _options: Dict[str, Any]) -> Dict[str, Any]:
    capacity = max(1, _int_or_none(input_data.get("capacity")) or 8)
    slots: List[Optional[Any]] = [None] * capacity
    front = 0
    rear = -1
    count = 0

    for value in input_data.get("initial_values", [])[:capacity]:
        rear = (rear + 1) % capacity
        slots[rear] = _to_number_or_text(value)
        count += 1

    ops = _normalize_ops(input_data)
    steps: List[Dict[str, Any]] = []

    def snapshot() -> Dict[str, Any]:
        values = []
        for i in range(count):
            values.append(slots[(front + i) % capacity])
        return {
            "kind": "queue",
            "variant": "circular",
            "capacity": capacity,
            "slots": list(slots),
            "front_index": front if count else -1,
            "rear_index": rear if count else -1,
            "size": count,
            "values": values,
            "front": values[0] if values else None,
            "rear": values[-1] if values else None,
            "is_empty": count == 0,
            "is_full": count == capacity,
        }

    _append_step(steps, "init", "ok", "Initialized circular queue.", snapshot())

    for op in ops:
        name = op["op"]

        if name == "enqueue":
            value = _to_number_or_text(op.get("value"))
            if count == capacity:
                _append_step(steps, name, "error", "Overflow: circular queue is full.", snapshot())
                continue
            rear = (rear + 1) % capacity
            slots[rear] = value
            count += 1
            _append_step(steps, name, "ok", f"Enqueued {value}.", snapshot())
            continue

        if name == "dequeue":
            if count == 0:
                _append_step(steps, name, "error", "Underflow: circular queue is empty.", snapshot())
                continue
            removed = slots[front]
            slots[front] = None
            front = (front + 1) % capacity
            count -= 1
            if count == 0:
                front = 0
                rear = -1
            _append_step(steps, name, "ok", f"Dequeued {removed}.", snapshot(), {"removed": removed})
            continue

        if name == "front":
            state = snapshot()
            if state["is_empty"]:
                _append_step(steps, name, "error", "Queue is empty: no front element.", state)
            else:
                _append_step(steps, name, "ok", f"Front element is {state['front']}.", state)
            continue

        if name == "rear":
            state = snapshot()
            if state["is_empty"]:
                _append_step(steps, name, "error", "Queue is empty: no rear element.", state)
            else:
                _append_step(steps, name, "ok", f"Rear element is {state['rear']}.", state)
            continue

        if name == "isempty":
            state = snapshot()
            _append_step(steps, name, "ok", f"isEmpty -> {state['is_empty']}", state)
            continue

        if name == "isfull":
            state = snapshot()
            _append_step(steps, name, "ok", f"isFull -> {state['is_full']}", state)
            continue

        _append_step(steps, name or "unknown", "error", f"Unsupported queue operation: '{name}'.", snapshot())

    final_state = snapshot()
    return {
        "result": {"queue": final_state["values"]},
        "steps": steps,
        "metrics": _base_metrics(final_state["size"], len(ops)),
    }


def run_deque(input_data: Dict[str, Any], _options: Dict[str, Any]) -> Dict[str, Any]:
    capacity = max(1, _int_or_none(input_data.get("capacity")) or 8)
    dq = [_to_number_or_text(v) for v in input_data.get("initial_values", [])][:capacity]
    ops = _normalize_ops(input_data)
    steps: List[Dict[str, Any]] = []

    def snapshot() -> Dict[str, Any]:
        return _linear_state("queue", "deque", dq, capacity, {
            "front": dq[0] if dq else None,
            "rear": dq[-1] if dq else None,
            "is_empty": len(dq) == 0,
            "is_full": len(dq) >= capacity,
        })

    _append_step(steps, "init", "ok", "Initialized deque.", snapshot())

    for op in ops:
        name = op["op"]

        if name in {"enqueue", "enqueue_rear"}:
            if len(dq) >= capacity:
                _append_step(steps, name, "error", "Overflow: deque is full.", snapshot())
                continue
            value = _to_number_or_text(op.get("value"))
            dq.append(value)
            _append_step(steps, name, "ok", f"Enqueued {value} at rear.", snapshot())
            continue

        if name == "enqueue_front":
            if len(dq) >= capacity:
                _append_step(steps, name, "error", "Overflow: deque is full.", snapshot())
                continue
            value = _to_number_or_text(op.get("value"))
            dq.insert(0, value)
            _append_step(steps, name, "ok", f"Enqueued {value} at front.", snapshot())
            continue

        if name in {"dequeue", "dequeue_front"}:
            if not dq:
                _append_step(steps, name, "error", "Underflow: deque is empty.", snapshot())
                continue
            removed = dq.pop(0)
            _append_step(steps, name, "ok", f"Dequeued {removed} from front.", snapshot(), {"removed": removed})
            continue

        if name == "dequeue_rear":
            if not dq:
                _append_step(steps, name, "error", "Underflow: deque is empty.", snapshot())
                continue
            removed = dq.pop()
            _append_step(steps, name, "ok", f"Dequeued {removed} from rear.", snapshot(), {"removed": removed})
            continue

        if name == "front":
            state = snapshot()
            if state["is_empty"]:
                _append_step(steps, name, "error", "Deque is empty: no front.", state)
            else:
                _append_step(steps, name, "ok", f"Front element is {state['front']}.", state)
            continue

        if name == "rear":
            state = snapshot()
            if state["is_empty"]:
                _append_step(steps, name, "error", "Deque is empty: no rear.", state)
            else:
                _append_step(steps, name, "ok", f"Rear element is {state['rear']}.", state)
            continue

        if name == "isempty":
            state = snapshot()
            _append_step(steps, name, "ok", f"isEmpty -> {state['is_empty']}", state)
            continue

        if name == "isfull":
            state = snapshot()
            _append_step(steps, name, "ok", f"isFull -> {state['is_full']}", state)
            continue

        _append_step(steps, name or "unknown", "error", f"Unsupported deque operation: '{name}'.", snapshot())

    return {
        "result": {"deque": dq},
        "steps": steps,
        "metrics": _base_metrics(len(dq), len(ops)),
    }


def run_priority_queue(input_data: Dict[str, Any], _options: Dict[str, Any]) -> Dict[str, Any]:
    capacity = max(1, _int_or_none(input_data.get("capacity")) or 8)
    pq: List[Tuple[int, Any]] = []
    for value in input_data.get("initial_values", [])[:capacity]:
        pq.append((0, _to_number_or_text(value)))

    ops = _normalize_ops(input_data)
    steps: List[Dict[str, Any]] = []

    def ordered_items() -> List[Dict[str, Any]]:
        ordered = sorted(pq, key=lambda item: (-item[0], str(item[1])))
        return [{"priority": p, "value": v} for p, v in ordered]

    def snapshot() -> Dict[str, Any]:
        items = ordered_items()
        return {
            "kind": "queue",
            "variant": "priority",
            "capacity": capacity,
            "items": items,
            "values": [item["value"] for item in items],
            "front": items[0]["value"] if items else None,
            "rear": items[-1]["value"] if items else None,
            "is_empty": len(items) == 0,
            "is_full": len(items) >= capacity,
            "size": len(items),
        }

    _append_step(steps, "init", "ok", "Initialized priority queue (higher number = higher priority).", snapshot())

    for op in ops:
        name = op["op"]

        if name == "enqueue":
            if len(pq) >= capacity:
                _append_step(steps, name, "error", "Overflow: priority queue is full.", snapshot())
                continue
            value = _to_number_or_text(op.get("value"))
            priority = _int_or_none(op.get("priority"))
            if priority is None:
                priority = 0
            pq.append((priority, value))
            _append_step(steps, name, "ok", f"Enqueued {value} with priority {priority}.", snapshot())
            continue

        if name == "dequeue":
            if not pq:
                _append_step(steps, name, "error", "Underflow: priority queue is empty.", snapshot())
                continue
            best_idx = max(range(len(pq)), key=lambda i: (pq[i][0], str(pq[i][1])))
            removed = pq.pop(best_idx)
            _append_step(steps, name, "ok", f"Dequeued {removed[1]} (priority {removed[0]}).", snapshot(), {
                "removed": {"value": removed[1], "priority": removed[0]},
            })
            continue

        if name == "front":
            state = snapshot()
            if state["is_empty"]:
                _append_step(steps, name, "error", "Priority queue is empty: no front.", state)
            else:
                first = state["items"][0]
                _append_step(steps, name, "ok", f"Front is {first['value']} (priority {first['priority']}).", state)
            continue

        if name == "rear":
            state = snapshot()
            if state["is_empty"]:
                _append_step(steps, name, "error", "Priority queue is empty: no rear.", state)
            else:
                last = state["items"][-1]
                _append_step(steps, name, "ok", f"Rear is {last['value']} (priority {last['priority']}).", state)
            continue

        if name == "isempty":
            state = snapshot()
            _append_step(steps, name, "ok", f"isEmpty -> {state['is_empty']}", state)
            continue

        if name == "isfull":
            state = snapshot()
            _append_step(steps, name, "ok", f"isFull -> {state['is_full']}", state)
            continue

        _append_step(steps, name or "unknown", "error", f"Unsupported priority-queue operation: '{name}'.", snapshot())

    final = snapshot()
    return {
        "result": {"queue": final["items"]},
        "steps": steps,
        "metrics": _base_metrics(final["size"], len(ops)),
    }


def _linked_list_runner(variant: str):
    doubly = "doubly" in variant
    circular = "circular" in variant

    def run_linked(input_data: Dict[str, Any], _options: Dict[str, Any]) -> Dict[str, Any]:
        values = [_to_number_or_text(v) for v in input_data.get("initial_values", [])]
        ops = _normalize_ops(input_data)
        steps: List[Dict[str, Any]] = []

        def snapshot(highlight: Optional[int] = None, traversed: Optional[List[Any]] = None) -> Dict[str, Any]:
            nodes = [{"id": f"n{idx}", "value": val, "index": idx} for idx, val in enumerate(values)]
            edges = []
            for idx in range(max(0, len(values) - 1)):
                edges.append({"from": f"n{idx}", "to": f"n{idx + 1}", "label": "next"})
                if doubly:
                    edges.append({"from": f"n{idx + 1}", "to": f"n{idx}", "label": "prev"})
            if circular and len(values) > 1:
                edges.append({"from": f"n{len(values) - 1}", "to": "n0", "label": "next"})
                if doubly:
                    edges.append({"from": "n0", "to": f"n{len(values) - 1}", "label": "prev"})

            return {
                "kind": "linked_list",
                "variant": variant,
                "values": _clone_list(values),
                "nodes": nodes,
                "edges": edges,
                "size": len(values),
                "head": values[0] if values else None,
                "tail": values[-1] if values else None,
                "is_empty": len(values) == 0,
                "highlight_index": highlight,
                "traversed": traversed or [],
            }

        _append_step(steps, "init", "ok", f"Initialized {variant.replace('_', ' ')}.", snapshot())

        for op in ops:
            name = op["op"]
            value = _to_number_or_text(op.get("value"))
            position = _int_or_none(op.get("position"))

            if name in {"insert_begin", "insert_at_beginning"}:
                values.insert(0, value)
                _append_step(steps, name, "ok", f"Inserted {value} at beginning.", snapshot(0))
                continue

            if name in {"insert_end", "insert_at_end"}:
                values.append(value)
                _append_step(steps, name, "ok", f"Inserted {value} at end.", snapshot(len(values) - 1))
                continue

            if name in {"insert_pos", "insert_position", "insert_at_position"}:
                if position is None or position < 0 or position > len(values):
                    _append_step(steps, name, "error", "Invalid index for insert-at-position.", snapshot())
                    continue
                values.insert(position, value)
                _append_step(steps, name, "ok", f"Inserted {value} at index {position}.", snapshot(position))
                continue

            if name in {"delete_begin", "delete_at_beginning"}:
                if not values:
                    _append_step(steps, name, "error", "Underflow: list is empty.", snapshot())
                    continue
                removed = values.pop(0)
                _append_step(steps, name, "ok", f"Deleted {removed} from beginning.", snapshot(), {"removed": removed})
                continue

            if name in {"delete_end", "delete_at_end"}:
                if not values:
                    _append_step(steps, name, "error", "Underflow: list is empty.", snapshot())
                    continue
                removed = values.pop()
                _append_step(steps, name, "ok", f"Deleted {removed} from end.", snapshot(), {"removed": removed})
                continue

            if name in {"delete_pos", "delete_position", "delete_at_position"}:
                if position is None or position < 0 or position >= len(values):
                    _append_step(steps, name, "error", "Invalid index for delete-at-position.", snapshot())
                    continue
                removed = values.pop(position)
                _append_step(steps, name, "ok", f"Deleted value {removed} at index {position}.", snapshot(position if position < len(values) else None), {"removed": removed})
                continue

            if name == "search":
                found = -1
                for i, item in enumerate(values):
                    if item == value:
                        found = i
                        break
                if found == -1:
                    _append_step(steps, name, "error", f"Value {value} not found.", snapshot())
                else:
                    _append_step(steps, name, "ok", f"Found {value} at index {found}.", snapshot(found), {"found_index": found})
                continue

            if name == "traverse":
                _append_step(steps, name, "ok", f"Traversal: {' -> '.join(map(str, values)) if values else '(empty)'}", snapshot(None, _clone_list(values)))
                continue

            if name == "reverse":
                values.reverse()
                _append_step(steps, name, "ok", "Reversed the linked list.", snapshot())
                continue

            _append_step(steps, name or "unknown", "error", f"Unsupported linked-list operation: '{name}'.", snapshot())

        return {
            "result": {"list": _clone_list(values)},
            "steps": steps,
            "metrics": _base_metrics(len(values), len(ops)),
        }

    return run_linked


@dataclass
class BNode:
    value: Any
    left: Optional["BNode"] = None
    right: Optional["BNode"] = None


@dataclass
class TrieNode:
    char: str
    terminal: bool = False
    children: Dict[str, "TrieNode"] = None

    def __post_init__(self) -> None:
        if self.children is None:
            self.children = {}


def _serialize_binary(root: Optional[BNode], variant: str, highlight: Optional[Any] = None) -> Dict[str, Any]:
    nodes: List[Dict[str, Any]] = []
    edges: List[Dict[str, Any]] = []

    if root is None:
        return {
            "kind": "tree",
            "variant": variant,
            "nodes": nodes,
            "edges": edges,
            "size": 0,
            "highlight_value": highlight,
        }

    queue: List[Tuple[BNode, int, str]] = [(root, 0, "r0")]
    while queue:
        node, level, node_id = queue.pop(0)
        nodes.append({"id": node_id, "value": node.value, "level": level})
        if node.left is not None:
            left_id = f"{node_id}L"
            edges.append({"from": node_id, "to": left_id, "label": "L"})
            queue.append((node.left, level + 1, left_id))
        if node.right is not None:
            right_id = f"{node_id}R"
            edges.append({"from": node_id, "to": right_id, "label": "R"})
            queue.append((node.right, level + 1, right_id))

    return {
        "kind": "tree",
        "variant": variant,
        "nodes": nodes,
        "edges": edges,
        "size": len(nodes),
        "highlight_value": highlight,
    }


def _serialize_trie(root: TrieNode, highlight_prefix: str = "") -> Dict[str, Any]:
    nodes: List[Dict[str, Any]] = []
    edges: List[Dict[str, Any]] = []

    queue: List[Tuple[TrieNode, int, str]] = [(root, 0, "root")]
    while queue:
        node, level, node_id = queue.pop(0)
        nodes.append({
            "id": node_id,
            "value": "∅" if node_id == "root" else node.char,
            "level": level,
            "terminal": node.terminal,
        })
        for key in sorted(node.children.keys()):
            child = node.children[key]
            child_id = f"{node_id}_{key}_{len(nodes)}"
            edges.append({"from": node_id, "to": child_id, "label": key})
            queue.append((child, level + 1, child_id))

    return {
        "kind": "tree",
        "variant": "trie",
        "nodes": nodes,
        "edges": edges,
        "size": len(nodes),
        "prefix": highlight_prefix,
    }


def _tree_traversals(root: Optional[BNode]) -> Dict[str, List[Any]]:
    inorder: List[Any] = []
    preorder: List[Any] = []
    postorder: List[Any] = []
    levelorder: List[Any] = []

    def dfs(node: Optional[BNode]) -> None:
        if node is None:
            return
        preorder.append(node.value)
        dfs(node.left)
        inorder.append(node.value)
        dfs(node.right)
        postorder.append(node.value)

    dfs(root)

    if root is not None:
        q = [root]
        while q:
            n = q.pop(0)
            levelorder.append(n.value)
            if n.left is not None:
                q.append(n.left)
            if n.right is not None:
                q.append(n.right)

    return {
        "inorder": inorder,
        "preorder": preorder,
        "postorder": postorder,
        "levelorder": levelorder,
    }


def _insert_bst(root: Optional[BNode], value: Any) -> BNode:
    if root is None:
        return BNode(value)
    if value < root.value:
        root.left = _insert_bst(root.left, value)
    elif value > root.value:
        root.right = _insert_bst(root.right, value)
    return root


def _search_bst(root: Optional[BNode], value: Any) -> bool:
    cur = root
    while cur is not None:
        if value == cur.value:
            return True
        if value < cur.value:
            cur = cur.left
        else:
            cur = cur.right
    return False


def _delete_bst(root: Optional[BNode], value: Any) -> Tuple[Optional[BNode], bool]:
    if root is None:
        return None, False
    if value < root.value:
        root.left, deleted = _delete_bst(root.left, value)
        return root, deleted
    if value > root.value:
        root.right, deleted = _delete_bst(root.right, value)
        return root, deleted

    if root.left is None:
        return root.right, True
    if root.right is None:
        return root.left, True

    successor_parent = root
    successor = root.right
    while successor.left is not None:
        successor_parent = successor
        successor = successor.left

    root.value = successor.value
    if successor_parent == root:
        successor_parent.right = successor.right
    else:
        successor_parent.left = successor.right
    return root, True


def run_binary_tree(input_data: Dict[str, Any], _options: Dict[str, Any]) -> Dict[str, Any]:
    values = [_to_number_or_text(v) for v in input_data.get("initial_values", [])]
    ops = _normalize_ops(input_data)
    steps: List[Dict[str, Any]] = []

    def build_tree_from_array(arr: List[Any], idx: int = 0) -> Optional[BNode]:
        if idx >= len(arr):
            return None
        node = BNode(arr[idx])
        node.left = build_tree_from_array(arr, idx * 2 + 1)
        node.right = build_tree_from_array(arr, idx * 2 + 2)
        return node

    def serialize(highlight: Optional[Any] = None, traversal: Optional[Dict[str, List[Any]]] = None) -> Dict[str, Any]:
        root = build_tree_from_array(values)
        state = _serialize_binary(root, "binary_tree", highlight)
        if traversal is not None:
            state["traversals"] = traversal
        state["array"] = _clone_list(values)
        return state

    _append_step(steps, "init", "ok", "Initialized binary tree from level-order array.", serialize())

    for op in ops:
        name = op["op"]
        value = _to_number_or_text(op.get("value"))

        if name == "insert":
            values.append(value)
            _append_step(steps, name, "ok", f"Inserted {value} (next level-order slot).", serialize(value))
            continue

        if name == "delete":
            if not values:
                _append_step(steps, name, "error", "Tree is empty.", serialize())
                continue
            try:
                idx = values.index(value)
            except ValueError:
                _append_step(steps, name, "error", f"Value {value} not found.", serialize())
                continue
            last = values.pop()
            if idx < len(values):
                values[idx] = last
            _append_step(steps, name, "ok", f"Deleted {value} using complete-tree replacement.", serialize())
            continue

        if name == "search":
            found = value in values
            status = "ok" if found else "error"
            _append_step(steps, name, status, f"Search {value}: {'found' if found else 'not found'}.", serialize(value if found else None))
            continue

        if name in {"traverse", "traversal"}:
            root = build_tree_from_array(values)
            traversals = _tree_traversals(root)
            mode = op.get("traversal") or "inorder"
            mode = mode if mode in traversals else "inorder"
            _append_step(steps, name, "ok", f"{mode} traversal: {traversals[mode]}", serialize(None, traversals), {
                "active_traversal": mode,
            })
            continue

        _append_step(steps, name or "unknown", "error", f"Unsupported binary-tree operation: '{name}'.", serialize())

    return {
        "result": {"tree_array": values},
        "steps": steps,
        "metrics": _base_metrics(len(values), len(ops)),
    }


def run_bst(input_data: Dict[str, Any], _options: Dict[str, Any]) -> Dict[str, Any]:
    root: Optional[BNode] = None
    for value in input_data.get("initial_values", []):
        root = _insert_bst(root, _to_number_or_text(value))

    ops = _normalize_ops(input_data)
    steps: List[Dict[str, Any]] = []

    _append_step(steps, "init", "ok", "Initialized binary search tree.", _serialize_binary(root, "bst"))

    for op in ops:
        name = op["op"]
        value = _to_number_or_text(op.get("value"))

        if name == "insert":
            if _search_bst(root, value):
                _append_step(steps, name, "error", f"Duplicate {value} ignored in BST.", _serialize_binary(root, "bst", value))
                continue
            root = _insert_bst(root, value)
            _append_step(steps, name, "ok", f"Inserted {value} into BST.", _serialize_binary(root, "bst", value))
            continue

        if name == "delete":
            root, deleted = _delete_bst(root, value)
            if not deleted:
                _append_step(steps, name, "error", f"Value {value} not found in BST.", _serialize_binary(root, "bst"))
            else:
                _append_step(steps, name, "ok", f"Deleted {value} from BST.", _serialize_binary(root, "bst"))
            continue

        if name == "search":
            found = _search_bst(root, value)
            _append_step(steps, name, "ok" if found else "error", f"Search {value}: {'found' if found else 'not found'}.", _serialize_binary(root, "bst", value if found else None))
            continue

        if name in {"traverse", "traversal"}:
            traversals = _tree_traversals(root)
            mode = op.get("traversal") or "inorder"
            mode = mode if mode in traversals else "inorder"
            state = _serialize_binary(root, "bst")
            state["traversals"] = traversals
            _append_step(steps, name, "ok", f"{mode} traversal: {traversals[mode]}", state, {"active_traversal": mode})
            continue

        _append_step(steps, name or "unknown", "error", f"Unsupported BST operation: '{name}'.", _serialize_binary(root, "bst"))

    final = _serialize_binary(root, "bst")
    return {
        "result": {"nodes": final["nodes"]},
        "steps": steps,
        "metrics": _base_metrics(final["size"], len(ops)),
    }


@dataclass
class AVLNode:
    value: Any
    left: Optional["AVLNode"] = None
    right: Optional["AVLNode"] = None
    height: int = 1


def _avl_height(node: Optional[AVLNode]) -> int:
    return node.height if node else 0


def _avl_balance(node: Optional[AVLNode]) -> int:
    if node is None:
        return 0
    return _avl_height(node.left) - _avl_height(node.right)


def _avl_rotate_right(y: AVLNode) -> AVLNode:
    x = y.left
    t2 = x.right if x else None
    x.right = y
    y.left = t2
    y.height = 1 + max(_avl_height(y.left), _avl_height(y.right))
    x.height = 1 + max(_avl_height(x.left), _avl_height(x.right))
    return x


def _avl_rotate_left(x: AVLNode) -> AVLNode:
    y = x.right
    t2 = y.left if y else None
    y.left = x
    x.right = t2
    x.height = 1 + max(_avl_height(x.left), _avl_height(x.right))
    y.height = 1 + max(_avl_height(y.left), _avl_height(y.right))
    return y


def _avl_insert(node: Optional[AVLNode], value: Any) -> Tuple[Optional[AVLNode], str]:
    if node is None:
        return AVLNode(value), "insert"

    if value < node.value:
        node.left, _ = _avl_insert(node.left, value)
    elif value > node.value:
        node.right, _ = _avl_insert(node.right, value)
    else:
        return node, "duplicate"

    node.height = 1 + max(_avl_height(node.left), _avl_height(node.right))
    balance = _avl_balance(node)

    if balance > 1 and value < node.left.value:
        return _avl_rotate_right(node), "rotate_right"
    if balance < -1 and value > node.right.value:
        return _avl_rotate_left(node), "rotate_left"
    if balance > 1 and value > node.left.value:
        node.left = _avl_rotate_left(node.left)
        return _avl_rotate_right(node), "rotate_left_right"
    if balance < -1 and value < node.right.value:
        node.right = _avl_rotate_right(node.right)
        return _avl_rotate_left(node), "rotate_right_left"

    return node, "insert"


def _avl_min_value(node: AVLNode) -> AVLNode:
    current = node
    while current.left is not None:
        current = current.left
    return current


def _avl_delete(node: Optional[AVLNode], value: Any) -> Tuple[Optional[AVLNode], bool, str]:
    if node is None:
        return None, False, "not_found"

    if value < node.value:
        node.left, deleted, rotation = _avl_delete(node.left, value)
    elif value > node.value:
        node.right, deleted, rotation = _avl_delete(node.right, value)
    else:
        deleted = True
        rotation = "delete"
        if node.left is None:
            return node.right, True, rotation
        if node.right is None:
            return node.left, True, rotation
        temp = _avl_min_value(node.right)
        node.value = temp.value
        node.right, _, _ = _avl_delete(node.right, temp.value)

    if node is None:
        return node, deleted, rotation

    node.height = 1 + max(_avl_height(node.left), _avl_height(node.right))
    balance = _avl_balance(node)

    if balance > 1 and _avl_balance(node.left) >= 0:
        return _avl_rotate_right(node), deleted, "rotate_right"
    if balance > 1 and _avl_balance(node.left) < 0:
        node.left = _avl_rotate_left(node.left)
        return _avl_rotate_right(node), deleted, "rotate_left_right"
    if balance < -1 and _avl_balance(node.right) <= 0:
        return _avl_rotate_left(node), deleted, "rotate_left"
    if balance < -1 and _avl_balance(node.right) > 0:
        node.right = _avl_rotate_right(node.right)
        return _avl_rotate_left(node), deleted, "rotate_right_left"

    return node, deleted, rotation


def _serialize_avl(root: Optional[AVLNode], highlight: Optional[Any] = None) -> Dict[str, Any]:
    def convert(node: Optional[AVLNode]) -> Optional[BNode]:
        if node is None:
            return None
        return BNode(node.value, convert(node.left), convert(node.right))

    state = _serialize_binary(convert(root), "avl_tree", highlight)
    state["height"] = _avl_height(root)
    return state


def _search_avl(node: Optional[AVLNode], value: Any) -> bool:
    cur = node
    while cur is not None:
        if value == cur.value:
            return True
        if value < cur.value:
            cur = cur.left
        else:
            cur = cur.right
    return False


def run_avl_tree(input_data: Dict[str, Any], _options: Dict[str, Any]) -> Dict[str, Any]:
    root: Optional[AVLNode] = None
    for value in input_data.get("initial_values", []):
        root, _ = _avl_insert(root, _to_number_or_text(value))

    ops = _normalize_ops(input_data)
    steps: List[Dict[str, Any]] = []

    _append_step(steps, "init", "ok", "Initialized AVL tree.", _serialize_avl(root))

    for op in ops:
        name = op["op"]
        value = _to_number_or_text(op.get("value"))

        if name == "insert":
            root, action = _avl_insert(root, value)
            if action == "duplicate":
                _append_step(steps, name, "error", f"Duplicate {value} ignored in AVL.", _serialize_avl(root, value))
            elif action.startswith("rotate"):
                _append_step(steps, name, "ok", f"Inserted {value}; balancing applied ({action}).", _serialize_avl(root, value), {"rotation": action})
            else:
                _append_step(steps, name, "ok", f"Inserted {value}.", _serialize_avl(root, value))
            continue

        if name == "delete":
            root, deleted, action = _avl_delete(root, value)
            if not deleted:
                _append_step(steps, name, "error", f"Value {value} not found in AVL tree.", _serialize_avl(root))
            elif action.startswith("rotate"):
                _append_step(steps, name, "ok", f"Deleted {value}; balancing applied ({action}).", _serialize_avl(root), {"rotation": action})
            else:
                _append_step(steps, name, "ok", f"Deleted {value}.", _serialize_avl(root))
            continue

        if name == "search":
            found = _search_avl(root, value)
            _append_step(steps, name, "ok" if found else "error", f"Search {value}: {'found' if found else 'not found'}.", _serialize_avl(root, value if found else None))
            continue

        if name in {"traverse", "traversal"}:
            traversals = _tree_traversals(None if root is None else BNode(root.value, None, None))
            # Build traversals from serialized order to stay deterministic.
            state = _serialize_avl(root)
            values = [node["value"] for node in state["nodes"]]
            traversals = {
                "inorder": sorted(values),
                "preorder": values,
                "postorder": list(reversed(values)),
                "levelorder": values,
            }
            mode = op.get("traversal") or "inorder"
            mode = mode if mode in traversals else "inorder"
            state["traversals"] = traversals
            _append_step(steps, name, "ok", f"{mode} traversal: {traversals[mode]}", state, {"active_traversal": mode})
            continue

        _append_step(steps, name or "unknown", "error", f"Unsupported AVL operation: '{name}'.", _serialize_avl(root))

    final_state = _serialize_avl(root)
    return {
        "result": {"nodes": final_state["nodes"]},
        "steps": steps,
        "metrics": _base_metrics(final_state["size"], len(ops)),
    }


def _heap_runner(variant: str):
    is_min = variant == "min_heap"

    def cmp(a: Any, b: Any) -> bool:
        return a < b if is_min else a > b

    def sift_up(heap: List[Any], idx: int) -> None:
        while idx > 0:
            parent = (idx - 1) // 2
            if cmp(heap[idx], heap[parent]):
                heap[idx], heap[parent] = heap[parent], heap[idx]
                idx = parent
            else:
                break

    def sift_down(heap: List[Any], idx: int) -> None:
        n = len(heap)
        while True:
            left = idx * 2 + 1
            right = idx * 2 + 2
            target = idx
            if left < n and cmp(heap[left], heap[target]):
                target = left
            if right < n and cmp(heap[right], heap[target]):
                target = right
            if target == idx:
                break
            heap[idx], heap[target] = heap[target], heap[idx]
            idx = target

    def heapify(heap: List[Any]) -> None:
        for i in range(len(heap) // 2 - 1, -1, -1):
            sift_down(heap, i)

    def to_tree_state(heap: List[Any], highlight: Optional[Any] = None) -> Dict[str, Any]:
        nodes = []
        edges = []
        for idx, value in enumerate(heap):
            level = 0
            j = idx + 1
            while j > 1:
                j //= 2
                level += 1
            node_id = f"h{idx}"
            nodes.append({"id": node_id, "value": value, "level": level})
            left = idx * 2 + 1
            right = idx * 2 + 2
            if left < len(heap):
                edges.append({"from": node_id, "to": f"h{left}", "label": "L"})
            if right < len(heap):
                edges.append({"from": node_id, "to": f"h{right}", "label": "R"})

        return {
            "kind": "tree",
            "variant": variant,
            "nodes": nodes,
            "edges": edges,
            "size": len(heap),
            "array": _clone_list(heap),
            "highlight_value": highlight,
        }

    def run_heap(input_data: Dict[str, Any], _options: Dict[str, Any]) -> Dict[str, Any]:
        heap = [_to_number_or_text(v) for v in input_data.get("initial_values", [])]
        heapify(heap)
        ops = _normalize_ops(input_data)
        steps: List[Dict[str, Any]] = []

        _append_step(steps, "init", "ok", f"Initialized {variant.replace('_', ' ')} using heapify.", to_tree_state(heap))

        for op in ops:
            name = op["op"]
            value = _to_number_or_text(op.get("value"))

            if name == "insert":
                heap.append(value)
                sift_up(heap, len(heap) - 1)
                _append_step(steps, name, "ok", f"Inserted {value} and restored heap order.", to_tree_state(heap, value))
                continue

            if name == "delete":
                if not heap:
                    _append_step(steps, name, "error", "Heap is empty.", to_tree_state(heap))
                    continue

                if value is None or value == "":
                    removed = heap[0]
                    last = heap.pop()
                    if heap:
                        heap[0] = last
                        sift_down(heap, 0)
                    _append_step(steps, name, "ok", f"Deleted root {removed}.", to_tree_state(heap), {"removed": removed})
                    continue

                try:
                    idx = heap.index(value)
                except ValueError:
                    _append_step(steps, name, "error", f"Value {value} not found in heap.", to_tree_state(heap))
                    continue
                removed = heap[idx]
                last = heap.pop()
                if idx < len(heap):
                    heap[idx] = last
                    sift_down(heap, idx)
                    sift_up(heap, idx)
                _append_step(steps, name, "ok", f"Deleted value {removed}.", to_tree_state(heap), {"removed": removed})
                continue

            if name == "search":
                found = value in heap
                _append_step(steps, name, "ok" if found else "error", f"Search {value}: {'found' if found else 'not found'}.", to_tree_state(heap, value if found else None))
                continue

            if name in {"traverse", "traversal"}:
                traversals = {
                    "levelorder": _clone_list(heap),
                    "inorder": sorted(heap) if is_min else sorted(heap, reverse=True),
                    "preorder": _clone_list(heap),
                    "postorder": list(reversed(heap)),
                }
                mode = op.get("traversal") or "levelorder"
                mode = mode if mode in traversals else "levelorder"
                state = to_tree_state(heap)
                state["traversals"] = traversals
                _append_step(steps, name, "ok", f"{mode} traversal: {traversals[mode]}", state, {"active_traversal": mode})
                continue

            if name == "heapify":
                heapify(heap)
                _append_step(steps, name, "ok", "Applied heapify to current array.", to_tree_state(heap))
                continue

            _append_step(steps, name or "unknown", "error", f"Unsupported heap operation: '{name}'.", to_tree_state(heap))

        final_state = to_tree_state(heap)
        return {
            "result": {"heap": heap},
            "steps": steps,
            "metrics": _base_metrics(final_state["size"], len(ops)),
        }

    return run_heap


def run_trie(input_data: Dict[str, Any], _options: Dict[str, Any]) -> Dict[str, Any]:
    root = TrieNode("*")
    ops = _normalize_ops(input_data)
    initial_words = [str(v) for v in input_data.get("initial_values", [])]
    steps: List[Dict[str, Any]] = []

    def insert_word(word: str) -> None:
        cur = root
        for ch in word:
            if ch not in cur.children:
                cur.children[ch] = TrieNode(ch)
            cur = cur.children[ch]
        cur.terminal = True

    def search_word(word: str) -> bool:
        cur = root
        for ch in word:
            if ch not in cur.children:
                return False
            cur = cur.children[ch]
        return cur.terminal

    def starts_with(prefix: str) -> bool:
        cur = root
        for ch in prefix:
            if ch not in cur.children:
                return False
            cur = cur.children[ch]
        return True

    def delete_word(word: str) -> bool:
        def _delete(node: TrieNode, depth: int) -> Tuple[bool, bool]:
            if depth == len(word):
                if not node.terminal:
                    return False, False
                node.terminal = False
                return len(node.children) == 0, True

            ch = word[depth]
            child = node.children.get(ch)
            if child is None:
                return False, False

            should_prune, deleted = _delete(child, depth + 1)
            if should_prune:
                del node.children[ch]
            can_prune = len(node.children) == 0 and not node.terminal and node.char != "*"
            return can_prune, deleted

        _, deleted = _delete(root, 0)
        return deleted

    for word in initial_words:
        insert_word(word)

    _append_step(steps, "init", "ok", f"Initialized trie with {len(initial_words)} word(s).", _serialize_trie(root))

    for op in ops:
        name = op["op"]
        value = str(op.get("value") or "")
        prefix = str(op.get("prefix") or value or "")

        if name == "insert":
            if value == "":
                _append_step(steps, name, "error", "Insert requires a non-empty word.", _serialize_trie(root))
                continue
            if search_word(value):
                _append_step(steps, name, "error", f"Duplicate word '{value}' ignored.", _serialize_trie(root, value))
                continue
            insert_word(value)
            _append_step(steps, name, "ok", f"Inserted '{value}' into trie.", _serialize_trie(root, value))
            continue

        if name == "delete":
            if value == "":
                _append_step(steps, name, "error", "Delete requires a word.", _serialize_trie(root))
                continue
            deleted = delete_word(value)
            if not deleted:
                _append_step(steps, name, "error", f"Word '{value}' not found.", _serialize_trie(root, value))
            else:
                _append_step(steps, name, "ok", f"Deleted '{value}' from trie.", _serialize_trie(root, value))
            continue

        if name == "search":
            found = search_word(value)
            _append_step(steps, name, "ok" if found else "error", f"Search '{value}': {'found' if found else 'not found'}.", _serialize_trie(root, value))
            continue

        if name in {"prefix", "prefix_search"}:
            found = starts_with(prefix)
            _append_step(steps, name, "ok" if found else "error", f"Prefix '{prefix}': {'exists' if found else 'not found'}.", _serialize_trie(root, prefix), {
                "prefix": prefix,
            })
            continue

        if name in {"traverse", "traversal"}:
            words: List[str] = []

            def dfs(node: TrieNode, path: str) -> None:
                if node.terminal:
                    words.append(path)
                for key in sorted(node.children.keys()):
                    dfs(node.children[key], path + key)

            dfs(root, "")
            state = _serialize_trie(root)
            state["words"] = words
            _append_step(steps, name, "ok", f"Trie traversal: {words}", state)
            continue

        _append_step(steps, name or "unknown", "error", f"Unsupported trie operation: '{name}'.", _serialize_trie(root))

    final = _serialize_trie(root)
    return {
        "result": {"nodes": final["nodes"]},
        "steps": steps,
        "metrics": _base_metrics(final["size"], len(ops)),
    }


def _btree_insert_sorted(values: List[Any], value: Any) -> None:
    idx = 0
    value_key = _sort_key(value)
    while idx < len(values) and _sort_key(values[idx]) < value_key:
        idx += 1
    values.insert(idx, value)


def _build_balanced_btree_state(values: List[Any], variant: str, order: int, highlight: Optional[Any] = None) -> Dict[str, Any]:
    normalized_order = max(3, order)
    sorted_values = sorted(values, key=_sort_key)
    node_capacity = max(2, normalized_order - 1)

    empty_state = {
        "kind": "tree",
        "variant": variant,
        "order": normalized_order,
        "keys": [],
        "nodes": [],
        "edges": [],
        "leaf_links": [],
        "size": 0,
        "highlight_value": highlight,
    }
    if not sorted_values:
        return empty_state

    leaves = []
    for start in range(0, len(sorted_values), node_capacity):
        leaves.append({
            "keys": _clone_list(sorted_values[start:start + node_capacity]),
            "leaf": True,
            "children": [],
        })

    def min_key(node: Dict[str, Any]) -> Any:
        if node["leaf"]:
            return node["keys"][0]
        return min_key(node["children"][0])

    def max_key(node: Dict[str, Any]) -> Any:
        if node["leaf"]:
            return node["keys"][-1]
        return max_key(node["children"][-1])

    levels: List[List[Dict[str, Any]]] = [leaves]
    current = leaves
    while len(current) > 1:
        parent_level: List[Dict[str, Any]] = []
        for start in range(0, len(current), normalized_order):
            group = current[start:start + normalized_order]
            if variant == "b_plus_tree":
                parent_keys = [min_key(child) for child in group[1:]]
            else:
                parent_keys = [max_key(child) for child in group[:-1]]
            parent_level.append({
                "keys": parent_keys,
                "leaf": False,
                "children": group,
            })
        current = parent_level
        levels.append(current)

    root = levels[-1][0]
    queue: List[Tuple[Dict[str, Any], int, str]] = [(root, 0, "r0")]
    node_id_map: Dict[int, str] = {id(root): "r0"}
    nodes: List[Dict[str, Any]] = []
    edges: List[Dict[str, Any]] = []

    while queue:
        node, level, node_id = queue.pop(0)
        key_text = " | ".join(str(key) for key in node["keys"]) if node["keys"] else "-"
        nodes.append({
            "id": node_id,
            "value": key_text,
            "keys": _clone_list(node["keys"]),
            "level": level,
            "leaf": bool(node["leaf"]),
        })

        for idx, child in enumerate(node["children"]):
            child_id = node_id_map.get(id(child))
            if child_id is None:
                child_id = f"{node_id}C{idx}"
                node_id_map[id(child)] = child_id
            edges.append({
                "from": node_id,
                "to": child_id,
                "label": f"c{idx}",
            })
            queue.append((child, level + 1, child_id))

    leaf_links: List[Dict[str, Any]] = []
    if variant == "b_plus_tree" and levels and levels[0]:
        leaf_level = levels[0]
        for idx in range(len(leaf_level) - 1):
            left_id = node_id_map.get(id(leaf_level[idx]))
            right_id = node_id_map.get(id(leaf_level[idx + 1]))
            if left_id and right_id:
                leaf_links.append({
                    "from": left_id,
                    "to": right_id,
                    "label": "next",
                })

    return {
        "kind": "tree",
        "variant": variant,
        "order": normalized_order,
        "keys": _clone_list(sorted_values),
        "nodes": nodes,
        "edges": edges,
        "leaf_links": leaf_links,
        "size": len(sorted_values),
        "highlight_value": highlight,
    }


def _btree_runner(variant: str):
    def run_btree(input_data: Dict[str, Any], _options: Dict[str, Any]) -> Dict[str, Any]:
        order = max(3, _int_or_none(input_data.get("order")) or 4)
        values: List[Any] = []

        for raw in input_data.get("initial_values", []):
            value = _to_number_or_text(raw)
            if value in values:
                continue
            _btree_insert_sorted(values, value)

        ops = _normalize_ops(input_data)
        steps: List[Dict[str, Any]] = []
        title = "B+ Tree" if variant == "b_plus_tree" else "B-Tree"

        _append_step(
            steps,
            "init",
            "ok",
            f"Initialized {title} with order {order} and {len(values)} key(s).",
            _build_balanced_btree_state(values, variant, order),
        )

        for op in ops:
            name = op["op"]
            value = _to_number_or_text(op.get("value"))

            if name == "insert":
                if value is None or value == "":
                    _append_step(
                        steps,
                        name,
                        "error",
                        "Insert requires a key value.",
                        _build_balanced_btree_state(values, variant, order),
                    )
                    continue

                if value in values:
                    _append_step(
                        steps,
                        name,
                        "error",
                        f"Duplicate key {value} ignored.",
                        _build_balanced_btree_state(values, variant, order, value),
                    )
                    continue

                _btree_insert_sorted(values, value)
                _append_step(
                    steps,
                    name,
                    "ok",
                    f"Inserted key {value}; tree rebalanced.",
                    _build_balanced_btree_state(values, variant, order, value),
                )
                continue

            if name == "delete":
                if value is None or value == "":
                    _append_step(
                        steps,
                        name,
                        "error",
                        "Delete requires a key value.",
                        _build_balanced_btree_state(values, variant, order),
                    )
                    continue

                if value not in values:
                    _append_step(
                        steps,
                        name,
                        "error",
                        f"Key {value} not found.",
                        _build_balanced_btree_state(values, variant, order),
                    )
                    continue

                values.remove(value)
                _append_step(
                    steps,
                    name,
                    "ok",
                    f"Deleted key {value}; tree rebalanced.",
                    _build_balanced_btree_state(values, variant, order),
                    {"removed": value},
                )
                continue

            if name == "search":
                found = value in values
                _append_step(
                    steps,
                    name,
                    "ok" if found else "error",
                    f"Search {value}: {'found' if found else 'not found'}.",
                    _build_balanced_btree_state(values, variant, order, value if found else None),
                )
                continue

            if name in {"traverse", "traversal"}:
                state = _build_balanced_btree_state(values, variant, order)
                levelorder: List[Any] = []
                for node in sorted(state["nodes"], key=lambda item: (item["level"], str(item["id"]))):
                    levelorder.extend(node.get("keys") or [])

                traversals = {
                    "inorder": _clone_list(values),
                    "preorder": _clone_list(values),
                    "postorder": list(reversed(values)),
                    "levelorder": levelorder,
                }
                mode = op.get("traversal") or "inorder"
                mode = mode if mode in traversals else "inorder"
                state["traversals"] = traversals

                _append_step(
                    steps,
                    name,
                    "ok",
                    f"{mode} traversal: {traversals[mode]}",
                    state,
                    {"active_traversal": mode},
                )
                continue

            _append_step(
                steps,
                name or "unknown",
                "error",
                f"Unsupported {title.lower()} operation: '{name}'.",
                _build_balanced_btree_state(values, variant, order),
            )

        final = _build_balanced_btree_state(values, variant, order)
        return {
            "result": {"keys": final["keys"]},
            "steps": steps,
            "metrics": _base_metrics(final["size"], len(ops)),
        }

    return run_btree


STACK_CODE = """class ArrayStack:\n    def __init__(self, capacity):\n        self.capacity = capacity\n        self.data = []\n\n    def push(self, value):\n        if len(self.data) >= self.capacity:\n            raise OverflowError('stack full')\n        self.data.append(value)\n\n    def pop(self):\n        if not self.data:\n            raise IndexError('stack empty')\n        return self.data.pop()\n\n    def peek(self):\n        return self.data[-1] if self.data else None\n"""

QUEUE_CODE = """from collections import deque\n\nclass CircularQueue:\n    def __init__(self, capacity):\n        self.capacity = capacity\n        self.q = deque()\n\n    def enqueue(self, value):\n        if len(self.q) >= self.capacity:\n            raise OverflowError('queue full')\n        self.q.append(value)\n\n    def dequeue(self):\n        if not self.q:\n            raise IndexError('queue empty')\n        return self.q.popleft()\n"""

LINKED_LIST_CODE = """class Node:\n    def __init__(self, value):\n        self.value = value\n        self.next = None\n\nclass SinglyLinkedList:\n    def __init__(self):\n        self.head = None\n\n    def insert_end(self, value):\n        node = Node(value)\n        if self.head is None:\n            self.head = node\n            return\n        cur = self.head\n        while cur.next is not None:\n            cur = cur.next\n        cur.next = node\n"""

TREE_CODE = """class BSTNode:\n    def __init__(self, value):\n        self.value = value\n        self.left = None\n        self.right = None\n\ndef insert(root, value):\n    if root is None:\n        return BSTNode(value)\n    if value < root.value:\n        root.left = insert(root.left, value)\n    elif value > root.value:\n        root.right = insert(root.right, value)\n    return root\n"""


def _spec(
    name: str,
    display_name: str,
    category: str,
    description: str,
    complexity: Dict[str, Any],
    code: str,
    run_fn,
) -> Dict[str, Any]:
    return {
        "name": name,
        "display_name": display_name,
        "category": category,
        "description": description,
        "code": code,
        "complexity": complexity,
        "theory": {
            "use_cases": ["Interactive visualization", "Learning data-structure operations"],
            "limitations": ["Operation cost depends on implementation and workload"],
            "optimization_tips": ["Choose the right structure variant for access/update patterns"],
        },
        "run": run_fn,
    }


ALGORITHMS: Dict[str, Dict[str, Any]] = {
    "array_stack": _spec(
        "array_stack",
        "Array Stack",
        "stack",
        "LIFO stack backed by a fixed-capacity array.",
        {"best_time": "O(1)", "average_time": "O(1)", "worst_time": "O(1)", "space": "O(n)", "paradigm": "Data Structure", "stable": False},
        STACK_CODE,
        run_array_stack,
    ),
    "linked_stack": _spec(
        "linked_stack",
        "Linked List Stack",
        "stack",
        "LIFO stack backed by dynamic linked nodes.",
        {"best_time": "O(1)", "average_time": "O(1)", "worst_time": "O(1)", "space": "O(n)", "paradigm": "Data Structure", "stable": False},
        STACK_CODE,
        run_linked_stack,
    ),
    "linear_queue": _spec(
        "linear_queue",
        "Linear Queue",
        "queue",
        "FIFO queue with fixed capacity and shifting front.",
        {"best_time": "O(1)", "average_time": "O(1)", "worst_time": "O(n)", "space": "O(n)", "paradigm": "Data Structure", "stable": False},
        QUEUE_CODE,
        run_linear_queue,
    ),
    "circular_queue": _spec(
        "circular_queue",
        "Circular Queue",
        "queue",
        "FIFO queue with circular indexing.",
        {"best_time": "O(1)", "average_time": "O(1)", "worst_time": "O(1)", "space": "O(n)", "paradigm": "Data Structure", "stable": False},
        QUEUE_CODE,
        run_circular_queue,
    ),
    "deque": _spec(
        "deque",
        "Deque",
        "queue",
        "Double-ended queue supporting front and rear updates.",
        {"best_time": "O(1)", "average_time": "O(1)", "worst_time": "O(1)", "space": "O(n)", "paradigm": "Data Structure", "stable": False},
        QUEUE_CODE,
        run_deque,
    ),
    "priority_queue": _spec(
        "priority_queue",
        "Priority Queue",
        "queue",
        "Queue where highest-priority elements are served first.",
        {"best_time": "O(log n)", "average_time": "O(log n)", "worst_time": "O(log n)", "space": "O(n)", "paradigm": "Data Structure", "stable": False},
        QUEUE_CODE,
        run_priority_queue,
    ),
    "singly_linked_list": _spec(
        "singly_linked_list",
        "Singly Linked List",
        "linked_list",
        "Linear linked nodes with one next pointer.",
        {"best_time": "O(1)", "average_time": "O(n)", "worst_time": "O(n)", "space": "O(n)", "paradigm": "Data Structure", "stable": False},
        LINKED_LIST_CODE,
        _linked_list_runner("singly_linked_list"),
    ),
    "doubly_linked_list": _spec(
        "doubly_linked_list",
        "Doubly Linked List",
        "linked_list",
        "Linked nodes with next and prev pointers.",
        {"best_time": "O(1)", "average_time": "O(n)", "worst_time": "O(n)", "space": "O(n)", "paradigm": "Data Structure", "stable": False},
        LINKED_LIST_CODE,
        _linked_list_runner("doubly_linked_list"),
    ),
    "circular_singly_linked_list": _spec(
        "circular_singly_linked_list",
        "Circular Singly Linked List",
        "linked_list",
        "Singly linked list where tail points back to head.",
        {"best_time": "O(1)", "average_time": "O(n)", "worst_time": "O(n)", "space": "O(n)", "paradigm": "Data Structure", "stable": False},
        LINKED_LIST_CODE,
        _linked_list_runner("circular_singly_linked_list"),
    ),
    "circular_doubly_linked_list": _spec(
        "circular_doubly_linked_list",
        "Circular Doubly Linked List",
        "linked_list",
        "Doubly linked list where head and tail are connected.",
        {"best_time": "O(1)", "average_time": "O(n)", "worst_time": "O(n)", "space": "O(n)", "paradigm": "Data Structure", "stable": False},
        LINKED_LIST_CODE,
        _linked_list_runner("circular_doubly_linked_list"),
    ),
    "binary_tree": _spec(
        "binary_tree",
        "Binary Tree",
        "tree",
        "General binary tree modeled in level-order form.",
        {"best_time": "O(1)", "average_time": "O(log n)", "worst_time": "O(n)", "space": "O(n)", "paradigm": "Data Structure", "stable": False},
        TREE_CODE,
        run_binary_tree,
    ),
    "binary_search_tree": _spec(
        "binary_search_tree",
        "Binary Search Tree",
        "tree",
        "Ordered binary tree with left<root<right invariant.",
        {"best_time": "O(log n)", "average_time": "O(log n)", "worst_time": "O(n)", "space": "O(n)", "paradigm": "Data Structure", "stable": False},
        TREE_CODE,
        run_bst,
    ),
    "avl_tree": _spec(
        "avl_tree",
        "AVL Tree",
        "tree",
        "Self-balancing BST that rotates to keep height logarithmic.",
        {"best_time": "O(log n)", "average_time": "O(log n)", "worst_time": "O(log n)", "space": "O(n)", "paradigm": "Data Structure", "stable": False},
        TREE_CODE,
        run_avl_tree,
    ),
    "b_tree": _spec(
        "b_tree",
        "B-Tree",
        "tree",
        "Balanced multi-way search tree that keeps keys sorted in each node.",
        {"best_time": "O(log n)", "average_time": "O(log n)", "worst_time": "O(log n)", "space": "O(n)", "paradigm": "Data Structure", "stable": False},
        TREE_CODE,
        _btree_runner("b_tree"),
    ),
    "b_plus_tree": _spec(
        "b_plus_tree",
        "B+ Tree",
        "tree",
        "Disk-friendly multi-way index where data keys live in linked leaves.",
        {"best_time": "O(log n)", "average_time": "O(log n)", "worst_time": "O(log n)", "space": "O(n)", "paradigm": "Data Structure", "stable": False},
        TREE_CODE,
        _btree_runner("b_plus_tree"),
    ),
    "min_heap": _spec(
        "min_heap",
        "Min Heap",
        "tree",
        "Complete binary tree where parent is <= children.",
        {"best_time": "O(1)", "average_time": "O(log n)", "worst_time": "O(log n)", "space": "O(n)", "paradigm": "Data Structure", "stable": False},
        TREE_CODE,
        _heap_runner("min_heap"),
    ),
    "max_heap": _spec(
        "max_heap",
        "Max Heap",
        "tree",
        "Complete binary tree where parent is >= children.",
        {"best_time": "O(1)", "average_time": "O(log n)", "worst_time": "O(log n)", "space": "O(n)", "paradigm": "Data Structure", "stable": False},
        TREE_CODE,
        _heap_runner("max_heap"),
    ),
    "trie": _spec(
        "trie",
        "Trie",
        "tree",
        "Prefix tree for fast word and prefix lookup.",
        {"best_time": "O(1)", "average_time": "O(k)", "worst_time": "O(k)", "space": "O(total_chars)", "paradigm": "Data Structure", "stable": False},
        TREE_CODE,
        run_trie,
    ),
}
