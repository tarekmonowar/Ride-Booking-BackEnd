import crypto from "crypto";
import AppError from "../../errorHelpers/AppError";
import { sendEmail } from "../../utils/sendEmail";
import { User } from "../user/user.model";
import { redisClient } from "../../config/redis.config";
const OTP_EXPIRATION = 2 * 60;

const generateOtp = (length = 6) => {
  //6 digit otp
  const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString();

  return otp;
};
//*-----------------------------------------------------------isverified token-----------------------
const sendOTP = async (email: string, name: string) => {
  if (!email) {
    throw new AppError(404, "Provide valid email");
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (user.isVerified) {
    throw new AppError(401, "You are already verified");
  }
  const otp = generateOtp();

  const redisKey = `otp:${email}`;

  await redisClient.set(redisKey, otp, {
    expiration: {
      type: "EX",
      value: OTP_EXPIRATION,
    },
  });

  await sendEmail({
    to: email,
    subject: "Your OTP Code",
    templateName: "otp",
    templateData: {
      name: name,
      otp: otp,
    },
  });
};

//*-----------------------------------------------------------isverified token verify-----------------------

const verifyOTP = async (email: string, otp: string) => {
  // const user = await User.findOne({ email, isVerified: false })
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (user.isVerified) {
    throw new AppError(401, "You are already verified");
  }

  const redisKey = `otp:${email}`;

  const savedOtp = await redisClient.get(redisKey);

  if (!savedOtp) {
    throw new AppError(401, "Invalid OTP");
  }

  if (savedOtp !== otp) {
    throw new AppError(401, "Invalid OTP");
  }

  await Promise.all([
    User.updateOne({ email }, { isVerified: true }, { runValidators: true }),
    redisClient.del([redisKey]),
  ]);
};

export const OTPService = {
  sendOTP,
  verifyOTP,
};
