"""
Greeks + implied volatility endpoints.

Only EuropeanOption exposes greeks()/implied_vol() in this package —
American, Asian, Barrier, and Lookback do not. The frontend should hide
the Greeks/IV bento boxes for any option type other than European.
"""

from fastapi import APIRouter

from option_pricing import EuropeanOption

router = APIRouter(prefix="/api/greeks", tags=["greeks"])


@router.get("")
def get_greeks(S: float, K: float, T: float, r: float, sigma: float):
    return EuropeanOption(S, K, T, r, sigma).greeks()


@router.get("/implied-volatility")
def implied_volatility(
    S: float, K: float, T: float, r: float, sigma: float,
    call_price: float = None, put_price: float = None,
):
    opt = EuropeanOption(S, K, T, r, sigma)
    result = opt.implied_vol(call_price=call_price, put_price=put_price)

    if call_price is not None and put_price is not None:
        iv_call, iv_put = result
        return {"iv_call": iv_call, "iv_put": iv_put}
    elif call_price is not None:
        return {"iv_call": result}
    else:
        return {"iv_put": result}