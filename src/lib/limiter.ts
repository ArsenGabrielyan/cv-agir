import { TrackerType } from "@/lib/types";
import { headers } from "next/headers";

const trackers: TrackerType = {};

export async function getIpAddress(): Promise<string | null> {
     const header = await headers();
     const forwardedFor = header.get("x-forwarded-for");
     const realIp = header.get("x-real-ip");
     const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : realIp ? realIp.trim() : null;
     return ip === "::1" ? "127.0.0.1" : ip;
}

export function checkLimiter(key: string, limit: number): boolean {
     const tracker = trackers[key];
     if (!tracker) return false;
     if (tracker.expiresAt < Date.now()) return false;
     return tracker.count >= limit;
}

export function incrementLimiter(key: string, window: number = 10_000): void {
     const tracker = trackers[key] || { count: 0, expiresAt: 0 };
     if (!trackers[key]) trackers[key] = tracker;
     if (tracker.expiresAt < Date.now()) {
          tracker.count = 0;
          tracker.expiresAt = Date.now() + window;
     }
     tracker.count++;
}

export function clearLimiter(key: string): void {
     if (trackers[key]) delete trackers[key];
}