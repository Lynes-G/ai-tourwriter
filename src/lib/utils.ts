import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getFirstWord = (input: string = ""): string => {
  return input.trim().split(/\s+/)[0] || "";
};

export const formatDate = (dateString: string): string => {
  return dayjs(dateString).format("MMM DD, YYYY");
};

export function parseMarkdownToJson(markdownText: string): unknown | null {
  const regex = /```json\n([\s\S]*?)\n```/;
  const match = markdownText.match(regex);
  if (match && match[1]) {
    try {
      return JSON.parse(match[1]);
    } catch (err) {
      console.error("Error parsing JSON:", err);
      return null;
    }
  }
  console.error("No JSON found in markdown text");
  return null;
}

export const formatKey = (key: keyof TripFormData) => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

export const calculateTrendPercentage = (
  currentMonthCount: number,
  lastMonthCount: number,
): TrendResult => {
  if (lastMonthCount === 0) {
    return currentMonthCount === 0
      ? { trend: "no change", percentage: 0 }
      : { trend: "increment", percentage: 100 };
  }
  const change = currentMonthCount - lastMonthCount;
  const percentage = Math.abs((change / lastMonthCount) * 100);

  if (change > 0) {
    return { trend: "increment", percentage };
  } else if (change < 0) {
    return { trend: "decrement", percentage };
  } else {
    return { trend: "no change", percentage: 0 };
  }
};

export function parseTripData(jsonString: string): Trip | null {
  try {
    const data = JSON.parse(jsonString);
    return data;
  } catch (err) {
    console.error("Failed to parse trip data:", err);
    return null;
  }
}
