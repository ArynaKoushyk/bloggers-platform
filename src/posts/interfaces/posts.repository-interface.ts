import { PostDocument } from "../infrastructure/persistence/mongoose/post.model";

export interface IPostsRepository {
  findPostById(id: string): Promise<PostDocument | null>;
  save(post: PostDocument): Promise<void>;
  deletePost(id: string): Promise<boolean>;
  deletePostsByBlogId(blogId: string): Promise<void>;
}
