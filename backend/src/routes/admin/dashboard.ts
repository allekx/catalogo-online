import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { notDeleted } from "../../lib/db";

export const adminDashboardRouter = Router();

adminDashboardRouter.get("/stats", async (_req, res) => {
  try {
    const [
      productsCount,
      ordersCount,
      whatsappAgg,
      topViewed,
      recentOrders,
    ] = await Promise.all([
      prisma.product.count({ where: notDeleted }),
      prisma.order.count({ where: notDeleted }),
      prisma.product.aggregate({
        where: notDeleted,
        _sum: { whatsappClicks: true },
      }),
      prisma.product.findMany({
        where: notDeleted,
        orderBy: { viewCount: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          slug: true,
          viewCount: true,
          whatsappClicks: true,
        },
      }),
      prisma.order.findMany({
        where: notDeleted,
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          customer: { select: { name: true } },
        },
      }),
    ]);

    res.json({
      productsCount,
      ordersCount,
      whatsappClicksTotal: whatsappAgg._sum.whatsappClicks ?? 0,
      topViewed,
      recentOrders: recentOrders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        status: o.status,
        total: Number(o.total),
        customerName: o.customer.name,
        createdAt: o.createdAt,
      })),
    });
  } catch (error) {
    console.error("[admin/dashboard]", error);
    res.status(500).json({ error: "Erro ao carregar dashboard" });
  }
});
