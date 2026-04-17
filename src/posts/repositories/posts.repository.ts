import { db } from "../../db/in-memory.db";
import { Post } from "../types/post.type";
import { PostInputDto } from "../dto/post-input.dto";

export const postsRepository = {
  findAll(): Post[] {
    return db.posts;
  },

  findById(id: string): Post | null {
    return (
      db.posts.find((posts) => {
        return posts.id === id;
      }) ?? null
    );
  },
  //!!как получить blogName
  createPost(dto: PostInputDto): Post {
    const newPost = {
      id: Date.now().toString(),
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      blogName: "name",
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
