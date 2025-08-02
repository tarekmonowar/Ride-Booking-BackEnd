"use strict";
// import { Request, Response } from "express";
// import DriverService from "./driver.service";
// import { successResponse, errorResponse } from "../../utils/apiResponse";
// class DriverController {
//   async getAvailableRides(req: Request, res: Response) {
//     try {
//       const rides = await DriverService.getAvailableRides();
//       successResponse(res, rides);
//     } catch (error: any) {
//       errorResponse(res, 500, error.message);
//     }
//   }
//   async acceptRide(req: Request, res: Response) {
//     try {
//       const ride = await DriverService.acceptRide(req.params.id, req.user.id);
//       successResponse(res, ride, 200, "Ride accepted");
//     } catch (error: any) {
//       errorResponse(res, 400, error.message);
//     }
//   }
//   async updateAvailability(req: Request, res: Response) {
//     try {
//       const driver = await DriverService.updateAvailability(
//         req.user.id,
//         req.body.isAvailable,
//       );
//       successResponse(res, driver, 200, "Availability updated");
//     } catch (error: any) {
//       errorResponse(res, 400, error.message);
//     }
//   }
// }
// export default new DriverController();
