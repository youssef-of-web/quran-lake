// Re-export from centralized i18n configuration
export { Link, redirect, usePathname, useRouter } from "@i18n/navigation";
export { routing } from "@i18n/routing";

// Keep these exports for backwards compatibility
export const locales = ["en", "ar"] as const;
export const localePrefix = "as-needed";
