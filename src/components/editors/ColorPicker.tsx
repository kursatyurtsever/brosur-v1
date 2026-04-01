/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Hash, Trash, Plus } from "lucide-react";
import { cmykToRgb, hexToRgb, hsvToRgb, rgbToCmyk, rgbToHex, rgbToHsv } from "@/lib/colorUtils";

type ColorFormat = "HEX" | "RGB" | "CMYK" | "HSB";

interface ColorObject {
  hex: string;
  alpha: number;
}

interface ColorPickerProps {
  initialColor: string;
  initialOpacity?: number;
  onChange: (hex: string) => void;
  onOpacityChange?: (opacity: number) => void;
}

export default function ColorPicker({
  initialColor,
  initialOpacity = 1,
  onChange,
  onOpacityChange,
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hsv, setHsv] = useState(() => {
    const { r, g, b } = hexToRgb(initialColor);
    return rgbToHsv(r, g, b);
  });
  const [alpha, setAlpha] = useState(initialOpacity);
  const [activeFormat, setActiveFormat] = useState<ColorFormat>("HEX");
  const [library, setLibrary] = useState<ColorObject[]>([
    { hex: "#FF0000", alpha: 1 },
    { hex: "#00FF00", alpha: 1 },
    { hex: "#0000FF", alpha: 0.5 },
    { hex: "#000000", alpha: 1 },
    { hex: "#FFFFFF", alpha: 1 },
  ]);

  const popoverRef = useRef<HTMLDivElement>(null);
  const squareRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const hex = useMemo(() => {
      const {r,g,b} = hsvToRgb(hsv.h, hsv.s, hsv.v);
      return rgbToHex(r,g,b);
  }, [hsv]);

  useEffect(() => {
    const timer = setTimeout(() => {
        if (hex.toUpperCase() !== initialColor.toUpperCase()) {
            onChange(hex);
        }
    }, 50);
    return () => clearTimeout(timer);
  }, [hex]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleMove = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (!squareRef.current) return;
    const rect = squareRef.current.getBoundingClientRect();
    const s = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
    const v = Math.min(100, Math.max(0, 100 - ((e.clientY - rect.top) / rect.height) * 100));
    setHsv(prev => ({ ...prev, s, v }));
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    handleMove(e);
    const onMouseMove = (moveEvent: MouseEvent) => isDragging.current && handleMove(moveEvent);
    const onMouseUp = () => {
      isDragging.current = false;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };
  
  const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

  const renderInputs = () => {
      switch(activeFormat) {
          case "HEX":
              return (
                <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <Hash size={14} className="text-slate-400" />
                    <input 
                        type="text" 
                        value={hex.replace("#", "")}
                        onChange={(e) => {
                            const newRgb = hexToRgb(e.target.value);
                            setHsv(rgbToHsv(newRgb.r, newRgb.g, newRgb.b));
                        }}
                        className="bg-transparent text-sm font-mono font-bold w-full outline-none uppercase text-slate-700"
                    />
                </div>
              )
          case "RGB":
            return (
                <div className="grid grid-cols-3 gap-2">
                    {["R", "G", "B"].map((label, i) => (
                        <input key={label} type="number" min="0" max="255" value={Math.round(Object.values(rgb)[i])} onChange={e => {
                            const newRgb = {...rgb, [label.toLowerCase()]: Number(e.target.value)};
                            setHsv(rgbToHsv(newRgb.r, newRgb.g, newRgb.b));
                        }} className="w-full bg-slate-50 border border-slate-200 rounded p-1 text-xs text-center font-bold outline-none focus:border-blue-500 text-slate-700" />
                    ))}
                </div>
            )
          case "CMYK":
            return (
                <div className="grid grid-cols-4 gap-2">
                     {["C", "M", "Y", "K"].map((label, i) => (
                        <input key={label} type="number" min="0" max="100" value={Math.round(Object.values(cmyk)[i])}  onChange={e => {
                            const newCmyk = {...cmyk, [label.toLowerCase()]: Number(e.target.value)};
                            const newRgb = cmykToRgb(newCmyk.c, newCmyk.m, newCmyk.y, newCmyk.k);
                            setHsv(rgbToHsv(newRgb.r, newRgb.g, newRgb.b));
                        }} className="w-full bg-slate-50 border border-slate-200 rounded p-1 text-xs text-center font-bold outline-none focus:border-blue-500 text-slate-700" />
                    ))}
                </div>
            )
          case "HSB":
            return (
                 <div className="grid grid-cols-3 gap-2">
                    {["H", "S", "B"].map((label, i) => (
                        <input key={label} type="number" min="0" max={label === 'H' ? 360 : 100} value={Math.round(Object.values(hsv)[i])}  onChange={e => {
                            const newHsv = {...hsv, [label.toLowerCase()]: Number(e.target.value)};
                            setHsv(newHsv)
                        }} className="w-full bg-slate-50 border border-slate-200 rounded p-1 text-xs text-center font-bold outline-none focus:border-blue-500 text-slate-700" />
                    ))}
                </div>
            )
      }
  }

  return (
    <div className="relative inline-block text-slate-800">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-lg border-2 border-white shadow-md ring-1 ring-slate-300 transition-transform active:scale-95"
        style={{ backgroundColor: hex }}
      />

      {isOpen && (
        <div 
          ref={popoverRef}
          className="absolute z-[100] mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 space-y-4 animate-in fade-in zoom-in-95 duration-150"
        >
          <div
            ref={squareRef}
            onMouseDown={onMouseDown}
            className="relative w-full h-44 rounded-lg cursor-crosshair overflow-hidden"
            style={{ 
              backgroundColor: `hsl(${hsv.h}, 100%, 50%)`,
              backgroundImage: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent)`
            }}
          >
            <div 
              className="absolute w-4 h-4 border-2 border-white rounded-full shadow-md -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{ left: `${hsv.s}%`, top: `${100 - hsv.v}%` }}
            />
          </div>

          <div className="space-y-3">
            <div>
              <input
                type="range" min="0" max="360" value={hsv.h}
                onChange={(e) => setHsv(prev => ({ ...prev, h: Number(e.target.value) }))}
                className="w-full h-3 rounded-full appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)` }}
              />
            </div>
            <div>
              <input
                type="range" min="0" max="1" step="0.01" value={alpha}
                onChange={(e) => {
                  const newAlpha = parseFloat(e.target.value);
                  setAlpha(newAlpha);
                  if (onOpacityChange) onOpacityChange(newAlpha);
                }}
                className="w-full h-3 rounded-full appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, transparent, ${hex})` }}
              />
            </div>
            <div className="flex items-center justify-between gap-2">
                <div className="flex gap-1">
                    {(["HEX", "RGB", "CMYK", "HSB"] as ColorFormat[]).map(f => (
                        <button key={f} onClick={() => setActiveFormat(f)} className={`px-2 py-1 text-xs font-bold rounded-md ${activeFormat === f ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>
                            {f}
                        </button>
                    ))}
                </div>
                <div 
                  className="w-8 h-8 rounded-md border border-slate-200 overflow-hidden"
                  style={{
                    backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill-opacity="0.05"><rect x="8" width="8" height="8"/><rect y="8" width="8" height="8"/></svg>')`,
                    backgroundSize: '8px 8px',
                  }}
                >
                  <div style={{backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`}} className="w-full h-full"/>
                </div>
            </div>
            {renderInputs()}
          </div>
          
          <div className="pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Renk Kütüphanesi</span>
              <button
                onClick={() => {
                  if (!library.find(c => c.hex === hex && c.alpha === alpha)) {
                    setLibrary([...library, { hex, alpha }]);
                  }
                }}
                className="p-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
              >
                <Plus size={14} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto pr-1">
              {library.map((colorObj, i) => {
                const { r, g, b } = hexToRgb(colorObj.hex);
                return (
                  <div key={i} className="group relative">
                    <button
                      onClick={() => {
                        setHsv(rgbToHsv(r, g, b));
                        setAlpha(colorObj.alpha);
                        if (onOpacityChange) onOpacityChange(colorObj.alpha);
                      }}
                      className="w-6 h-6 rounded-md border border-slate-200 shadow-sm transition-transform hover:scale-110 overflow-hidden"
                      style={{
                        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill-opacity=\"0.05\"><rect x=\"8\" width=\"8\" height=\"8\"/><rect y=\"8\" width=\"8\" height=\"8\"/></svg>")`,
                        backgroundSize: "8px 8px",
                      }}
                    >
                       <div style={{ backgroundColor: `rgba(${r}, ${g}, ${b}, ${colorObj.alpha})` }} className="w-full h-full" />
                    </button>
                    <button
                      onClick={() => setLibrary(library.filter((_, index) => index !== i))}
                      className="absolute -top-1 -right-1 bg-white shadow-md rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-red-500"
                    >
                      <Trash size={10} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
