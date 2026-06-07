import { WithId } from "mongodb";
import { postsRepository } from "../repositories/posts.repository";
import { Post } from "../types/domain/post.type";
import { PostInputDto } from "../dto/post-input.dto";
import { blogsRepository } from "../../blogs/repositories/blogs.repository";
import { ResultStatus } from "../../core/result/resultCode";
import { Result } from "../../core/result/result.type";
import { blogsService } from "../../blogs/applications/blogs.service";
import { BlogPostModel } from "../types/post-blog.input.type";
import { PostQueryInput } from "../types/post-query.input";
import { PaginatedViewModel } from "../../core/types/paginated-view.model";
import { query } from "express-validator";

export const postsService = {
  async findAllPosts(query: PostQueryInput): Promise<Result<PaginatedViewModel<WithId<Post>>>> {
    const { items, totalCount } = await postsRepository.findAllPosts(query);
    return {
      status: ResultStatus.Success,
      data: {
        pagesCount: Math.ceil(totalCount / query.pageSize),
        page: query.pageNumber,
        pageSize: query.pageSize,
        totalCount,
        items,
      },
      errorsMessages: null,
    };
  },

  async findPostById(id: string): Promise<Result<WithId<Post>>> {
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

  async createPost(dto: PostInputDto): Promise<Result<WithId<Post>>> {
    const { title, shortDescription, content, blogId } = dto;
    const blog = await blogsRepository.findBlogById(blogId);
    if (!blog) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        errorsMessages: [{ field: "blogId", message: "Blog not found" }],
      };
    }
    const newPost: Post = {
      title,
      shortDescription,
      content,
      blogId,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };
    const createdPost = await postsRepository.createPost(newPost);
    return {
      status: ResultStatus.Success,
      data: createdPost,
      errorsMessages: null,
    };
  },

  async updatePost(id: string, dto: PostInputDto): Promise<Result<null>> {
    const { blogId } = dto;
    const blog = await blogsRepository.findBlogById(blogId);
    if (!blog) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        errorsMessages: [{ field: "blogId", message: "Blog not found" }],
      };
    }
    const isUpdated = await postsRepository.updatePost(id, { ...dto, blogName: blog.name });
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
    return await postsRepository.deletePostByBlogId(blogId);
  },

  async findPostsByBlogId(
    blogId: string,
    query: PostQueryInput,
  ): Promise<Result<PaginatedViewModel<WithId<Post>>>> {
    const blog = await blogsService.findBlogById(blogId);
    if (blog.status !== ResultStatus.Success) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        errorsMessages: null,
      };
    }

    const { items, totalCount } = await postsRepository.findPostsByBlogId(blogId, query);
    return {
      status: ResultStatus.Success,
      data: {
        pagesCount: Math.ceil(totalCount / query.pageSize),
        page: query.pageNumber,
        pageSize: query.pageSize,
        totalCount,
        items,
      },
      errorsMessages: null,
    };
  },

  async createPostByBlogId(blogId: string, dto: BlogPostModel): Promise<Result<WithId<Post>>> {
    const { title, shortDescription, content } = dto;
    const blog = await blogsRepository.findBlogById(blogId);
    if (!blog) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        errorsMessages: null,
      };
    }
    const newPost: Post = {
      title,
      shortDescription,
      content,
      blogId,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };
    const createdPost = await postsRepository.createPost(newPost);
    return {
      status: ResultStatus.Success,
      data: createdPost,
      errorsMessages: null,
    };
  },
};
