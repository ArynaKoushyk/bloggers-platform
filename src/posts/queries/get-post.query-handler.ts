import { Result } from "../../core/result/result.type";
import { ResultStatus } from "../../core/result/resultCode";
import { mapToPostViewModel } from "../mappers/map-to-post-view-model.util";
import { postsQueryRepository } from "../repositories/mongo-posts.query-repository";
import { PostViewModel } from "../types/post-view-model";

export const getPostQueryHandler = {
  async findPostById(id: string): Promise<Result<PostViewModel>> {
    const post = await postsQueryRepository.findPostById(id);

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
  },
};
