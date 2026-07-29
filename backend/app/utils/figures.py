import io
import base64

import matplotlib.pyplot as plt


def fig_to_base64(fig, fmt: str = "png", dpi: int = 150) -> str:
    """Convert a matplotlib Figure into a data-URI string for JSON responses."""
    buf = io.BytesIO()
    fig.savefig(buf, format=fmt, dpi=dpi, bbox_inches="tight")
    buf.seek(0)
    encoded = base64.b64encode(buf.read()).decode("utf-8")
    plt.close(fig)  # prevent figures piling up in memory on a long-running server
    return f"data:image/{fmt};base64,{encoded}"