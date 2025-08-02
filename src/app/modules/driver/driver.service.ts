import { QueryBuilder } from "../../utils/queryBuilder";
import { RideStatus } from "../ride/ride.interface";
import { Ride } from "../ride/ride.model";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { Types } from "mongoose";
import { envVars } from "../../config/env";

//*-----------------------------------------------------------------getAvailableRides------------------------------------------

const getAvailableRides = async (query: Record<string, string>) => {
  const forcedQuery = { ...query, status: RideStatus.REQUESTED };
  const queryBuilder = new QueryBuilder(Ride.find(), forcedQuery);

  const rideData = queryBuilder.filter().fields().sort().paginate();

  const [data, meta] = await Promise.all([
    rideData.build().populate("rider").lean(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

//*-----------------------------------------------------------------acceptRide------------------------------------------

const acceptRide = async (rideId: string, driverId: string) => {
  const ride = await Ride.findById(rideId);
  const MAX_CANCEL_LIMIT = Number(envVars.MAX_CANCEL_LIMIT);

  if (!ride || ride.status !== RideStatus.REQUESTED) {
    throw new AppError(httpStatus.BAD_REQUEST, "Ride Not Available");
  }
  const driver = await User.findById(driverId);
  if (!driver || !driver.isApproved || !driver.isAvailable) {
    throw new AppError(httpStatus.BAD_REQUEST, "Driver Not Available");
  }

  if (driver.cancelledRidesCount! >= MAX_CANCEL_LIMIT) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Driver not available due to too many cancellations.",
    );
  }

  ride.driver = new Types.ObjectId(driverId);
  ride.status = RideStatus.ACCEPTED;
  ride.acceptedAt = new Date();

  driver.isAvailable = false;
  await driver.save();
  await ride.save();

  return ride;
};

//*-----------------------------------------------------------------updateAvailability------------------------------------------

const updateAvailability = async (driverId: string, isAvailable: boolean) => {
  const driver = await User.findById(driverId);
  if (!driver || !driver.isApproved) {
    throw new AppError(httpStatus.BAD_REQUEST, "Driver Not Available");
  }
  driver.isAvailable = isAvailable;
  await driver.save();
  return driver;
};

export const DriverService = {
  getAvailableRides,
  acceptRide,
  updateAvailability,
};
