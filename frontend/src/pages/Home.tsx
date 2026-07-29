import React, { useState, useEffect } from 'react';
import { BookOpen, Activity, ArrowRight } from 'lucide-react';
import NeobrutalistCard from '../components/NeobrutalistCard';
import { generateCurves } from '../utils/mathUtils';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface HomeProps {
  setActivePage: (page: 'home' | 'models' | 'docs' | 'lab') => void;
}

const teamMembers = [
  {
    name: "Eklavya",
    role: "Quantitative Models & Core Development",
    description:
      "Worked on analytical and numerical pricing models, package architecture, and quantitative finance implementations.",
    image:
      "https://cdn.pfps.gg/pfps/2072-rikka-display-picture.png",
    github: "https://github.com/lightbender62",
    linkedin: "https://www.linkedin.com/in/eklavya-46567536a/",
  },

  {
    name: "Prasad",
    role: "Research & Validation",
    description:
      "Contributed to model analysis, testing workflows, and validation of pricing techniques and results.",
    image:
      "https://c4.wallpaperflare.com/wallpaper/791/830/381/vagabond-miyamoto-musashi-sky-peace-katana-hd-wallpaper-preview.jpg",
    github: "https://github.com/ce250004051",
    linkedin: "https://www.linkedin.com/in/prasad-wagh-990a66209/",
  },

  {
    name: "Parth",
    role: "Documentation & Testing",
    description:
      "Helped refine documentation, organize project resources, and improve reliability through testing.",
      
    image:
      "https://images4.alphacoders.com/134/thumb-1920-1348998.png",
    github: "https://github.com/Parth-250001054",
    linkedin: "https://in.linkedin.com/in/parth-kalia-b16b69380",
  },

  {
    name: "Soham",
    role: "Frontend & User Experience",
    description:
      "Focused on interface design, usability, and building an accessible experience for the web portal.",
    image:
      "https://images6.alphacoders.com/107/thumb-1920-1073087.jpg",
    github: "https://github.com/aspiringchoker",
    linkedin: "https://www.linkedin.com/in/soham-gupta-27a910424/",
  },
];

export const Home: React.FC<HomeProps> = ({ setActivePage}) => {
  const [miniPayoffData, setMiniPayoffData] = useState<any[]>([]);

  useEffect(() => {
    // Generate mini payoff data for interactive graph
    const data = generateCurves(100, 0.5, 0.05, 0.2, 70, 130, 20);
    setMiniPayoffData(data);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-16">

      {/* 1. HERO SECTION */}
      <section className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-8">
        <div className="lg:col-span-7 flex flex-col gap-6 text-left">
          <h1 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight leading-none text-navy">
            <span className="underline decoration-gold decoration-8 underline-offset-4">
              Quantitative Finance
            </span>{" "}
            & Option Pricing
          </h1>
          <p className="text-lg md:text-xl text-navy-light max-w-xl font-sans leading-relaxed">
            A Python toolkit implementing analytical and numerical methods for option pricing, volatility modelling, and financial simulations.
          </p>
          <div className="flex flex-wrap gap-4 mt-2">
            <button
              onClick={() => setActivePage('lab')}
              className="btn-brutal-primary flex items-center gap-2"
              id="hero-cta-lab"
            >
              <Activity size={20} />
              <span>Explore Quant Lab</span>
            </button>
            <button
              onClick={() => setActivePage('docs')}
              className="btn-brutal-secondary flex items-center gap-2"
              id="hero-cta-docs"
            >
              <BookOpen size={20} />
              <span>Read Documentation</span>
            </button>
            <button
              onClick={() => setActivePage('models')}
              className="px-6 py-3 font-display font-semibold text-lg text-navy hover:text-teal-muted flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View Models</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Hero Interactive Mini-Dashboard Card */}
        <div className="lg:col-span-5 w-full">
          <NeobrutalistCard bgColor="bg-beige" shadowSize="lg" hoverEffect={true} className="flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-navy/20 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent-peach border border-navy" />
                <span className="font-mono text-xs font-semibold text-navy">Black-Scholes Model</span>
              </div>
              <span className="text-xs px-2 py-0.5 bg-white border border-navy rounded font-mono font-medium">Sample Parameters</span>
            </div>
            <div className="grid grid-cols-2 gap-4 my-2 text-left">
              <div className="bg-white border-2 border-navy rounded-xl p-3 shadow-brutal-sm">
                <span className="text-[10px] uppercase font-mono tracking-wider text-navy-light block">Call Option Price</span>
                <span className="text-2xl font-display font-extrabold text-navy">$11.42</span>
              </div>
              <div className="bg-white border-2 border-navy rounded-xl p-3 shadow-brutal-sm">
                <span className="text-[10px] uppercase font-mono tracking-wider text-navy-light block">Delta (&Delta;)</span>
                <span className="text-2xl font-display font-extrabold text-teal-muted">0.584</span>
              </div>
            </div>
            <div className="h-44 w-full bg-white border-2 border-navy rounded-xl p-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={miniPayoffData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                  <XAxis dataKey="spot" hide />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ border: '2px solid #1B2A4A', borderRadius: '8px', fontSize: '12px' }}
                    labelFormatter={(label) => `Spot Price: $${label}`}
                  />
                  <Line type="monotone" dataKey="callPrice" stroke="#1B2A4A" strokeWidth={3} dot={false} name="BS Call Value" />
                  <Line type="monotone" dataKey="payoffCall" stroke="#8A9A86" strokeWidth={2} strokeDasharray="3 3" dot={false} name="Payoff (Intrinsic)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center text-xs text-navy-light italic">
              Explore parameter changes interactively in the Quant Lab.
            </div>
          </NeobrutalistCard>
        </div>
      </section>

      {/* 2. BENTO-STYLE FEATURE GRID */}
      <section className="flex flex-col gap-8 text-left">
        <div>
          <h2 className="text-3xl font-display font-bold text-navy">Pricing Models & Risk Analysis</h2>
          <p className="text-navy-light max-w-2xl mt-2 font-sans">
            Explore analytical models, stochastic simulations, and risk metrics for pricing and analyzing financial derivatives.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Card 1: Black-Scholes (Large 2cols on desktop) */}
          <NeobrutalistCard bgColor="bg-white" className="md:col-span-2 flex flex-col justify-between min-h-[220px]">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <span className="text-xs font-mono px-2 py-0.5 bg-sage-light border border-navy rounded font-semibold text-navy">Analytical Model</span>
              </div>
              <h3 className="text-xl font-display font-bold text-navy mt-2">Black-Scholes-Merton Pricing</h3>
              <p className="text-sm text-navy-light max-w-xl font-sans mt-1">
                Price European call and put options, compute risk sensitivities, and evaluate geometric Asian contracts using closed-form solutions.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-xs font-mono font-semibold px-2 py-1 bg-beige rounded border border-navy">European Style</span>
              <span className="text-xs font-mono font-semibold px-2 py-1 bg-beige rounded border border-navy">Continuous Dividends</span>
              <span className="text-xs font-mono font-semibold px-2 py-1 bg-beige rounded border border-navy">Closed Form</span>
            </div>
          </NeobrutalistCard>

          {/* Card 2: Greeks */}
          <NeobrutalistCard bgColor="bg-gold-light" className="flex flex-col justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <span className="text-xs font-mono px-2 py-0.5 bg-white border border-navy rounded font-semibold text-navy">Risk Metrics</span>
              </div>
              <h3 className="text-xl font-display font-bold text-navy mt-2">Option Greeks</h3>
              <p className="text-sm text-navy-light font-sans mt-1">
                Measure sensitivity to price movements, volatility, time decay, and interest rates through Delta, Gamma, Vega, Theta, and Rho.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-xs font-mono font-semibold px-2 py-1 bg-white rounded border border-navy">Delta</span>
              <span className="text-xs font-mono font-semibold px-2 py-1 bg-white rounded border border-navy">Theta</span>
              <span className="text-xs font-mono font-semibold px-2 py-1 bg-white rounded border border-navy">Vega</span>
              <span className="text-xs font-mono font-semibold px-2 py-1 bg-white rounded border border-navy">Gamma</span>
              <span className="text-xs font-mono font-semibold px-2 py-1 bg-white rounded border border-navy">Rho</span>
            </div>
          </NeobrutalistCard>

          {/* Card 3: Binomial Tree */}
          <NeobrutalistCard bgColor="bg-dusty-light" className="flex flex-col justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <span className="text-xs font-mono px-2 py-0.5 bg-white border border-navy rounded font-semibold text-navy">Numerical Model</span>
              </div>
              <h3 className="text-xl font-display font-bold text-navy mt-2">Binomial Tree (CRR)</h3>
              <p className="text-sm text-navy-light font-sans mt-1">
                Price European and American options with the Cox–Ross–Rubinstein lattice model, including support for early exercise analysis.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-xs font-mono font-semibold px-2 py-1 bg-white rounded border border-navy">American Options</span>
              <span className="text-xs font-mono font-semibold px-2 py-1 bg-white rounded border border-navy">European Options</span>
              <span className="text-xs font-mono font-semibold px-2 py-1 bg-white rounded border border-navy">CRR Lattice</span>
            </div>
          </NeobrutalistCard>

          {/* Card 4: Exotic Options */}
          <NeobrutalistCard
            bgColor="bg-sage-light"
            className="md:col-span-2 flex flex-col justify-between min-h-[220px]"
          >
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <span className="text-xs font-mono px-2 py-0.5 bg-white border border-navy rounded font-semibold text-navy">
                  Advanced Pricing
                </span>
              </div>

              <h3 className="text-xl font-display font-bold text-navy mt-2">
                Exotic Options & Path Dependents
              </h3>

              <p className="text-sm text-navy-light max-w-xl font-sans mt-1">
              Price Asian, Barrier, and Lookback contracts using analytical formulas and simulation-based methods for path-dependent derivatives.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-xs font-mono font-semibold px-2 py-1 bg-beige rounded border border-navy">
                Asian Options
              </span>

              <span className="text-xs font-mono font-semibold px-2 py-1 bg-beige rounded border border-navy">
                Barrier Options
              </span>

              <span className="text-xs font-mono font-semibold px-2 py-1 bg-beige rounded border border-navy">
                Lookback Options
              </span>
            </div>
          </NeobrutalistCard>

          {/* Card 5: Monte Carlo (Large 2cols on desktop) */}
          <NeobrutalistCard bgColor="bg-white" className="md:col-span-2 flex flex-col justify-between min-h-[220px]">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <span className="text-xs font-mono px-2 py-0.5 bg-sage-light border border-navy rounded font-semibold text-navy">Stochastic Simulation</span>
              </div>
              <h3 className="text-xl font-display font-bold text-navy mt-2">Monte Carlo Simulation Engine</h3>
              <p className="text-sm text-navy-light max-w-xl font-sans mt-1">
                Generate thousands of GBM price paths to price European, Asian, Barrier, and Lookback options through stochastic simulation.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-xs font-mono font-semibold px-2 py-1 bg-beige rounded border border-navy">Path Dependent</span>
              <span className="text-xs font-mono font-semibold px-2 py-1 bg-beige rounded border border-navy">Brownian Motion</span>
              <span className="text-xs font-mono font-semibold px-2 py-1 bg-beige rounded border border-navy">Vectorized Simulation</span>
            </div>
          </NeobrutalistCard>

          {/* Card 6: Implied Volatility */}
          <NeobrutalistCard bgColor="bg-beige" className="flex flex-col justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <span className="text-xs font-mono px-2 py-0.5 bg-white border border-navy rounded font-semibold text-navy">Market Math</span>
              </div>
              <h3 className="text-xl font-display font-bold text-navy mt-2">Implied Volatility (IV)</h3>
              <p className="text-sm text-navy-light font-sans mt-1">
                Recover market-implied volatility from observed option prices using Newton–Raphson iteration and numerical root finding.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-xs font-mono font-semibold px-2 py-1 bg-white rounded border border-navy">Newton Solver</span>
              <span className="text-xs font-mono font-semibold px-2 py-1 bg-white rounded border border-navy">Iterative Method</span>
            </div>
          </NeobrutalistCard>

        </div>
      </section>

      {/* 4. VISUALIZATIONS & ANALYTICS */}
<section className="flex flex-col gap-8 text-left">
  <div>
    <h2 className="text-3xl font-display font-bold text-navy">
      Visualizations & Analytics
    </h2>

    <p className="text-navy-light max-w-2xl mt-2 font-sans">
      Explore the visual tools available for analyzing option prices,
      volatility behaviour, and model sensitivities.
    </p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

    {/* Card 1 */}
    <NeobrutalistCard
      bgColor="bg-white"
      className="md:col-span-2 flex flex-col justify-between min-h-[220px]"
    >
      <div className="flex flex-col gap-2">
        <span className="text-xs font-mono px-2 py-0.5 bg-gold-light border border-navy rounded font-semibold text-navy w-fit">
          Payoff Analysis
        </span>

        <h3 className="text-xl font-display font-bold text-navy mt-2">
          Payoff Diagrams
        </h3>

        <p className="text-sm text-navy-light font-sans mt-1">
          Visualize payoff profiles and compare intrinsic value with model
          prices across different strike prices and market conditions.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <span className="text-xs font-mono font-semibold px-2 py-1 bg-beige rounded border border-navy">
          Calls & Puts
        </span>

        <span className="text-xs font-mono font-semibold px-2 py-1 bg-beige rounded border border-navy">
          Strategy Profiles
        </span>
      </div>
    </NeobrutalistCard>

    {/* Card 2 */}
    <NeobrutalistCard
      bgColor="bg-beige"
      className="flex flex-col justify-between"
    >
      <div className="flex flex-col gap-2">
        <span className="text-xs font-mono px-2 py-0.5 bg-white border border-navy rounded font-semibold text-navy w-fit">
          Risk Visualization
        </span>

        <h3 className="text-xl font-display font-bold text-navy mt-2">
          Greeks Analysis
        </h3>

        <p className="text-sm text-navy-light font-sans mt-1">
          Explore how Delta, Gamma, Vega, Theta, and Rho evolve under
          changing market parameters.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <span className="text-xs font-mono font-semibold px-2 py-1 bg-white rounded border border-navy">
          Sensitivity Curves
        </span>

        <span className="text-xs font-mono font-semibold px-2 py-1 bg-white rounded border border-navy">
          Risk Metrics
        </span>
      </div>
    </NeobrutalistCard>

    {/* Card 3 */}
    <NeobrutalistCard
      bgColor="bg-dusty-light"
      className="flex flex-col justify-between"
    >
      <div className="flex flex-col gap-2">
        <span className="text-xs font-mono px-2 py-0.5 bg-white border border-navy rounded font-semibold text-navy w-fit">
          Volatility Analysis
        </span>

        <h3 className="text-xl font-display font-bold text-navy mt-2">
          Volatility Surfaces & Smiles
        </h3>

        <p className="text-sm text-navy-light font-sans mt-1">
          Analyze implied volatility across strikes and maturities through
          volatility smiles, skews, and surface plots.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <span className="text-xs font-mono font-semibold px-2 py-1 bg-white rounded border border-navy">
          Smiles
        </span>

        <span className="text-xs font-mono font-semibold px-2 py-1 bg-white rounded border border-navy">
          Surface Plots
        </span>
      </div>
    </NeobrutalistCard>

     {/* Card 4 */}
    <NeobrutalistCard
      bgColor="bg-sage-light"
      className="md:col-span-2 flex flex-col justify-between min-h-[220px]"
    >
      <div className="flex flex-col gap-2">
        <span className="text-xs font-mono px-2 py-0.5 bg-white border border-navy rounded font-semibold text-navy w-fit">
          Stochastic Paths
        </span>

        <h3 className="text-xl font-display font-bold text-navy mt-2">
          Monte Carlo Asset Paths
        </h3>

        <p className="text-sm text-navy-light font-sans mt-1">
          Generate and inspect thousands of simulated asset trajectories
          driven by Geometric Brownian Motion.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <span className="text-xs font-mono font-semibold px-2 py-1 bg-beige rounded border border-navy">
          GBM
        </span>

        <span className="text-xs font-mono font-semibold px-2 py-1 bg-beige rounded border border-navy">
          Simulation Paths
        </span>
      </div>
    </NeobrutalistCard>


  </div>
</section>

      {/* 5. TEAM SECTION */}
<section className="flex flex-col gap-8 text-left">
  <div className="border-t border-navy/20 pt-12">
    <h2 className="text-3xl font-display font-bold text-navy">
      Meet the Team
    </h2>

    <p className="text-navy-light max-w-xl mt-2 font-sans">
      The team behind the pricing library, analytics engine, and interactive web portal.
    </p>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {teamMembers.map((member) => (
      <NeobrutalistCard
        key={member.name}
        bgColor="bg-white"
        className="flex flex-col items-center gap-5 text-center p-7 min-h-[360px]"
      >
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-navy shadow-brutal-sm">
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div>
          <h4 className="font-display font-bold text-xl text-navy">
            {member.name}
          </h4>

          <p className="text-xs text-teal-muted font-mono font-medium mt-1">
            {member.role}
          </p>
        </div>

        <p className="text-sm text-navy-light font-sans flex-grow">
          {member.description}
        </p>

        <div className="flex gap-3 mt-auto">
          <a
            href={member.github}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 border-2 border-navy rounded-lg font-mono text-xs font-semibold hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            GitHub
          </a>

          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 border-2 border-navy rounded-lg font-mono text-xs font-semibold hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            LinkedIn
          </a>
        </div>
      </NeobrutalistCard>
    ))}
  </div>
</section>

    </div>
  );
};
export default Home;
