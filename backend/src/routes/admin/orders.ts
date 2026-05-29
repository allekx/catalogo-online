import { Router } from "express";
import { OrderStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { notDeleted } from "../../lib/db";

export const adminOrdersRouter = Router();

const STATUS_VALUES = new Set<string>(Object.values(OrderStatus));

function serializeOrder(order: {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: { toString(): string };
  total: { toString(): string };
  notes: string | null;
  whatsappSent: boolean;
  createdAt: Date;
  updatedAt: Date;
  customer: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    city: string | null;
  };
  items: {
    id: string;
    name: string;
    quantity: number;
    unitPrice: { toString(): string };
    lineTotal: { toString(): string };
    observations: string | null;
    productId: string | null;
  }[];
}) {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    subtotal: Number(order.subtotal),
    total: Number(order.total),
    notes: order.notes,
    whatsappSent: order.whatsappSent,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    customer: order.customer,
    items: order.items.map((i) => ({
      ...i,
      unitPrice: Number(i.unitPrice),
      lineTotal: Number(i.lineTotal),
    })),
  };
}

adminOrdersRouter.get("/", async (req, res) => {
  try {
    const status =
      typeof req.query.status === "string" ? req.query.status : undefined;

    const orders = await prisma.order.findMany({
      where: {
        ...notDeleted,
        ...(status && STATUS_VALUES.has(status)
          ? { status: status as OrderStatus }
          : {}),
      },
      include: {
        customer: true,
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(orders.map(serializeOrder));
  } catch (error) {
    console.error("[admin/orders]", error);
    res.status(500).json({ error: "Erro ao listar pedidos" });
  }
});

adminOrdersRouter.get("/:id", async (req, res) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: req.params.id, ...notDeleted },
      include: { customer: true, items: true },
    });
    if (!order) {
      res.status(404).json({ error: "Pedido não encontrado" });
      return;
    }
    res.json(serializeOrder(order));
  } catch (error) {
    console.error("[admin/order]", error);
    res.status(500).json({ error: "Erro ao buscar pedido" });
  }
});

adminOrdersRouter.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body as { status?: string };
    if (!status || !STATUS_VALUES.has(status)) {
      res.status(400).json({ error: "Status inválido" });
      return;
    }

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status: status as OrderStatus },
      include: { customer: true, items: true },
    });

    res.json(serializeOrder(order));
  } catch (error) {
    console.error("[admin/order status]", error);
    res.status(500).json({ error: "Erro ao atualizar status" });
  }
});

adminOrdersRouter.delete("/:id", async (req, res) => {
  try {
    await prisma.order.update({
      where: { id: req.params.id },
      data: { deletedAt: new Date(), status: OrderStatus.CANCELLED },
    });
    res.json({ success: true });
  } catch (error) {
    console.error("[admin/order delete]", error);
    res.status(500).json({ error: "Erro ao excluir pedido" });
  }
});
