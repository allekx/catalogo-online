"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi, ApiError } from "@/lib/admin/api";
import { setAdminToken } from "@/lib/admin/auth";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token } = await adminApi.login(password);
      setAdminToken(token);
      router.replace("/admin");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Erro ao entrar. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-maia-nude via-white to-maia-rose/40 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-3xl border border-black/[0.06] bg-white p-8 shadow-lg"
      >
        <h1 className="font-display text-2xl font-bold">
          Le <span className="text-maia-orange">Maia</span>
        </h1>
        <p className="mt-1 text-sm text-maia-muted">Acesso administrativo</p>

        <label className="admin-label mt-8">Senha</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="admin-input"
          placeholder="••••••••"
          autoFocus
          required
        />

        {error && (
          <p className="mt-3 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary mt-6 w-full"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}
