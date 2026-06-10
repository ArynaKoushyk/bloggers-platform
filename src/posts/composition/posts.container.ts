import { mongoBlogsRepository } from "../../blogs/repositories/mongo-blogs.repository";
import { createPostsService } from "../applications/posts.service";
import { mongoPostsRepository } from "../repositories/mongo-posts.repository";

export const postsService = createPostsService(
  mongoPostsRepository,
  mongoBlogsRepository,
);
