import type { Ohlcv, BollingerInputs } from "../types";

export type BollingerSeries = {
  basis: number[];
  upper: number[];
  lower: number[];
};

export function sma(values: number[], period: number): number[] {
  const result: number[] = [];
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
    if (i >= period) sum -= values[i - period];
    if (i >= period - 1) result.push(sum / period);
    else result.push(NaN);
  }
  return result;
}

export function stdDev(values: number[], period: number): number[] {
  // Population standard deviation over rolling window
  const out: number[] = [];
  const means = sma(values, period);
  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) {
      out.push(NaN);
      continue;
    }
    let sumSq = 0;
    for (let j = i - period + 1; j <= i; j++) {
      const d = values[j] - means[i];
      sumSq += d * d;
    }
    out.push(Math.sqrt(sumSq / period));
  }
  return out;
}

export function computeBollingerBands(data: Ohlcv[], options: BollingerInputs): BollingerSeries {
  const closes = data.map(d => d.close);
  const basis = sma(closes, options.length);
  const sd = stdDev(closes, options.length);
  const upper = basis.map((b, i) => (isNaN(b) ? NaN : b + options.stdMultiplier * sd[i]));
  const lower = basis.map((b, i) => (isNaN(b) ? NaN : b - options.stdMultiplier * sd[i]));

  const shift = (arr: number[]) => {
    if (!options.offset) return arr;
    const n = options.offset;
    const res = new Array(arr.length).fill(NaN);
    for (let i = 0; i < arr.length; i++) {
      const idx = i + n;
      if (idx >= 0 && idx < arr.length) res[idx] = arr[i];
    }
    return res;
  };

  return {
    basis: shift(basis),
    upper: shift(upper),
    lower: shift(lower),
  };
}


