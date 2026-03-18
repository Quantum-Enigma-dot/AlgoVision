from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import algorithms, compare, health, run, theory, ai, benchmark, playground, codeviz, algo_visualize

app = FastAPI(title="AlgoVision API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api")
app.include_router(algorithms.router, prefix="/api")
app.include_router(run.router, prefix="/api")
app.include_router(compare.router, prefix="/api")
app.include_router(theory.router, prefix="/api")
app.include_router(ai.router, prefix="/api")
app.include_router(benchmark.router, prefix="/api")
app.include_router(playground.router, prefix="/api")
app.include_router(codeviz.router, prefix="/api")
app.include_router(algo_visualize.router, prefix="/api")

