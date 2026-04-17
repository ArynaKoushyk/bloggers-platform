import { Router } from "express";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard-middleware";
import { getPostHandler } from "./handlers/get-post.handler";
import { getPostListHandler } from "./handlers/get-post-list.handler";
import { createPostHandler } from "./handlers/create-post.handler";
import { updatePostHandler } from "./handlers/update-post.handler";
import { deletePostHandler } from "./handlers/delete-post.hamdler";

export const postsRouter = Router({});
postsRouter.use(superAdminGuardMiddleware);

postsRouter.get("", getPostListHandler);

postsRouter.get("/:id", getPostHandler);

postsRouter.post("", createPostHandler, superAdminGuardMiddleware);

postsRouter.put("/:id", updatePostHandler, superAdminGuardMiddleware);

postsRouter.delete("/:id", deletePostHandler, superAdminGuardMiddleware);
