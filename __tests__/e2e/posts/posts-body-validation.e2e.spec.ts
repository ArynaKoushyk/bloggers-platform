import express from "express";
import request from "supertest";
import { setupApp } from "../../../src/setup-app";
import { generateBasicAuthToken } from "../../utils/generate-admin-auth-token";
import { clearDb } from "../../utils/clear-db";
import { BLOGS_PATH, POSTS_PATH } from "../../../src/core/paths/paths";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { getBlogDto } from "../../utils/blogs/get-blog-dto";
import { createBlog } from "../../utils/blogs/create-blog.dto";
import { getPostDto } from "../../utils/posts/get-post-dto";

describe("Posts API body validation check", () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  beforeEach(async () => {
    await clearDb(app);
  });

  it(`should return 401 if user unauthorized; POST /posts`, async () => {
    await request(app)
      .post(POSTS_PATH)
      .send({})
      .expect(HttpStatus.Unauthorized);
  });

  it.each([
    [{ blogId: "" }, "blogId"],
    [{ blogId: "   " }, "blogId"],
    [{ blogId: 123 }, "blogId"],
    [{ blogId: "abc" }, "blogId"],
    [{ blogId: "12abc34" }, "blogId"],
    [{ blogId: "0" }, "blogId"],

    [{ title: "" }, "title"],
    [{ title: "   " }, "title"],
    [{ title: 123 }, "title"],
    [{ title: "1234567890123456" }, "title"],
    [{ title: "a".repeat(31) }, "title"],

    [{ shortDescription: "" }, "shortDescription"],
    [{ shortDescription: "   " }, "shortDescription"],
    [{ shortDescription: 123 }, "shortDescription"],
    [{ shortDescription: "a".repeat(100) }, "shortDescription"],

    [{ content: "" }, "content"],
    [{ content: "   " }, "content"],
    [{ content: 123 }, "content"],
    [{ content: "a".repeat(1001) }, "content"],
  ])(
    "should not create post with incorrect data",
    async (invalidBody, field) => {
      const blog = await createBlog(app, getBlogDto());
      const blogId = blog.id;
      const invalidData = {
        ...getPostDto(blogId),
        ...invalidBody,
      };
      const response = await request(app)
        .post(POSTS_PATH)
        .set("Authorization", adminToken)
        .send(invalidData)
        .expect(HttpStatus.BadRequest);

      expect(response.body).toEqual({
        errorsMessages: expect.arrayContaining([
          expect.objectContaining({
            field,
            message: expect.any(String),
          }),
        ]),
      });
    },
  );
});
