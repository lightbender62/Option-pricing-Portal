import React from 'react';
import NeobrutalistCard from '../components/NeobrutalistCard';
import { CheckCircle2 } from 'lucide-react';

export const Models: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-12 text-left">

      {/* Pricing Models */}
      <section className="flex flex-col gap-6">
        <div>
          <h2 className="text-4xl font-display font-extrabold text-navy">
            Pricing Models
          </h2>
          <p className="text-navy-light text-xl mt-2 mb-4 max-w-3xl">
            Analytical, numerical and simulation-based pricing engines with
            integrated quantitative risk analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">

          {/* Black-Scholes */}
          <NeobrutalistCard
            bgColor="bg-cream"
            className="md:col-span-2 flex flex-col gap-5"
          >
            <span className="w-fit rounded-full border-2 border-navy px-3 py-1 text-xs font-bold uppercase">
              Analytical
            </span>

            <div>
              <h3 className="text-2xl font-display font-bold text-navy">
                Black–Scholes
              </h3>

              <p className="mt-2 text-navy-light">
                Closed-form pricing engine for European and Geometric Asian options
                with continuous dividend support.
              </p>
            </div>

            <div className="space-y-2">
              {[
                "European Calls & Puts",
                "Geometric Asian",
                "Dividend Yield",
                "Fast Closed-form Pricing",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 size={18} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </NeobrutalistCard>

          {/* Binomial */}
          <NeobrutalistCard
            bgColor="bg-sage-light"
            className="md:col-span-2 flex flex-col gap-5"
          >
            <span className="w-fit rounded-full border-2 border-navy px-3 py-1 text-xs font-bold uppercase">
              Numerical
            </span>

            <div>
              <h3 className="text-2xl font-display font-bold text-navy">
                Binomial Tree
              </h3>

              <p className="mt-2 text-navy-light">
                Cox–Ross–Rubinstein lattice supporting European and American options.
              </p>
            </div>

            <div className="space-y-2">
              {[
                "European Options",
                "American Options",
                "Early Exercise",
                "CRR Tree",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 size={18} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </NeobrutalistCard>

          {/* Monte Carlo */}
          <NeobrutalistCard
            bgColor="bg-dusty-light"
            className="md:col-span-2 flex flex-col gap-5"
          >
            <span className="w-fit rounded-full border-2 border-navy px-3 py-1 text-xs font-bold uppercase">
              Simulation
            </span>

            <div>
              <h3 className="text-2xl font-display font-bold text-navy">
                Monte Carlo
              </h3>

              <p className="mt-2 text-navy-light">
                Vectorized GBM simulation engine for pricing vanilla and path-dependent
                derivatives.
              </p>
            </div>

            <div className="space-y-2">
              {[
                "Asian Options",
                "Barrier Options",
                "Lookback Options",
                "GBM Simulation",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 size={18} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </NeobrutalistCard>

          {/* Greeks */}
          <NeobrutalistCard
            bgColor="bg-gold-light"
            className="md:col-span-3 flex flex-col gap-5"
          >
            <span className="w-fit rounded-full border-2 border-navy px-3 py-1 text-xs font-bold uppercase">
              Risk Analytics
            </span>

            <div>
              <h3 className="text-2xl font-display font-bold text-navy">
                Greeks
              </h3>

              <p className="mt-2 text-navy-light">
                Compute first- and second-order sensitivities for quantitative risk
                analysis.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {["Delta", "Gamma", "Theta", "Vega", "Rho"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 size={18} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </NeobrutalistCard>

          {/* Implied Volatility */}
          <NeobrutalistCard
            bgColor="bg-beige"
            className="md:col-span-3 flex flex-col gap-5"
          >
            <span className="w-fit rounded-full border-2 border-navy px-3 py-1 text-xs font-bold uppercase">
              Calibration
            </span>

            <div>
              <h3 className="text-2xl font-display font-bold text-navy">
                Implied Volatility
              </h3>

              <p className="mt-2 text-navy-light">
                Recover market-implied volatility using Newton–Raphson iteration from
                observed option prices.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                "Newton-Raphson",
                "Call & Put IV",
                "Fast Convergence",
                "Market Calibration",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 size={18} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </NeobrutalistCard>

        </div>
      </section>
      {/* Options */}
      <section className="flex flex-col gap-6">
        <div>
          <h2 className="text-4xl font-display font-extrabold text-navy">
            Supported Option Types
          </h2>
          <p className="text-navy-light text-xl mt-2 mb-4 max-w-3xl">
            Explore the range of financial derivatives supported by the package, from standard vanilla contracts to advanced path-dependent exotic options.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">

          {/* European Options */}
          <NeobrutalistCard
            bgColor="bg-cream"
            className="md:col-span-2 flex flex-col gap-5"
          >
            <span className="w-fit rounded-full border-2 border-navy px-3 py-1 text-xs font-bold uppercase">
              Vanilla
            </span>

            <div>
              <h3 className="text-2xl font-display font-bold text-navy">
                European Options
              </h3>

              <p className="mt-2 text-navy-light">
                Price standard European call and put options using analytical, numerical, and simulation-based methods.
              </p>
            </div>

            <div className="space-y-2">
              {[
                "European Calls & Puts",
                "Black–Scholes Pricing",
                "Binomial Tree",
                "Monte Carlo",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 size={18} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </NeobrutalistCard>

          {/* American Options  */}
          <NeobrutalistCard
            bgColor="bg-sage-light"
            className="md:col-span-2 flex flex-col gap-5"
          >
            <span className="w-fit rounded-full border-2 border-navy px-3 py-1 text-xs font-bold uppercase">
              Early Exercise
            </span>

            <div>
              <h3 className="text-2xl font-display font-bold text-navy">
                American Options
              </h3>

              <p className="mt-2 text-navy-light">
                Support for American-style contracts through the Cox–Ross–Rubinstein lattice with optimal early exercise evaluation.
              </p>
            </div>

            <div className="space-y-2">
              {[
                "American Calls & Puts",
                "Early Exercise",
                "CRR Binomial Tree",
                "Backward Induction",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 size={18} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </NeobrutalistCard>

          {/* Monte Carlo */}
          <NeobrutalistCard
            bgColor="bg-dusty-light"
            className="md:col-span-2 flex flex-col gap-5"
          >
            <span className="w-fit rounded-full border-2 border-navy px-3 py-1 text-xs font-bold uppercase">
              Path-Dependent
            </span>

            <div>
              <h3 className="text-2xl font-display font-bold text-navy">
                Exotic Options
              </h3>

              <p className="mt-2 text-navy-light">
                Advanced derivatives whose payoff depends on the asset price path or additional contract conditions.
              </p>
            </div>

            <div className="space-y-2">
              {[
                "Asian Options",
                "Barrier Options",
                "Lookback Options",
                "Monte Carlo Pricing",
                "Geometric Asian (Black–Scholes)",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 size={18} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </NeobrutalistCard>

        </div>
      </section>

      {/* Visualization Suite */}
      <section className="flex flex-col gap-6">
        <div>
          <h2 className="text-4xl font-display font-extrabold text-navy">
            Visualization Suite
          </h2>
          <p className="text-navy-light mt-2 max-w-3xl">
            Transform pricing results into intuitive visual insights through
            Interactive Visualizations for pricing, simulations, risk analysis, and market
            behavior.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Pricing Analysis */}
          <NeobrutalistCard
            bgColor="bg-cream"
            className="flex flex-col gap-5"
          >
            <span className="w-fit rounded-full border-2 border-navy px-3 py-1 text-xs font-bold uppercase">
              Core Charts
            </span>

            <div>
              <h3 className="text-2xl font-display font-bold text-navy">
                Pricing Analysis
              </h3>

              <p className="mt-2 text-navy-light">
                Compare pricing models and analyze option values through interactive
                payoff and pricing visualizations.
              </p>
            </div>

            <div className="space-y-2">
              {[
                "Payoff Diagrams",
                "Price Curves",
                "Model Comparison",
                "Interactive Charts",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 size={18} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </NeobrutalistCard>

          {/* Monte Carlo Insights */}
          <NeobrutalistCard
            bgColor="bg-sage-light"
            className="flex flex-col gap-5"
          >
            <span className="w-fit rounded-full border-2 border-navy px-3 py-1 text-xs font-bold uppercase">
              Simulation
            </span>

            <div>
              <h3 className="text-2xl font-display font-bold text-navy">
                Monte Carlo Insights
              </h3>

              <p className="mt-2 text-navy-light">
                Visualize stochastic price evolution and simulation statistics
                generated from thousands of Monte Carlo paths.
              </p>
            </div>

            <div className="space-y-2">
              {[
                "Simulated Price Paths",
                "Terminal Distribution",
                "Convergence Analysis",
                "GBM Simulation",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 size={18} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </NeobrutalistCard>

          {/* Risk Analytics */}
          <NeobrutalistCard
            bgColor="bg-dusty-light"
            className="flex flex-col gap-5"
          >
            <span className="w-fit rounded-full border-2 border-navy px-3 py-1 text-xs font-bold uppercase">
              Greeks
            </span>

            <div>
              <h3 className="text-2xl font-display font-bold text-navy">
                Risk Analytics
              </h3>

              <p className="mt-2 text-navy-light">
                Understand portfolio sensitivities through dynamic visualization of
                option Greeks and parameter changes.
              </p>
            </div>

            <div className="space-y-2">
              {[
                "Delta Analysis",
                "Gamma Analysis",
                "Vega Analysis",
                "Theta & Rho",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 size={18} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </NeobrutalistCard>

          {/* Volatility Analysis */}
          <NeobrutalistCard
            bgColor="bg-gold-light"
            className="flex flex-col gap-5"
          >
            <span className="w-fit rounded-full border-2 border-navy px-3 py-1 text-xs font-bold uppercase">
              Volatility  
            </span>

            <div>
              <h3 className="text-2xl font-display font-bold text-navy">
                Volatility Analysis
              </h3>

              <p className="mt-2 text-navy-light">
                Explore implied volatility and pricing sensitivity under varying
                market conditions through interactive analytical visualizations.
              </p>
            </div>

            <div className="space-y-2">
              {[
                "IV Curves",
                "Volatility Smile",
                "Parameter Comparison",
                "Sensitivity Charts",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 size={18} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </NeobrutalistCard>

        </div>
      </section>
    </div>
  )
};
export default Models;
