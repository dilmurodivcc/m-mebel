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


export const getImageUrl = (
  imageUrl: string | undefined,
  baseUrl: string = process.env.NEXT_PUBLIC_API_URL || "https://exuberant-comfort-0c2f94bc2b.strapiapp.com"
): string => {
  if (!imageUrl) {
    return "/img/cardimg.png"; 
  }
  
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
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

export const addLocaleToParams = (params: Record<string, string | number | boolean> = {}): Record<string, string | number | boolean> => {
  return {
    ...params,
    locale: getCurrentLocale(),
  };
};

export const buildPopulateParams = (fields: string[]): Record<string, string> => {
  const populateParams: Record<string, string> = {};
  
  fields.forEach((field, index) => {
    populateParams[`populate[${index}]`] = field;
  });
  
  return populateParams;
};


export const buildStrapiQuery = (
  fields: string[] = [], 
  additionalParams: Record<string, string | number | boolean> = {}
): string => {
  const params = new URLSearchParams();
  
  fields.forEach((field, index) => {
    params.append(`populate[${index}]`, field);
  });
  
  Object.entries(additionalParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  });
  
  return params.toString();
};
