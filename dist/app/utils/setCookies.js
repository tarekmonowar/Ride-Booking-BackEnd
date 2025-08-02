"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAuthCookies = void 0;
const env_1 = require("../config/env");
const setAuthCookies = (res, tokenInfo) => {
    if (tokenInfo.accessToken) {
        res.cookie("accessToken", tokenInfo.accessToken, {
            httpOnly: true,
            secure: env_1.envVars.NODE_ENV === "production",
            sameSite: "none",
        });
    }
    if (tokenInfo.refreshToken) {
        res.cookie("refreshToken", tokenInfo.refreshToken, {
            httpOnly: true,
            secure: env_1.envVars.NODE_ENV === "production",
            sameSite: "none",
        });
    }
};
exports.setAuthCookies = setAuthCookies;
