"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const env_1 = require("./app/config/env");
const seedSuperAdmin_1 = require("./app/utils/seedSuperAdmin");
const redis_config_1 = require("./app/config/redis.config");
let server;
const startServer = async () => {
    try {
        await mongoose_1.default.connect(env_1.envVars.DB_URL);
        console.log("Connected to DB");
        server = app_1.default.listen(env_1.envVars.PORT, () => {
            console.log(`Server is running on http://localhost:${env_1.envVars.PORT}`);
        });
    }
    catch (error) {
        console.log(error);
    }
};
(async () => {
    await (0, redis_config_1.connectRedis)();
    await startServer();
    await (0, seedSuperAdmin_1.seedSuperAdmin)();
})();
// You create a Promise that rejects.And you don’t attach any .catch() handler (or try/catch in async)
process.on("unhandledRejection", (reason) => {
    console.log("Unhandle Rejection Detected", reason);
    if (server) {
        server.close(() => {
            console.log("Server closed gracefully");
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
});
// You throw an error outside any try/catch
process.on("uncaughtException", (reason) => {
    console.log("Uncaught Exception Detected", reason);
    if (server) {
        server.close(() => {
            console.log("Server closed gracefully");
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
});
//If the server owner (or admin) wants to stop my Node.js app like aws,vercel
process.on("SIGTERM", () => {
    console.error("SIGTERM received");
    if (server) {
        server.close(() => {
            console.log("Server closed gracefully");
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
});
//If Manually off server it shutdown gracefully
process.on("SIGINT", () => {
    console.log("SIGINT received (Ctrl+C). Shutting down gracefully...");
    if (server) {
        server.close(() => {
            console.log("Server closed gracefully");
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
});
