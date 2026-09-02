import { ServiceIdentifier } from "inversify";
import { IBlogsRepository } from "../../blogs/interfaces/blogs.repository-interface";
import { IBlogsService } from "../../blogs/interfaces/blogs.service-interface";
import { IBlogsQueryRepository } from "../../blogs/interfaces/blogs.query.repository-interface";
import { IPostsRepository } from "../../posts/interfaces/posts.repository-interface";
import { IPostsService } from "../../posts/interfaces/posts.service-interface";
import { IPostsQueryRepository } from "../../posts/interfaces/posts.query.repository-interface";
import { ICommentsRepository } from "../../comments/interfaces/comments.repository-interfaces";
import { ICommentsService } from "../../comments/interfaces/comments.service-interfaces";
import { ICommentsQueryRepository } from "../../comments/interfaces/comments.query.repository-interface";
import { IUsersRepository } from "../../users/applications/interfaces/users.repository-interface";
import { IUsersService } from "../../users/applications/interfaces/users.service.interface";
import { IUsersQueryRepository } from "../../users/applications/interfaces/users.repository.query-interface";
import { IAuthService } from "../../auth/interfaces/auth.service-interface";
import { IEmailService } from "../../auth/interfaces/email.service-interface";
import { IJwtService } from "../../auth/interfaces/jwt.service-interface";
import { IPasswordHashService } from "../../auth/interfaces/password-hash.service-interface";
import { IAuthSessionRepository } from "../../auth/interfaces/auth-session.repository-interface";
import { IAuthSessionQueryRepository } from "../../auth/interfaces/auth-session.query-repository-interface";
import { IApiRequestLogRepository } from "../../request-logs/interfaces/api-request-log.repository-interface";
import { ILikesRepository } from "../../likes/interfaces/likes.repository-interface";
import { ILikesQueryRepository } from "../../likes/interfaces/likes.query-repository-interface";

export const BLOGS_REPOSITORY: ServiceIdentifier<IBlogsRepository> = Symbol.for("BLOGS_REPOSITORY");
export const BLOGS_SERVICE: ServiceIdentifier<IBlogsService> = Symbol.for("BLOGS_SERVICE");
export const BLOGS_QUERY_REPOSITORY: ServiceIdentifier<IBlogsQueryRepository> =
  Symbol.for("BLOGS_QUERY_REPOSITORY");

export const POSTS_REPOSITORY: ServiceIdentifier<IPostsRepository> = Symbol.for("POSTS_REPOSITORY");
export const POSTS_SERVICE: ServiceIdentifier<IPostsService> = Symbol.for("POSTS_SERVICE");
export const POSTS_QUERY_REPOSITORY: ServiceIdentifier<IPostsQueryRepository> =
  Symbol.for("POSTS_QUERY_REPOSITORY");

export const COMMENTS_REPOSITORY: ServiceIdentifier<ICommentsRepository> =
  Symbol.for("COMMENTS_REPOSITORY");
export const COMMENTS_SERVICE: ServiceIdentifier<ICommentsService> = Symbol.for("COMMENTS_SERVICE");
export const COMMENTS_QUERY_REPOSITORY: ServiceIdentifier<ICommentsQueryRepository> = Symbol.for(
  "COMMENTS_QUERY_REPOSITORY",
);

export const LIKES_REPOSITORY: ServiceIdentifier<ILikesRepository> = Symbol.for("LIKES_REPOSITORY");
export const LIKES_QUERY_REPOSITORY: ServiceIdentifier<ILikesQueryRepository> =
  Symbol.for("LIKES_QUERY_REPOSITORY");
export const USERS_REPOSITORY: ServiceIdentifier<IUsersRepository> = Symbol.for("USERS_REPOSITORY");
export const USERS_SERVICE: ServiceIdentifier<IUsersService> = Symbol.for("USERS_SERVICE");
export const USERS_QUERY_REPOSITORY: ServiceIdentifier<IUsersQueryRepository> =
  Symbol.for("USERS_QUERY_REPOSITORY");

export const AUTH_SERVICE: ServiceIdentifier<IAuthService> = Symbol.for("AUTH_SERVICE");
export const EMAIL_SERVICE: ServiceIdentifier<IEmailService> = Symbol.for("EMAIL_SERVICE");
export const JWT_SERVICE: ServiceIdentifier<IJwtService> = Symbol.for("JWT_SERVICE");
export const PASSWORD_HASH_SERVICE: ServiceIdentifier<IPasswordHashService> =
  Symbol.for("PASSWORD_HASH_SERVICE");
export const AUTH_SESSION_REPOSITORY: ServiceIdentifier<IAuthSessionRepository> =
  Symbol.for("AUTH_SESSION_REPOSITORY");
export const AUTH_SESSION_QUERY_REPOSITORY: ServiceIdentifier<IAuthSessionQueryRepository> =
  Symbol.for("AUTH_SESSION_QUERY_REPOSITORY");
export const API_REQUEST_LOG_REPOSITORY: ServiceIdentifier<IApiRequestLogRepository> = Symbol.for(
  "API_REQUEST_LOG_REPOSITORY",
);
