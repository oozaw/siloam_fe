"use client";

import { formatSearchParams } from "@/app/lib/helpers";
import api from "@/services/api.service";
import { ApiResponse, BaseQueryParams, PaginationMeta, Product } from "@/types";
import { useCallback, useEffect, useState } from "react";

export function useProducts(initialParams: Partial<BaseQueryParams> = {}) {
  const [params, setParams] = useState<BaseQueryParams>(initialParams);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = useCallback(
    async (queryParams?: BaseQueryParams) => {
      setLoading(true);
      setError(null);

      try {
        const formattedParams = formatSearchParams(queryParams || params);
        const { data: response } = await api.get<ApiResponse<Product[]>>(
          `/products?${formattedParams}`,
        );

        setProducts(response.data);
        setPagination(response.meta || null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    },
    [params],
  );

  const updateParams = useCallback(
    (newParams: Partial<BaseQueryParams>) => {
      const updatedParams = { ...params, ...newParams };

      setParams(updatedParams);
      fetchProducts(updatedParams);
    },
    [params, fetchProducts],
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    pagination,
    params,
    setParams: updateParams,
    refetch: fetchProducts,
  };
}

export const useProduct = (id: number | string | null) => {
  const [productId, setProductId] = useState<number | string | null>(id);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!productId) return;

    setLoading(true);
    setError(null);

    try {
      const { data: response } = await api.get<ApiResponse<Product>>(
        `/products/${productId}`,
      );
      setProduct(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      console.error("Failed to fetch product:", err);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  const updateProductId = useCallback(
    (newId: number | string) => {
      setProductId(newId);
      fetchProduct();
    },
    [fetchProduct],
  );

  useEffect(() => {
    if (productId) {
      fetchProduct();
    } else {
      setProduct(null);
      setLoading(false);
      setError(null);
    }
  }, [fetchProduct]);

  return {
    product,
    loading,
    error,
    productId,
    setProductId: updateProductId,
    refetch: fetchProduct,
  };
};

export const useProductActions = () => {
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProduct = async (data: Partial<Product>) => {
    setCreating(true);
    setError(null);

    try {
      const { data: response } = await api.post<ApiResponse<{ data: Product }>>(
        "/products",
        data,
      );
      return response.data;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      // console.error("Failed to create product:", err);
      throw err;
    } finally {
      setCreating(false);
    }
  };

  const updateProduct = async (id: number | string, data: Partial<Product>) => {
    setUpdating(true);
    setError(null);

    try {
      const { data: response } = await api.put<ApiResponse<{ data: Product }>>(
        `/products/${id}`,
        data,
      );
      return response.data;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      // console.error("Failed to update product:", err);
      throw err;
    } finally {
      setUpdating(false);
    }
  };

  const deleteProduct = async (id: number | string) => {
    setDeleting(true);
    setError(null);

    try {
      await api.delete(`/products/${id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      console.error("Failed to delete product:", err);
    } finally {
      setDeleting(false);
    }
  };

  return {
    creating,
    updating,
    deleting,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};
