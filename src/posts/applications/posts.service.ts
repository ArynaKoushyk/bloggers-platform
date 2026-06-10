import { ResultStatus } from "../../core/result/resultCode";
import { Result } from "../../core/result/result.type";
import { PostsService } from "./types/posts.service.type";
import { PostsRepository } from "./types/posts.repository.type";
import { BlogsRepository } from "../../blogs/applications/types/blogs.repository.type";
import { PostEntity } from "../types/domain/post-entity.model";
import { CreatePostInputDto } from "../dto/create-post.input.dto";
import { UpdatePostInputDto } from "../dto/update-post.input.dto";
import { CreatePostData } from "../types/data/create-post.data";
import { UpdatePostData } from "../types/data/update-post.data";
import { CreatePostByBlogIdInputDto } from "../dto/create-post-by-blog-id.input.dto";

export const createPostsService = (
  postsRepository: PostsRepository,
  blogsRepository: BlogsRepository,
): PostsService => {
  return {
    async findPostById(id: string): Promise<Result<PostEntity>> {
      const post = await postsRepository.findPostById(id);
      if (!post) {
        return {
          status: ResultStatus.NotFound,
          data: null,
          errorsMessages: null,
        };
      }
      return {
        status: ResultStatus.Success,
        data: post,
        errorsMessages: null,
      };
    },

    async createPost(dto: CreatePostInputDto): Promise<Result<string>> {
      const { title, shortDescription, content, blogId } = dto;
      const blog = await blogsRepository.findBlogById(blogId);
      if (!blog) {
        return {
          status: ResultStatus.BadRequest,
          data: null,
          errorsMessages: [{ field: "blogId", message: "Blog not found" }],
        };
      }
      const createData: CreatePostData = {
        title,
        shortDescription,
        content,
        blogId,
        blogName: blog.name,
        createdAt: new Date().toISOString(),
      };
      const postId = await postsRepository.createPost(createData);
      return {
        status: ResultStatus.Success,
        data: postId,
        errorsMessages: null,
      };
    },

    async updatePost(id: string, dto: UpdatePostInputDto): Promise<Result<null>> {
      const { title, shortDescription, content, blogId } = dto;
      const blog = await blogsRepository.findBlogById(blogId);
      if (!blog) {
        return {
          status: ResultStatus.BadRequest,
          data: null,
          errorsMessages: [{ field: "blogId", message: "Blog not found" }],
        };
      }

      const updateData: UpdatePostData = {
        title,
        shortDescription,
        content,
        blogId,
        blogName: blog.name,
      };
      const isUpdated = await postsRepository.updatePost(id, updateData);
      if (!isUpdated) {
        return {
          status: ResultStatus.NotFound,
          data: null,
          errorsMessages: null,
        };
      }
      return {
        status: ResultStatus.Success,
        data: null,
        errorsMessages: null,
      };
    },

    async deletePost(id: string): Promise<Result<null>> {
      const isDeleted = await postsRepository.deletePost(id);
      if (!isDeleted) {
        return {
          status: ResultStatus.NotFound,
          data: null,
          errorsMessages: null,
        };
      }
      return {
        status: ResultStatus.Success,
        data: null,
        errorsMessages: null,
      };
    },

    async deletePostsByBlogId(blogId: string): Promise<void> {
      return await postsRepository.deletePostsByBlogId(blogId);
    },

    //!! использовать репозиторий блогов или сервис ?
    async createPostByBlogId(
      blogId: string,
      dto: CreatePostByBlogIdInputDto,
    ): Promise<Result<string>> {
      const { title, shortDescription, content } = dto;
      const blog = await blogsRepository.findBlogById(blogId);
      if (!blog) {
        return {
          status: ResultStatus.NotFound,
          data: null,
          errorsMessages: null,
        };
      }
      const createData: CreatePostData = {
        title,
        shortDescription,
        content,
        blogId,
        blogName: blog.name,
        createdAt: new Date().toISOString(),
      };
      const postId = await postsRepository.createPost(createData);
      return {
        status: ResultStatus.Success,
        data: postId,
        errorsMessages: null,
      };
    },
  };
};
