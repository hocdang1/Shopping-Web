import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
// convert prisma object into  a regular js object

export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

//Format number with decimal places
export function formatNumberWithDecimal(num: number): string {
  return num.toFixed(2);
}