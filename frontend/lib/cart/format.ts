export { formatPrice } from "@/lib/format/currency";

export function getItemSubtotal(price: number, quantity: number): number {
  return price * quantity;
}
