import { injectable } from "inversify";
import { IApiRequestLogRepository } from "../../../interfaces/api-request-log.repository-interface";
import { ApiRequestLogDbModel } from "../../../types/api-request-log-db.model";
import { ApiRequestLogModel } from "./api-request-log.model";

@injectable()
export class MongoApiRequestLogRepository implements IApiRequestLogRepository {
  async createApiRequestLog(data: ApiRequestLogDbModel): Promise<void> {
    await ApiRequestLogModel.create(data);
  }

  async countRecentApiRequests(ip: string, url: string, fromDate: Date): Promise<number> {
    return await ApiRequestLogModel.countDocuments({
      ip,
      url,
      date: { $gte: fromDate },
    });
  }
}
