import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://www.mp3quran.net/api/v3/",
});
