import { setupApp } from "../../../src/setup-app";
import request from "supertest";
import express from "express";
import { generateBasicAuthToken } from "../../utils/generate-admin-auth-token";
import { clearDb } from "../../utils/clear-db";
import { getBlogDto } from "../../utils/blogs/get-blog-dto";
import { createBlog } from "../../utils/blogs/create-blog.dto";
import { BLOGS_PATH } from "../../../src/core/paths/paths";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { getBlogById } from "../../utils/blogs/get-blog-by-id";
import { BlogInputDto } from "../../../src/blogs/dto/blog-input.dto";
import { updateBlog } from "../../utils/blogs/update-blog-dto";

describe("Blogs API ", () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  beforeEach(async () => {
    await clearDb(app);
  });

  describe("POST /blogs", () => {
    it("should create blog", async () => {
      const newBlog: BlogInputDto = {
        ...getBlogDto(),
        name: "TechInsights2",
        description: "Latest trends and insights in software development",
      };
      await createBlog(app, newBlog);
    });
  });

  describe("GET /blogs", () => {
    it("should get all blogs", async () => {
      await createBlog(app, getBlogDto());
      await createBlog(app, getBlogDto());
      const response = await request(app).get(BLOGS_PATH).expect(HttpStatus.Ok);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toEqual(2);
    });
  });

  describe("GET /blogs/:id", () => {
    it("should get blog", async () => {
      const createdBlog = await createBlog(app, getBlogDto());
      const blog = await getBlogById(app, createdBlog.id);
      expect(blog).toEqual({
        ...createdBlog,
        id: expect.any(String),
      });
    });
  });

  describe("PUT /blogs/:id", () => {
    it("should update blog", async () => {
      const createdBlog = await createBlog(app, getBlogDto());
      const blogUpdateDate: BlogInputDto = {
        name: "TechInsights2",
        description: "Latest trends and insights in software development",
        websiteUrl: "https://techinsights2.example.com",
      };
      await updateBlog(app, createdBlog.id, blogUpdateDate);

      const response = await getBlogById(app, createdBlog.id);
      expect(response).toEqual({
        ...blogUpdateDate,
        id: expect.any(String),
      });
    });
  });

  describe("DELETE /blogs/:id", () => {
    it("should delete blog", async () => {
      const createdBlog = await createBlog(app, getBlogDto());
      await request(app)
        .delete(`${BLOGS_PATH}/${createdBlog.id}`)
        .set("Authorization", adminToken)
        .expect(HttpStatus.NoContent);

      await request(app)
        .get(`${BLOGS_PATH}/${createdBlog.id}`)
        .set("Authorization", adminToken)
        .expect(HttpStatus.NotFound);
    });
  });
});
