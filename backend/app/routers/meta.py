"""
Metadata endpoint describing the five option types, so the frontend's
"pick an option type" step can drive its form fields and which bento
boxes to show without hardcoding this list twice.
"""

from fastapi import APIRouter

router = APIRouter(prefix="/api/meta", tags=["meta"])

OPTION_TYPES = [
    {
        "id": "european",
        "label": "European",
        "base_params": ["S", "K", "T", "r", "sigma"],
        "extra_params": ["model"],   # 'black_scholes' | 'binomial' | 'montecarlo'
        "has_greeks": True,
        "has_implied_vol": True,
    },
    {
        "id": "american",
        "label": "American",
        "base_params": ["S", "K", "T", "r", "sigma"],
        "extra_params": [],
        "has_greeks": False,
        "has_implied_vol": False,
    },
    {
        "id": "asian",
        "label": "Asian",
        "base_params": ["S", "K", "T", "r", "sigma"],
        "extra_params": ["average"],   # 'arithmetic' | 'geometric'
        "has_greeks": False,
        "has_implied_vol": False,
    },
    {
        "id": "barrier",
        "label": "Barrier",
        "base_params": ["S", "K", "T", "r", "sigma"],
        "extra_params": ["H", "barrier_type"],   # barrier_type: down-and-out | down-and-in | up-and-out | up-and-in
        "has_greeks": False,
        "has_implied_vol": False,
    },
    {
        "id": "lookback",
        "label": "Lookback",
        "base_params": ["S", "K", "T", "r", "sigma"],
        "extra_params": ["strike_type"],   # 'floating' | 'fixed'
        "has_greeks": False,
        "has_implied_vol": False,
    },
]


@router.get("/option-types")
def get_option_types():
    return OPTION_TYPES