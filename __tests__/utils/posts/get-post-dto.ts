import { PostInputDto } from "../../../src/posts/dto/post-input.dto";

export function getPostDto(blogId: string): PostInputDto {
  return {
    blogId,
    title: "post",
    shortDescription: "new post",
    content: "video",
  };
}
