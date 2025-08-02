"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideService = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_model_1 = require("../user/user.model");
const ride_interface_1 = require("./ride.interface");
const ride_model_1 = require("./ride.model");
const env_1 = require("../../config/env");
const CalculateCost_1 = require("../../utils/CalculateCost");
const user_interface_1 = require("../user/user.interface");
const queryBuilder_1 = require("../../utils/queryBuilder");
//*-----------------------------------------------------------------create ride------------------------------------------
const createRide = async (payload, userId) => {
    const rider = await user_model_1.User.findById(userId);
    if (!rider || rider.isBlocked) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid rider account");
    }
    const PER_KM_COST = Number(env_1.envVars.PER_KM_COST);
    // Step 1: Calculate distance
    const distance = (0, CalculateCost_1.calculateDistanceInKm)(payload.pickupLocation, payload.destination);
    // Step 2: Calculate estimated cost
    const estimatedCost = distance * PER_KM_COST;
    const ride = await ride_model_1.Ride.create({
        rider: userId,
        pickupLocation: {
            type: "Point",
            coordinates: [payload.pickupLocation.lng, payload.pickupLocation.lat],
        },
        destination: {
            type: "Point",
            coordinates: [payload.destination.lng, payload.destination.lat],
        },
        status: ride_interface_1.RideStatus.REQUESTED,
        estimatedCost: estimatedCost,
        distance: distance,
    });
    return ride;
};
//*-----------------------------------------------------------------cancel ride------------------------------------------
const cancelRide = async (rideId, userId, payload) => {
    const ride = await ride_model_1.Ride.findById(rideId);
    if (!ride) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Ride not found");
    }
    const rider = await user_model_1.User.findById(userId);
    if (!rider || rider.isBlocked) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid rider account");
    }
    //Rider/Driver cannot cancel other ride
    if (rider.role === user_interface_1.Role.RIDER || rider.role === user_interface_1.Role.DRIVER) {
        if (!ride.rider.equals(userId)) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You cannot cancel this ride");
        }
    }
    // Ride can be cancelled only if still in REQUESTED status
    if (ride.status !== ride_interface_1.RideStatus.REQUESTED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Cannot cancel ride after it has been ${ride.status.toLowerCase()}`);
    }
    // Cancel ride
    ride.status = ride_interface_1.RideStatus.CANCELLED;
    ride.cancelledAt = new Date();
    ride.cancellationReason = payload.cancellationReason || "Cancelled";
    await ride.save();
    return ride;
};
//*-----------------------------------------------------------------getRideHistory------------------------------------------
const getRideHistory = async (userId, query) => {
    const baseQuery = ride_model_1.Ride.find({ rider: userId });
    const queryBuilder = new queryBuilder_1.QueryBuilder(baseQuery, query);
    const rideData = queryBuilder.filter().fields().sort().paginate();
    const [data, meta] = await Promise.all([
        rideData.build().populate("rider driver").lean(),
        queryBuilder.getMeta(),
    ]);
    return {
        data,
        meta,
    };
};
//*-----------------------------------------------------------------get all rides admin------------------------------------------
const getAllRides = async (query) => {
    const queryBuilder = new queryBuilder_1.QueryBuilder(ride_model_1.Ride.find(), query);
    const rideData = queryBuilder.filter().fields().sort().paginate();
    const [data, meta] = await Promise.all([
        rideData.build().populate("rider driver").lean(),
        queryBuilder.getMeta(),
    ]);
    return {
        data,
        meta,
    };
};
//*-----------------------------------------------------------------get all driver history------------------------------------------
const driverHistory = async (userId, query) => {
    const baseQuery = ride_model_1.Ride.find({ driver: userId });
    const queryBuilder = new queryBuilder_1.QueryBuilder(baseQuery, query);
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
//*-----------------------------------------------------------------Driver accept ride and update status------------------------------------------
const updateRideStatus = async (userId, rideId, updateData) => {
    const ride = await ride_model_1.Ride.findById(rideId);
    if (!ride) {
        throw new Error("Ride not found");
    }
    const driver = await user_model_1.User.findById(userId);
    if (!driver) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid driver account");
    }
    if (!driver.isApproved || !driver.isAvailable) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid driver account");
    }
    if (driver.role !== user_interface_1.Role.DRIVER) {
        throw new Error("You are not driver");
    }
    if (ride.driver?.toString() !== userId) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Unauthorized");
    }
    const validTransitions = {
        [ride_interface_1.RideStatus.REQUESTED]: [], //only accepted ride driver can update /accept route driver already accepted
        [ride_interface_1.RideStatus.ACCEPTED]: [ride_interface_1.RideStatus.PICKED_UP, ride_interface_1.RideStatus.CANCELLED],
        [ride_interface_1.RideStatus.PICKED_UP]: [ride_interface_1.RideStatus.IN_TRANSIT],
        [ride_interface_1.RideStatus.IN_TRANSIT]: [ride_interface_1.RideStatus.COMPLETED],
        [ride_interface_1.RideStatus.COMPLETED]: [],
        [ride_interface_1.RideStatus.CANCELLED]: [],
    };
    if (!updateData.status) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Status is required");
    }
    const nextStatuses = validTransitions[ride.status];
    if (!nextStatuses ||
        !nextStatuses.includes(updateData.status)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Invalid status transition from ${ride.status} to ${updateData.status}`);
    }
    ride.status = updateData.status;
    switch (updateData.status) {
        case ride_interface_1.RideStatus.PICKED_UP:
            ride.pickedUpAt = new Date();
            break;
        case ride_interface_1.RideStatus.COMPLETED:
            ride.completedAt = new Date();
            driver.isAvailable = true;
            await driver.save();
            break;
        case ride_interface_1.RideStatus.CANCELLED:
            ride.cancellationReason = updateData.cancellationReason;
            ride.cancelledAt = new Date();
            driver.cancelledRidesCount += 1;
            driver.isAvailable = true;
            await driver.save();
            break;
    }
    const UpdateRide = await ride.save();
    return UpdateRide;
};
exports.RideService = {
    createRide,
    cancelRide,
    getRideHistory,
    getAllRides,
    driverHistory,
    updateRideStatus,
};
