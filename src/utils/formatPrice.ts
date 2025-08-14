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
