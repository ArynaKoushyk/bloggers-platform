import { ResultStatus } from "../../core/result/resultCode";
import { Result } from "../../core/result/result.type";
import { CreatePostInputDto } from "../dto/create-post.input.dto";
import { UpdatePostInputDto } from "../dto/update-post.input.dto";
import { CreatePostData } from "../types/data/create-post.data";
import { UpdatePostData } from "../types/data/update-post.data";
import { CreatePostByBlogIdInputDto } from "../dto/create-post-by-blog-id.input.dto";
import { IBlogsRepository } from "../../blogs/interfaces/blogs.repository-interface";
import { IPostsService } from "../interfaces/posts.service-interface";
import { IPostsRepository } from "../interfaces/posts.repository-interface";
import { inject, injectable } from "inversify";
import { BLOGS_REPOSITORY, POSTS_REPOSITORY } from "../../core/composition/di-tokens";
import { PostDocument, PostModel } from "../infrastructure/persistence/mongoose/post.model";

@injectable()
export class PostsService implements IPostsService {
  constructor(
    @inject(POSTS_REPOSITORY) private postsRepository: IPostsRepository,
    @inject(BLOGS_REPOSITORY) private blogsRepository: IBlogsRepository,
  ) {}
  async findPostById(id: string): Promise<Result<PostDocument>> {
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
    const blog = await this.blogsRepository.findBlogById(dto.blogId);
    if (!blog) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        errorsMessages: [{ field: "blogId", message: "Blog not found" }],
      };
    }
    const createData: CreatePostData = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      blogName: blog.name,
    };

    const createdPost = PostModel.createPost(createData);
    await this.postsRepository.save(createdPost);
    return {
      status: ResultStatus.Success,
      data: createdPost._id.toString(),
      errorsMessages: null,
    };
  }
  async updatePost(id: string, dto: UpdatePostInputDto): Promise<Result<null>> {
    const blog = await this.blogsRepository.findBlogById(dto.blogId);
    if (!blog) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        errorsMessages: [{ field: "blogId", message: "Blog not found" }],
      };
    }

    const post = await this.postsRepository.findPostById(id);

    if (!post) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        errorsMessages: null,
      };
    }
    const updateData: UpdatePostData = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      blogName: blog.name,
    };

    post.updatePost(updateData);

    await this.postsRepository.save(post);

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
    };
    const createdPost = PostModel.createPost(createData);
    await this.postsRepository.save(createdPost);
    return {
      status: ResultStatus.Success,
      data: createdPost._id.toString(),
      errorsMessages: null,
    };
  }
}
