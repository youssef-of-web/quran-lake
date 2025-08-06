import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

// Can be imported from a shared config
const locales = ["en", "ar"];

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as any)) notFound();

  return {
    locale,
    messages: (
      await (locale === "en"
        ? // When using Turbopack, this will enable HMR for `en`
          import("../messages/en.json")
        : import(`../messages/${locale}.json`))
    ).default,
  };
});
