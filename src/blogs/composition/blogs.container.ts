import { createBlogsService } from "../applications/blogs.service";
import { mongoBlogsRepository } from "../repositories/mongo-blogs.repository";

export const blogsService = createBlogsService(mongoBlogsRepository);
