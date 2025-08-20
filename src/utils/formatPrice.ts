export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: 'UZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatPriceNumber = (price: number): string => {
  return new Intl.NumberFormat("uz-UZ", {
    style: "currency",
    currency: "UZS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Utility function to get the correct image URL
 * @param imageUrl - The image URL from the API
 * @param baseUrl - The base URL to prepend if the image URL is relative
 * @returns The complete image URL
 */
export const getImageUrl = (
  imageUrl: string | undefined,
  baseUrl: string = process.env.NEXT_PUBLIC_API_URL || "https://exuberant-comfort-0c2f94bc2b.strapiapp.com"
): string => {
  if (!imageUrl) {
    return "/img/cardimg.png"; // Default fallback image
  }
  
  // If the URL already starts with http/https, use it as is
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // If it's a relative URL, prepend the base URL
  return `${baseUrl}${imageUrl}`;
};

export const formatPriceShort = (price: number): string => {
  if (price >= 1000000) {
    return (price / 1000000).toFixed(1) + 'M sum';
  } else if (price >= 1000) {
    return (price / 1000).toFixed(1) + 'K sum';
  } else {
    return price + " sum";
  }
};

// Utility function to get current locale for API requests
export const getCurrentLocale = (): string => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('theme-storage');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.state?.language || 'ru';
      } catch {
        return 'ru';
      }
    }
  }
  return 'ru';
};

// Helper function to add locale to API params
export const addLocaleToParams = (params: Record<string, string | number | boolean> = {}): Record<string, string | number | boolean> => {
  return {
    ...params,
    locale: getCurrentLocale(),
  };
};

/**
 * Builds proper Strapi populate parameters for multiple fields
 * @param fields - Array of field names to populate
 * @returns Object with proper populate parameters
 */
export const buildPopulateParams = (fields: string[]): Record<string, string> => {
  const populateParams: Record<string, string> = {};
  
  fields.forEach((field, index) => {
    populateParams[`populate[${index}]`] = field;
  });
  
  return populateParams;
};

/**
 * Builds a query string with proper Strapi populate parameters
 * @param fields - Array of field names to populate
 * @param additionalParams - Additional query parameters
 * @returns Query string
 */
export const buildStrapiQuery = (
  fields: string[] = [], 
  additionalParams: Record<string, string | number | boolean> = {}
): string => {
  const params = new URLSearchParams();
  
  // Add populate parameters
  fields.forEach((field, index) => {
    params.append(`populate[${index}]`, field);
  });
  
  // Add additional parameters
  Object.entries(additionalParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  });
  
  return params.toString();
};
