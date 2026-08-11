import { Router } from "express";
import { securityDevicesController } from "../../core/composition/composition-root";
import { refreshTokenGuardMiddleware } from "../middlewares/refresh-token.guard-middleware";

export const securityDevicesRouter = Router({});

securityDevicesRouter.get(
  "/devices",
  refreshTokenGuardMiddleware,
  securityDevicesController.getActiveDevicesHandler.bind(securityDevicesController),
);

securityDevicesRouter.delete(
  "/devices",
  refreshTokenGuardMiddleware,
  securityDevicesController.invalidateOtherSessionsHandler.bind(securityDevicesController),
);

securityDevicesRouter.delete(
  "/devices/:deviceId",
  refreshTokenGuardMiddleware,
  securityDevicesController.invalidateSessionHandler.bind(securityDevicesController),
);
