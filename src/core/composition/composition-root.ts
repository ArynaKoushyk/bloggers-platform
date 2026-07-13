import { BlogsService } from "../../blogs/applications/blogs.service";
import { BlogsController } from "../../blogs/controllers/blogs.controller";
import { GetBlogQueryHandler } from "../../blogs/queries/get-blog.query-handler";
import { GetBlogsListQueryHandler } from "../../blogs/queries/get-blogs-list.query-handler";
import { MongoBlogsQueryRepository } from "../../blogs/repositories/mongo-blogs.query-repository";
import { MongoBlogsRepository } from "../../blogs/repositories/mongo-blogs.repository";
import { DeleteBlogWithPostsUseCase } from "../../blogs/use-cases/delete-blog-with-posts.use-case";
import { CommentsService } from "../../comments/applications/comments.service";
import { GetCommentQueryHandler } from "../../comments/queries/get-comment.query-handler";
import { GetCommentsByPostIdQueryHandler } from "../../comments/queries/get-comments-by-post-id.query-handler";
import { MongoCommentsQueryRepository } from "../../comments/repositories/mongo-comments.query-repository";
import { MongoCommentsRepository } from "../../comments/repositories/mongo-comments.repository";
import { CommentsController } from "../../comments/routers/controllers/comments.controller";
import { PostsService } from "../../posts/applications/posts.service";
import { PostsController } from "../../posts/controllers/posts.controller";
import { GetPostQueryHandler } from "../../posts/queries/get-post.query-handler";
import { GetPostsByBlogIdQueryHandler } from "../../posts/queries/get-posts-by-blog-id.query-handler";
import { GetPostListQueryHandler } from "../../posts/queries/get-posts-list.query-handler";
import { MongoPostsQueryRepository } from "../../posts/repositories/mongo-posts.query-repository";
import { MongoPostsRepository } from "../../posts/repositories/mongo-posts.repository";
import { GetUserQueryHandler } from "../../users/queries/get-user.query-handler";
import { GetUsersListQueryHandler } from "../../users/queries/get-users-list.query-handler";
import { MongoUsersQueryRepository } from "../../users/repositories/mongo-users.query-repository";
import { MongoUsersRepository } from "../../users/repositories/mongo-users.repository";
import { UsersService } from "../../users/applications/users.service";
import { BcryptPasswordHashAdapter } from "../../auth/adapters/bcrypt-password-hash.adapter";
import { UsersController } from "../../users/routers/controllers/users.controller";
import { JwtAdapter } from "../../auth/adapters/jwt.adapter";
import { NodemailerAdapter } from "../../auth/adapters/nodemailer.adapter";
import { MongoRefreshSessionRepository } from "../../auth/repositories/mongo-refresh-session.repository";
import { AuthService } from "../../auth/applications/auth.service";
import { AuthController } from "../../auth/routers/controllers/auth.controller";

const postsRepository = new MongoPostsRepository();
const postsQueryRepository = new MongoPostsQueryRepository();
const blogsRepository = new MongoBlogsRepository();
const postsService = new PostsService(postsRepository, blogsRepository);
const blogsQueryRepository = new MongoBlogsQueryRepository();
const blogsService = new BlogsService(blogsRepository);
const getBlogsListQueryHandler = new GetBlogsListQueryHandler(blogsQueryRepository);
const deleteBlogWithPostsUseCase = new DeleteBlogWithPostsUseCase(blogsService, postsService);
const getBlogsQueryHandler = new GetBlogQueryHandler(blogsQueryRepository);
export const blogsController = new BlogsController(
  blogsService,
  getBlogsQueryHandler,
  getBlogsListQueryHandler,
  deleteBlogWithPostsUseCase,
);

const getPostQueryHandler = new GetPostQueryHandler(postsQueryRepository);
const getPostListQueryHandler = new GetPostListQueryHandler(postsQueryRepository);
const getPostsByBlogIdQueryHandler = new GetPostsByBlogIdQueryHandler(
  postsQueryRepository,
  blogsRepository,
);
export const postsController = new PostsController(
  postsService,
  getPostQueryHandler,
  getPostListQueryHandler,
  getPostsByBlogIdQueryHandler,
);

const commentsRepository = new MongoCommentsRepository();
const commentsQueryRepository = new MongoCommentsQueryRepository();
const commentsService = new CommentsService(commentsRepository, postsRepository);
const getCommentQueryHandler = new GetCommentQueryHandler(commentsQueryRepository);
const getCommentsByPostIdQueryHandler = new GetCommentsByPostIdQueryHandler(
  commentsQueryRepository,
  postsRepository,
);
export const commentsController = new CommentsController(
  commentsService,
  getCommentQueryHandler,
  getCommentsByPostIdQueryHandler,
);
const passwordHashService = new BcryptPasswordHashAdapter();
const usersRepository = new MongoUsersRepository();
const usersQueryRepository = new MongoUsersQueryRepository();
const usersService = new UsersService(usersRepository, passwordHashService);
const getUserQueryHandler = new GetUserQueryHandler(usersQueryRepository);
const getUsersListQueryHandler = new GetUsersListQueryHandler(usersQueryRepository);
export const usersController = new UsersController(
  usersService,
  getUserQueryHandler,
  getUsersListQueryHandler,
);

const jwtService = new JwtAdapter();
const emailService = new NodemailerAdapter();
const refreshSessionRepository = new MongoRefreshSessionRepository();
const authService = new AuthService(
  usersRepository,
  passwordHashService,
  jwtService,
  emailService,
  refreshSessionRepository,
);
export const authController = new AuthController(authService);
