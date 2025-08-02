"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAvailabilitySchema = void 0;
const zod_1 = require("zod");
exports.updateAvailabilitySchema = zod_1.z.object({
    isAvailable: zod_1.z.boolean(),
});
