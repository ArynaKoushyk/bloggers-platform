import { Request, Response } from "express";
import { PostInputDto } from "../../dto/post-input.dto";
import { blogsRepository } from "../../../blogs/repositories/blogs.repository";
import { HttpStatus } from "../../../core/types/http-statuses";
import { createErrorMessages } from "../../../core/utils/error.utils";
import { postsRepository } from "../../repositories/posts.repository";
import { Post } from "../../types/post.type";
import { mapToPostViewModel } from "../../mappers/map-to-post-view-model.util";

export async function createPostHandler(
  req: Request<{}, {}, PostInputDto>,
  res: Response,
) {
  const blogId = req.body.blogId;
  const blog = await blogsRepository.findBlogById(blogId);

  if (!blog) {
    return res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: "id", message: "Blog not found" }]));
  }

  const newPost: Post = {
    title: req.body.title,
    shortDescription: req.body.shortDescription,
    content: req.body.content,
    blogId: blogId,
    createdAt: new Date(),
  };

  const createdPost = await postsRepository.createPost(newPost);
  const postViewModel = mapToPostViewModel(createdPost, blog.name);
  return res.status(HttpStatus.Created).send(postViewModel);
}
