"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { BottomSheet, Input, Button } from "@/design-system";
import { ROUTES } from "@/lib/constants/routes";
import { useAppStore } from "@/store/useAppStore";

export function SearchSheet() {
  const router = useRouter();
  const { isSearchOpen, setSearchOpen } = useAppStore();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    const q = query.trim();
    setSearchOpen(false);
    setQuery("");
    router.push(
      q
        ? `${ROUTES.catalog}?busca=${encodeURIComponent(q)}`
        : ROUTES.catalog
    );
  };

  return (
    <BottomSheet
      open={isSearchOpen}
      onClose={() => setSearchOpen(false)}
      title="Buscar produtos"
    >
      <div className="space-y-4 pb-2">
        <Input
          placeholder="Nome, categoria ou tipo..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          leftIcon={<Search className="h-4 w-4" />}
          autoFocus
        />
        <Button variant="primary" fullWidth onClick={handleSearch}>
          Buscar
        </Button>
      </div>
    </BottomSheet>
  );
}
