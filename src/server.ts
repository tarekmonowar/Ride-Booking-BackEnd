import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";
import { connectRedis } from "./app/config/redis.config";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log("Connected to DB");

    server = app.listen(envVars.PORT, () => {
      console.log(`Server is running on http://localhost:${envVars.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await connectRedis();
  await startServer();
  await seedSuperAdmin();
})();

// You create a Promise that rejects.And you don’t attach any .catch() handler (or try/catch in async)
process.on("unhandledRejection", (reason) => {
  console.log("Unhandle Rejection Detected", reason);
  if (server) {
    server.close(() => {
      console.log("Server closed gracefully");
      process.exit(1);
    });
  } else {
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
  } else {
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
  } else {
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
  } else {
    process.exit(1);
  }
});
