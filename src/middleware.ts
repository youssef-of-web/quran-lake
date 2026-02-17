import createMiddleware from "next-intl/middleware";
import { localePrefix, locales } from "./lib/intl";

export default createMiddleware({
  // A list of all locales that are supported
  locales: locales,
  // Used when no locale matches
  defaultLocale: "en",
  localePrefix: localePrefix,
  localeDetection: false,
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
