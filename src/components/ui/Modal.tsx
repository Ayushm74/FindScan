"use client";
import React from "react";

type ModalProps = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export default function Modal({ open, title, onClose, children, footer }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-[#1e1e1e] text-white rounded-lg shadow-lg w-[640px] max-w-[95vw] border border-gray-700">
        <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
          <div className="font-semibold">{title}</div>
          <button onClick={onClose} className="text-gray-300 hover:text-white">✕</button>
        </div>
        <div className="p-4 max-h-[70vh] overflow-auto">
          {children}
        </div>
        <div className="px-4 py-3 border-t border-gray-700 flex items-center justify-between">
          <div className="text-sm text-gray-400">
            <select className="bg-[#121212] text-gray-200 rounded px-2 py-1 border border-gray-700">
              <option>Defaults</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="bg-[#121212] text-white px-3 py-1 rounded border border-gray-700">Cancel</button>
            <button onClick={onClose} className="bg-white text-black px-3 py-1 rounded">Ok</button>
          </div>
        </div>
      </div>
    </div>
  );
}


