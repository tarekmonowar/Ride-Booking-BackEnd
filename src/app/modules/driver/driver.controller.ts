import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { DriverService } from "./driver.service";

//*--------------------------------------------------------getAvailableRides--------------------------------------------

const getAvailableRides = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await DriverService.getAvailableRides(
    query as Record<string, string>,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Available ride retrieved successfully",
    data: result,
  });
});

//*--------------------------------------------------------acceptRide--------------------------------------------

const acceptRide = catchAsync(async (req: Request, res: Response) => {
  const decodeToken = req.user as JwtPayload;
  const rideId = req.params.id;

  const result = await DriverService.acceptRide(rideId, decodeToken.userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Available ride retrieved successfully",
    data: result,
  });
});

//*--------------------------------------------------------updateAvailability--------------------------------------------

const updateAvailability = catchAsync(async (req: Request, res: Response) => {
  const decodeToken = req.user as JwtPayload;
  const isAvailable = req.body.isAvailable;

  const result = await DriverService.updateAvailability(
    decodeToken.userId,
    isAvailable,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Available ride retrieved successfully",
    data: result,
  });
});

export const DriverController = {
  getAvailableRides,
  acceptRide,
  updateAvailability,
};
