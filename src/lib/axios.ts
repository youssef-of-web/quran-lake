import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://mp3quran.net/api/v3/",
});
