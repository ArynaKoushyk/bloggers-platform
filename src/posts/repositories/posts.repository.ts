import { db } from "../../db/in-memory.db";
import { DbPost, Post } from "../types/post.type";
import { PostInputDto } from "../dto/post-input.dto";

export const postsRepository = {
  findAll(): DbPost[] {
    return db.posts;
  },

  findById(id: string): DbPost | null {
    return (
      db.posts.find((posts) => {
        return posts.id === id;
      }) ?? null
    );
  },

  //!! мы в репозитории работаем с dto?
  createPost(dto: PostInputDto): DbPost {
    const newPost = {
      id: Date.now().toString(),
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
    };
    db.posts.push(newPost);
    return newPost;
  },

  updatePost(id: string, dto: PostInputDto): void {
    const post = db.posts.find((posts) => {
      return posts.id === id;
    });
    if (!post) {
      throw new Error("Post not found");
    }
    ((post.title = dto.title),
      (post.shortDescription = dto.shortDescription),
      (post.content = dto.content),
      (post.blogId = dto.blogId));
    return;
  },

  deletePost(id: string): void {
    const index = db.posts.findIndex((posts) => {
      return posts.id === id;
    });
    if (index == -1) {
      throw new Error("Post not found");
    }
    db.posts.splice(index, 1);
    return;
  },
};
