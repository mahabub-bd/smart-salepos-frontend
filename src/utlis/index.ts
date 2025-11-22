import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import z from "zod";
export const baseUrl = import.meta.env.VITE_API_URL;
export const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "active", label: "Active" },
  { value: "suspend", label: "Suspend" },
  { value: "deactive", label: "Deactive" },
];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrencyEnglish(amount: number): string {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
    .format(amount)
    .replace("BDT", "৳ ");
}

export const SafeNumber = (msg: string) =>
  z.preprocess((v) => {
    const num = Number(v);
    return Number.isFinite(num) ? num : null;
  }, z.number({ error: msg }));


