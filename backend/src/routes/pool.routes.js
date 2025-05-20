import {Router} from "express";
import verifyJWT from '../middlewares/auth.middlewares.js';
import { acceptJoinRequest, createPool, discoverPools, getAllPools, getPoolById, rejectJoinRequests, sendJoinRequest, updatePoolStatus, viewJoinRequests, withdrawJoinRequest } from "../controllers/pool.controllers.js";


const poolRouter = Router();


poolRouter.route("/createPool").post(verifyJWT,createPool);
poolRouter.route("/").get(verifyJWT,getAllPools);
poolRouter.route("/discover").get(verifyJWT, discoverPools);
poolRouter.route("/:id").get(verifyJWT,getPoolById);
poolRouter.route("/:id/join").post(verifyJWT,sendJoinRequest);
poolRouter.route('/:id/withdraw').post(verifyJWT, withdrawJoinRequest);
poolRouter.route('/:id/requests').get(verifyJWT,viewJoinRequests);
poolRouter.route('/:id/accept').post(verifyJWT,acceptJoinRequest);
poolRouter.route('/:id/reject').post(verifyJWT,rejectJoinRequests);
poolRouter.route('/:id/status').patch(verifyJWT, updatePoolStatus);



export default poolRouter;


