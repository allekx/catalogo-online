"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductForm } from "@/components/products/ProductForm";
import { adminApi, type AdminCategory } from "@/lib/api";

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<AdminCategory[]>([]);

  useEffect(() => {
    adminApi.categories.list().then(setCategories);
  }, []);

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold">Novo produto</h1>
      </header>
      <ProductForm
        categories={categories}
        onCancel={() => router.push("/produtos")}
        onSubmit={async (data) => {
          await adminApi.products.create(data);
          router.push("/produtos");
        }}
      />
    </div>
  );
}
