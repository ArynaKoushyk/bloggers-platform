import "reflect-metadata";
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
import { CommentsController } from "../../comments/controllers/comments.controller";
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
import { UsersController } from "../../users/controllers/users.controller";
import { JwtAdapter } from "../../auth/adapters/jwt.adapter";
import { NodemailerAdapter } from "../../auth/adapters/nodemailer.adapter";
import { MongoRefreshSessionRepository } from "../../auth/repositories/mongo-refresh-session.repository";
import { AuthService } from "../../auth/applications/auth.service";
import { AuthController } from "../../auth/controllers/auth.controller";
import { Container } from "inversify";
import {
  BLOGS_QUERY_REPOSITORY,
  BLOGS_REPOSITORY,
  BLOGS_SERVICE,
  COMMENTS_QUERY_REPOSITORY,
  COMMENTS_REPOSITORY,
  COMMENTS_SERVICE,
  POSTS_QUERY_REPOSITORY,
  POSTS_REPOSITORY,
  POSTS_SERVICE,
  PASSWORD_HASH_SERVICE,
  USERS_QUERY_REPOSITORY,
  USERS_REPOSITORY,
  USERS_SERVICE,
  JWT_SERVICE,
  EMAIL_SERVICE,
  REFRESH_SESSION_REPOSITORY,
  AUTH_SERVICE,
} from "./di-tokens";
import { IBlogsQueryRepository } from "../../blogs/interfaces/blogs.query.repository-interface";
import { IBlogsRepository } from "../../blogs/interfaces/blogs.repository-interface";
import { IBlogsService } from "../../blogs/interfaces/blogs.service-interface";
import { IPostsRepository } from "../../posts/interfaces/posts.repository-interface";
import { IPostsQueryRepository } from "../../posts/interfaces/posts.query.repository-interface";
import { IPostsService } from "../../posts/interfaces/posts.service-interface";
import { ICommentsRepository } from "../../comments/interfaces/comments.repository-interfaces";
import { ICommentsQueryRepository } from "../../comments/interfaces/comments.query.repository-interface";
import { ICommentsService } from "../../comments/interfaces/comments.service-interfaces";
import { IUsersRepository } from "../../users/applications/interfaces/users.repository-interface";
import { IUsersQueryRepository } from "../../users/applications/interfaces/users.repository.query-interface";
import { IUsersService } from "../../users/applications/interfaces/users.service.interface";
import { IPasswordHashService } from "../../auth/interfaces/password-hash.service-interface";
import { IJwtService } from "../../auth/interfaces/jwt.service-interface";
import { IEmailService } from "../../auth/interfaces/email.service-interface";
import { IRefreshSessionRepository } from "../../auth/interfaces/refresh-session.repository-interface";
import { IAuthService } from "../../auth/interfaces/auth.service-interface";

const container: Container = new Container();

// const blogsQueryRepository = new MongoBlogsQueryRepository();
// const blogsService = new BlogsService(blogsRepository);

container.bind<IBlogsRepository>(BLOGS_REPOSITORY).to(MongoBlogsRepository).inSingletonScope();
container
  .bind<IBlogsQueryRepository>(BLOGS_QUERY_REPOSITORY)
  .to(MongoBlogsQueryRepository)
  .inSingletonScope();
container.bind<IBlogsService>(BLOGS_SERVICE).to(BlogsService).inSingletonScope();
container.bind(GetBlogQueryHandler).toSelf().inSingletonScope();
container.bind(GetBlogsListQueryHandler).toSelf().inSingletonScope();
container.bind(DeleteBlogWithPostsUseCase).toSelf().inSingletonScope();
container.bind(BlogsController).to(BlogsController).inSingletonScope();

container.bind<IPostsRepository>(POSTS_REPOSITORY).to(MongoPostsRepository).inSingletonScope();
container
  .bind<IPostsQueryRepository>(POSTS_QUERY_REPOSITORY)
  .to(MongoPostsQueryRepository)
  .inSingletonScope();
container.bind<IPostsService>(POSTS_SERVICE).to(PostsService).inSingletonScope();
container.bind(GetPostQueryHandler).toSelf().inSingletonScope();
container.bind(GetPostListQueryHandler).toSelf().inSingletonScope();
container.bind(GetPostsByBlogIdQueryHandler).toSelf().inSingletonScope();
container.bind(PostsController).to(PostsController).inSingletonScope();

container
  .bind<ICommentsRepository>(COMMENTS_REPOSITORY)
  .to(MongoCommentsRepository)
  .inSingletonScope();
container
  .bind<ICommentsQueryRepository>(COMMENTS_QUERY_REPOSITORY)
  .to(MongoCommentsQueryRepository)
  .inSingletonScope();
container.bind<ICommentsService>(COMMENTS_SERVICE).to(CommentsService).inSingletonScope();
container.bind(GetCommentQueryHandler).toSelf().inSingletonScope();
container.bind(GetCommentsByPostIdQueryHandler).toSelf().inSingletonScope();
container.bind(CommentsController).to(CommentsController).inSingletonScope();

container.bind<IUsersRepository>(USERS_REPOSITORY).to(MongoUsersRepository).inSingletonScope();
container
  .bind<IUsersQueryRepository>(USERS_QUERY_REPOSITORY)
  .to(MongoUsersQueryRepository)
  .inSingletonScope();
container
  .bind<IPasswordHashService>(PASSWORD_HASH_SERVICE)
  .to(BcryptPasswordHashAdapter)
  .inSingletonScope();
container.bind<IUsersService>(USERS_SERVICE).to(UsersService).inSingletonScope();
container.bind(GetUserQueryHandler).toSelf().inSingletonScope();
container.bind(GetUsersListQueryHandler).toSelf().inSingletonScope();
container.bind(UsersController).to(UsersController).inSingletonScope();

container.bind<IJwtService>(JWT_SERVICE).to(JwtAdapter).inSingletonScope();
container.bind<IEmailService>(EMAIL_SERVICE).to(NodemailerAdapter).inSingletonScope();

container
  .bind<IRefreshSessionRepository>(REFRESH_SESSION_REPOSITORY)
  .to(MongoRefreshSessionRepository)
  .inSingletonScope();
container.bind<IAuthService>(AUTH_SERVICE).to(AuthService).inSingletonScope();
container.bind(AuthController).toSelf().inSingletonScope();

export const blogsController = container.get(BlogsController);
export const postsController = container.get(PostsController);
export const commentsController = container.get(CommentsController);
export const authController = container.get(AuthController);
export const usersController = container.get(UsersController);
export const usersRepository = container.get<IUsersRepository>(USERS_REPOSITORY);
export const jwtService = container.get<IJwtService>(JWT_SERVICE);
export const refreshSessionRepository = container.get<IRefreshSessionRepository>(
  REFRESH_SESSION_REPOSITORY,
);
