import axios from "axios";
import { getCookie } from "cookies-next";

export const AxiosAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
AxiosAPI.interceptors.response.use(function (response: any) {
  return response;
});

AxiosAPI.interceptors.request.use(async function (config: any) {
  var token = getCookie("auth_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const AxiosChatbot = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_CHATBOT_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
AxiosChatbot.interceptors.response.use(function (response: any) {
  return response;
});

export const fetcherClient = (url: any, params: any) => {
  if (!url) return;

  if (url) {
    if (url.indexOf("/v1/") > -1) {
      return AxiosAPI.get(url, { params });
    } else {
      if (typeof url === "string") return AxiosAPI.get(url, { params });
      else if (typeof url === "object") return AxiosAPI.get(url[0], { params: url[1] });
    }
  }
};
export const optionsFetch = {
  fetcher: fetcherClient,
};
export default AxiosAPI;
