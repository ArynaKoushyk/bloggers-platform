import express from "express";
import { setupApp } from "./setup-app";
import { SETTINGS } from "./core/settings/settings";
import { runDb } from "./db/mongo.db";

const bootstrap = async () => {
  const app = express();
  setupApp(app);
  const PORT = SETTINGS.PORT;

  console.log("PORT:", SETTINGS.PORT);
  console.log("MONGO_URL:", SETTINGS.MONGO_URL);
  console.log("DB_NAME:", SETTINGS.DB_NAME);
  await runDb(SETTINGS.MONGO_URL);

  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
  return app;
};

bootstrap();
