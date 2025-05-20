import { deleteMessage, editMessage, getAllMessages, getUnreadMessageCounts, markMessageAsSeen, replyToMessage, sendMessage } from "../controllers/chat.controllers.js";
import  verifyJWT  from "../middlewares/auth.middlewares.js";
import {Router} from "express";

const chatRouter = Router();


chatRouter.route('/:poolId/send').post(verifyJWT,sendMessage);
chatRouter.route("/:poolId/messages").get(verifyJWT,getAllMessages);
chatRouter.route('/:poolId/mark-seen').patch(verifyJWT,markMessageAsSeen);
chatRouter.route("/unread-counts").get(verifyJWT, getUnreadMessageCounts);
chatRouter.route("/:messageId").delete(verifyJWT, deleteMessage);
chatRouter.route("/:id/edit").patch(verifyJWT, editMessage);
chatRouter.route("/:poolId/reply").post(verifyJWT, replyToMessage);


export default chatRouter;