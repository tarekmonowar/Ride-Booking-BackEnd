"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverService = void 0;
const queryBuilder_1 = require("../../utils/queryBuilder");
const ride_interface_1 = require("../ride/ride.interface");
const ride_model_1 = require("../ride/ride.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_model_1 = require("../user/user.model");
const mongoose_1 = require("mongoose");
const env_1 = require("../../config/env");
//*-----------------------------------------------------------------getAvailableRides------------------------------------------
const getAvailableRides = async (query) => {
    const forcedQuery = { ...query, status: ride_interface_1.RideStatus.REQUESTED };
    const queryBuilder = new queryBuilder_1.QueryBuilder(ride_model_1.Ride.find(), forcedQuery);
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
const acceptRide = async (rideId, driverId) => {
    const ride = await ride_model_1.Ride.findById(rideId);
    const MAX_CANCEL_LIMIT = Number(env_1.envVars.MAX_CANCEL_LIMIT);
    if (!ride || ride.status !== ride_interface_1.RideStatus.REQUESTED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Ride Not Available");
    }
    const driver = await user_model_1.User.findById(driverId);
    if (!driver) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Driver Not Available");
    }
    if (!driver.isApproved) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Driver Not Approved by admin");
    }
    if (!driver.isAvailable) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Driver is currently unavailable or already on a ride.");
    }
    if (driver.cancelledRidesCount >= MAX_CANCEL_LIMIT) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Driver not available due to too many cancellations.");
    }
    ride.driver = new mongoose_1.Types.ObjectId(driverId);
    ride.status = ride_interface_1.RideStatus.ACCEPTED;
    ride.acceptedAt = new Date();
    driver.isAvailable = false;
    await driver.save();
    await ride.save();
    return ride;
};
//*-----------------------------------------------------------------updateAvailability------------------------------------------
const updateAvailability = async (driverId, isAvailable) => {
    const driver = await user_model_1.User.findById(driverId);
    if (!driver || !driver.isApproved) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Driver Not Found");
    }
    driver.isAvailable = isAvailable;
    await driver.save();
    return driver;
};
exports.DriverService = {
    getAvailableRides,
    acceptRide,
    updateAvailability,
};
