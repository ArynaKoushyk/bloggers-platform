import mongoose from "mongoose";
import { SETTINGS } from "../../core/settings/settings";

export async function runDb(): Promise<void> {
  try {
    await mongoose.connect(SETTINGS.MONGO_URL, {
      dbName: SETTINGS.DB_NAME,
    });
    console.log("it is ok");
  } catch (e) {
    console.log("no connection");
    await mongoose.disconnect();
  }
}
