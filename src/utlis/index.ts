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

export const badgeColors = {
  // Payment Methods
  cash: "green",
  bank: "blue",
  bkash: "purple",

  // Account Types
  asset: "blue",
  liability: "orange",
  equity: "purple",
  income: "green",
  expense: "red",

  // Status or fallback
  default: "gray",
};

export function getTypeColor(type: string) {
  switch (type) {
    case "asset":
      return "success"; // green
    case "liability":
      return "warning"; // yellow
    case "equity":
      return "primary"; // blue
    case "expense":
      return "error"; // red
    case "income":
      return "info"; // purple
    default:
      return "secondary";
  }
}

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
