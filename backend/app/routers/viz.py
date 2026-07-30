"""
Visualization endpoints — one route per plot type. Matplotlib-based plots
return a base64 PNG via fig_to_base64; VolatilitySurface.surface() is the
one exception, returning a Plotly figure serialized with to_json().
"""

from fastapi import APIRouter

from option_pricing import (
    PriceHeatmap,
    PricingCurves,
    GreeksProfile,
    ConvergenceAnalysis,
    MonteCarloVisualization,
    PayoffDiagram,
    AsianPayoff,
    BarrierPayoff,
    LookbackPayoff,
    VolatilitySurface,
)

from ..utils.figures import fig_to_base64

router = APIRouter(prefix="/api/viz", tags=["visualization"])


# ---------------- Heatmap ----------------

@router.get("/heatmap")
def viz_heatmap(S: float, K: float, T: float, r: float, sigma: float, option: str = "call"):
    fig = PriceHeatmap(S, K, T, r, sigma).plot(option)
    return {"image": fig_to_base64(fig)}


# ---------------- Pricing curves ----------------

@router.get("/pricing-curve/stock")
def viz_pricing_curve_stock(S: float, K: float, T: float, r: float, sigma: float):
    fig = PricingCurves(S, K, T, r, sigma).plot("stock")
    return {"image": fig_to_base64(fig)}


@router.get("/pricing-curve/volatility")
def viz_pricing_curve_volatility(S: float, K: float, T: float, r: float, sigma: float):
    fig = PricingCurves(S, K, T, r, sigma).plot("volatility")
    return {"image": fig_to_base64(fig)}


@router.get("/pricing-curve/time")
def viz_pricing_curve_time(S: float, K: float, T: float, r: float, sigma: float):
    fig = PricingCurves(S, K, T, r, sigma).plot("time")
    return {"image": fig_to_base64(fig)}


@router.get("/pricing-curve/rate")
def viz_pricing_curve_rate(S: float, K: float, T: float, r: float, sigma: float):
    fig = PricingCurves(S, K, T, r, sigma).plot("rate")
    return {"image": fig_to_base64(fig)}


# ---------------- Greeks profile ----------------

@router.get("/greeks-profile/delta")
def viz_greeks_delta(S: float, K: float, T: float, r: float, sigma: float):
    fig = GreeksProfile(S, K, T, r, sigma).plot("delta")
    return {"image": fig_to_base64(fig)}


@router.get("/greeks-profile/gamma")
def viz_greeks_gamma(S: float, K: float, T: float, r: float, sigma: float):
    fig = GreeksProfile(S, K, T, r, sigma).plot("gamma")
    return {"image": fig_to_base64(fig)}


@router.get("/greeks-profile/theta")
def viz_greeks_theta(S: float, K: float, T: float, r: float, sigma: float):
    fig = GreeksProfile(S, K, T, r, sigma).plot("theta")
    return {"image": fig_to_base64(fig)}


@router.get("/greeks-profile/vega")
def viz_greeks_vega(S: float, K: float, T: float, r: float, sigma: float):
    fig = GreeksProfile(S, K, T, r, sigma).plot("vega")
    return {"image": fig_to_base64(fig)}


@router.get("/greeks-profile/rho")
def viz_greeks_rho(S: float, K: float, T: float, r: float, sigma: float):
    fig = GreeksProfile(S, K, T, r, sigma).plot("rho")
    return {"image": fig_to_base64(fig)}


# ---------------- Convergence ----------------

@router.get("/convergence/monte-carlo")
def viz_convergence_mc(S: float, K: float, T: float, r: float, sigma: float):
    # Capped at 20,000 paths for this deployment: the package default (up to
    # 100,000) allocates several (252, M) float arrays each (~200MB+ at
    # M=100000) inside a single request, which was OOM-killing this
    # memory-constrained Railway container and crashing the whole backend
    # process. Left as the package's own default for other consumers of
    # option_pricing — this cap is portal-specific.
    fig = ConvergenceAnalysis(S, K, T, r, sigma).plot("mc", mc_path_counts=[100, 500, 1000, 5000, 10000, 20000])
    return {"image": fig_to_base64(fig)}


@router.get("/convergence/binomial")
def viz_convergence_binomial(S: float, K: float, T: float, r: float, sigma: float):
    fig = ConvergenceAnalysis(S, K, T, r, sigma).plot("binomial")
    return {"image": fig_to_base64(fig)}


# ---------------- Monte Carlo paths / distribution ----------------

@router.get("/montecarlo/paths")
def viz_mc_paths(S: float, K: float, T: float, r: float, sigma: float, N: int, M: int, num_paths: int = 50):
    fig = MonteCarloVisualization(S, K, T, r, sigma, N, M).plot("paths", num_paths=num_paths)
    return {"image": fig_to_base64(fig)}


@router.get("/montecarlo/distribution")
def viz_mc_distribution(S: float, K: float, T: float, r: float, sigma: float, N: int, M: int):
    fig = MonteCarloVisualization(S, K, T, r, sigma, N, M).plot("distribution")
    return {"image": fig_to_base64(fig)}


@router.get("/montecarlo/barrier-paths")
def viz_mc_barrier_paths(
    S: float, K: float, T: float, r: float, sigma: float, N: int, M: int,
    H: float, barrier_type: str, num_paths: int = 50,
):
    fig = MonteCarloVisualization(S, K, T, r, sigma, N, M).plot(
        "barrier", num_paths=num_paths, H=H, barrier_type=barrier_type
    )
    return {"image": fig_to_base64(fig)}


@router.get("/montecarlo/lookback-paths")
def viz_mc_lookback_paths(S: float, K: float, T: float, r: float, sigma: float, N: int, M: int, num_paths: int = 10):
    fig = MonteCarloVisualization(S, K, T, r, sigma, N, M).plot("lookback", num_paths=num_paths)
    return {"image": fig_to_base64(fig)}


@router.get("/montecarlo/asian-average")
def viz_mc_asian_average(S: float, K: float, T: float, r: float, sigma: float, N: int, M: int, num_paths: int = 10):
    fig = MonteCarloVisualization(S, K, T, r, sigma, N, M).plot("asian", num_paths=num_paths)
    return {"image": fig_to_base64(fig)}


# ---------------- Payoff diagrams ----------------

@router.get("/payoff/call")
def viz_payoff_call(K: float, premium: float = 0):
    fig = PayoffDiagram(K, premium).call()
    return {"image": fig_to_base64(fig)}


@router.get("/payoff/put")
def viz_payoff_put(K: float, premium: float = 0):
    fig = PayoffDiagram(K, premium).put()
    return {"image": fig_to_base64(fig)}


@router.get("/payoff/both")
def viz_payoff_both(K: float, premium: float = 0):
    fig = PayoffDiagram(K, premium).both()
    return {"image": fig_to_base64(fig)}


@router.get("/payoff/asian")
def viz_payoff_asian(S: float, K: float, T: float, r: float, sigma: float, average: str = "arithmetic"):
    fig = AsianPayoff(S, K, T, r, sigma).plot(average)
    return {"image": fig_to_base64(fig)}


@router.get("/payoff/barrier")
def viz_payoff_barrier(S: float, K: float, T: float, r: float, sigma: float, H: float, barrier_type: str):
    fig = BarrierPayoff(S, K, T, r, sigma).plot(H, barrier_type)
    return {"image": fig_to_base64(fig)}


@router.get("/payoff/lookback")
def viz_payoff_lookback(S: float, K: float, T: float, r: float, sigma: float, strike_type: str = "floating"):
    fig = LookbackPayoff(S, K, T, r, sigma).plot(strike_type)
    return {"image": fig_to_base64(fig)}


# ---------------- Volatility smile / surface ----------------
# VolatilitySurface hits yfinance live — noticeably slower than the closed-form
# and simulation-based routes above. Worth a frontend loading state or a
# server-side TTL cache if this gets hit often.

@router.get("/volatility/smile")
def viz_vol_smile(ticker: str, r: float, expiry: str):
    fig = VolatilitySurface(ticker, r).smile(expiry)
    if fig is None:
        return {"image": None, "message": f"No data for expiry {expiry}"}
    return {"image": fig_to_base64(fig)}


@router.get("/volatility/surface")
def viz_vol_surface(ticker: str, r: float, num_expiries: int = 30):
    fig = VolatilitySurface(ticker, r).surface(num_expiries)
    if fig is None:
        return {"figure": None, "message": "No data available."}
    # Plotly figure, not matplotlib — React renders this with react-plotly.js, not <img>.
    return {"figure": fig.to_json()}