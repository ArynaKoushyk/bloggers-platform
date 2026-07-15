import { inject, injectable } from "inversify";
import { POSTS_QUERY_REPOSITORY } from "../../core/composition/di-tokens";
import { Result } from "../../core/result/result.type";
import { ResultStatus } from "../../core/result/resultCode";
import { IPostsQueryRepository } from "../interfaces/posts.query.repository-interface";
import { mapToPostViewModel } from "../mappers/map-to-post-view-model.util";
import { PostViewModel } from "../types/post-view-model";

@injectable()
export class GetPostQueryHandler {
  constructor(
    @inject(POSTS_QUERY_REPOSITORY) private postsQueryRepository: IPostsQueryRepository,
  ) {}
  async findPostById(id: string): Promise<Result<PostViewModel>> {
    const post = await this.postsQueryRepository.findPostById(id);

    if (!post) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        errorsMessages: null,
      };
    }

    return {
      status: ResultStatus.Success,
      data: mapToPostViewModel(post),
      errorsMessages: null,
    };
  }
}
