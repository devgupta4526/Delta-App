import { Router } from 'express';
import { loginUser, registerUser, getUserProfile, logoutUser, refreshAccessToken } from '../controllers/users.controllers.js';
import verifyJWT from '../middlewares/auth.middlewares.js';
import authorizeRoles from "../middlewares/role.middlewares.js";
import { getAllUsers } from "../controllers/users.controllers.js";
import { upload } from '../middlewares/multer.middlewares.js';
const userRouter = Router();


//public routes
userRouter.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 }, 
        { name: "coverImage", maxCount: 1 }]),
    registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route('/refresh-token').post(refreshAccessToken);

//protected routes 
userRouter.route("/profile/:username").get(verifyJWT, getUserProfile);
userRouter.route('/logout').post(verifyJWT, logoutUser);
userRouter.route("/admin/users").get(verifyJWT, authorizeRoles("admin"), getAllUsers);


export default userRouter;