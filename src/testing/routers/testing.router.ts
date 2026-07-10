import { Request, Response, Router } from "express";
import {
  blogCollection,
  commentCollection,
  postCollection,
  userCollection,
  refreshSessionsCollection,
} from "../../db/mongo.db";
import { HttpStatus } from "../../core/types/http-statuses";
export const testingRouter = Router({});
testingRouter.delete("/all-data", async (req: Request, res: Response) => {
  console.log("data deleted");
  await Promise.all([
    blogCollection.deleteMany({}),
    postCollection.deleteMany({}),
    userCollection.deleteMany({}),
    commentCollection.deleteMany({}),
    refreshSessionsCollection.deleteMany({}),
  ]);
  return res.sendStatus(HttpStatus.NoContent);
});
