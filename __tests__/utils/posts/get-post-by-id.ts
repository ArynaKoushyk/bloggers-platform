import request from "supertest";
import { Express } from "express";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { Post } from "../../../src/posts/types/post.type";
import { POSTS_PATH } from "../../../src/core/paths/paths";
import { generateBasicAuthToken } from "../generate-admin-auth-token";

export async function getPostById(app: Express, postId: string): Promise<Post> {
  const getResponse = await request(app)
    .get(`&{POSTS_PATH}/${postId}`)
    .set("Authorization", generateBasicAuthToken())
    .expect(HttpStatus.Ok);

  return getResponse.body;
}
