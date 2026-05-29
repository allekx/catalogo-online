import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { notDeleted } from "../../lib/db";

export const adminCustomersRouter = Router();

adminCustomersRouter.get("/", async (_req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      where: notDeleted,
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { orders: { where: notDeleted } } },
        orders: {
          where: notDeleted,
          take: 1,
          orderBy: { createdAt: "desc" },
          select: { total: true, createdAt: true },
        },
      },
    });

    res.json(
      customers.map((c) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        city: c.city,
        state: c.state,
        notes: c.notes,
        ordersCount: c._count.orders,
        lastOrderAt: c.orders[0]?.createdAt?.toISOString() ?? null,
        lastOrderTotal: c.orders[0] ? Number(c.orders[0].total) : null,
        createdAt: c.createdAt.toISOString(),
      }))
    );
  } catch (error) {
    console.error("[admin/customers]", error);
    res.status(500).json({ error: "Erro ao listar clientes" });
  }
});

adminCustomersRouter.get("/:id", async (req, res) => {
  try {
    const customer = await prisma.customer.findFirst({
      where: { id: req.params.id, ...notDeleted },
      include: {
        orders: {
          where: notDeleted,
          orderBy: { createdAt: "desc" },
          include: { items: true },
        },
      },
    });
    if (!customer) {
      res.status(404).json({ error: "Cliente não encontrado" });
      return;
    }
    res.json({
      ...customer,
      createdAt: customer.createdAt.toISOString(),
      updatedAt: customer.updatedAt.toISOString(),
      orders: customer.orders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        status: o.status,
        total: Number(o.total),
        createdAt: o.createdAt.toISOString(),
        itemsCount: o.items.length,
      })),
    });
  } catch (error) {
    console.error("[admin/customer]", error);
    res.status(500).json({ error: "Erro ao buscar cliente" });
  }
});

adminCustomersRouter.post("/", async (req, res) => {
  try {
    const { name, email, phone, city, state, notes } = req.body as {
      name?: string;
      email?: string;
      phone?: string;
      city?: string;
      state?: string;
      notes?: string;
    };
    if (!name?.trim()) {
      res.status(400).json({ error: "Nome obrigatório" });
      return;
    }
    const customer = await prisma.customer.create({
      data: {
        name: name.trim(),
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        city: city?.trim() || null,
        state: state?.trim() || null,
        notes: notes?.trim() || null,
      },
    });
    res.status(201).json(customer);
  } catch (error) {
    console.error("[admin/customers create]", error);
    res.status(500).json({ error: "Erro ao criar cliente" });
  }
});

adminCustomersRouter.delete("/:id", async (req, res) => {
  try {
    await prisma.customer.update({
      where: { id: req.params.id },
      data: { deletedAt: new Date() },
    });
    res.json({ success: true });
  } catch (error) {
    console.error("[admin/customers delete]", error);
    res.status(500).json({ error: "Erro ao excluir cliente" });
  }
});
