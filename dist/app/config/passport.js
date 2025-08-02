"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_local_1 = require("passport-local");
const user_model_1 = require("../modules/user/user.model");
const env_1 = require("./env");
const user_interface_1 = require("../modules/user/user.interface");
// Local Strategy
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: "email",
    passwordField: "password",
}, async (email, password, done) => {
    try {
        const isUserExist = await user_model_1.User.findOne({ email });
        if (!isUserExist) {
            return done(null, false, { message: "User not found" });
        }
        if (!isUserExist.isVerified) {
            return done(null, false, { message: "User is not Verified" });
        }
        if (isUserExist.isBlocked === true) {
            return done(null, false, {
                message: `User is Blocked`,
            });
        }
        const isGoogleAuthenticated = isUserExist.auths.some((providerObject) => providerObject.provider == "google");
        if (isGoogleAuthenticated && !isUserExist.password) {
            return done(null, false, {
                message: "You have authenticated through Google.For login with credentials please first login with google and then set a password for your email",
            });
        }
        const isMatch = await bcryptjs_1.default.compare(password, isUserExist.password);
        if (!isMatch) {
            return done(null, false, { message: "Incorrect password" });
        }
        return done(null, isUserExist);
    }
    catch (err) {
        console.log(err);
        return done(err);
    }
}));
// Google Strategy--->
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: env_1.envVars.GOOGLE_CLIENT_ID,
    clientSecret: env_1.envVars.GOOGLE_CLIENT_SECRET,
    callbackURL: env_1.envVars.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0].value.toLowerCase();
        if (!email) {
            return done(null, false, { message: "No Email Found" });
        }
        let user = await user_model_1.User.findOne({ email });
        if (!user) {
            user = new user_model_1.User({
                name: profile.displayName,
                email: email,
                picture: profile.photos?.[0].value,
                role: user_interface_1.Role.RIDER,
                isApproved: false,
                isAvailable: false,
                isVerified: true,
                auths: [
                    {
                        provider: "google",
                        providerId: profile.id,
                    },
                ],
            });
            await user.save();
        }
        if (user) {
            if (!user.isVerified) {
                return done(null, false, { message: "User is not verified" });
            }
            if (user.isBlocked === true) {
                return done(null, false, { message: `User is Blocked` });
            }
        }
        return done(null, user);
    }
    catch (err) {
        console.log("Google Strategy Error", err);
        return done(err, false);
    }
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await user_model_1.User.findById(id);
        done(null, user);
    }
    catch (error) {
        done(error);
    }
});
