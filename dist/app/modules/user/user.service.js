"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const queryBuilder_1 = require("../../utils/queryBuilder");
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const user_constant_1 = require("./user.constant");
//*--------------------------------------------------------- create user------------------------------------------------
const createUser = async (payload) => {
    const { email, password, ...rest } = payload;
    const isUserExist = await user_model_1.User.findOne({ email });
    if (isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User Already Exist");
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const authProvider = {
        provider: "credentials",
        providerId: email,
    };
    const user = await user_model_1.User.create({
        email,
        password: hashedPassword,
        auths: [authProvider],
        ...rest,
    });
    const userWithoutPassword = user?.toObject();
    delete userWithoutPassword.password;
    return userWithoutPassword;
};
//*---------------------------------------------------------------update user------------------------------------------------------
const updateUser = async (userId, payload, decodedToken) => {
    //user and guid cannot update others
    if (decodedToken.role === user_interface_1.Role.RIDER || decodedToken.role === user_interface_1.Role.DRIVER) {
        if (userId !== decodedToken.userId) {
            throw new AppError_1.default(401, "You are not authorized");
        }
    }
    const ifUserExist = await user_model_1.User.findById(userId);
    if (!ifUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User Not Found");
    }
    //admin trying to update super-admin
    if (decodedToken.role === user_interface_1.Role.ADMIN &&
        ifUserExist.role === user_interface_1.Role.SUPER_ADMIN) {
        throw new AppError_1.default(401, "You are not authorized");
    }
    //its work when update role i mean payload.role
    if (payload.role) {
        if (decodedToken.role === user_interface_1.Role.DRIVER || decodedToken.role === user_interface_1.Role.RIDER) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
    }
    //its work when user want update there isactive/is deleted status
    if (payload.isBlocked || payload.isApproved || payload.isVerified) {
        if (decodedToken.role === user_interface_1.Role.DRIVER || decodedToken.role === user_interface_1.Role.RIDER) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
    }
    const newUpdatedUser = await user_model_1.User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });
    const userWithoutPassword = newUpdatedUser?.toObject();
    delete userWithoutPassword?.password;
    return userWithoutPassword;
};
//*---------------------------------------------------------------get all users------------------------------------------------
const getAllUsers = async (query) => {
    const queryBuilder = new queryBuilder_1.QueryBuilder(user_model_1.User.find(), query);
    const usersData = queryBuilder
        .filter()
        .search(user_constant_1.userSearchableFields)
        .sort()
        .fields()
        .paginate();
    const [data, meta] = await Promise.all([
        usersData.build(),
        queryBuilder.getMeta(),
    ]);
    // remove password from each user
    const usersWithoutPassword = data.map((user) => {
        const userObj = user.toObject?.() || user;
        delete userObj.password;
        return userObj;
    });
    return {
        data: usersWithoutPassword,
        meta,
    };
};
//*---------------------------------------------------------------get me------------------------------------------------
const getMe = async (id) => {
    const user = await user_model_1.User.findById(id).select("-password");
    return {
        data: user,
    };
};
//*---------------------------------------------------------------get single users------------------------------------------------
const getSingleUser = async (id) => {
    const user = await user_model_1.User.findById(id).select("-password");
    return {
        data: user,
    };
};
//All exports
exports.UserServices = {
    createUser,
    updateUser,
    getAllUsers,
    getSingleUser,
    getMe,
};
