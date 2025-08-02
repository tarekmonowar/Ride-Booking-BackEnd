import { NextFunction, Request, Response, Router } from "express";
import { AuthContoller } from "./auth.controller";
import { Role } from "../user/user.interface";
import passport from "passport";
import { envVars } from "../../config/env";
import { checkAuth } from "../../middleware/auth.middleware";
const router = Router();

//Route api/v1/auth/login

router.post("/login", AuthContoller.credentialsLogin);
router.post("/refresh-token", AuthContoller.getNewAccessToken);
router.post("/logout", AuthContoller.logout);
router.post(
  "/change-password",
  checkAuth(...Object.values(Role)),
  AuthContoller.changePassword,
);
router.post(
  "/set-password",
  checkAuth(...Object.values(Role)),
  AuthContoller.setPassword,
);

router.post("/forgot-password", AuthContoller.forgotPassword);
router.post(
  "/reset-password",
  checkAuth(...Object.values(Role)),
  AuthContoller.resetPassword,
);

router.get("/google", (req: Request, res: Response, next: NextFunction) => {
  const redirect = req.query.redirect || "/";
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: redirect as string,
  })(req, res, next);
});

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${envVars.FRONTEND_URL}/login?error=There is some issues with your account. Please contact with out support team!`,
  }),
  AuthContoller.googleCallback,
);
export const AuthRoutes = router;
