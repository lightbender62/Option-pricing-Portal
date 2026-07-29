// Helper to generate Python code snippets using the mock "option-pricing" package

export interface CodeParams {
  spot: number;
  strike: number;
  volatility: number;
  interestRate: number;
  maturity: number;
  isCall: boolean;
  steps?: number;
  simulations?: number;
  barrierLevel?: number;
  barrierType?: string;
  lookbackType?: string;
}

export function generatePythonCode(
  optionStyle: 'European' | 'American' | 'Asian' | 'Barrier' | 'Lookback',
  model: 'Black-Scholes' | 'Binomial' | 'Monte Carlo',
  params: CodeParams
): string {
  const { spot, strike, volatility, interestRate, maturity, isCall, steps, simulations, barrierLevel, barrierType, lookbackType } = params;
  
  const formattedParams = `
# Define parameters
spot_price = ${spot}
strike_price = ${strike}
volatility = ${volatility}  # ${Math.round(volatility * 100)}%
rate = ${interestRate}      # ${Math.round(interestRate * 100)}%
maturity = ${maturity}      # in years
is_call = ${isCall ? 'True' : 'False'}
`;

  let modelImport = '';
  let modelExecution = '';

  if (optionStyle === 'European') {
    if (model === 'Black-Scholes') {
      modelImport = `from option_pricing import BlackScholes`;
      modelExecution = `
# Initialize Black-Scholes solver
bs_model = BlackScholes(
    spot=spot_price,
    strike=strike_price,
    volatility=volatility,
    rate=rate,
    maturity=maturity
)

# Solve for price and greeks
price = bs_model.price(is_call=is_call)
greeks = bs_model.greeks(is_call=is_call)

print(f"Option Price: {price:.4f}")
print("Greeks:")
for greek, value in greeks.items():
    print(f"  {greek.capitalize()}: {value:.4f}")
`;
    } else if (model === 'Binomial') {
      modelImport = `from option_pricing import BinomialTree`;
      modelExecution = `
# Initialize Cox-Ross-Rubinstein Binomial Tree
tree_model = BinomialTree(
    spot=spot_price,
    strike=strike_price,
    volatility=volatility,
    rate=rate,
    maturity=maturity,
    steps=${steps || 100}
)

price = tree_model.price(is_call=is_call, american=False)
print(f"European Option Price (Binomial): {price:.4f}")
`;
    } else { // Monte Carlo
      modelImport = `from option_pricing import MonteCarlo`;
      modelExecution = `
# Initialize Monte Carlo simulator
mc_simulator = MonteCarlo(
    spot=spot_price,
    strike=strike_price,
    volatility=volatility,
    rate=rate,
    maturity=maturity,
    steps=${steps || 100},
    simulations=${simulations || 5000}
)

# Run simulations for European Option
price = mc_simulator.price_european(is_call=is_call)
print(f"European Option Price (Monte Carlo): {price:.4f}")

# Plot simulated paths
mc_simulator.plot_paths(num_paths=10)
`;
    }
  } else if (optionStyle === 'American') {
    modelImport = `from option_pricing import BinomialTree`;
    modelExecution = `
# Initialize Binomial Tree for American style option
tree_model = BinomialTree(
    spot=spot_price,
    strike=strike_price,
    volatility=volatility,
    rate=rate,
    maturity=maturity,
    steps=${steps || 100}
)

# Price American option (supports early exercise checks)
price = tree_model.price(is_call=is_call, american=True)
print(f"American Option Price (Binomial): {price:.4f}")
`;
  } else if (optionStyle === 'Asian') {
    modelImport = `from option_pricing import MonteCarlo`;
    modelExecution = `
# Asian Options require path-dependent simulation
mc_simulator = MonteCarlo(
    spot=spot_price,
    strike=strike_price,
    volatility=volatility,
    rate=rate,
    maturity=maturity,
    steps=${steps || 100},
    simulations=${simulations || 5000}
)

# Price using arithmetic average of paths
price = mc_simulator.price_asian(is_call=is_call)
print(f"Asian Option Price (Monte Carlo): {price:.4f}")
`;
  } else if (optionStyle === 'Barrier') {
    modelImport = `from option_pricing import MonteCarlo`;
    modelExecution = `
# Barrier Option Pricing via Monte Carlo simulation
mc_simulator = MonteCarlo(
    spot=spot_price,
    strike=strike_price,
    volatility=volatility,
    rate=rate,
    maturity=maturity,
    steps=${steps || 100},
    simulations=${simulations || 5000}
)

# Price option with barrier conditions
price = mc_simulator.price_barrier(
    is_call=is_call,
    barrier_level=${barrierLevel || 110},
    barrier_type="${barrierType || 'up-out'}"
)
print(f"Barrier Option Price ({barrierType || 'up-out'}): {price:.4f}")
`;
  } else if (optionStyle === 'Lookback') {
    modelImport = `from option_pricing import MonteCarlo`;
    modelExecution = `
# Lookback Option Pricing based on extrema (min/max) asset price
mc_simulator = MonteCarlo(
    spot=spot_price,
    strike=strike_price,
    volatility=volatility,
    rate=rate,
    maturity=maturity,
    steps=${steps || 100},
    simulations=${simulations || 5000}
)

price = mc_simulator.price_lookback(
    is_call=is_call,
    lookback_type="${lookbackType || 'fixed'}"
)
print(f"Lookback Option Price (${lookbackType || 'fixed'} strike): {price:.4f}")
`;
  }

  return `import matplotlib.pyplot as plt
${modelImport}
${formattedParams}${modelExecution}
# Display plots
plt.show()
`;
}
