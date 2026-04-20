export type Post = DbPost & {
  blogName: string;
};

export type DbPost = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};
