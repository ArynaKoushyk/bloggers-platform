import express from "express";
import request from "supertest";
import { setupApp } from "../../../src/setup-app";
import { generateBasicAuthToken } from "../../utils/generate-admin-auth-token";
import { clearDb } from "../../utils/clear-db";
import { BLOGS_PATH } from "../../../src/core/paths/paths";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { getBlogDto } from "../../utils/blogs/get-blog-dto";

describe("Blogs API body validation check", () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  beforeEach(async () => {
    await clearDb(app);
  });

  it(`should return 401 if user unauthorized; POST /blogs`, async () => {
    await request(app)
      .post(BLOGS_PATH)
      .send({})
      .expect(HttpStatus.Unauthorized);
  });

  it.each([
    [{ name: "" }, "name"],
    [{ name: "   " }, "name"],
    [{ name: 123 }, "name"],
    [{ name: "1234567890123456" }, "name"],

    [{ description: "" }, "description"],
    [{ description: "   " }, "description"],
    [{ description: 123 }, "description"],
    [{ description: "a".repeat(501) }, "description"],

    [{ websiteUrl: "" }, "websiteUrl"],
    [{ websiteUrl: "   " }, "websiteUrl"],
    [{ websiteUrl: 123 }, "websiteUrl"],
    [{ websiteUrl: "http://example.com" }, "websiteUrl"],
    [{ websiteUrl: "invalid-url" }, "websiteUrl"],
  ])(
    "should not create blog with incorrect data",
    async (invalidBody, field) => {
      const invalidData = {
        ...getBlogDto,
        ...invalidBody,
      };
      const response = await request(app)
        .post(BLOGS_PATH)
        .set("Authorization", adminToken)
        .send(invalidData)
        .expect(HttpStatus.BadRequest);
    },
  );
});
