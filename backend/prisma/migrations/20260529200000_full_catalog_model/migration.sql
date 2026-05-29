-- Le Maia — modelagem completa do catálogo (snake_case + soft delete)

-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'WHATSAPP_SENT', 'CONFIRMED', 'IN_PRODUCTION', 'SHIPPED', 'DELIVERED', 'CANCELLED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Categories
CREATE TABLE IF NOT EXISTS "categories" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "cloudinary_public_id" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "categories_slug_key" ON "categories"("slug");
CREATE INDEX IF NOT EXISTS "categories_slug_idx" ON "categories"("slug");
CREATE INDEX IF NOT EXISTS "categories_sort_order_idx" ON "categories"("sort_order");
CREATE INDEX IF NOT EXISTS "categories_active_idx" ON "categories"("active");
CREATE INDEX IF NOT EXISTS "categories_deleted_at_idx" ON "categories"("deleted_at");

-- Products
CREATE TABLE IF NOT EXISTS "products" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "image_url" TEXT NOT NULL,
    "cloudinary_public_id" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "is_new" BOOLEAN NOT NULL DEFAULT false,
    "product_type" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "sales_count" INTEGER NOT NULL DEFAULT 0,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "whatsapp_clicks" INTEGER NOT NULL DEFAULT 0,
    "category_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "products_slug_key" ON "products"("slug");
CREATE INDEX IF NOT EXISTS "products_category_id_idx" ON "products"("category_id");
CREATE INDEX IF NOT EXISTS "products_category_id_active_deleted_at_idx" ON "products"("category_id", "active", "deleted_at");
CREATE INDEX IF NOT EXISTS "products_featured_active_idx" ON "products"("featured", "active");
CREATE INDEX IF NOT EXISTS "products_deleted_at_idx" ON "products"("deleted_at");

-- Product images
CREATE TABLE IF NOT EXISTS "product_images" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "cloudinary_public_id" TEXT,
    "alt_text" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    CONSTRAINT "product_images_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "product_images_product_id_idx" ON "product_images"("product_id");
CREATE INDEX IF NOT EXISTS "product_images_product_id_sort_order_idx" ON "product_images"("product_id", "sort_order");

-- Customers
CREATE TABLE IF NOT EXISTS "customers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "city" TEXT,
    "state" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "customers_email_idx" ON "customers"("email");
CREATE INDEX IF NOT EXISTS "customers_phone_idx" ON "customers"("phone");
CREATE INDEX IF NOT EXISTS "customers_deleted_at_idx" ON "customers"("deleted_at");

-- Orders
CREATE TABLE IF NOT EXISTS "orders" (
    "id" TEXT NOT NULL,
    "order_number" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'WHATSAPP_SENT',
    "customer_id" TEXT NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "notes" TEXT,
    "whatsapp_sent" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "orders_order_number_key" ON "orders"("order_number");
CREATE INDEX IF NOT EXISTS "orders_status_idx" ON "orders"("status");
CREATE INDEX IF NOT EXISTS "orders_customer_id_idx" ON "orders"("customer_id");
CREATE INDEX IF NOT EXISTS "orders_created_at_idx" ON "orders"("created_at");

-- Order items
CREATE TABLE IF NOT EXISTS "order_items" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "product_id" TEXT,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "line_total" DECIMAL(10,2) NOT NULL,
    "observations" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "order_items_order_id_idx" ON "order_items"("order_id");

-- Favorites
CREATE TABLE IF NOT EXISTS "favorites" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "customer_id" TEXT,
    "guest_key" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "favorites_product_id_customer_id_key" ON "favorites"("product_id", "customer_id");
CREATE UNIQUE INDEX IF NOT EXISTS "favorites_product_id_guest_key_key" ON "favorites"("product_id", "guest_key");
CREATE INDEX IF NOT EXISTS "favorites_customer_id_deleted_at_idx" ON "favorites"("customer_id", "deleted_at");
CREATE INDEX IF NOT EXISTS "favorites_guest_key_deleted_at_idx" ON "favorites"("guest_key", "deleted_at");

-- Users
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" "Role" NOT NULL DEFAULT 'CUSTOMER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");

-- Foreign keys (idempotent)
DO $$ BEGIN
  ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "favorites" ADD CONSTRAINT "favorites_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "favorites" ADD CONSTRAINT "favorites_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;
