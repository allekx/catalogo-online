import { PrismaClient, OrderStatus } from "@prisma/client";

const prisma = new PrismaClient();

const IMG =
  "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=85";

async function main() {
  const categories = [
    { slug: "bolsas", name: "Bolsas", sortOrder: 1 },
    { slug: "kits", name: "Kits", sortOrder: 2 },
    { slug: "maternidade", name: "Maternidade", sortOrder: 3 },
    { slug: "mochilas", name: "Mochilas", sortOrder: 4 },
    { slug: "personalizadas", name: "Personalizadas", sortOrder: 5 },
    { slug: "necessaires", name: "Necessáires", sortOrder: 6 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      create: { ...cat, active: true },
      update: { name: cat.name, sortOrder: cat.sortOrder, active: true },
    });
  }

  const bolsas = await prisma.category.findUniqueOrThrow({
    where: { slug: "bolsas" },
  });

  const product = await prisma.product.upsert({
    where: { slug: "clutch-elegance-rose" },
    create: {
      slug: "clutch-elegance-rose",
      name: "Clutch Elegance Rosé",
      description: "Clutch sofisticada em tom rosé com acabamento premium.",
      price: 289.9,
      imageUrl: IMG,
      featured: true,
      isNew: false,
      productType: "clutch",
      stock: 8,
      viewCount: 142,
      whatsappClicks: 38,
      salesCount: 12,
      categoryId: bolsas.id,
      images: {
        create: [
          {
            url: IMG,
            sortOrder: 0,
            isPrimary: true,
            altText: "Clutch Elegance Rosé",
          },
        ],
      },
    },
    update: {
      viewCount: 142,
      whatsappClicks: 38,
    },
  });

  let customer = await prisma.customer.findFirst({
    where: { phone: "+55 11 99999-0000", deletedAt: null },
  });
  if (!customer) {
    customer = await prisma.customer.create({
      data: {
        name: "Maria Silva",
        email: "maria@email.com",
        phone: "+55 11 99999-0000",
        city: "São Paulo",
        state: "SP",
      },
    });
  }

  const existingOrder = await prisma.order.findFirst({
    where: { orderNumber: "LM-2026-0001" },
  });

  if (!existingOrder) {
    await prisma.order.create({
      data: {
        orderNumber: "LM-2026-0001",
        status: OrderStatus.WHATSAPP_SENT,
        customerId: customer.id,
        subtotal: 289.9,
        total: 289.9,
        whatsappSent: true,
        items: {
          create: {
            productId: product.id,
            name: product.name,
            quantity: 1,
            unitPrice: 289.9,
            lineTotal: 289.9,
          },
        },
      },
    });
  }

  await prisma.favorite.upsert({
    where: {
      productId_guestKey: {
        productId: product.id,
        guestKey: "seed-demo-guest",
      },
    },
    create: {
      productId: product.id,
      guestKey: "seed-demo-guest",
    },
    update: { deletedAt: null },
  });

  console.log("Seed concluído — categories, products, product_images, orders, favorites.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
