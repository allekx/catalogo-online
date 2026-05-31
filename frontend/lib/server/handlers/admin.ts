import type { NextRequest } from "next/server";
import { OrderStatus } from "@prisma/client";
import { serverEnv } from "../env";
import { prisma } from "../prisma";
import { archiveSlug, notDeleted, productWithImagesInclude } from "../db";
import { syncProductImages } from "../product-images";
import {
  serializeAdminProduct,
} from "../serializers/product";
import { slugify, uniqueProductSlug } from "../slug";
import { apiError, json } from "../http";
import { requireDatabase } from "../guards";
import { revalidateCatalogData } from "../revalidate-catalog";

export async function adminLogin(request: NextRequest) {
  const { password } = (await request.json()) as { password?: string };
  if (!password || password !== serverEnv.adminPassword) {
    return apiError("Senha inválida", 401);
  }
  return json({ token: serverEnv.adminApiKey, expiresIn: null });
}

export async function adminDashboardStats() {
  const db = requireDatabase();
  if (db) return db;

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
        include: { customer: { select: { name: true } } },
      }),
    ]);

    return json({
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
    return apiError("Erro ao carregar dashboard", 500);
  }
}

async function slugExists(slug: string, excludeId?: string) {
  const found = await prisma.product.findFirst({
    where: {
      slug,
      ...notDeleted,
      ...(excludeId ? { NOT: { id: excludeId } } : {}),
    },
  });
  return Boolean(found);
}

export async function adminListProducts() {
  try {
    const products = await prisma.product.findMany({
      where: notDeleted,
      include: productWithImagesInclude,
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    });
    return json(products.map(serializeAdminProduct));
  } catch (error) {
    console.error("[admin/products]", error);
    return apiError("Erro ao listar produtos", 500);
  }
}

export async function adminGetProduct(id: string) {
  try {
    const product = await prisma.product.findFirst({
      where: { id, ...notDeleted },
      include: productWithImagesInclude,
    });
    if (!product) return apiError("Produto não encontrado", 404);
    return json(serializeAdminProduct(product));
  } catch (error) {
    console.error("[admin/product]", error);
    return apiError("Erro ao buscar produto", 500);
  }
}

export async function adminCreateProduct(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const name = String(body.name ?? "").trim();
    if (!name) return apiError("Nome obrigatório", 400);

    const categoryId = String(body.categoryId ?? "");
    const category = await prisma.category.findFirst({
      where: { id: categoryId, ...notDeleted },
    });
    if (!category) return apiError("Categoria inválida", 400);

    const slug =
      typeof body.slug === "string" && body.slug.trim()
        ? slugify(body.slug)
        : await uniqueProductSlug(name, slugExists);

    const imageUrls = Array.isArray(body.images)
      ? (body.images as string[]).filter(Boolean)
      : [];
    const imageUrl = String(body.imageUrl ?? "") || imageUrls[0] || "";
    if (!imageUrl) return apiError("Imagem principal obrigatória", 400);

    const urls = imageUrls.length ? imageUrls : [imageUrl];

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: String(body.description ?? ""),
        price: Number(body.price ?? 0),
        imageUrl: urls[0],
        cloudinaryPublicId:
          typeof body.cloudinaryPublicId === "string"
            ? body.cloudinaryPublicId
            : null,
        featured: Boolean(body.featured),
        isNew: Boolean(body.isNew),
        productType:
          typeof body.productType === "string" ? body.productType : null,
        active: body.active !== false,
        stock: Number(body.stock ?? 0),
        categoryId,
        images: {
          create: urls.map((url, index) => ({
            url,
            cloudinaryPublicId:
              index === 0 && typeof body.cloudinaryPublicId === "string"
                ? body.cloudinaryPublicId
                : null,
            sortOrder: index,
            isPrimary: index === 0,
          })),
        },
      },
      include: productWithImagesInclude,
    });

    revalidateCatalogData(product.slug);
    return json(serializeAdminProduct(product), 201);
  } catch (error) {
    console.error("[admin/products create]", error);
    return apiError("Erro ao criar produto", 500);
  }
}

export async function adminUpdateProduct(id: string, request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const existing = await prisma.product.findFirst({
      where: { id, ...notDeleted },
    });
    if (!existing) return apiError("Produto não encontrado", 404);

    let slug = existing.slug;
    if (typeof body.slug === "string" && body.slug.trim()) {
      slug = slugify(body.slug);
    } else if (typeof body.name === "string" && body.name !== existing.name) {
      slug = await uniqueProductSlug(body.name, (s) => slugExists(s, existing.id));
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(typeof body.name === "string" ? { name: body.name.trim() } : {}),
        slug,
        ...(typeof body.description === "string"
          ? { description: body.description }
          : {}),
        ...(body.price != null ? { price: Number(body.price) } : {}),
        ...(body.featured !== undefined
          ? { featured: Boolean(body.featured) }
          : {}),
        ...(body.isNew !== undefined ? { isNew: Boolean(body.isNew) } : {}),
        ...(body.productType !== undefined
          ? {
              productType:
                typeof body.productType === "string"
                  ? body.productType
                  : null,
            }
          : {}),
        ...(body.active !== undefined ? { active: Boolean(body.active) } : {}),
        ...(body.stock != null ? { stock: Number(body.stock) } : {}),
        ...(typeof body.categoryId === "string"
          ? { categoryId: body.categoryId }
          : {}),
      },
      include: productWithImagesInclude,
    });

    if (Array.isArray(body.images) && body.images.length) {
      await syncProductImages(
        product.id,
        body.images as string[],
        body.cloudinaryPublicId
          ? [String(body.cloudinaryPublicId)]
          : undefined
      );
    } else if (typeof body.imageUrl === "string" && body.imageUrl) {
      await syncProductImages(product.id, [body.imageUrl]);
    }

    const refreshed = await prisma.product.findUniqueOrThrow({
      where: { id: product.id },
      include: productWithImagesInclude,
    });

    revalidateCatalogData(refreshed.slug);
    if (existing.slug !== refreshed.slug) {
      revalidateCatalogData(existing.slug);
    }
    return json(serializeAdminProduct(refreshed));
  } catch (error) {
    console.error("[admin/products update]", error);
    return apiError("Erro ao atualizar produto", 500);
  }
}

export async function adminDeleteProduct(id: string) {
  try {
    const existing = await prisma.product.findFirst({
      where: { id, ...notDeleted },
    });
    if (!existing) {
      return json({ success: true, alreadyDeleted: true });
    }

    await prisma.$transaction([
      prisma.productImage.updateMany({
        where: { productId: id, ...notDeleted },
        data: { deletedAt: new Date() },
      }),
      prisma.favorite.updateMany({
        where: { productId: id, ...notDeleted },
        data: { deletedAt: new Date() },
      }),
      prisma.product.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          active: false,
          slug: archiveSlug(existing.slug, existing.id),
        },
      }),
    ]);

    revalidateCatalogData(existing.slug);
    return json({ success: true });
  } catch (error) {
    console.error("[admin/products delete]", error);
    return apiError("Erro ao excluir produto", 500);
  }
}

export async function adminListCategories() {
  const db = requireDatabase();
  if (db) return db;

  try {
    const categories = await prisma.category.findMany({
      where: notDeleted,
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: { products: { where: notDeleted } },
        },
      },
    });
    return json(categories);
  } catch (error) {
    console.error("[admin/categories]", error);
    return apiError("Erro ao listar categorias", 500);
  }
}

export async function adminCreateCategory(request: NextRequest) {
  const db = requireDatabase();
  if (db) return db;

  try {
    const { name, slug, imageUrl, sortOrder, description } =
      (await request.json()) as {
        name?: string;
        slug?: string;
        imageUrl?: string;
        sortOrder?: number;
        description?: string;
      };
    if (!name?.trim()) return apiError("Nome obrigatório", 400);

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug: slug?.trim() ? slugify(slug) : slugify(name),
        imageUrl: imageUrl ?? null,
        description: description?.trim() ?? null,
        sortOrder: sortOrder ?? 0,
      },
    });
    revalidateCatalogData();
    return json(category, 201);
  } catch (error) {
    console.error("[admin/categories create]", error);
    return apiError("Erro ao criar categoria", 500);
  }
}

export async function adminUpdateCategory(id: string, request: NextRequest) {
  try {
    const { name, slug, imageUrl, sortOrder, description, active } =
      (await request.json()) as {
        name?: string;
        slug?: string;
        imageUrl?: string;
        sortOrder?: number;
        description?: string;
        active?: boolean;
      };
    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name ? { name: name.trim() } : {}),
        ...(slug ? { slug: slugify(slug) } : {}),
        ...(imageUrl !== undefined ? { imageUrl } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(sortOrder != null ? { sortOrder } : {}),
        ...(active !== undefined ? { active } : {}),
      },
    });
    revalidateCatalogData();
    return json(category);
  } catch (error) {
    console.error("[admin/categories update]", error);
    return apiError("Erro ao atualizar categoria", 500);
  }
}

export async function adminDeleteCategory(id: string) {
  try {
    const count = await prisma.product.count({
      where: { categoryId: id, ...notDeleted },
    });
    if (count > 0) {
      return apiError("Categoria possui produtos vinculados", 400);
    }

    const existing = await prisma.category.findFirst({
      where: { id, ...notDeleted },
    });
    if (!existing) {
      return json({ success: true, alreadyDeleted: true });
    }

    await prisma.category.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        active: false,
        slug: archiveSlug(existing.slug, existing.id),
      },
    });

    revalidateCatalogData();
    return json({ success: true });
  } catch (error) {
    console.error("[admin/categories delete]", error);
    return apiError("Erro ao excluir categoria", 500);
  }
}

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

export async function adminListOrders(request: NextRequest) {
  try {
    const status = request.nextUrl.searchParams.get("status") ?? undefined;

    const orders = await prisma.order.findMany({
      where: {
        ...notDeleted,
        ...(status && STATUS_VALUES.has(status)
          ? { status: status as OrderStatus }
          : {}),
      },
      include: { customer: true, items: true },
      orderBy: { createdAt: "desc" },
    });

    return json(orders.map(serializeOrder));
  } catch (error) {
    console.error("[admin/orders]", error);
    return apiError("Erro ao listar pedidos", 500);
  }
}

export async function adminGetOrder(id: string) {
  try {
    const order = await prisma.order.findFirst({
      where: { id, ...notDeleted },
      include: { customer: true, items: true },
    });
    if (!order) return apiError("Pedido não encontrado", 404);
    return json(serializeOrder(order));
  } catch (error) {
    console.error("[admin/order]", error);
    return apiError("Erro ao buscar pedido", 500);
  }
}

export async function adminUpdateOrderStatus(id: string, request: NextRequest) {
  try {
    const { status } = (await request.json()) as { status?: string };
    if (!status || !STATUS_VALUES.has(status)) {
      return apiError("Status inválido", 400);
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status: status as OrderStatus },
      include: { customer: true, items: true },
    });

    return json(serializeOrder(order));
  } catch (error) {
    console.error("[admin/order status]", error);
    return apiError("Erro ao atualizar status", 500);
  }
}

export async function adminDeleteOrder(id: string) {
  try {
    await prisma.order.update({
      where: { id },
      data: { deletedAt: new Date(), status: OrderStatus.CANCELLED },
    });
    return json({ success: true });
  } catch (error) {
    console.error("[admin/order delete]", error);
    return apiError("Erro ao excluir pedido", 500);
  }
}

export async function adminListCustomers() {
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

    return json(
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
    return apiError("Erro ao listar clientes", 500);
  }
}

export async function adminGetCustomer(id: string) {
  try {
    const customer = await prisma.customer.findFirst({
      where: { id, ...notDeleted },
      include: {
        orders: {
          where: notDeleted,
          orderBy: { createdAt: "desc" },
          include: { items: true },
        },
      },
    });
    if (!customer) return apiError("Cliente não encontrado", 404);

    return json({
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
    return apiError("Erro ao buscar cliente", 500);
  }
}

export async function adminCreateCustomer(request: NextRequest) {
  try {
    const { name, email, phone, city, state, notes } =
      (await request.json()) as {
        name?: string;
        email?: string;
        phone?: string;
        city?: string;
        state?: string;
        notes?: string;
      };
    if (!name?.trim()) return apiError("Nome obrigatório", 400);

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
    return json(customer, 201);
  } catch (error) {
    console.error("[admin/customers create]", error);
    return apiError("Erro ao criar cliente", 500);
  }
}

export async function adminDeleteCustomer(id: string) {
  try {
    await prisma.customer.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return json({ success: true });
  } catch (error) {
    console.error("[admin/customers delete]", error);
    return apiError("Erro ao excluir cliente", 500);
  }
}
