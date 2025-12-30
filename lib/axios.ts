import axios from "axios";
import { getCookie } from "cookies-next";
import { enrichProductWithMockImage, enrichProductsWithMockImages } from "./image-utils";

/**
 * Enrich API response with mock images for products
 * Handles various response structures (single product, array, nested objects)
 */
function enrichApiResponse(data: any): any {
  if (!data) return data;

  // Handle array of products
  if (Array.isArray(data)) {
    return enrichProductsWithMockImages(data);
  }

  // Handle single product
  if (data.id && (data.title || data.name)) {
    return enrichProductWithMockImage(data);
  }

  // Handle nested structures (e.g., cart items, order items)
  if (data.product) {
    return {
      ...data,
      product: enrichProductWithMockImage(data.product)
    };
  }

  // Handle array of nested products (e.g., cart with items)
  if (data.items && Array.isArray(data.items)) {
    return {
      ...data,
      items: data.items.map((item: any) => ({
        ...item,
        product: item.product ? enrichProductWithMockImage(item.product) : item.product
      }))
    };
  }

  // Handle paginated responses
  if (data.content && Array.isArray(data.content)) {
    return {
      ...data,
      content: enrichProductsWithMockImages(data.content)
    };
  }

  // Handle homepage response structure
  if (data.specialOffers || data.newArrivals || data.popularProducts || data.limitedDeals) {
    const enrichedData = { ...data };
    
    if (data.specialOffers && Array.isArray(data.specialOffers)) {
      enrichedData.specialOffers = enrichProductsWithMockImages(data.specialOffers);
    }
    
    if (data.newArrivals && Array.isArray(data.newArrivals)) {
      enrichedData.newArrivals = enrichProductsWithMockImages(data.newArrivals);
    }
    
    if (data.popularProducts && Array.isArray(data.popularProducts)) {
      enrichedData.popularProducts = enrichProductsWithMockImages(data.popularProducts);
    }
    
    if (data.limitedDeals && Array.isArray(data.limitedDeals)) {
      enrichedData.limitedDeals = enrichProductsWithMockImages(data.limitedDeals);
    }
    
    return enrichedData;
  }

  // Handle data wrapper (must be after specific handlers to avoid premature recursion)
  if (data.data) {
    return {
      ...data,
      data: enrichApiResponse(data.data)
    };
  }

  return data;
}

export const AxiosAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

AxiosAPI.interceptors.response.use(function (response: any) {
  // Enrich response data with mock images
  if (response.data) {
    response.data = enrichApiResponse(response.data);
  }
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
  // Enrich chatbot response data with mock images
  if (response.data) {
    response.data = enrichApiResponse(response.data);
  }
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
