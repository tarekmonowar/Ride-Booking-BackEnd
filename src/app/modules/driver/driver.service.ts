import User from "../../models/User.model";
import { errorResponse } from "../../utils/apiResponse";

class DriverService {
  async getAvailableRides() {
    return await Ride.find({
      status: "requested",
      driver: { $exists: false },
    }).populate("rider", "name");
  }

  async acceptRide(rideId: string, driverId: string) {
    const ride = await Ride.findById(rideId);
    if (!ride || ride.status !== "requested") {
      throw new Error("Ride not available");
    }

    const driver = await User.findById(driverId);
    if (!driver || !driver.isApproved || !driver.isAvailable) {
      throw new Error("Driver not available");
    }

    ride.driver = driverId;
    ride.status = "accepted";
    ride.acceptedAt = new Date();

    // Update driver availability
    driver.isAvailable = false;
    await driver.save();

    return await ride.save();
  }

  async updateAvailability(userId: string, isAvailable: boolean) {
    const driver = await User.findById(userId);
    if (!driver || driver.role !== "driver") {
      throw new Error("Driver not found");
    }

    driver.isAvailable = isAvailable;
    return await driver.save();
  }
}

export default new DriverService();
