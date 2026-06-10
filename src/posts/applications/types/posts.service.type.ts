import { Result } from "../../../core/result/result.type";
import { CreatePostByBlogIdInputDto } from "../../dto/create-post-by-blog-id.input.dto";
import { CreatePostInputDto } from "../../dto/create-post.input.dto";
import { UpdatePostInputDto } from "../../dto/update-post.input.dto";
import { PostEntity } from "../../types/domain/post-entity.model";

export type PostsService = {
  findPostById(id: string): Promise<Result<PostEntity>>;

  createPost(dto: CreatePostInputDto): Promise<Result<string>>;

  updatePost(id: string, dto: UpdatePostInputDto): Promise<Result<null>>;

  deletePost(id: string): Promise<Result<null>>;

  deletePostsByBlogId(blogId: string): Promise<void>;

  createPostByBlogId(
    id: string,
    dto: CreatePostByBlogIdInputDto,
  ): Promise<Result<string>>;
};
