import express from "express";
import DriverController from "./driver.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { availabilitySchema } from "./driver.validation";
import { UserRole } from "../../interfaces/user.interface";

const router = express.Router();

router.use(authenticate, authorize([UserRole.DRIVER]));

router.get("/available-rides", DriverController.getAvailableRides);
router.patch("/accept/:id", DriverController.acceptRide);
router.patch(
  "/availability",
  validate(availabilitySchema),
  DriverController.updateAvailability,
);

export default router;
