import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser,getCurrentUser  } from "../Controllers/User.js";
import { verifyJWT } from "../Middlewares/auth.js";

const router = Router()

    router.route("/register").post(registerUser)

    router.route("/login").post(loginUser)

    router.route("/logout").post(verifyJWT , logoutUser)

    router.route("/refresh-token").post(refreshAccessToken)

    router.route("/current-user").get(getCurrentUser)

    export default router