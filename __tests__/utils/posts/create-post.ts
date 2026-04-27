import { PostInputDto } from "../../../src/posts/dto/post-input.dto";
import request from "supertest";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { Express } from "express";
import { Post } from "../../../src/posts/types/post.type";
import { createBlog } from "../blogs/create-blog.dto";
import { getBlogDto } from "../blogs/get-blog-dto";
import { getPostDto } from "./get-post-dto";
import { POSTS_PATH } from "../../../src/core/paths/paths";
import { generateBasicAuthToken } from "../generate-admin-auth-token";

export async function createPost(
  app: Express,
  postDto?: PostInputDto,
): Promise<Post> {
  const blog = await createBlog(app, getBlogDto());
  const defaultPostData = getPostDto(blog.id);

  const testPostData = {
    ...defaultPostData,
    ...postDto,
  };

  const createdPostResponse = await request(app)
    .post(POSTS_PATH)
    .set("Authorization", generateBasicAuthToken())
    .send(testPostData)
    .expect(HttpStatus.Created);

  return createdPostResponse.body;
}
