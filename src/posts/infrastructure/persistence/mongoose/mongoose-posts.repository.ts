import { injectable } from "inversify";
import { IPostsRepository } from "../../../interfaces/posts.repository-interface";
import { PostDocument, PostModel } from "./post.model";

@injectable()
export class MongoPostsRepository implements IPostsRepository {
  async findPostById(id: string): Promise<PostDocument | null> {
    return await PostModel.findById(id).exec();
  }

  async save(post: PostDocument): Promise<void> {
    await post.save();
  }

  async deletePost(id: string): Promise<boolean> {
    const deleteResult = await PostModel.deleteOne({ _id: id });
    return deleteResult.deletedCount === 1;
  }

  async deletePostsByBlogId(blogId: string): Promise<void> {
    await PostModel.deleteMany({ blogId: blogId });
    return;
  }
}
