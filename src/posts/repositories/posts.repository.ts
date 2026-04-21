import { db } from "../../db/in-memory.db";
import { DbPost, Post } from "../types/post.type";
import { PostInputDto } from "../dto/post-input.dto";

export const postsRepository = {
  //!!
  findAll(): Post[] {
    return db.posts.map((p) => {
      const blog = db.blogs.find((b) => b.id === p.blogId);
      if (!blog) {
        throw new Error("Blog not found");
      }
      return {
        ...p,
        blogName: blog.name,
      };
    });
  },

  findById(id: string): DbPost | null {
    return (
      db.posts.find((posts) => {
        return posts.id === id;
      }) ?? null
    );
  },

  createPost(dto: PostInputDto): DbPost {
    const newPost = {
      ...dto,
      id: Date.now().toString(),
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
    post.title = dto.title;
    post.shortDescription = dto.shortDescription;
    post.content = dto.content;
    post.blogId = dto.blogId;

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
