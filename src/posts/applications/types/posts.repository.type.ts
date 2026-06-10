import { CreatePostData } from "../../types/data/create-post.data";
import { UpdatePostData } from "../../types/data/update-post.data";
import { PostEntity } from "../../types/domain/post-entity.model";

export type PostsRepository = {
  findPostById(id: string): Promise<PostEntity | null>;

  createPost(data: CreatePostData): Promise<string>;

  updatePost(id: string, data: UpdatePostData): Promise<boolean>;

  deletePost(id: string): Promise<boolean>;

  deletePostsByBlogId(blogId: string): Promise<void>;
};
