"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedis = exports.redisClient = void 0;
const redis_1 = require("redis");
const env_1 = require("./env");
exports.redisClient = (0, redis_1.createClient)({
    username: env_1.envVars.REDIS_USERNAME,
    password: env_1.envVars.REDIS_PASSWORD,
    socket: {
        host: env_1.envVars.REDIS_HOST,
        port: Number(env_1.envVars.REDIS_PORT),
    },
});
exports.redisClient.on("error", (err) => console.log("Redis Client Error", err));
const connectRedis = async () => {
    if (!exports.redisClient.isOpen) {
        await exports.redisClient.connect();
        console.log("Redis connected");
    }
};
exports.connectRedis = connectRedis;
