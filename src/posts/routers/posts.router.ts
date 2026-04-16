import { Router } from "express";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard-middleware";
export const postsRouter = Router({});
postsRouter.use(superAdminGuardMiddleware);

postsRouter.get("");

postsRouter.get("/:id");

postsRouter.post("");

postsRouter.put("/:id");

postsRouter.delete("/:id");
