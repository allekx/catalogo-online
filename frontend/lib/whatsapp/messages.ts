import type { CartItem } from "@/lib/products/types";
import type { Product } from "@/lib/products/types";
import { formatPrice, getItemSubtotal } from "@/lib/cart/format";

/**
 * Mensagem de pedido — formato oficial Le Maia (Prompt 7)
 */
export function buildOrderMessage(items: CartItem[]): string {
  if (items.length === 0) {
    return "Olá, gostaria de atendimento.";
  }

  const total = items.reduce(
    (sum, i) => sum + getItemSubtotal(i.price, i.quantity),
    0
  );

  const productBlocks = items.map((item) => {
    const lines = [
      `👜 Produto: ${item.name}`,
      `Quantidade: ${item.quantity}`,
      `Valor: ${formatPrice(item.price)}`,
    ];
    if (item.observations?.trim()) {
      lines.push(`Observações: ${item.observations.trim()}`);
    }
    return lines.join("\n");
  });

  return [
    "Olá, gostaria de finalizar meu pedido.",
    "",
    ...productBlocks.flatMap((block, i) =>
      i < productBlocks.length - 1 ? [block, ""] : [block]
    ),
    "",
    `🧾 Total do pedido: ${formatPrice(total)}`,
    "",
    "Gostaria de atendimento.",
  ].join("\n");
}

/** Personalização de um produto — canal manual via responsável */
export function buildPersonalizationMessage(
  product: Product,
  observations?: string
): string {
  const lines = [
    "Olá, gostaria de solicitar personalização.",
    "",
    `👜 Produto: ${product.name}`,
    `Valor base: ${formatPrice(product.price)}`,
    product.category?.name ? `Categoria: ${product.category.name}` : "",
    observations?.trim() ? `Observações: ${observations.trim()}` : "",
    "",
    "Gostaria de atendimento.",
  ].filter(Boolean);

  return lines.join("\n");
}

/** Atendimento geral (botão flutuante / menu) */
export function buildGreetingMessage(customText?: string): string {
  return customText?.trim() ?? "Olá! Gostaria de atendimento no catálogo Le Maia.";
}
