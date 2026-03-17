# AlgoVision - Interactive Algorithm Analyzer & Optimizer

AlgoVision is a polished mini project for Design and Analysis of Algorithms. It visualizes algorithm execution step by step, compares performance, and bridges theory with real-world behavior. The stack is intentionally simple: a React dashboard with D3 visualizations and a FastAPI backend that returns structured traces.

## Features
- Interactive analyzer with step controls, speed slider, and live metrics
- Sorting, graph, DP, and string-matching visualizations
- Side-by-side algorithm comparison with charts
- Theory cards with complexity, use cases, and optimization tips
- Export results and keep local run history
- Dark/light mode toggle and responsive layout

## Tech Stack
**Frontend:** React (Vite), Tailwind CSS, React Router, Monaco Editor, D3, Axios
**Backend:** FastAPI, Uvicorn, Pydantic

## Folder Structure
```
AlgoVision/
  client/
    src/
      components/
      pages/
      layouts/
      hooks/
      services/
      utils/
      data/
    public/
  server/
    app/
      routes/
      schemas/
      algorithms/
        sorting/
        graph/
        dp/
        string_matching/
      services/
    tests/
  README.md
```

## Setup
### Backend
```bash
cd server
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

### Frontend
```bash
cd client
npm install
```

## Run
### Backend
```bash
cd server
.venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd client
npm run dev
```

Open http://localhost:5173

## API Overview
- `GET /api/health`
- `GET /api/algorithms`
- `POST /api/run`
- `POST /api/compare`
- `GET /api/theory/{algorithm_name}`

Example `POST /api/run`:
```json
{
  "category": "sorting",
  "algorithm": "quick_sort",
  "input": {"array": [5, 1, 4, 2, 8]},
  "options": {"track_steps": true}
}
```

## Screenshots
- Home dashboard (placeholder)
- Analyzer view (placeholder)
- Comparison view (placeholder)
- Theory card (placeholder)

## Tests
```bash
cd server
.venv\Scripts\activate
pytest
```

## Future Enhancements
- Additional algorithm categories and visual presets
- Better graph layout controls
- Advanced statistical benchmarking
- Export charts as images
