export interface User {
  id: number;
  email: string;
  name: string;
  role: "ADMIN" | "STAFF";
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  productStockLog?: ProductStockLog[];
}

export interface ProductStockLog {
  id: number;
  productId: string;
  changedBy: string;
  stockChange: number;
  createdAt: string;
  updatedAt: string;
}
