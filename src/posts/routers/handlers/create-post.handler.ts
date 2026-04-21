import { Request, Response } from "express";
import { PostInputDto } from "../../dto/post-input.dto";
import { blogsRepository } from "../../../blogs/repositories/blogs.repository";
import { HttpStatus } from "../../../core/types/http-statuses";
import { createErrorMessages } from "../../../core/utils/error.utils";
import { postsRepository } from "../../repositories/posts.repository";
export function createPostHandler(
  req: Request<{}, {}, PostInputDto>,
  res: Response,
) {
  const blogId = req.body.blogId;
  const blog = blogsRepository.findById(blogId);

  if (!blog) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: "id", message: "Blog not found" }]));
    return;
  }
  const postDto = {
    title: req.body.title,
    shortDescription: req.body.shortDescription,
    content: req.body.content,
    blogId: blogId,
  };

  const createdPost = postsRepository.createPost(postDto);
  const newPost = { ...createdPost, blogName: blog.name };
  return res.status(HttpStatus.Created).send(newPost);
}
