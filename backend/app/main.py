import matplotlib
matplotlib.use("Agg")

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .routers import pricing, greeks, viz, meta

app = FastAPI(title="Option Pricing API")

# Adjust allow_origins to your actual React dev/prod URLs before shipping.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://option-pricing-portal.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# option_pricing raises plain ValueError for bad input (unknown model,
# invalid barrier_type, K <= 0, barrier H on the wrong side of S, etc.)
# Catch it once here instead of try/except in every single route.
@app.exception_handler(ValueError)
def value_error_handler(request: Request, exc: ValueError):
    return JSONResponse(status_code=400, content={"detail": str(exc)})


app.include_router(meta.router)
app.include_router(pricing.router)
app.include_router(greeks.router)
app.include_router(viz.router)


@app.get("/api/health")
def health():
    return {"status": "ok"}