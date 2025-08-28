export type Ohlcv = {
  timestamp: number; // ms epoch
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
};

export type BollingerInputs = {
  length: number; // SMA length
  stdMultiplier: number; // standard deviation multiplier
  offset: number; // shift in bars
};

export type BollingerStyle = {
  showBasis: boolean;
  showUpper: boolean;
  showLower: boolean;
  showBackground: boolean;
  basisColor: string;
  upperColor: string;
  lowerColor: string;
  lineWidth: number;
  lineStyle: "solid" | "dashed";
  backgroundOpacity: number; // 0..1
};


