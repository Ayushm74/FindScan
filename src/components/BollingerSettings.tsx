"use client";
import React, { useState } from "react";
import type { BollingerInputs, BollingerStyle } from "../lib/types";

type Props = {
  inputs: BollingerInputs;
  style: BollingerStyle;
  onChange: (next: { inputs: BollingerInputs; style: BollingerStyle }) => void;
};

export default function BollingerSettings({ inputs, style, onChange }: Props) {
  const [tab, setTab] = useState<"Inputs" | "Style">("Inputs");

  return (
    <div className="text-sm">
      <div className="flex border-b border-gray-700 mb-3">
        {(["Inputs", "Style"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-2 ${tab === t ? "border-b-2 border-white" : "text-gray-400"}`}>{t}</button>
        ))}
      </div>
      {tab === "Inputs" && (
        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <label>Length</label>
            <input type="number" className="w-24 bg-[#121212] border border-gray-700 rounded px-2 py-1"
              value={inputs.length}
              onChange={e => onChange({ inputs: { ...inputs, length: Number(e.target.value) }, style })}
            />
          </div>
          <div className="flex items-center justify-between">
            <label>MA Type</label>
            <select className="w-24 bg-[#121212] border border-gray-700 rounded px-2 py-1" value="SMA" disabled>
              <option>SMA</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <label>Source</label>
            <select className="w-24 bg-[#121212] border border-gray-700 rounded px-2 py-1" value="close" disabled>
              <option>close</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <label>StdDev</label>
            <input type="number" className="w-24 bg-[#121212] border border-gray-700 rounded px-2 py-1"
              value={inputs.stdMultiplier}
              step={0.1}
              onChange={e => onChange({ inputs: { ...inputs, stdMultiplier: Number(e.target.value) }, style })}
            />
          </div>
          <div className="flex items-center justify-between">
            <label>Offset</label>
            <input type="number" className="w-24 bg-[#121212] border border-gray-700 rounded px-2 py-1"
              value={inputs.offset}
              onChange={e => onChange({ inputs: { ...inputs, offset: Number(e.target.value) }, style })}
            />
          </div>
        </div>
      )}
      {tab === "Style" && (
        <div className="grid gap-4">
          <div className="text-xs text-gray-400">OUTPUT VALUES</div>
          {[{ key: "basis", label: "Basic", color: style.basisColor, visible: style.showBasis },
            { key: "upper", label: "Upper", color: style.upperColor, visible: style.showUpper },
            { key: "lower", label: "Lower", color: style.lowerColor, visible: style.showLower }].map(row => (
            <div key={row.key} className="flex items-center justify-between gap-3">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="appearance-none w-4 h-4 border border-white checked:bg-white" checked={row.visible}
                  onChange={e => {
                    const next: BollingerStyle = { ...style } as any;
                    if (row.key === "basis") next.showBasis = e.target.checked;
                    if (row.key === "upper") next.showUpper = e.target.checked;
                    if (row.key === "lower") next.showLower = e.target.checked;
                    onChange({ inputs, style: next });
                  }}
                />
                {row.label}
              </label>
              <div className="flex items-center gap-2">
                <input type="color" value={row.color} onChange={e => {
                  const next: BollingerStyle = { ...style } as any;
                  if (row.key === "basis") next.basisColor = e.target.value;
                  if (row.key === "upper") next.upperColor = e.target.value;
                  if (row.key === "lower") next.lowerColor = e.target.value;
                  onChange({ inputs, style: next });
                }} />
                <select className="bg-[#121212] border border-gray-700 rounded px-2 py-1"
                  value={style.lineStyle}
                  onChange={e => onChange({ inputs, style: { ...style, lineStyle: e.target.value as any } })}
                >
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                </select>
                <input type="number" className="w-16 bg-[#121212] border border-gray-700 rounded px-2 py-1" value={style.lineWidth}
                  onChange={e => onChange({ inputs, style: { ...style, lineWidth: Number(e.target.value) } })}
                />
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="appearance-none w-4 h-4 border border-white checked:bg-white" checked={style.showBackground}
                onChange={e => onChange({ inputs, style: { ...style, showBackground: e.target.checked } })}
              />
              Background fill
            </label>
            <div className="flex items-center gap-2">
              <input type="range" min={0} max={1} step={0.01} value={style.backgroundOpacity}
                onChange={e => onChange({ inputs, style: { ...style, backgroundOpacity: Number(e.target.value) } })}
              />
              <span className="w-10 text-right">{Math.round(style.backgroundOpacity * 100)}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


