import { Types } from "mongoose";
import { IUser } from "../user/user.interface";

export enum RideStatus {
  REQUESTED = "REQUESTED",
  ACCEPTED = "ACCEPTED",
  PICKED_UP = "PICKED_UP",
  IN_TRANSIT = "IN_TRANSIT",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface LocationInput {
  lat: number;
  lng: number;
}

export interface CreateRideInput {
  pickupLocation: LocationInput;
  destination: LocationInput;
}

export interface UpdateRideStatusInput {
  status?: RideStatus;
  cancellationReason?: string;
}

export interface IRide {
  rider: Types.ObjectId;
  driver?: Types.ObjectId;
  pickupLocation: {
    type: string;
    coordinates: [number, number];
  };
  destination: {
    type: string;
    coordinates: [number, number];
  };
  status: RideStatus;
  distance?: number;
  estimatedCost?: number;
  requestedAt: Date;
  acceptedAt?: Date;
  pickedUpAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
}
