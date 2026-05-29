import { Router } from "express";
import { requireAdminKey } from "../../middleware/adminAuth";
import { adminAuthRouter } from "./auth";
import { adminDashboardRouter } from "./dashboard";
import { adminProductsRouter } from "./products";
import { adminCategoriesRouter } from "./categories";
import { adminOrdersRouter } from "./orders";
import { adminCustomersRouter } from "./customers";
import { adminUploadRouter } from "./upload";

export const adminRouter = Router();

adminRouter.use("/auth", adminAuthRouter);
adminRouter.use(requireAdminKey);
adminRouter.use("/dashboard", adminDashboardRouter);
adminRouter.use("/products", adminProductsRouter);
adminRouter.use("/categories", adminCategoriesRouter);
adminRouter.use("/orders", adminOrdersRouter);
adminRouter.use("/customers", adminCustomersRouter);
adminRouter.use("/upload", adminUploadRouter);
