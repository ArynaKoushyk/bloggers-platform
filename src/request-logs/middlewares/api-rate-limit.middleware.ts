import { subSeconds } from "date-fns";
import { NextFunction, Request, Response } from "express";
import { apiRequestLogRepository } from "../../core/composition/composition-root";
import { HttpStatus } from "../../core/types/http-statuses";

export const apiRateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip as string;
  const url = req.originalUrl as string;
  const currentDate = new Date();
  const fromDate = subSeconds(currentDate, 10);
  await apiRequestLogRepository.createApiRequestLog({ ip, url, date: currentDate });
  const apiLogCount = await apiRequestLogRepository.countRecentApiRequests(ip, url, fromDate);
  if (apiLogCount > 5) {
    return res.sendStatus(HttpStatus.TooManyRequests);
  }

  next();
};
