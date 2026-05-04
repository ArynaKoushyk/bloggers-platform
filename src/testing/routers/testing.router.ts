import { Request, Response, Router } from "express";
import { blogCollection, postCollection } from "../../db/mongo.db";
import { HttpStatus } from "../../core/types/http-statuses";
export const testingRouter = Router({});
testingRouter.delete("/all-data", (req: Request, res: Response) => {
  console.log("data deleted");
  Promise.all([blogCollection.deleteMany(), postCollection.deleteMany()]);
  return res.sendStatus(HttpStatus.NoContent);
});
