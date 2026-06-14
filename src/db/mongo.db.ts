import { Collection, Db, MongoClient } from "mongodb";
import { SETTINGS } from "../core/settings/settings";
import { BlogDbModel } from "../blogs/types/blog-db.model";
import { PostDbModel } from "../posts/types/post-db.model";
import { UserDbModel } from "../users/types/user-db.model";
import { CommentDbModel } from "../comments/types/comment-db.model";

const BLOG_COLLECTION_NAME = "blogs";
const POST_COLLECTION_NAME = "posts";
const USER_COLLECTION_NAME = "users";
const COMMENT_COLLECTION_NAME = "comments";

export let client: MongoClient;
export let blogCollection: Collection<BlogDbModel>;
export let postCollection: Collection<PostDbModel>;
export let userCollection: Collection<UserDbModel>;
export let commentCollection: Collection<CommentDbModel>;

export async function runDb(url: string): Promise<void> {
  client = new MongoClient(url);
  const db: Db = client.db(SETTINGS.DB_NAME);

  blogCollection = db.collection<BlogDbModel>(BLOG_COLLECTION_NAME);
  postCollection = db.collection<PostDbModel>(POST_COLLECTION_NAME);
  userCollection = db.collection<UserDbModel>(USER_COLLECTION_NAME);
  commentCollection = db.collection<CommentDbModel>(COMMENT_COLLECTION_NAME);
  try {
    await client.connect();
    await db.command({ ping: 1 });
    console.log("✅ Connected to the database");
  } catch (e) {
    await client.close();
    throw new Error(`❌ Database not connected: ${e}`);
  }
}
export async function stopDb() {
  if (!client) {
    throw new Error(`❌ No active client`);
  }
  await client.close();
}
