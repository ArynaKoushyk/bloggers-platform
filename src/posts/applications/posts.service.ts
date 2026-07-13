import { ResultStatus } from "../../core/result/resultCode";
import { Result } from "../../core/result/result.type";
import { PostEntity } from "../types/domain/post-entity.model";
import { CreatePostInputDto } from "../dto/create-post.input.dto";
import { UpdatePostInputDto } from "../dto/update-post.input.dto";
import { CreatePostData } from "../types/data/create-post.data";
import { UpdatePostData } from "../types/data/update-post.data";
import { CreatePostByBlogIdInputDto } from "../dto/create-post-by-blog-id.input.dto";
import { MongoPostsRepository } from "../repositories/mongo-posts.repository";
import { IBlogsRepository } from "../../blogs/interfaces/blogs.repository-interface";
import { MongoBlogsRepository } from "../../blogs/repositories/mongo-blogs.repository";
import { IPostsService } from "../interfaces/posts.service-interface";
import { IPostsRepository } from "../interfaces/posts.repository-interface";

export class PostsService implements IPostsService {
  constructor(
    private postsRepository: IPostsRepository,
    private blogsRepository: IBlogsRepository,
  ) {}
  async findPostById(id: string): Promise<Result<PostEntity>> {
    const post = await this.postsRepository.findPostById(id);
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
  }

  async createPost(dto: CreatePostInputDto): Promise<Result<string>> {
    const { title, shortDescription, content, blogId } = dto;
    const blog = await this.blogsRepository.findBlogById(blogId);
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
    const postId = await this.postsRepository.createPost(createData);
    return {
      status: ResultStatus.Success,
      data: postId,
      errorsMessages: null,
    };
  }
  async updatePost(id: string, dto: UpdatePostInputDto): Promise<Result<null>> {
    const { title, shortDescription, content, blogId } = dto;
    const blog = await this.blogsRepository.findBlogById(blogId);
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
    const isUpdated = await this.postsRepository.updatePost(id, updateData);
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
  }

  async deletePost(id: string): Promise<Result<null>> {
    const isDeleted = await this.postsRepository.deletePost(id);
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
  }

  async deletePostsByBlogId(blogId: string): Promise<void> {
    return await this.postsRepository.deletePostsByBlogId(blogId);
  }

  //!! использовать репозиторий блогов или сервис ?
  async createPostByBlogId(
    blogId: string,
    dto: CreatePostByBlogIdInputDto,
  ): Promise<Result<string>> {
    const { title, shortDescription, content } = dto;
    const blog = await this.blogsRepository.findBlogById(blogId);
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
    const postId = await this.postsRepository.createPost(createData);
    return {
      status: ResultStatus.Success,
      data: postId,
      errorsMessages: null,
    };
  }
}
