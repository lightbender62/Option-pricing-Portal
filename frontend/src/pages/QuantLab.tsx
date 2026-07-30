import { useState } from "react";
import {
  TrendingUp,
  Layers,
  Waves,
  ShieldAlert,
  Eye,
  Loader2,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import { NeobrutalistCard } from "../components/NeobrutalistCard";

const API_BASE =
  import.meta.env.VITE_API_URL ??
  "http://localhost:8000";

type OptionType = "european" | "american" | "asian" | "barrier" | "lookback";
type TabKey =
  | "payoff"
  | "paths"
  | "binomial-convergence"
  | "mc-convergence"
  | "heatmap-call"
  | "heatmap-put";
type Page = "config" | "results";

interface Params {
  S: string;
  K: string;
  T: string;
  r: string;
  sigma: string;
  H: string;
  barrier_type: string;
  strike_type: string;
}

interface ModelDef {
  key: string;
  label: string;
  summary: string;
}

interface VizCardDef {
  tab: TabKey;
  title: string;
}

const DEFAULT_PARAMS: Params = {
  S: "100",
  K: "100",
  T: "1",
  r: "0.05",
  sigma: "0.2",
  H: "120",
  barrier_type: "up-and-out",
  strike_type: "floating",
};

const OPTION_CARDS: {
  id: OptionType;
  label: string;
  description: string;
  icon: React.ElementType;
}[] = [
    { id: "european", label: "European", description: "Exercisable only at expiration", icon: TrendingUp },
    { id: "american", label: "American", description: "Early exercise, priced via Binomial Tree", icon: Layers },
    { id: "asian", label: "Asian", description: "Payoff depends on the average price", icon: Waves },
    { id: "barrier", label: "Barrier", description: "Activates or extinguishes at a barrier level", icon: ShieldAlert },
    { id: "lookback", label: "Lookback", description: "Payoff depends on the path's min/max", icon: Eye },
  ];

const MODEL_CONFIG: Record<OptionType, ModelDef[]> = {
  european: [
    { key: "black_scholes", label: "Black-Scholes", summary: "Closed-form analytical solution" },
    { key: "binomial", label: "Binomial Tree", summary: "Lattice-based numerical method" },
    { key: "montecarlo", label: "Monte Carlo", summary: "Simulation-based pricing" },
  ],
  american: [
    { key: "binomial", label: "Binomial Tree", summary: "Supports early exercise, no closed form exists" },
  ],
  asian: [
    {
      key: "arithmetic",
      label: "Arithmetic MC",
      summary: "Monte Carlo using arithmetic averaging",
    },
    {
      key: "geometric",
      label: "Geometric MC",
      summary: "Monte Carlo using geometric averaging",
    },
  ],
  barrier: [
    { key: "montecarlo", label: "Monte Carlo", summary: "Simulated barrier-crossing payoff" },
  ],
  lookback: [
    { key: "montecarlo", label: "Monte Carlo", summary: "Simulated path min/max payoff" },
  ],
};

// Which visualization cards are applicable per option type, and what to title them.
// Reuses the existing buildVizRequest() tabs ("payoff" / "convergence") as the data source.
const VIZ_CARDS: Record<OptionType, VizCardDef[]> = {
  european: [
    { tab: "payoff", title: "Payoff Diagram" },
    { tab: "paths", title: "Monte Carlo Simuulations" },
    { tab: "binomial-convergence", title: "Binomial Convergence" },
    { tab: "mc-convergence", title: "Monte Carlo Convergence" },
    { tab: "heatmap-call", title: "Call Price Heatmap" },
    { tab: "heatmap-put", title: "Put Price Heatmap" },
  ],
  american: [],
  asian: [
    { tab: "payoff", title: "Payoff Diagram" },
    { tab: "paths", title: "Average Price Paths" },
  ],
  barrier: [
    { tab: "payoff", title: "Payoff Diagram" },
    { tab: "paths", title: "Barrier Paths" },
  ],
  lookback: [
    { tab: "payoff", title: "Payoff Diagram" },
    { tab: "paths", title: "Lookback Paths" },
  ],
};

function errMsg(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

async function fetchJSON(path: string, query: Record<string, unknown>) {
  const qs = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
  });
  const start = performance.now();
  const res = await fetch(`${API_BASE}${path}?${qs.toString()}`);
  const ms = Math.round(performance.now() - start);
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const detail = data && typeof data === "object" && "detail" in data ? (data as any).detail : `Request failed (${res.status})`;
    throw new Error(typeof detail === "string" ? detail : JSON.stringify(detail));
  }
  return { data, ms };
}

function priceExtraParams(type: OptionType, modelKey: string, p: Params): Record<string, unknown> {
  if (type === "european") return { model: modelKey };
  if (type === "barrier") return { H: p.H, barrier_type: p.barrier_type };
  if (type === "lookback") return { strike_type: p.strike_type };
  if (type === "asian")
    return {
      average: modelKey === "geometric"
        ? "geometric"
        : "arithmetic",
    };
  return {};
}

function buildVizRequest(
  type: OptionType,
  tab: TabKey,
  p: Params
): { path: string; params: Record<string, unknown>; kind: "image" | "multi-image" | "plotly" } | null {
  const base = { S: p.S, K: p.K, T: p.T, r: p.r, sigma: p.sigma };

  if (tab === "payoff") {
    if (type === "european" || type === "american") return { path: "/api/viz/payoff/both", params: { K: p.K }, kind: "image" };
    if (type === "asian") return { path: "/api/viz/payoff/asian", params: { ...base, average: "arithmetic" }, kind: "image" };
    if (type === "barrier") return { path: "/api/viz/payoff/barrier", params: { ...base, H: p.H, barrier_type: p.barrier_type }, kind: "image" };
    if (type === "lookback") return { path: "/api/viz/payoff/lookback", params: { ...base, strike_type: p.strike_type }, kind: "image" };
  }

  if (tab === "paths") {
    const mc = { ...base, N: 100, M: 2000 };
    if (type === "european") return { path: "/api/viz/montecarlo/paths", params: mc, kind: "image" };
    if (type === "asian") return { path: "/api/viz/montecarlo/asian-average", params: mc, kind: "image" };
    if (type === "barrier") return { path: "/api/viz/montecarlo/barrier-paths", params: { ...mc, H: p.H, barrier_type: p.barrier_type }, kind: "image" };
    if (type === "lookback") return { path: "/api/viz/montecarlo/lookback-paths", params: mc, kind: "image" };
    return null; // American has no Monte Carlo path viz
  }
  if (tab === "binomial-convergence") {
    if (type === "european" || type === "american")
      return {
        path: "/api/viz/convergence/binomial",
        params: base,
        kind: "image",
      };

    return null; // Binomial convergence only for vanilla options
  }

  if (tab === "mc-convergence") {
    if (type === "european")
      return {
        path: "/api/viz/convergence/monte-carlo",
        params: base,
        kind: "image",
      };

    return null; // MC convergence only for European
  }

  if (tab === "heatmap-call") {
    if (type === "european")
      return {
        path: "/api/viz/heatmap",
        params: {
          ...base,
          option: "call",
        },
        kind: "image",
      };

    return null;
  }

  if (tab === "heatmap-put") {
    if (type === "european")
      return {
        path: "/api/viz/heatmap",
        params: {
          ...base,
          option: "put",
        },
        kind: "image",
      };

    return null;
  }

  return null;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-navy-light">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "rounded-xl border-2 border-navy bg-cream px-3 py-2 text-navy font-mono text-sm focus:outline-none focus:ring-2 focus:ring-gold";

function NumberValue({ value, suffix }: { value: number | null | undefined; suffix?: string }) {
  if (value === null || value === undefined || Number.isNaN(value)) return <span>&mdash;</span>;
  return (
    <span>
      {value.toFixed(4)}
      {suffix}
    </span>
  );
}

function CardSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <div className="h-5 w-32 rounded bg-navy/10" />

      <div className="flex justify-between">
        <div className="h-4 w-10 rounded bg-navy/10" />
        <div className="h-4 w-20 rounded bg-navy/10" />
      </div>

      <div className="flex justify-between">
        <div className="h-4 w-10 rounded bg-navy/10" />
        <div className="h-4 w-20 rounded bg-navy/10" />
      </div>

      <div className="flex justify-between mt-2">
        <div className="h-3 w-12 rounded bg-navy/10" />
        <div className="h-3 w-12 rounded bg-navy/10" />
      </div>
    </div>
  );
}
function GreeksSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border-2 border-navy bg-white p-3 animate-pulse"
        >
          <div className="h-3 w-16 rounded bg-navy/10 mb-3" />
          <div className="h-5 w-20 rounded bg-navy/10" />
        </div>
      ))}
    </div>
  );
}

function ErrorBlock({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2 text-accent-peach">
      <AlertTriangle size={18} className="mt-0.5 flex-shrink-0" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

// Renders a single, independent visualization card. It reads its own slice of
// vizData/vizLoading/vizError (keyed by `${optionType}:${tab}`) and never
// affects any other card if its fetch is loading, empty, or failed.
function VisualizationCard({
  title,
  loading,
  error,
  data,
}: {
  title: string;
  loading: boolean;
  error: string;
  data: any;
}) {
  return (
    <NeobrutalistCard bgColor="bg-white" hoverEffect={false} className="flex flex-col gap-4">
      <h3 className="text-xl font-display font-bold text-navy">{title}</h3>
      <div className="h-[380px] flex items-center justify-center overflow-hidden">
        {loading ? (
          <div className="flex items-center gap-2 text-navy-light">
            <Loader2 size={20} className="animate-spin" />
            Loading visualization...
          </div>
        ) : error ? (
          <ErrorBlock message={error} />
        ) : data?.kind === "image" && data.image ? (
          <img src={data.image} alt={title} className="max-w-full rounded-xl border-2 border-navy" />
        ) : data?.kind === "multi-image" ? (
          <div className="grid md:grid-cols-2 gap-4 w-full">
            {data.images.map((img: string, i: number) => (
              <img key={i} src={img} alt={`${title}-${i}`} className="rounded-xl border-2 border-navy" />
            ))}
          </div>
        ) : data?.message ? (
          <p className="text-sm text-navy-light">{data.message}</p>
        ) : (
          <p className="text-sm text-navy-light">Run a simulation to see this visualization.</p>
        )}
      </div>
    </NeobrutalistCard>
  );
}

export default function QuantLab(_props: { prefills?: Record<string, unknown>; clearPrefills?: () => void }) {
  const [page, setPage] = useState<Page>("config");
  const [optionType, setOptionType] = useState<OptionType>("european");
  const [params, setParams] = useState<Params>(DEFAULT_PARAMS);

  const [priceResults, setPriceResults] = useState<Record<string, { call: number; put: number; ms: number }>>({});
  const [priceLoading, setPriceLoading] = useState<Record<string, boolean>>({});
  const [priceError, setPriceError] = useState<Record<string, string>>({});

  const [greeks, setGreeks] = useState<Record<string, number> | null>(null);
  const [greeksLoading, setGreeksLoading] = useState(false);
  const [greeksError, setGreeksError] = useState<string | null>(null);

  const [vizData, setVizData] = useState<Record<string, any>>({});
  const [vizLoading, setVizLoading] = useState<Record<string, boolean>>({});
  const [vizError, setVizError] = useState<Record<string, string>>({});

  const [execStatus, setExecStatus] = useState<"idle" | "online" | "offline">("idle");
  const [execLatency, setExecLatency] = useState<number | null>(null);
  const [lastSolver, setLastSolver] = useState<string>("&mdash;");

  const isBusy = Object.values(priceLoading).some(Boolean) || greeksLoading;

  const updateParam = (key: keyof Params, value: string) => setParams((p) => ({ ...p, [key]: value }));

  // Fetches a single visualization card's data for the given option type + tab.
  // Independent per cacheKey: a failure or in-flight request here never touches
  // any other card's state.
  const loadTab = async (tab: TabKey, type: OptionType = optionType) => {
    const cacheKey = `${type}:${tab}`;

    const req = buildVizRequest(type, tab, params);
    if (!req) {
      setVizError((v) => ({ ...v, [cacheKey]: "Not applicable for this option type." }));
      return;
    }

    setVizLoading((v) => ({ ...v, [cacheKey]: true }));
    setVizError((v) => ({ ...v, [cacheKey]: "" }));
    try {
      if (req.kind === "multi-image") {
        const paths = req.path.split(",");
        const results = await Promise.all(paths.map((p) => fetchJSON(p, req.params)));
        setVizData((v) => ({ ...v, [cacheKey]: { kind: req.kind, images: results.map((r) => r.data.image) } }));
      } else {
        const { data } = await fetchJSON(req.path, req.params);
        setVizData((v) => ({ ...v, [cacheKey]: { kind: req.kind, ...data } }));
      }
    } catch (e) {
      setVizError((v) => ({ ...v, [cacheKey]: errMsg(e) }));
    } finally {
      setVizLoading((v) => ({ ...v, [cacheKey]: false }));
    }
  };

  const runSimulation = async () => {
    setPriceResults({});
    setPriceError({});
    setGreeks(null);
    setGreeksError(null);
    setVizData({});
    setVizError({});
    setLastSolver(MODEL_CONFIG[optionType].map((m) => m.label).join(", "));

    const base = { S: params.S, K: params.K, T: params.T, r: params.r, sigma: params.sigma };

    MODEL_CONFIG[optionType].forEach((m) => {
      setPriceLoading((p) => ({ ...p, [m.key]: true }));
      fetchJSON(`/api/price/${optionType}`, { ...base, ...priceExtraParams(optionType, m.key, params) })
        .then(({ data, ms }) => setPriceResults((p) => ({ ...p, [m.key]: { ...data, ms } })))
        .catch((e) => setPriceError((p) => ({ ...p, [m.key]: errMsg(e) })))
        .finally(() => setPriceLoading((p) => ({ ...p, [m.key]: false })));
    });

    if (optionType === "european") {
      setGreeksLoading(true);
      fetchJSON("/api/greeks", base)
        .then(({ data }) => setGreeks(data))
        .catch((e) => setGreeksError(errMsg(e)))
        .finally(() => setGreeksLoading(false));
    }

    // Fetch every visualization card applicable to this option type, independently.
    for (const card of VIZ_CARDS[optionType]) {
      await loadTab(card.tab);
    }

    const start = performance.now();
    fetch(`${API_BASE}/api/health`)
      .then((res) => {
        setExecStatus(res.ok ? "online" : "offline");
        setExecLatency(Math.round(performance.now() - start));
      })
      .catch(() => setExecStatus("offline"));

    setPage("results");
  };

  const renderConfigPage = () => (
    <div className="flex flex-col gap-10">
      {/* ================= Header ================= */}
      <header className="flex flex-col items-start gap-2">
        <div>
          <h1 className="text-5xl font-display font-extrabold text-navy">Quant Lab</h1>
          <p className="mt-2 text-lg text-navy-light">Professional Option Pricing Workspace</p>
        </div>
      </header>

      {/* ================= Option Selection ================= */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {OPTION_CARDS.map((card) => {
          const selected = optionType === card.id;
          return (
            <button
              key={card.id}
              onClick={() => setOptionType(card.id)}
              className={`h-[220px] rounded-2xl border-2 p-8 text-left flex flex-col justify-center text-center gap-6 transition-all duration-200 ${selected
                ? "border-navy bg-[#F7D774] shadow-brutal scale-[1.02]"
                : "border-navy/30 bg-cream hover:border-navy hover:shadow-brutal-sm"
                }`}
            >
              <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
                <h3 className="text-2xl font-display font-bold text-navy">{card.label}</h3>
                <p className="text-sm text-navy-light">{card.description}</p>
              </div>
            </button>
          );
        })}
      </section>

      {/* ================= Input Card ================= */}
      <NeobrutalistCard bgColor="bg-white" hoverEffect={false} className="p-10 flex flex-col gap-8">
        <h2 className="text-2xl font-display font-bold text-navy">Parameters</h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-7">
          <Field label="Spot Price (S)">
            <input className={inputClass} value={params.S} onChange={(e) => updateParam("S", e.target.value)} />
          </Field>
          <Field label="Strike Price (K)">
            <input className={inputClass} value={params.K} onChange={(e) => updateParam("K", e.target.value)} />
          </Field>
          <Field label="Volatility (σ)">
            <input className={inputClass} value={params.sigma} onChange={(e) => updateParam("sigma", e.target.value)} />
          </Field>
          <Field label="Risk-Free Rate (r)">
            <input className={inputClass} value={params.r} onChange={(e) => updateParam("r", e.target.value)} />
          </Field>
          <Field label="Time to Maturity (T)">
            <input className={inputClass} value={params.T} onChange={(e) => updateParam("T", e.target.value)} />
          </Field>

          {optionType === "barrier" && (
            <>
              <Field label="Barrier Level (H)">
                <input className={inputClass} value={params.H} onChange={(e) => updateParam("H", e.target.value)} />
              </Field>
              <Field label="Barrier Type">
                <select
                  className={inputClass}
                  value={params.barrier_type}
                  onChange={(e) => updateParam("barrier_type", e.target.value)}
                >
                  <option value="up-and-out">up-and-out</option>
                  <option value="up-and-in">up-and-in</option>
                  <option value="down-and-out">down-and-out</option>
                  <option value="down-and-in">down-and-in</option>
                </select>
              </Field>
            </>
          )}

          {optionType === "lookback" && (
            <Field label="Lookback Type">
              <select
                className={inputClass}
                value={params.strike_type}
                onChange={(e) => updateParam("strike_type", e.target.value)}
              >
                <option value="floating">floating</option>
                <option value="fixed">fixed</option>
              </select>
            </Field>
          )}
        </div>

        <div className="pt-3">
          <button
            onClick={runSimulation}
            disabled={isBusy}
            className="btn-brutal-primary w-fit px-8 py-4 disabled:opacity-50"
          >
            {isBusy ? "Running..." : "Run Simulation"}
          </button>
        </div>
      </NeobrutalistCard>
    </div>
  );

  const renderResultsPage = () => (
    <div className="flex flex-col gap-10">
      {/* ================= Back Navigation ================= */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-5">
          <button
            onClick={() => setPage("config")}
            className="btn-brutal-secondary flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="h-10 w-px bg-navy/20" />

          <div>
            <h1 className="text-3xl font-display font-extrabold text-navy">
              Simulation Results
            </h1>
            <p className="text-sm text-navy-light">
              {OPTION_CARDS.find(card => card.id === optionType)?.label} Option Analysis
            </p>
          </div>
        </div>
      </header>

      {/* ================= Results Dashboard ================= */}
      <section className="flex flex-col gap-6">

        {/* Top Row */}
        <div
          className={`grid gap-6 items-stretch ${MODEL_CONFIG[optionType].length === 2
            ? "lg:grid-cols-3"
            : "lg:grid-cols-12"
            }`}
        >

          {/* Pricing Cards */}
          <div
            className={`${MODEL_CONFIG[optionType].length === 2
              ? "lg:col-span-2"
              : MODEL_CONFIG[optionType].length > 1
                ? "lg:col-span-8"
                : "lg:col-span-6"
              } flex`}
          >

            <div
              className={`grid gap-6 w-full ${MODEL_CONFIG[optionType].length > 1
                ? "md:grid-cols-2"
                : "grid-cols-1"
                }`}
            >
              {MODEL_CONFIG[optionType].map((m) => (
                <NeobrutalistCard key={m.key} bgColor="bg-cream" hoverEffect={false} className="h-55 flex flex-col">
                  <h3 className="text-xl font-display font-bold text-navy">{m.label}</h3>
                  <div className="mt-3 flex-1">
                    {priceLoading[m.key] ? (
                      <CardSkeleton />
                    ) : priceError[m.key] ? (
                      <ErrorBlock message={priceError[m.key]} />
                    ) : priceResults[m.key] ? (
                      <div className="flex flex-col gap-2 font-mono text-sm">
                        <div className="flex justify-between">
                          <span className="text-navy-light">Call</span>
                          <NumberValue value={priceResults[m.key].call} />
                        </div>
                        <div className="flex justify-between">
                          <span className="text-navy-light">Put</span>
                          <NumberValue value={priceResults[m.key].put} />
                        </div>
                        <div className="flex justify-between text-xs text-navy-light mt-2">
                          <span>Runtime</span>
                          <span>{priceResults[m.key].ms} ms</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-navy-light">Run a simulation to see results.</p>
                    )}
                  </div>
                  <p className="text-xs text-navy-light mt-2">{m.summary}</p>
                </NeobrutalistCard>
              ))}
            </div>
          </div>
          {/* ================= Execution Card ================= */}
          <div
            className={`${MODEL_CONFIG[optionType].length === 2
                ? "lg:col-span-1"
                : MODEL_CONFIG[optionType].length > 1
                  ? "lg:col-span-4"
                  : "lg:col-span-6"
              } flex`}
          >
            <NeobrutalistCard bgColor="bg-sage-light" hoverEffect={false} className="w-full flex flex-col gap-5 border-navy">
              <h3 className="text-xl font-display font-bold text-navy">Execution</h3>
              <div className="flex flex-col gap-3 text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-navy-light">Backend Status</span>
                  <span className={execStatus === "online" ? "text-sage" : execStatus === "offline" ? "text-accent-peach" : "text-navy-light"}>
                    {execStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-navy-light">API Latency</span>
                  <span>{execLatency !== null ? `${execLatency} ms` : "&mdash;"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-navy-light">Solver Used</span>
                  <span className="text-right">{lastSolver}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-navy-light">Package</span>
                  <span>option_pricing</span>
                </div>
              </div>
            </NeobrutalistCard>
          </div>
        </div>

        {optionType === "european" && (
          <NeobrutalistCard bgColor="bg-sage-light" hoverEffect={false} className=" md:col-span-2 flex flex-col">
            <h3 className="text-xl font-display font-bold text-navy pb-2 ">Greeks</h3>
            <div className="mt-3 flex-1 pb-2">
              {greeksLoading ? (
                <GreeksSkeleton />
              ) : greeksError ? (
                <ErrorBlock message={greeksError} />
              ) : greeks ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-sm">
                  <div>
                    <div className="text-xs text-navy-light">Delta Call</div>
                    <NumberValue value={greeks.delta_call} />
                  </div>
                  <div>
                    <div className="text-xs text-navy-light">Delta Put</div>
                    <NumberValue value={greeks.delta_put} />
                  </div>
                  <div>
                    <div className="text-xs text-navy-light">Gamma</div>
                    <NumberValue value={greeks.gamma} />
                  </div>
                  <div>
                    <div className="text-xs text-navy-light">Vega</div>
                    <NumberValue value={greeks.vega} />
                  </div>
                  <div>
                    <div className="text-xs text-navy-light">Theta Call</div>
                    <NumberValue value={greeks.theta_call} />
                  </div>
                  <div>
                    <div className="text-xs text-navy-light">Theta Put</div>
                    <NumberValue value={greeks.theta_put} />
                  </div>
                  <div>
                    <div className="text-xs text-navy-light">Rho Call</div>
                    <NumberValue value={greeks.rho_call} />
                  </div>
                  <div>
                    <div className="text-xs text-navy-light">Rho Put</div>
                    <NumberValue value={greeks.rho_put} />
                  </div>
                </div>
              ) : (
                <p className="text-sm text-navy-light">Run a simulation to see the Greeks.</p>
              )}
            </div>
          </NeobrutalistCard>
        )}

        {/* ================= Visualization Cards ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {VIZ_CARDS[optionType].map((card) => {
            const cacheKey = `${optionType}:${card.tab}`;
            return (
              <div key={cacheKey} className="w-full">
                <VisualizationCard
                  title={card.title}
                  loading={!!vizLoading[cacheKey]}
                  error={vizError[cacheKey] || ""}
                  data={vizData[cacheKey]}
                />
              </div>
            );
          })}
        </div>
      </section >
    </div >
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {page === "config" ? renderConfigPage() : renderResultsPage()}
    </div>
  );
}