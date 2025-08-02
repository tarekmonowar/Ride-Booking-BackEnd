"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRideStatusSchema = exports.createRideZodSchema = void 0;
const zod_1 = require("zod");
const ride_interface_1 = require("./ride.interface");
exports.createRideZodSchema = zod_1.z.object({
    pickupLocation: zod_1.z.object({
        lat: zod_1.z.number(),
        lng: zod_1.z.number(),
    }),
    destination: zod_1.z.object({
        lat: zod_1.z.number(),
        lng: zod_1.z.number(),
    }),
});
exports.updateRideStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(Object.values(ride_interface_1.RideStatus)).optional(),
    cancellationReason: zod_1.z.string().optional(),
});
