// Math and option pricing utilities

// Cumulative standard normal distribution function (Abramowitz & Stegun approximation)
export function stdNormalCDF(x: number): number {
  const b1 = 0.319381530;
  const b2 = -0.356563782;
  const b3 = 1.781477937;
  const b4 = -1.821255978;
  const b5 = 1.330274429;
  const p = 0.2316419;
  const c = 0.39894228;

  if (x >= 0.0) {
    const t = 1.0 / (1.0 + p * x);
    return 1.0 - c * Math.exp(-x * x / 2.0) * t * (t * (t * (t * (t * b5 + b4) + b3) + b2) + b1);
  } else {
    const t = 1.0 / (1.0 - p * x);
    return c * Math.exp(-x * x / 2.0) * t * (t * (t * (t * (t * b5 + b4) + b3) + b2) + b1);
  }
}

// Standard normal probability density function
export function stdNormalPDF(x: number): number {
  return Math.exp(-x * x / 2.0) / Math.sqrt(2 * Math.PI);
}

// Box-Muller transform for standard normal random variables
export function randomNormal(): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

// -------------------------------------------------------------
// BLACK-SCHOLES MODEL
// -------------------------------------------------------------

export interface BSResult {
  price: number;
  delta: number;
  gamma: number;
  vega: number;
  theta: number;
  rho: number;
}

export function priceBlackScholes(
  S: number, // Spot Price
  K: number, // Strike Price
  T: number, // Time to Maturity (years)
  r: number, // Risk-free Interest Rate (decimal)
  sigma: number, // Volatility (decimal)
  isCall: boolean
): BSResult {
  if (T <= 0) {
    const payoff = isCall ? Math.max(S - K, 0) : Math.max(K - S, 0);
    return { price: payoff, delta: isCall ? (S > K ? 1 : 0) : (S < K ? -1 : 0), gamma: 0, vega: 0, theta: 0, rho: 0 };
  }

  const d1 = (Math.log(S / K) + (r + (sigma * sigma) / 2) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);

  const pdfD1 = stdNormalPDF(d1);
  const cdfD1 = stdNormalCDF(d1);
  const cdfD2 = stdNormalCDF(d2);

  let price = 0;
  let delta = 0;
  let theta = 0;
  let rho = 0;

  if (isCall) {
    price = S * cdfD1 - K * Math.exp(-r * T) * cdfD2;
    delta = cdfD1;
    theta = -(S * pdfD1 * sigma) / (2 * Math.sqrt(T)) - r * K * Math.exp(-r * T) * cdfD2;
    rho = K * T * Math.exp(-r * T) * cdfD2;
  } else {
    const cdfNegD1 = stdNormalCDF(-d1);
    const cdfNegD2 = stdNormalCDF(-d2);
    price = K * Math.exp(-r * T) * cdfNegD2 - S * cdfNegD1;
    delta = cdfD1 - 1;
    theta = -(S * pdfD1 * sigma) / (2 * Math.sqrt(T)) + r * K * Math.exp(-r * T) * cdfNegD2;
    rho = -K * T * Math.exp(-r * T) * cdfNegD2;
  }

  const gamma = pdfD1 / (S * sigma * Math.sqrt(T));
  const vega = S * Math.sqrt(T) * pdfD1; // Vega is the same for Call and Put

  // Convert theta to per-day, and vega/rho to 1% change format
  return {
    price,
    delta,
    gamma,
    vega: vega / 100, // For a 1% change in volatility
    theta: theta / 365, // Daily theta
    rho: rho / 100, // For a 1% change in rate
  };
}

// Newton-Raphson Implied Volatility Solver
export function calculateImpliedVolatility(
  marketPrice: number,
  S: number,
  K: number,
  T: number,
  r: number,
  isCall: boolean
): number {
  let sigma = 0.3; // Initial guess
  const maxIterations = 100;
  const tolerance = 1e-6;

  for (let i = 0; i < maxIterations; i++) {
    const bs = priceBlackScholes(S, K, T, r, sigma, isCall);
    const diff = bs.price - marketPrice;
    
    if (Math.abs(diff) < tolerance) {
      return sigma;
    }

    // Vega is bs.vega * 100 to convert back to normal derivative dC/dSigma
    const vega = bs.vega * 100;
    if (vega < 1e-4) {
      // Avoid division by near-zero vega, fall back to bisection style or break
      break;
    }

    sigma = sigma - diff / vega;

    // Boundary conditions
    if (sigma <= 0.01) sigma = 0.01;
    if (sigma >= 3.0) sigma = 3.0;
  }

  return sigma;
}

// -------------------------------------------------------------
// BINOMIAL TREE MODEL (Cox-Ross-Rubinstein)
// -------------------------------------------------------------

export function priceBinomialTree(
  S: number,
  K: number,
  T: number,
  r: number,
  sigma: number,
  steps: number,
  isCall: boolean,
  isAmerican: boolean
): number {
  const dt = T / steps;
  const u = Math.exp(sigma * Math.sqrt(dt));
  const d = 1 / u;
  const a = Math.exp(r * dt);
  const p = (a - d) / (u - d);
  const discount = Math.exp(-r * dt);

  // Initialize option values at maturity
  const prices: number[] = new Array(steps + 1);
  for (let j = 0; j <= steps; j++) {
    const assetPrice = S * Math.pow(u, j) * Math.pow(d, steps - j);
    prices[j] = isCall ? Math.max(assetPrice - K, 0) : Math.max(K - assetPrice, 0);
  }

  // Backward induction
  for (let i = steps - 1; i >= 0; i--) {
    for (let j = 0; j <= i; j++) {
      const continuation = discount * (p * prices[j + 1] + (1 - p) * prices[j]);
      if (isAmerican) {
        const assetPrice = S * Math.pow(u, j) * Math.pow(d, i - j);
        const earlyExercise = isCall ? Math.max(assetPrice - K, 0) : Math.max(K - assetPrice, 0);
        prices[j] = Math.max(earlyExercise, continuation);
      } else {
        prices[j] = continuation;
      }
    }
  }

  return prices[0];
}

// -------------------------------------------------------------
// MONTE CARLO SIMULATOR
// -------------------------------------------------------------

export interface Path {
  name: string;
  data: { step: number; price: number }[];
}

export interface MonteCarloResult {
  price: number;
  paths: Path[];
  convergence: { trial: number; estimate: number }[];
}

export function simulateMonteCarlo(
  S: number,
  K: number,
  T: number,
  r: number,
  sigma: number,
  steps: number,
  numSimulations: number,
  isCall: boolean,
  optionStyle: 'European' | 'Asian' | 'Barrier' | 'Lookback',
  barrierLevel?: number,
  barrierType?: 'up-out' | 'down-out' | 'up-in' | 'down-in',
  lookbackType: 'fixed' | 'floating' = 'fixed'
): MonteCarloResult {
  const dt = T / steps;
  const drift = (r - 0.5 * sigma * sigma) * dt;
  const volSqDt = sigma * Math.sqrt(dt);

  const pathsToPlot: Path[] = [];
  const maxPathsToSave = 10;
  const runningEstimates: { trial: number; estimate: number }[] = [];

  // Generate some paths for visual graphing
  for (let p = 0; p < Math.max(maxPathsToSave, 10); p++) {
    const data = [{ step: 0, price: S }];
    let currentPrice = S;
    for (let s = 1; s <= steps; s++) {
      currentPrice = currentPrice * Math.exp(drift + volSqDt * randomNormal());
      data.push({ step: s, price: currentPrice });
    }
    pathsToPlot.push({
      name: `Path ${p + 1}`,
      data,
    });
  }

  // Perform full simulations
  let totalPayoff = 0;
  for (let i = 1; i <= numSimulations; i++) {
    let currentPrice = S;
    let sumPrice = S;
    let minPrice = S;
    let maxPrice = S;
    let barrierTriggered = false;

    for (let s = 1; s <= steps; s++) {
      currentPrice = currentPrice * Math.exp(drift + volSqDt * randomNormal());
      sumPrice += currentPrice;
      if (currentPrice < minPrice) minPrice = currentPrice;
      if (currentPrice > maxPrice) maxPrice = currentPrice;

      if (optionStyle === 'Barrier' && barrierLevel !== undefined) {
        if (barrierType === 'up-out' && currentPrice >= barrierLevel) barrierTriggered = true;
        if (barrierType === 'down-out' && currentPrice <= barrierLevel) barrierTriggered = true;
        if (barrierType === 'up-in' && currentPrice >= barrierLevel) barrierTriggered = true;
        if (barrierType === 'down-in' && currentPrice <= barrierLevel) barrierTriggered = true;
      }
    }

    let payoff = 0;

    if (optionStyle === 'European') {
      payoff = isCall ? Math.max(currentPrice - K, 0) : Math.max(K - currentPrice, 0);
    } else if (optionStyle === 'Asian') {
      const avgPrice = sumPrice / (steps + 1);
      payoff = isCall ? Math.max(avgPrice - K, 0) : Math.max(K - avgPrice, 0);
    } else if (optionStyle === 'Barrier' && barrierLevel !== undefined) {
      const rawPayoff = isCall ? Math.max(currentPrice - K, 0) : Math.max(K - currentPrice, 0);
      if (barrierType === 'up-out' || barrierType === 'down-out') {
        payoff = barrierTriggered ? 0 : rawPayoff;
      } else { // 'up-in' or 'down-in'
        payoff = barrierTriggered ? rawPayoff : 0;
      }
    } else if (optionStyle === 'Lookback') {
      if (lookbackType === 'floating') {
        payoff = isCall ? Math.max(currentPrice - minPrice, 0) : Math.max(maxPrice - currentPrice, 0);
      } else { // fixed strike
        payoff = isCall ? Math.max(maxPrice - K, 0) : Math.max(K - minPrice, 0);
      }
    }

    totalPayoff += payoff;
    
    // Save points for convergence plot (logarithmic distribution to save memory/rendering time)
    if (i === 1 || i === 10 || i === 50 || i === 100 || i % 250 === 0 || i === numSimulations) {
      const meanPayoff = totalPayoff / i;
      const discountedPrice = meanPayoff * Math.exp(-r * T);
      runningEstimates.push({
        trial: i,
        estimate: discountedPrice,
      });
    }
  }

  const finalPrice = (totalPayoff / numSimulations) * Math.exp(-r * T);

  return {
    price: finalPrice,
    paths: pathsToPlot,
    convergence: runningEstimates,
  };
}

// -------------------------------------------------------------
// GRAPH GENERATORS (PAYOFF, GREEKS CURVES, VOL SMILE)
// -------------------------------------------------------------

export interface CurvePoint {
  spot: number;
  callPrice?: number;
  putPrice?: number;
  deltaCall?: number;
  deltaPut?: number;
  gamma?: number;
  vega?: number;
  thetaCall?: number;
  thetaPut?: number;
  payoffCall?: number;
  payoffPut?: number;
}

export function generateCurves(
  K: number,
  T: number,
  r: number,
  sigma: number,
  startSpot: number,
  endSpot: number,
  pointsCount = 30
): CurvePoint[] {
  const result: CurvePoint[] = [];
  const step = (endSpot - startSpot) / (pointsCount - 1);

  for (let i = 0; i < pointsCount; i++) {
    const spot = startSpot + i * step;
    const callBS = priceBlackScholes(spot, K, T, r, sigma, true);
    const putBS = priceBlackScholes(spot, K, T, r, sigma, false);

    result.push({
      spot: parseFloat(spot.toFixed(2)),
      callPrice: parseFloat(callBS.price.toFixed(2)),
      putPrice: parseFloat(putBS.price.toFixed(2)),
      deltaCall: parseFloat(callBS.delta.toFixed(3)),
      deltaPut: parseFloat(putBS.delta.toFixed(3)),
      gamma: parseFloat(callBS.gamma.toFixed(4)),
      vega: parseFloat(callBS.vega.toFixed(3)),
      thetaCall: parseFloat(callBS.theta.toFixed(3)),
      thetaPut: parseFloat(putBS.theta.toFixed(3)),
      payoffCall: parseFloat(Math.max(spot - K, 0).toFixed(2)),
      payoffPut: parseFloat(Math.max(K - spot, 0).toFixed(2)),
    });
  }

  return result;
}

// Generate simple mock Volatility Smile data
export interface SmilePoint {
  strike: number;
  impliedVol: number;
}

export function generateVolatilitySmile(K: number, atmVol: number): SmilePoint[] {
  const result: SmilePoint[] = [];
  const start = K * 0.7;
  const end = K * 1.3;
  const step = (end - start) / 10;

  for (let i = 0; i <= 10; i++) {
    const strike = start + i * step;
    // Volatility Smile: Volatility increases as we go away from ATM
    const deviation = (strike - K) / K;
    const iv = atmVol + 0.15 * deviation * deviation - 0.02 * deviation; // Smirk shape
    result.push({
      strike: parseFloat(strike.toFixed(2)),
      impliedVol: parseFloat((iv * 100).toFixed(2)),
    });
  }

  return result;
}

// Generate Mock Volatility Surface data
export interface SurfacePoint {
  strike: number;
  timeToMaturity: number;
  impliedVol: number;
}

export function generateVolatilitySurface(K: number, atmVol: number): SurfacePoint[] {
  const result: SurfacePoint[] = [];
  const strikes = [0.8 * K, 0.9 * K, K, 1.1 * K, 1.2 * K];
  const tenors = [0.1, 0.25, 0.5, 1.0, 2.0]; // Years

  strikes.forEach(strike => {
    tenors.forEach(t => {
      const strikeDev = (strike - K) / K;
      // Smile shape that flattens out for longer maturities
      const iv = atmVol + (0.15 * strikeDev * strikeDev) / Math.sqrt(t) - 0.05 * strikeDev / t;
      result.push({
        strike: parseFloat(strike.toFixed(2)),
        timeToMaturity: t,
        impliedVol: parseFloat((Math.max(0.05, iv) * 100).toFixed(2)),
      });
    });
  });

  return result;
}
