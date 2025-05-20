import { generateQRForUserPool, verifyQRTokenController } from "../controllers/qr.controllers.js";
import  verifyJWT  from "../middlewares/auth.middlewares.js";
import {Router} from "express";


const qrRouter = Router();


qrRouter.route('/generate').post(verifyJWT,generateQRForUserPool);
qrRouter.route('/verify').post(verifyJWT,verifyQRTokenController);

export default qrRouter;

