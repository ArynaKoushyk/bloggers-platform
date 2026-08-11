import { ApiRequestLogDbModel } from "../types/api-request-log-db.model";

export interface IApiRequestLogRepository {
  
  createApiRequestLog(data: ApiRequestLogDbModel): Promise<void>;

  countRecentApiRequests(ip: string, url: string, fromDate: Date): Promise<number>;
}
