import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get user initials from a name string
 * @param name - The user's full name (can be undefined)
 * @returns String with initials (e.g., "John Doe" -> "JD", "Alice" -> "AL")
 */
export function getInitials(name: string | undefined): string {
  if (!name) return "";
  const allNames = name.trim().split(" ");
  if (allNames.length === 1) {
    return allNames[0].substring(0, 2).toUpperCase();
  }

  return (
    allNames[0][0].toUpperCase() +
    allNames[allNames.length - 1][0].toUpperCase()
  );
}
