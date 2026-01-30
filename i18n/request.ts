import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
    // This typically corresponds to the `[locale]` segment
    let locale = await requestLocale;

    // Ensure that a valid locale is used
    if (!locale || !routing.locales.includes(locale as any)) {
        locale = routing.defaultLocale;
    }

    return {
        locale,
        messages: (
            await (locale === "en"
                ? // When using Turbopack, this will enable HMR for `en`
                import("../src/messages/en.json")
                : import(`../src/messages/${locale}.json`))
        ).default,
    };
});
