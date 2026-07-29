import { useEffect, useState } from "react";
import { Info } from "lucide-react";
import NeobrutalistCard from "../components/NeobrutalistCard";
import CodePanel from "../components/CodePanel";

const codeSnippets: Record<string, string> = {
  quick: `from option_pricing import EuropeanOption

opt = EuropeanOption(S=100, K=105, T=1, r=0.05, sigma=0.2, option_type="call")
print(opt.price())`,
  base: `
#BaseOption is an internal class used by the library.
#Users should instantiate one of the concrete option classes (such as EuropeanOption or AmericanOption) instead.`,
  european: `from option_pricing import EuropeanOption

option = EuropeanOption(
    S=100,
    K=105,
    T=1,
    r=0.05,
    sigma=0.2,
)

call_price = option.call()
put_price = option.put()`,
  american: `from option_pricing import AmericanOption

option = AmericanOption(
    S=100,
    K=105,
    T=1,
    r=0.05,
    sigma=0.2,
)

call_price = option.call()
put_price = option.put()`,
  asian: `from option_pricing import AsianOption

option = AsianOption(
    S=100,
    K=105,
    T=1,
    r=0.05,
    sigma=0.2,
)

call_price = option.call(average="arithmetic")
put_price = option.put(average="geometric")`,
  barrier: `from option_pricing import BarrierOption

option = BarrierOption(
    S=100,
    K=105,
    T=1,
    r=0.05,
    sigma=0.2,
    H=120,
    barrier_type="up-and-out",
)

call_price = option.call()
put_price = option.put()`,
  lookback: `from option_pricing import LookbackOption

option = LookbackOption(
    S=100,
    K=100,
    T=1,
    r=0.05,
    sigma=0.2,
)

call_price = option.call(strike_type="floating")
put_price = option.put(strike_type="fixed")`,
  greeks: `from option_pricing import EuropeanOption

option = EuropeanOption(
    S=100,
    K=105,
    T=1,
    r=0.05,
    sigma=0.2,
)

option.delta()
option.gamma()
option.vega()
option.theta()
option.rho()`,
  iv: `from option_pricing import EuropeanOption

option = EuropeanOption(
    S=100,
    K=100,
    T=1,
    r=0.05,
    sigma=0.2,
)

call_iv, put_iv = option.implied_vol(
    call_market=10.45,
    put_market=5.57,
)`,
};

interface ApiParam {
  name: string;
  type: string;
  desc: string;
}

interface ApiMethod {
  name: string;
  desc: string;
}

type CardColor =
  | "bg-cream"
  | "bg-beige"
  | "bg-sage-light"
  | "bg-dusty-light"
  | "bg-gold-light"
  | "bg-white";

interface ApiEntryProps {
  name: string;
  tag: string;
  summary: string;
  constructor: string;
  params?: ApiParam[];
  methods?: ApiMethod[];
  bgColor: CardColor;
}


// ---- API documentation block ----
function ApiEntry({ name, tag, summary, constructor, params, methods, bgColor }: ApiEntryProps) {
  return (
    <NeobrutalistCard bgColor={bgColor} hoverEffect={false} className="border-2 border-navy flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <span className="rounded-full border-2 border-navy px-3 py-1 text-xs font-bold uppercase">{tag}</span>
        <h3 className="text-2xl font-display font-bold text-navy">{name}</h3>
      </div>

      <p className="text-navy-light">{summary}</p>

      <div>
        <h4 className="font-display font-bold text-navy mb-2">Usage</h4>
        <CodePanel code={constructor} />
      </div>

      {params && (
        <div>
          <h4 className="font-display font-bold text-navy mb-2">Parameters</h4>
          <ul className="space-y-2 text-sm text-navy-light">
            {params.map((p) => (
              <li key={p.name}><code className="font-semibold text-navy">{p.name}</code> <span className="opacity-70">({p.type})</span> — {p.desc}</li>
            ))}
          </ul>
        </div>
      )}

      {methods && (
        <div>
          <h4 className="font-display font-bold text-navy mb-2">Methods</h4>
          <ul className="space-y-2 text-sm text-navy-light">
            {methods.map((m) => (
              <li key={m.name}><code className="font-semibold text-navy">{m.name}</code> — {m.desc}</li>
            ))}
          </ul>
        </div>
      )}
    </NeobrutalistCard>
  );
}

type SectionId =
  | "introduction"
  | "installation"
  | "quickstart"
  | "concepts"
  | "api"
  | "visualization"
  | "faq"
  | "limitations";

export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState<SectionId>("introduction");

  const navItems: [SectionId, string][] = [
    ["introduction", "Introduction"],
    ["installation", "Installation"],
    ["quickstart", "Quick Start"],
    ["concepts", "Core Concepts"],
    ["api", "API Reference"],
    ["visualization", "Visualization"],
    ["faq", "FAQ"],
    ["limitations", "Known Limitations"],
  ];
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) setActiveSection(e.target.id as SectionId);
      });
    }, { rootMargin: "-40% 0px -50% 0px" });
    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: SectionId) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-10 text-left items-start">
      {/* ================= Sidebar ================= */}
      <aside className="w-full md:w-64 md:sticky md:top-24 flex flex-col gap-2 border-b md:border-b-0 md:border-r-2 border-navy/20 md:pr-6 pb-6 md:pb-0">
        <h3 className="font-display font-bold text-xl text-navy mb-2 px-2">Documentation</h3>
        <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible whitespace-nowrap">
          {navItems.map(([id, label]) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`text-left px-3 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeSection === id
                  ? "bg-gold border-2 border-navy shadow-brutal-sm"
                  : "border-2 border-transparent hover:bg-beige"
                }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* ================= Content ================= */}
      <main className="flex-1 max-w-5xl flex flex-col gap-20">
        {/* Hero */}
        <section className="scroll-mt-28 flex flex-col gap-8">
          <div className="flex flex-col gap-5">

            <h1 className="text-5xl md:text-6xl font-display font-extrabold text-navy">
              Option Pricing Library
            </h1>
            <p className="text-xl text-navy-light max-w-3xl leading-relaxed">
              Everything you need to install, understand, and use the
              <strong> Option Pricing </strong>
              library—from pricing your first European option to advanced
              quantitative analytics and visualization.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => scrollTo("quickstart")} className="btn-brutal-primary">
                Quick Start
              </button>
              <a
                href="https://github.com/lightbender62/Option-pricing"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-brutal-secondary"
              >
                GitHub
              </a>
            </div>
          </div>
        </section>

        {/* Introduction body */}
        <section id="introduction" className="flex flex-col gap-8">
          <div>
            <h2 className="text-4xl font-display font-extrabold text-navy">Introduction</h2>
            <p className="mt-3 text-lg text-navy-light max-w-4xl">
              Option Pricing is a Python library for pricing vanilla and exotic
              financial derivatives using analytical, numerical, and
              simulation-based techniques. Alongside pricing engines, the
              package includes quantitative risk analytics, implied
              volatility estimation, and visualization utilities for
              research, education, and quantitative finance workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NeobrutalistCard bgColor="bg-cream" className="flex flex-col gap-5">
              <h3 className="text-2xl font-display font-bold text-navy">Supported Pricing Models</h3>
              <ul className="space-y-2">
                <li>• Black–Scholes–Merton</li>
                <li>• Cox–Ross–Rubinstein Binomial Tree</li>
                <li>• Monte Carlo Simulation</li>
              </ul>
            </NeobrutalistCard>
            <NeobrutalistCard bgColor="bg-sage-light" className="flex flex-col gap-5">
              <h3 className="text-2xl font-display font-bold text-navy">Supported Option Types</h3>
              <ul className="space-y-2">
                <li>• European Options</li>
                <li>• American Options</li>
                <li>• Asian Options</li>
                <li>• Barrier Options</li>
                <li>• Lookback Options</li>
              </ul>
            </NeobrutalistCard>
          </div>
        </section>

        {/* Installation */}
        <section id="installation" className="scroll-mt-28 flex flex-col gap-8">
          <div>
            <h2 className="text-4xl font-display font-extrabold text-navy">Installation</h2>
            <p className="mt-3 text-lg text-navy-light max-w-3xl">
              Install the library using pip or directly from the GitHub
              repository. A virtual environment is recommended for all
              installations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <NeobrutalistCard bgColor="bg-cream" className="flex flex-col gap-4">
              <h3 className="font-display text-xl font-bold text-navy">Requirements</h3>
              <ul className="space-y-2 text-sm">
                <li>Python 3.10+</li>
                <li>NumPy</li>
                <li>SciPy</li>
                <li>Matplotlib</li>
                <li>yfinance</li>
              </ul>
            </NeobrutalistCard>
            <NeobrutalistCard bgColor="bg-beige" className="flex flex-col gap-4">
              <h3 className="font-display text-xl font-bold text-navy">Clone Repository</h3>
              <CodePanel code={`git clone https://github.com/lightbender62/Option-pricing.git\n
cd Option-pricing`} />
            </NeobrutalistCard>
            <NeobrutalistCard bgColor="bg-gold-light" className="flex flex-col gap-4">
              <h3 className="font-display text-xl font-bold text-navy">Install package</h3>
              <CodePanel
                code={`pip install .`}
              />
            </NeobrutalistCard>
          </div>
        </section>

        {/* Quick Start */}
        <section id="quickstart" className="scroll-mt-28 flex flex-col gap-8">
          <div>
            <h2 className="text-4xl font-display font-extrabold text-navy">Quick Start</h2>
            <p className="mt-3 text-lg text-navy-light max-w-3xl">
              Price your first European option in just a few lines using the
              Black–Scholes pricing engine. The package exposes a clean,
              object-oriented API while keeping the implementation flexible
              enough to switch pricing models when required.
            </p>
          </div>

          <CodePanel code={codeSnippets.quick} />

          <NeobrutalistCard bgColor="bg-sage-light" hoverEffect={false} className="border-2 border-navy">
            <div className="flex gap-3">
              <Info size={24} className="text-teal-muted flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-display text-lg font-bold text-navy">Consistent Interface</h3>
                <p className="text-sm text-navy-light mt-2">
                  Most pricing functions share the same parameter
                  conventions, making it easy to switch between analytical,
                  lattice-based, and simulation models without changing your
                  workflow.
                </p>
              </div>
            </div>
          </NeobrutalistCard>
        </section>

        {/* Core Concepts */}
        <section id="concepts" className="scroll-mt-28 flex flex-col gap-8">
          <div>
            <h2 className="text-4xl font-display font-extrabold text-navy">Core Concepts</h2>
            <p className="mt-3 text-lg text-navy-light max-w-3xl">
              The following symbols and parameters are used consistently
              throughout the library. Understanding these conventions will
              make the API reference easier to follow.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(
              [
                ["S", "Underlying Price", "Current market price of the underlying asset.", "bg-cream"],
                ["K", "Strike Price", "Exercise price specified by the option contract.", "bg-beige"],
                ["T", "Time to Expiration", "Remaining lifetime of the contract, measured in years.", "bg-sage-light"],
                ["σ", "Volatility", "Annualized standard deviation of asset returns.", "bg-dusty-light"],
                ["r", "Risk-free Rate", "Continuously compounded annual risk-free interest rate.", "bg-gold-light"],
                ["q", "Dividend Yield", "Continuous dividend yield of the underlying asset.", "bg-cream"],
                ["N", "Tree Steps", "Number of time steps used by the Binomial Tree.", "bg-beige"],
                ["M", "Simulations", "Total Monte Carlo simulation paths.", "bg-sage-light"],
              ] as [string, string, string, string][]
            ).map(([symbol, label, desc, bg]) => (
              <NeobrutalistCard key={symbol} bgColor={bg as CardColor}>
                <h3 className="text-3xl font-display font-bold text-navy">{symbol}</h3>
                <p className="font-semibold mt-2">{label}</p>
                <p className="text-sm text-navy-light mt-2">{desc}</p>
              </NeobrutalistCard>
            ))}
          </div>
        </section>

        {/* API Reference — overview cards + accordions */}
        <section id="api" className="scroll-mt-28 flex flex-col gap-8">
          <div>
            <h2 className="text-4xl font-display font-extrabold text-navy">API Reference</h2>
            <p className="mt-3 text-lg text-navy-light max-w-4xl">
              The API is organized into logical modules. Every public class
              exposes a consistent interface, making it straightforward to
              switch between pricing models while keeping your code
              unchanged. Expand any entry below for its constructor,
              parameters, methods, and a usage example.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <NeobrutalistCard bgColor="bg-cream" className="flex flex-col gap-5">
              <span className="w-fit rounded-full border-2 border-navy px-3 py-1 text-xs font-bold uppercase">Models</span>
              <div>
                <h3 className="text-2xl font-display font-bold text-navy">Pricing Models</h3>
                <p className="text-navy-light mt-2">Core pricing engines for vanilla and exotic derivatives.</p>
              </div>
              <ul className="space-y-2 text-sm">
                <li>• BaseOption</li>
                <li>• EuropeanOption</li>
                <li>• AmericanOption</li>
                <li>• AsianOption</li>
                <li>• BarrierOption</li>
                <li>• LookbackOption</li>
              </ul>
            </NeobrutalistCard>
            <NeobrutalistCard bgColor="bg-sage-light" className="flex flex-col gap-5">
              <span className="w-fit rounded-full border-2 border-navy px-3 py-1 text-xs font-bold uppercase">Analytics</span>
              <div>
                <h3 className="text-2xl font-display font-bold text-navy">Quantitative Analytics</h3>
                <p className="text-navy-light mt-2">Risk measures and calibration utilities.</p>
              </div>
              <ul className="space-y-2 text-sm">
                <li>• Greeks</li>
                <li>• Implied Volatility</li>
              </ul>
            </NeobrutalistCard>
            <NeobrutalistCard bgColor="bg-gold-light" className="flex flex-col gap-5">
              <span className="w-fit rounded-full border-2 border-navy px-3 py-1 text-xs font-bold uppercase">Visualization</span>
              <div>
                <h3 className="text-2xl font-display font-bold text-navy">Plotting Utilities</h3>
                <p className="text-navy-light mt-2">Interactive charts and analytical visualizations.</p>
              </div>
              <ul className="space-y-2 text-sm">
                <li>• Price Heatmaps</li>
                <li>• Payoff Plots</li>
                <li>• Monte Carlo Paths</li>
              </ul>
            </NeobrutalistCard>
          </div>

          {/* ---- Accordions: full API content ---- */}
          <div className="flex flex-col gap-4">
            <ApiEntry
              tag="Base"
              name="BaseOption"
              bgColor="bg-cream"
              summary="Base class that stores the common option parameters (S, K, T, r, sigma) shared by all option types. All pricing classes inherit from BaseOption, allowing them to reuse the same core option attributes."
              constructor={codeSnippets.base}
              params={[
                { name: "S", type: "float", desc: "Underlying asset price." },
                { name: "K", type: "float", desc: "Strike price." },
                { name: "T", type: "float", desc: "Time to expiration, in years." },
                { name: "r", type: "float", desc: "Risk-free interest rate." },
                { name: "sigma", type: "float", desc: "Volatility of the underlying." },
              ]}
            />

            <ApiEntry
              tag="Model"
              name="EuropeanOption"
              bgColor="bg-beige"
              summary="Prices European-style call and put options using the selected pricing model. Supports analytical Black–Scholes, Binomial Tree, and Monte Carlo methods through a unified interface."
              constructor={codeSnippets.european}
              params={[
                { name: "S", type: "float", desc: "Underlying asset price." },
                { name: "K", type: "float", desc: "Strike price." },
                { name: "T", type: "float", desc: "Time to expiration (years)." },
                { name: "r", type: "float", desc: "Risk-free interest rate." },
                { name: "sigma", type: "float", desc: "Annualized volatility." },
              ]}
              methods={[
                { name: "call(model='black_scholes', steps=500, paths=100000)", desc: "Returns the European call option price." },
                { name: "put(model='black_scholes', steps=100, paths=100000)", desc: "Returns the European put option price." },
                { name: "delta()", desc: "Returns (delta_call, delta_put)." },
                { name: "gamma()", desc: "Returns gamma." },
                { name: "theta()", desc: "Returns (theta_call, theta_put)." },
                { name: "vega()", desc: "Returns vega." },
                { name: "rho()", desc: "Returns (rho_call, rho_put)." },
                { name: "greeks()", desc: "Returns all Greeks as a dictionary." },
                { name: "implied_vol(call_market=None, put_market=None)", desc: "Computes implied volatility from market prices." },
              ]}
            />

            <ApiEntry
              tag="Model"
              name="AmericanOption"
              bgColor="bg-sage-light"
              summary="Prices American-style call and put options using a Binomial Tree model with early exercise."
              constructor={codeSnippets.american}
              params={[
                { name: "S", type: "float", desc: "Underlying asset price." },
                { name: "K", type: "float", desc: "Strike price." },
                { name: "T", type: "float", desc: "Time to expiration (years)." },
                { name: "r", type: "float", desc: "Risk-free interest rate." },
                { name: "sigma", type: "float", desc: "Annualized volatility." },
              ]}
              methods={[
                { name: "call(steps=500)", desc: "Returns the American call option price." },
                { name: "put(steps=500)", desc: "Returns the American put option price." },
              ]}
            />

            <ApiEntry
              tag="Exotic"
              name="AsianOption"
              bgColor="bg-dusty-light"
              summary="Prices Asian call and put options using arithmetic or geometric averaging through Monte Carlo simulation."
              constructor={codeSnippets.asian}
              params={[
                { name: "S", type: "float", desc: "Underlying asset price." },
                { name: "K", type: "float", desc: "Strike price." },
                { name: "T", type: "float", desc: "Time to expiration (years)." },
                { name: "r", type: "float", desc: "Risk-free interest rate." },
                { name: "sigma", type: "float", desc: "Annualized volatility." },
              ]}
              methods={[
                { name: "call(average='arithmetic', steps=100, paths=100000)", desc: "Returns the Asian call option price." },
                { name: "put(average='arithmetic', steps=100, paths=100000)", desc: "Returns the Asian put option price." },
              ]}
            />

            <ApiEntry
              tag="Exotic"
              name="BarrierOption"
              bgColor="bg-gold-light"
              summary="Prices barrier call and put options using Monte Carlo simulation. Supports knock-in and knock-out barrier styles."
              constructor={codeSnippets.barrier}
              params={[
                { name: "S", type: "float", desc: "Underlying asset price." },
                { name: "K", type: "float", desc: "Strike price." },
                { name: "T", type: "float", desc: "Time to expiration (years)." },
                { name: "r", type: "float", desc: "Risk-free interest rate." },
                { name: "sigma", type: "float", desc: "Annualized volatility." },
                { name: "H", type: "float", desc: "Barrier price level" },
                { name: "barrier_type", type: "string", desc: "Barrier style (up-and-out, up-and-in, down-and-out, down-and-in)" },
              ]}
              methods={[
                { name: "call(steps=100, paths=100000)", desc: "Returns the barrier call option price." },
                { name: "put(steps=100, paths=100000)", desc: "Returns the barrier put option price." },
              ]}
            />

            <ApiEntry
              tag="Exotic"
              name="LookbackOption"
              bgColor="bg-cream"
              summary="Prices lookback call and put options using Monte Carlo simulation. Supports both floating-strike and fixed-strike variants."
              constructor={codeSnippets.lookback}
              params={[
                { name: "S", type: "float", desc: "Underlying asset price." },
                { name: "K", type: "float", desc: "Strike price." },
                { name: "T", type: "float", desc: "Time to expiration (years)." },
                { name: "r", type: "float", desc: "Risk-free interest rate." },
                { name: "sigma", type: "float", desc: "Annualized volatility." },
              ]}
              methods={[
                { name: "call(strike_type='floating', steps=100, paths=100000)", desc: "Returns the lookback call option price. strike_type may be \"floating\" or \"fixed\". " },
                { name: "put(strike_type='floating', steps=100, paths=100000)", desc: "Returns the lookback put option price. strike_type may be \"floating\" or \"fixed\"." },
              ]}
            />

            <ApiEntry
              tag="Analytics"
              name="Greeks"
              bgColor="bg-beige"
              summary="Computes the option Greeks (Delta, Gamma, Vega, Theta, and Rho) for European options using the Black–Scholes model."
              constructor={codeSnippets.greeks}
              methods={[
                { name: "delta()", desc: "Returns the call and put delta values." },
                { name: "gamma()", desc: "Returns the option gamma." },
                { name: "vega()", desc: "Returns the option vega." },
                { name: "theta()", desc: "Returns the call and put theta values." },
                { name: "rho()", desc: "Returns the call and put rho values." },
                { name: "greeks()", desc: "Returns all Greeks as a dictionary." }
              ]}
            />

            <ApiEntry
              tag="Analytics"
              name="Implied Volatility"
              bgColor="bg-sage-light"
              summary="Computes the implied volatility of European call and/or put options using the Newton–Raphson method."
              constructor={codeSnippets.iv}
              methods={[{ name: "implied_vol(call_market=None, put_market=None)", desc: "Computes the implied volatility for the supplied call and/or put market prices. Returns a tuple (call_iv, put_iv), where the value is None for any option type that was not requested." }]}
            />
          </div>
        </section>
        {/* Visualization */}
        <section id="visualization" className="scroll-mt-28 flex flex-col gap-8">
          <div>
            <h2 className="text-4xl font-display font-extrabold text-navy">
              Visualization
            </h2>
            <p className="mt-3 text-lg text-navy-light max-w-4xl">
              The visualization module provides plotting utilities for analyzing
              pricing behavior, Monte Carlo simulations, option sensitivities,
              and payoff structures.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <ApiEntry
              tag="Visualization"
              name="Price Analysis"
              bgColor="bg-gold-light"
              summary="Visualize option prices across varying market conditions using heatmaps, pricing curves, and volatility surfaces."
              constructor={`from option_pricing import (
    PriceHeatmap,
    PricingCurves,
    VolatilitySurface,
)

PriceHeatmap(S, K, T, r, sigma).plot()

PricingCurves(S, K, T, r, sigma).plot()

VolatilitySurface("AAPL", r=0.05).surface()`}
              methods={[
                {
                  name: "PriceHeatmap.plot(option=\"call\")",
                  desc: "Generates a pricing heatmap for call or put options.",
                },
                {
                  name: "PricingCurves.plot(param=\"all\")",
                  desc: "Plots option prices against stock price, volatility, time, interest rate, or all.",
                },
                {
                  name: "VolatilitySurface.surface(num_expiries=30)",
                  desc: "Generates a 3D implied volatility surface from Yahoo Finance option data.",
                },
              ]}
            />

            <ApiEntry
              tag="Visualization"
              name="Risk Analysis"
              bgColor="bg-sage-light"
              summary="Analyze option sensitivities and numerical convergence using dedicated visualization tools."
              constructor={`from option_pricing import GreeksProfile, ConvergenceAnalysis

GreeksProfile(S, K, T, r, sigma).plot()

ConvergenceAnalysis(S, K, T, r, sigma).plot()`}
              methods={[
                {
                  name: "GreeksProfile.plot(greek=\"all\")",
                  desc: "Visualizes Delta, Gamma, Vega, Theta, Rho, or all Greeks.",
                },
                {
                  name: "ConvergenceAnalysis.plot(kind=\"all\")",
                  desc: "Plots Monte Carlo convergence, Binomial Tree convergence, or both.",
                },
              ]}
            />

            <ApiEntry
              tag="Visualization"
              name="Monte Carlo Visualization"
              bgColor="bg-dusty-light"
              summary="Inspect Monte Carlo simulations through simulated stock paths and pricing statistics."
              constructor={`from option_pricing import MonteCarloVisualization

viz = MonteCarloVisualization(
    S, K, T, r, sigma, N, M
)

viz.paths()`}
              methods={[
                {
                  name: "paths()",
                  desc: "Visualizes simulated stock price paths.",
                },
                {
                  name: "terminal_distribution()",
                  desc: "Plots the distribution of terminal stock prices.",
                },
                {
                  name: "barrier_paths()",
                  desc: "Visualizes Monte Carlo paths for Barrier options.",
                },
                {
                  name: "lookback_paths()",
                  desc: "Visualizes Monte Carlo paths for Lookback options.",
                },
                {
                  name: "asian_average_paths()",
                  desc: "Visualizes averaged price paths for Asian options.",
                },
              ]}
            />

            <ApiEntry
              tag="Visualization"
              name="Payoff Diagrams"
              bgColor="bg-beige"
              summary="Generate payoff diagrams for vanilla and exotic option contracts."
              constructor={`from option_pricing import PayoffDiagram

diagram = PayoffDiagram(...)

diagram.both()`}
              methods={[
                {
                  name: "PayoffDiagram.call()",
                  desc: "Generates the payoff diagram for a vanilla call option.",
                },
                {
                  name: "PayoffDiagram.put()",
                  desc: "Generates the payoff diagram for a vanilla put option.",
                },
                {
                  name: "PayoffDiagram.both()",
                  desc: "Displays both call and put payoff diagrams.",
                },
                {
                  name: "AsianPayoff.plot()",
                  desc: "Generates the payoff diagram for Asian options.",
                },
                {
                  name: "BarrierPayoff.plot()",
                  desc: "Generates the payoff diagram for Barrier options.",
                },
                {
                  name: "LookbackPayoff.plot()",
                  desc: "Generates the payoff diagram for Lookback options.",
                },
              ]}
            />
          </div>
        </section>
        {/* FAQ */}
        <section id="faq" className="scroll-mt-28 flex flex-col gap-8">
          <div>
            <h2 className="text-4xl font-display font-extrabold text-navy">Frequently Asked Questions</h2>
          </div>

          <div className="flex flex-col gap-6">
            <NeobrutalistCard bgColor="bg-beige">
              <h3 className="font-display text-xl font-bold text-navy">Which pricing model should I use?</h3>
              <p className="mt-3 text-navy-light">
                Black–Scholes is suitable for standard European options,
                Binomial Trees support early exercise for American options,
                while Monte Carlo simulation is recommended for
                path-dependent exotic derivatives.
              </p>
            </NeobrutalistCard>
            <NeobrutalistCard bgColor="bg-sage-light">
              <h3 className="font-display text-xl font-bold text-navy">Why doesn't Black–Scholes support American options?</h3>
              <p className="mt-3 text-navy-light">
                The analytical Black–Scholes solution assumes exercise only
                at expiration. American contracts allow early exercise,
                requiring numerical methods such as the Binomial Tree.
              </p>
            </NeobrutalistCard>
            <NeobrutalistCard bgColor="bg-dusty-light">
              <h3 className="font-display text-xl font-bold text-navy">Why isn't my implied volatility converging?</h3>
              <p className="mt-3 text-navy-light">
                Newton–Raphson iteration depends on a reasonable initial
                guess and valid market prices. Deep in-the-money or illiquid
                contracts may require additional iterations or fail to
                converge.
              </p>
            </NeobrutalistCard>
            <NeobrutalistCard bgColor="bg-gold-light">
              <h3 className="font-display text-xl font-bold text-navy">How many Monte Carlo simulations should I use?</h3>
              <p className="mt-3 text-navy-light">
                Higher simulation counts generally improve accuracy at the
                cost of additional computation time. A few thousand paths
                are often sufficient for demonstrations, while larger
                studies may require substantially more.
              </p>
            </NeobrutalistCard>
          </div>
        </section>

        {/* Known Limitations */}
        <section id="limitations" className="scroll-mt-28 flex flex-col gap-8 mb-20">
          <div>
            <h2 className="text-4xl font-display font-extrabold text-navy">Known Limitations</h2>
          </div>

          <NeobrutalistCard bgColor="bg-white" hoverEffect={false} className="border-2 border-navy">
            <ul className="space-y-4">
              <li>• Black–Scholes analytical pricing is available only for European and Geometric Asian options.</li>
              <li>• American option pricing is implemented using the Cox–Ross–Rubinstein Binomial Tree.</li>
              <li>• Monte Carlo results are stochastic and depend on the number of simulation paths.</li>
              <li>• Visualization utilities require Matplotlib.</li>
              <li>• Floating-point precision may lead to minor numerical differences between pricing models.</li>
            </ul>
          </NeobrutalistCard>

          <div className="flex flex-wrap justify-between items-center gap-4 border-t border-navy/20 pt-8">
            <a href="/models" className="btn-brutal-secondary">← Explore Models</a>
            <a href="/quantlab" className="btn-brutal-primary">Launch Quant Lab →</a>
          </div>
        </section>
      </main>
    </div>
  );
}