import { PostInputDto } from "../../../src/posts/dto/post-input.dto";
import request from "supertest";
import { Express } from "express";
import { createBlog } from "../blogs/create-blog.dto";
import { getBlogDto } from "../blogs/get-blog-dto";
import { getPostDto } from "./get-post-dto";
import { POSTS_PATH } from "../../../src/core/paths/paths";
import { generateBasicAuthToken } from "../generate-admin-auth-token";
import { HttpStatus } from "../../../src/core/types/http-statuses";

export async function updatePost(
  app: Express,
  postId: string,
  postDto?: PostInputDto,
): Promise<void> {
  const blog = await createBlog(app, getBlogDto());
  const defaultPostData = getPostDto(blog.id);

  const testPostData = {
    ...defaultPostData,
    ...postDto,
  };

  await request(app)
    .put(`${POSTS_PATH}/${postId}`)
    .set("Authorization", generateBasicAuthToken())
    .send(testPostData)
    .expect(HttpStatus.NoContent);
  return;
}
