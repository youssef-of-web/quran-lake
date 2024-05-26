import { getLocale } from "next-intl/server";

export const generateServerUrlId = (id: string) => {
  if (id.length === 1) {
    return `00${id}`;
  } else {
    if (id.length === 2) {
      return `0${id}`;
    } else {
      return `${id}`;
    }
  }
};

export const getLocalForApi = async () => {
  const locale = await getLocale();
  return locale === "en" ? "eng" : "en";
};
