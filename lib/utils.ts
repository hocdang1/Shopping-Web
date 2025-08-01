import { clsx, type ClassValue } from "clsx"
import { Currency } from "lucide-react";
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
//format error for zod
  export function formatError(error: any) {
    if(error.name === "ZodError") {
      // Handle ZodError
      const fieldErrors = Object.keys(error.errors).map((field) =>error.errors[field].message); 
      return fieldErrors.join(". ");
    }else if(error.name === "PrismaClientKnownRequestError" && error.code === "P2002") {
      // Hanle Prisma error
      const field = error.meta?.target ? error.meta.target[0] : "Field";
      return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
    }else {
      // Handle other errors
      return typeof error.message === "string" ? error.message
      : JSON.stringify(error.message);
    }
  }
  export function round2(value: number | string) {
  if (typeof value === 'number') {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  } else if (typeof value === 'string') {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error('Value is not a number or string');
  }
}

const CURRENCY_FOMATTER =new Intl.NumberFormat('en-US',{
  currency:'USD',
  style:'currency',
  minimumFractionDigits:2
});
// format currency using the formatter above
export function formatCurrency(amount:number|string|null){
  if (typeof amount ==='number'){
    return CURRENCY_FOMATTER.format(amount);

  }else if (typeof amount === 'string'){
    return CURRENCY_FOMATTER.format(Number(amount));
  }else{
    return 'NaN'
  }
}