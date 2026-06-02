"use client";

import { cn } from "@/lib/utils";
import { ReactNode, useState } from "react";

interface TabsProps {
  tabs: { id: string; label: string; count?: number }[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex gap-1 p-1 bg-neutral-100 rounded-xl", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
            activeTab === tab.id
              ? "bg-white text-neutral-900 shadow-sm"
              : "text-neutral-500 hover:text-neutral-700"
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span
              className={cn(
                "text-xs px-1.5 py-0.5 rounded-full",
                activeTab === tab.id
                  ? "bg-brand-50 text-brand-700"
                  : "bg-neutral-200 text-neutral-500"
              )}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, label, disabled }: ToggleProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200",
          checked ? "bg-brand-600" : "bg-neutral-300",
          disabled && "opacity-50"
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-sm",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
      {label && <span className="text-sm text-neutral-700">{label}</span>}
    </label>
  );
}

interface SelectProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function Select({ options, value, onChange, placeholder, className }: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "h-10 px-3 text-sm bg-white border border-neutral-200 rounded-xl text-neutral-900",
        "focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500",
        "appearance-none cursor-pointer",
        className
      )}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
