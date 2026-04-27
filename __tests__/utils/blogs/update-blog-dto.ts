import { BlogInputDto } from "../../../src/blogs/dto/blog-input.dto";
import { Express } from "express";
import request from "supertest";
import { Blog } from "../../../src/blogs/types/blogs.type";
import { getBlogDto } from "./get-blog-dto";
import { BLOGS_PATH } from "../../../src/core/paths/paths";
import { generateBasicAuthToken } from "../generate-admin-auth-token";
import { HttpStatus } from "../../../src/core/types/http-statuses";

export async function updateBlog(
  app: Express,
  blogId: string,
  blogDto: BlogInputDto,
): Promise<void> {
  const defaultBlog: BlogInputDto = getBlogDto();
  const testBlogData = { ...defaultBlog, ...blogDto };
  await request(app)
    .put(`${BLOGS_PATH}/${blogId}`)
    .set("Authorization", generateBasicAuthToken())
    .send(testBlogData)
    .expect(HttpStatus.NoContent);
  return;
}
