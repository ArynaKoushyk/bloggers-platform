import { mongoPostsRepository } from "../../posts/repositories/mongo-posts.repository";
import { createCommentsService } from "../applications/comments.service";
import { mongoCommentsRepository } from "../repositories/mongo-comments.repository";

export const commentsService = createCommentsService(mongoCommentsRepository, mongoPostsRepository);
