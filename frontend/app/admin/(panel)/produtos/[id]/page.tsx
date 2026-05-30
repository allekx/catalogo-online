"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProductForm } from "@/components/admin/products/ProductForm";
import { adminApi, type AdminCategory, type AdminProduct } from "@/lib/admin/api";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [categories, setCategories] = useState<AdminCategory[]>([]);

  useEffect(() => {
    Promise.all([
      adminApi.products.get(id),
      adminApi.categories.list(),
    ]).then(([p, c]) => {
      setProduct(p);
      setCategories(c);
    });
  }, [id]);

  if (!product) {
    return <div className="admin-card text-sm text-maia-muted">Carregando...</div>;
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold">Editar produto</h1>
        <p className="text-sm text-maia-muted">{product.name}</p>
      </header>
      <ProductForm
        categories={categories}
        initial={product}
        onCancel={() => router.push("/admin/produtos")}
        onSubmit={async (data) => {
          await adminApi.products.update(id, data);
          router.push("/admin/produtos");
        }}
      />
    </div>
  );
}
