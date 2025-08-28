"use client";

import React, { useEffect, useRef } from "react";
// Using 'LineType' from klinecharts
import { init, dispose, KLineData, registerIndicator, LineType } from "klinecharts";
import { computeBollingerBands } from "../lib/indicators/bollinger";

// --- Type Definitions ---
export type BollingerInputs = {
  length: number;
  stdMultiplier: number;
  offset: number;
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
  // UPDATED: Made backgroundColor optional to prevent build errors
  // if the prop isn't passed from the parent component.
  backgroundColor?: string;
  backgroundOpacity: number;
};

export type ChartProps = {
  data: KLineData[];
  inputs: BollingerInputs;
  style: BollingerStyle;
};

// --- Indicator Registration ---
const BOLLINGER_BANDS_INDICATOR_NAME = "FindScanBollingerBands";

// Ensure the indicator is registered only once on the client side.
if (typeof window !== 'undefined' && !(window as any).__boll_findscan_registered) {
  registerIndicator({
    name: BOLLINGER_BANDS_INDICATOR_NAME,
    shortName: "BB",
    calcParams: [20, 2, 0],
    figures: [
      { key: "upper", title: "Upper: ", type: "line" },
      { key: "basis", title: "Basis: ", type: "line" },
      { key: "lower", title: "Lower: ", type: "line" },
    ],
    calc: (kLineDataList, indicator) => {
      const params = indicator.calcParams as [number, number, number];
      const { basis, upper, lower } = computeBollingerBands(kLineDataList, {
        length: params[0],
        stdMultiplier: params[1],
        offset: params[2],
      });
      return basis.map((b, i) => ({
        basis: b,
        upper: upper[i],
        lower: lower[i],
      }));
    },
  });
  (window as any).__boll_findscan_registered = true;
}

// --- Chart Component ---
const Chart: React.FC<ChartProps> = ({ data, inputs, style }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReturnType<typeof init> | null>(null);

  // Effect for chart initialization and disposal
  useEffect(() => {
    if (!chartContainerRef.current) return;
    const chart = init(chartContainerRef.current, {
        // You can add global chart styles here, e.g., colors for grid, crosshair, etc.
    });
    chartRef.current = chart;
    if (chart) {
      chart.createIndicator(BOLLINGER_BANDS_INDICATOR_NAME, false, { id: "candle_pane" });
    }
    
    // Cleanup function to dispose of the chart instance
    return () => {
      if (chartRef.current) {
        dispose(chartRef.current);
        chartRef.current = null;
      }
    };
  }, []);

  // Effect to apply new data when it changes
  useEffect(() => {
    if (chartRef.current && data.length > 0) {
      chartRef.current.applyNewData(data);
    }
  }, [data]);

  // Effect to update indicator styles and parameters
  useEffect(() => {
    if (!chartRef.current) return;

    // Convert string style to the enum required by klinecharts
    const kLineChartLineStyle = style.lineStyle === "dashed" ? LineType.Dashed : LineType.Solid;

    // Helper function to convert HEX to RGBA for background opacity
    const getRgbaColor = (hex: string, opacity: number): string => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${opacity})`
        : `rgba(255, 255, 255, ${opacity})`; // Fallback color
    };
    
    // UPDATED: Safely determine the band color. If background is not shown or color is not provided,
    // it defaults to transparent.
    const bandColor = (style.showBackground && style.backgroundColor)
        ? getRgbaColor(style.backgroundColor, style.backgroundOpacity)
        : "transparent";

    chartRef.current.overrideIndicator({
      name: BOLLINGER_BANDS_INDICATOR_NAME,
      calcParams: [inputs.length, inputs.stdMultiplier, inputs.offset],
      styles: {
        figures: [
          { key: "upper", styles: { line: { color: style.showUpper ? style.upperColor : "transparent", size: style.lineWidth, style: kLineChartLineStyle } } },
          { key: "basis", styles: { line: { color: style.showBasis ? style.basisColor : "transparent", size: style.lineWidth, style: kLineChartLineStyle } } },
          { key: "lower", styles: { line: { color: style.showLower ? style.lowerColor : "transparent", size: style.lineWidth, style: kLineChartLineStyle } } },
        ],
        band: {
          color: bandColor,
        },
      },
    });
  }, [inputs, style, data]);

  return <div ref={chartContainerRef} className="w-full h-full" />;
};

export default Chart;
