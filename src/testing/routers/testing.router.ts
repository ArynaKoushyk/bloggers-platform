import { Request, Response, Router } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { BlogModel } from "../../blogs/infrastructure/persistence/mongoose/blog.model";
import { PostModel } from "../../posts/infrastructure/persistence/mongoose/post.model";
import { UserModel } from "../../users/infrastructure/persistence/mongoose/user.model";
import { CommentModel } from "../../comments/infrastructure/persistence/mongoose/comment.model";
import { AuthSessionModel } from "../../auth/infrastructure/persistence/mongoose/auth-session.model";
import { ApiRequestLogModel } from "../../request-logs/infrastructure/persistence/mongoose/api-request-log.model";
import { LikeModel } from "../../likes/infrastructure/persistence/mongoose/like.model";

export const testingRouter = Router({});
testingRouter.delete("/all-data", async (req: Request, res: Response) => {
  console.log("data deleted");
  await Promise.all([
    BlogModel.deleteMany({}),
    PostModel.deleteMany({}),
    UserModel.deleteMany({}),
    CommentModel.deleteMany({}),
    AuthSessionModel.deleteMany({}),
    ApiRequestLogModel.deleteMany({}),
    LikeModel.deleteMany({}),
  ]);
  return res.sendStatus(HttpStatus.NoContent);
});
