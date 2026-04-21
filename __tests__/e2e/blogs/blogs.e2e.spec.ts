import { setupApp } from "../../../src/setup-app";
import request from "supertest";
import express from "express";
import { generateBasicAuthToken } from "../../utils/generate-admin-auth-token";

describe("Blogs API ", () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();
});
