import { ResultStatus } from "./resultCode";

type FieldError = {
  field: string;
  message: string;
};

export type APIErrorResult = {
  errorsMessages: FieldError[] | null;
};

type SuccessResult<T> = {
  status: ResultStatus.Success;
  data: T;
  errorsMessages: null;
};

type ErrorResult = {
  status: Exclude<ResultStatus, ResultStatus.Success>;
  data: null;
  errorsMessages: FieldError[] | null;
};

export type Result<T = null> = SuccessResult<T> | ErrorResult;
