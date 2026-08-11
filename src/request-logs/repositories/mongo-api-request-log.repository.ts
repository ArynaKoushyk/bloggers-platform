import { injectable } from "inversify";
import { IApiRequestLogRepository } from "../interfaces/api-request-log.repository-interface";
import { ApiRequestLogDbModel } from "../types/api-request-log-db.model";
import { apiRequestLogsCollection } from "../../db/mongo.db";

@injectable()
export class MongoApiRequestLogRepository implements IApiRequestLogRepository {
  async createApiRequestLog(data: ApiRequestLogDbModel): Promise<void> {
    await apiRequestLogsCollection.insertOne(data);
  }

  async countRecentApiRequests(ip: string, url: string, fromDate: Date): Promise<number> {
    return await apiRequestLogsCollection.countDocuments({
      ip,
      url,
      date: { $gte: fromDate },
    });
  }
}
