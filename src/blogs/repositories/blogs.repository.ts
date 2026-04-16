import { db } from "../../db/in-memory.db";
import { BlogInputDto } from "../dto/blog-input.dto";
import { Blog } from "../types/blogs.type";

export const blogsRepository = {
  findAll(): Blog[] {
    return db.blogs;
  },
  findById(id: string): Blog | null {
    return (
      db.blogs.find((blog) => {
        return blog.id === id;
      }) ?? null
    );
  },

  create(dto: BlogInputDto): Blog {
    const newBlog = {
      id: Date.now().toString(),
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
    };
    db.blogs.push(newBlog);
    return newBlog;
  },

  update(id: string, dto: BlogInputDto): void {
    const blog = db.blogs.find((blog) => {
      return blog.id === id;
    });

    if (!blog) {
      throw new Error("Blog not found");
    }

    ((blog.name = dto.name),
      (blog.description = dto.description),
      (blog.websiteUrl = dto.websiteUrl));

    return;
  },

  delete(id: string): void {
    const index = db.blogs.findIndex((blog) => {
      return blog.id === id;
    });
    if (index === -1) {
      throw new Error("Blog not found");
    }
    db.blogs.splice(index, 1);
    return;
  },
};
