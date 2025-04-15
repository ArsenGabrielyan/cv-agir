import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { env } from "@/lib/env"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const absoluteUrl = (path: string) => `${env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}${path}`