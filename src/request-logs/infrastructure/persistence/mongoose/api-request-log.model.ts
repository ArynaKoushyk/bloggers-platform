import { model, Schema } from "mongoose";

const apiRequestLogSchema = new Schema({
  ip: { type: String, required: true },
  url: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
});
export const ApiRequestLogModel = model("ApiRequestLog", apiRequestLogSchema, "apiRequestLogs");
