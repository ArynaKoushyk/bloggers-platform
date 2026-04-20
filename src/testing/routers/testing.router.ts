import { Router } from "express";
import { db } from "../../db/in-memory.db";
export const testingRouter = Router({});
testingRouter.delete("/all-data", (req, res) => {
  console.log("data deleted");
  db.blogs.length = 0;
  db.posts.length = 0;
  return res.sendStatus(204);
});
