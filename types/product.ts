export type Product = {
  id: string | number;
  name: string;
  description?: string;
  modelName?: string;
  manufacturerName?: string;
  price: number;
  availableQty?: number;
  images?: string[];
  brand?: string;
  discount?: number;
  stock?: number;
  rating?: {
    average: number;
    count: number;
  };
  reviews?: Array<{
    stars: number;
    message: string;
    by: string;
    date: string;
    images: string[];
  }>;
  specs?: Record<string, string | number | undefined>;
};