"use client";

import { useProduct } from "@/hooks/useProduct";
import { useParams } from "next/navigation";
import React from "react";

interface DetailProductPageProps {
  params: { id: string };
}

export default function DetailProductPage({ params }: DetailProductPageProps) {
  const { id } = useParams() as { id: string | null };
  if (!id) return <div>Invalid Product ID</div>;

  const {product, loading, error, refetch} = useProduct(id);

  return <div>Detail Product {product?.name}</div>;
}
