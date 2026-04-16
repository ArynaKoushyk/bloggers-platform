import { Router } from "express";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard-middleware";
import { getBlogListHandler } from "./handlers/get-blog-list.handler";
import { getBlogHandler } from "./handlers/get-blog.handler";
import { createBlogHandler } from "./handlers/create-blog.handler";
import { updateBlogHandler } from "./handlers/update-blog.handler";
import { deleteBlogHandler } from "./handlers/delete-blog.handler";
export const blogsRouter = Router({});

blogsRouter.get("", getBlogListHandler);

blogsRouter.get("/:id", getBlogHandler);

blogsRouter.post("", createBlogHandler, superAdminGuardMiddleware);

blogsRouter.put("/:id", updateBlogHandler, superAdminGuardMiddleware);

blogsRouter.delete("/:id", deleteBlogHandler, superAdminGuardMiddleware);
