import { BlogInputDto } from "../../../src/blogs/dto/blog-input.dto";

export function getBlogDto(): BlogInputDto {
  return {
    name: "TechInsights",
    description:
      "Latest trends and insights in software development, AI, and cloud computing",
    websiteUrl: "https://techinsights.example.com",
  };
}
