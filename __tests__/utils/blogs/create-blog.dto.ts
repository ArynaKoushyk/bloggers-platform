import { BlogInputDto } from "../../../src/blogs/dto/blog-input.dto";
import { Express } from "express";
import request from "supertest";
import { Blog } from "../../../src/blogs/types/blogs.type";
import { getBlogDto } from "./get-blog-dto";
import { BLOGS_PATH } from "../../../src/core/paths/paths";
import { generateBasicAuthToken } from "../generate-admin-auth-token";
import { HttpStatus } from "../../../src/core/types/http-statuses";

export async function createBlog(
  app: Express,
  blogDto: BlogInputDto,
): Promise<Blog> {
  const defaultBlog: BlogInputDto = getBlogDto();
  const testBlogData = { ...defaultBlog, ...blogDto };
  const createdBlogResponse = await request(app)
    .post(BLOGS_PATH)
    .set("Authorization", generateBasicAuthToken())
    .send(testBlogData)
    .expect(HttpStatus.Created);
  return createdBlogResponse.body;
}
