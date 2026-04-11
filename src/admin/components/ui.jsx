import { useEffect, useState } from "react";

// ── Toast System ──────────────────────────────────────────────────────────────
let _addToast = null;
export function ToastProvider() {
  const [toasts, setToasts] = useState([]);
  _addToast = (msg, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  };
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all duration-300 animate-slide-in
            ${t.type === "success" ? "bg-emerald-600 text-white" : "bg-red-500 text-white"}`}
        >
          {t.type === "success" ? (
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {t.msg}
        </div>
      ))}
    </div>
  );
}
export const toast = {
  success: (msg) => _addToast?.(msg, "success"),
  error: (msg) => _addToast?.(msg, "error"),
};

// ── Badge ──────────────────────────────────────────────────────────────────────
const badgeVariants = {
  success: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  warning: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  danger:  "bg-red-50 text-red-600 ring-1 ring-red-200",
  info:    "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  purple:  "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
  gray:    "bg-gray-100 text-gray-600 ring-1 ring-gray-200",
};
export function Badge({ children, variant = "gray", className = "" }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeVariants[variant]} ${className}`}>
      {children}
    </span>
  );
}

// ── Spinner ───────────────────────────────────────────────────────────────────
export function Spinner({ size = "md" }) {
  const s = size === "sm" ? "w-4 h-4" : size === "lg" ? "w-8 h-8" : "w-6 h-6";
  return (
    <svg className={`animate-spin ${s} text-emerald-600`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

// ── SkeletonTable ─────────────────────────────────────────────────────────────
export function SkeletonTable({ rows = 6, cols = 5 }) {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className={`h-4 bg-gray-100 rounded-lg ${j === 0 ? "w-3/4" : "w-full"}`} />
          ))}
        </div>
      ))}
    </div>
  );
}

// ── EmptyState ─────────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4 ring-1 ring-gray-100">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-xs text-gray-400 max-w-xs">{description}</p>
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 ${className}`}>
      {children}
    </div>
  );
}

// ── Button ────────────────────────────────────────────────────────────────────
const btnVariants = {
  primary: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-100",
  secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
  danger: "bg-red-500 text-white hover:bg-red-600 shadow-sm shadow-red-100",
  ghost: "text-gray-600 hover:bg-gray-100",
  outline: "border border-gray-200 text-gray-700 hover:bg-gray-50",
};
export function Button({ children, variant = "primary", size = "md", className = "", disabled, ...props }) {
  const sz = size === "sm" ? "px-3 py-1.5 text-xs" : size === "lg" ? "px-6 py-3 text-sm" : "px-4 py-2 text-sm";
  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center gap-2 font-semibold rounded-xl transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${sz} ${btnVariants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// ── Input / Select ────────────────────────────────────────────────────────────
export function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${className}`}
      {...props}
    />
  );
}
export function Select({ className = "", children, ...props }) {
  return (
    <select
      className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

// ── Table components ──────────────────────────────────────────────────────────
export function Table({ children }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[700px]">{children}</table>
    </div>
  );
}
export function Thead({ children }) {
  return (
    <thead>
      <tr className="border-b border-gray-100">{children}</tr>
    </thead>
  );
}
export function Th({ children, className = "" }) {
  return (
    <th className={`py-3 px-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider ${className}`}>
      {children}
    </th>
  );
}
export function Tbody({ children }) {
  return <tbody className="divide-y divide-gray-50">{children}</tbody>;
}
export function Tr({ children, className = "" }) {
  return (
    <tr className={`group hover:bg-gray-50/70 transition-colors duration-100 ${className}`}>
      {children}
    </tr>
  );
}
export function Td({ children, className = "" }) {
  return <td className={`py-3.5 px-4 text-gray-700 ${className}`}>{children}</td>;
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, size = "md" }) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;
  const w = size === "lg" ? "max-w-2xl" : size === "xl" ? "max-w-4xl" : "max-w-lg";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-xl w-full ${w} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ── Page Header ───────────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ── Label ─────────────────────────────────────────────────────────────────────
export function Label({ children, className = "" }) {
  return <label className={`block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide ${className}`}>{children}</label>;
}
