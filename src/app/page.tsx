"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { KLineData } from "klinecharts";
import Chart from "../components/Chart";
import type { BollingerInputs, BollingerStyle } from "../lib/types";
import Modal from "../components/ui/Modal";
import BollingerSettings from "../components/BollingerSettings";

export default function Home() {
  const [data, setData] = useState<KLineData[]>([]);
  const [inputs, setInputs] = useState<BollingerInputs>({ length: 20, stdMultiplier: 2, offset: 0 });
  const [style, setStyle] = useState<BollingerStyle>({
    showBasis: true,
    showUpper: true,
    showLower: true,
    showBackground: false,
    basisColor: "#0066ff",
    upperColor: "#ff3333",
    lowerColor: "#009688",
    lineWidth: 2,
    lineStyle: "solid",
    backgroundOpacity: 0.12,
  });
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    fetch("/data/ohlcv.json").then(r => r.json()).then((rows) => {
      const k: KLineData[] = rows.map((r: any) => ({
        timestamp: Number(r.timestamp),
        open: Number(r.open),
        high: Number(r.high),
        low: Number(r.low),
        close: Number(r.close),
        volume: Number(r.volume ?? 0),
      }));
      setData(k);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d1117] to-[#1a1d24] text-white flex flex-col">
      <div className="flex items-center justify-between px-4 h-12 bg-black/80 border-b border-white/10">
        <div className="font-semibold">FindScan</div>
        <div className="flex gap-2">
          <button className="bg-[#0066ff] text-white px-3 py-1 rounded">Buy</button>
          <button className="bg-[#ff3333] text-white px-3 py-1 rounded">Sell</button>
          <button onClick={() => setSettingsOpen(true)} className="bg-white/10 text-white px-3 py-1 rounded border border-white/20">Indicator Settings</button>
        </div>
      </div>
      <div className="flex flex-1">
        <div className="w-12 bg-black/60 border-r border-white/10 flex flex-col items-center py-2 gap-2">
          <div className="w-8 h-8 rounded bg-white/20" />
          <div className="w-8 h-8 rounded bg-white/20" />
          <div className="w-8 h-8 rounded bg-white/20" />
        </div>
        <div className="flex-1">
          <div className="h-[72vh]">
            <Chart data={data} inputs={inputs} style={style} />
          </div>
          <div className="h-10 bg-black text-white flex items-center gap-4 px-4 border-t border-white/10 text-sm">
            <button>1D</button>
            <button>5D</button>
            <button>1M</button>
            <button>3M</button>
            <button>6M</button>
            <button>1Y</button>
          </div>
        </div>
      </div>
      <Modal open={settingsOpen} onClose={() => setSettingsOpen(false)} title="Bollinger Bands Settings">
        <BollingerSettings
          inputs={inputs}
          style={style}
          onChange={({ inputs: i, style: s }) => { setInputs(i); setStyle(s); }}
        />
      </Modal>
    </div>
  );
}
