import { getLocalForApi } from "./helpers/utils";
import { axiosInstance } from "./lib/axios";
import { BaseApiError } from "./types/ApiError";

const handleErrors = async (res: any) => {
  return res;
};

const fetcher = async <T>(url: string, options?: any): Promise<T> => {
  const response = await axiosInstance.get(url, options);
  return response.data as T;
};

const getSurahListUrl = async () => {
  const locale = await getLocalForApi();
  return `suwar?language=${locale}`;
};

const getRecitersUrl = async () => {
  const locale = await getLocalForApi();
  return `reciters?language=${locale}`;
};

const getReciterByIdUrl = async (id: number) => {
  const locale = await getLocalForApi();
  return `reciters?language=${locale}&reciter=${id}`;
};

const getSurahList = async <T>() => {
  try {
    const response = await fetcher<T>(await getSurahListUrl());
    return response;
  } catch (error) {
    await handleErrors(error as BaseApiError);
    return null;
  }
};

const getReciters = async <T>() => {
  try {
    const data = await fetcher<T>(await getRecitersUrl());
    return data;
  } catch (error) {
    await handleErrors(error as BaseApiError);
    return null;
  }
};

const getReciterById = async <T>(id: number) => {
  try {
    const data = await fetcher<T>(await getReciterByIdUrl(id));
    return data;
  } catch (error) {
    await handleErrors(error as BaseApiError);
    return null;
  }
};

export { getReciterById, getReciters, getSurahList };
