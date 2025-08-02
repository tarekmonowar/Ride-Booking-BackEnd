import { Types } from "mongoose";

export enum Role {
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
  RIDER = "RIDER",
  DRIVER = "DRIVER",
}

export interface IAuthProvider {
  provider: "google" | "credentials";
  providerId: string;
}

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  address?: string;
  role: Role;
  isVerified: boolean;
  isBlocked: boolean;
  isApproved?: boolean;
  isAvailable?: boolean;
  cancelledRidesCount?: number;
  auths: IAuthProvider[];
  vehicle?: {
    model: string;
    licensePlate: string;
  };
  rating?: number;
  createdAt?: Date;
}
