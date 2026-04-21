import request from "supertest";
import { Express } from "express";
import { Blog } from "../../../src/blogs/types/blogs.type";
import { BLOGS_PATH } from "../../../src/core/paths/paths";
import { HttpStatus } from "../../../src/core/types/http-statuses";

export async function getBlogById(app: Express, blogId: string): Promise<Blog> {
  const blogResponse = await request(app)
    .get(`${BLOGS_PATH}/${blogId}`)
    .expect(HttpStatus.Ok);
  return blogResponse.body;
}
