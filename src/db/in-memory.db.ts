import { Blog } from "../blogs/types/blogs.type";
import { Post } from "../posts/types/post.type";

export const db = {
  blogs: <Blog[]>[
    {
      id: "1",
      name: "TechInsights",
      description:
        "Latest trends and insights in software development, AI, and cloud computing",
      websiteUrl: "https://techinsights.example.com",
    },
    {
      id: "2",
      name: "TastyRecipes",
      description:
        "Delicious recipes from around the world, from appetizers to desserts",
      websiteUrl: "https://tastyrecipes.example.com",
    },
    {
      id: "3",
      name: "Wanderlust",
      description:
        "Travel guides, tips, and stories from globetrotters exploring the world",
      websiteUrl: "https://wanderlust.example.com",
    },
  ],
  posts: <Post[]>[],
};
