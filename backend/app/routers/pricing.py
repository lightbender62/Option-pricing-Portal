"""
Pricing endpoints — one route per option type, matching the five public
classes exported from option_pricing: EuropeanOption, AmericanOption,
AsianOption, BarrierOption, LookbackOption.
"""

from fastapi import APIRouter

from option_pricing import EuropeanOption, AmericanOption, AsianOption, BarrierOption, LookbackOption

router = APIRouter(prefix="/api/price", tags=["pricing"])


@router.get("/european")
def price_european(
    S: float, K: float, T: float, r: float, sigma: float,
    model: str = "black_scholes", steps: int = 100, paths: int = 2000,
):
    """model: 'black_scholes' | 'binomial' | 'montecarlo'"""
    opt = EuropeanOption(S, K, T, r, sigma)
    return {
        "call": opt.call(model=model, steps=steps, paths=paths),
        "put": opt.put(model=model, steps=steps, paths=paths),
    }


@router.get("/american")
def price_american(S: float, K: float, T: float, r: float, sigma: float, steps: int = 500):
    """Priced via Binomial Tree with early exercise — no model switch, unlike European."""
    opt = AmericanOption(S, K, T, r, sigma)
    return {
        "call": opt.call(steps=steps),
        "put": opt.put(steps=steps),
    }


@router.get("/asian")
def price_asian(
    S: float, K: float, T: float, r: float, sigma: float,
    average: str = "arithmetic", steps: int = 100, paths: int = 100000,
):
    """average: 'arithmetic' | 'geometric'"""
    opt = AsianOption(S, K, T, r, sigma)
    return {
        "call": opt.call(average=average, steps=steps, paths=paths),
        "put": opt.put(average=average, steps=steps, paths=paths),
    }


@router.get("/barrier")
def price_barrier(
    S: float, K: float, T: float, r: float, sigma: float,
    H: float, barrier_type: str, steps: int = 100, paths: int = 100000,
):
    """
    barrier_type: 'down-and-out' | 'down-and-in' | 'up-and-out' | 'up-and-in'
    H is required at construction, unlike the other four option types.
    """
    opt = BarrierOption(S, K, T, r, sigma, H, barrier_type)
    return {
        "call": opt.call(steps=steps, paths=paths),
        "put": opt.put(steps=steps, paths=paths),
    }


@router.get("/lookback")
def price_lookback(
    S: float, K: float, T: float, r: float, sigma: float,
    strike_type: str = "floating", steps: int = 100, paths: int = 100000,
):
    """strike_type: 'floating' | 'fixed'"""
    opt = LookbackOption(S, K, T, r, sigma)
    return {
        "call": opt.call(strike_type=strike_type, steps=steps, paths=paths),
        "put": opt.put(strike_type=strike_type, steps=steps, paths=paths),
    }