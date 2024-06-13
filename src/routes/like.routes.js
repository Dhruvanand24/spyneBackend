import { Router } from 'express';
import {
    toggleCommentLike,
    togglePostLike,
    getPostLike,
    toggleReplyLike,
} from "../controllers/like.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/toggle/c/:comment_id").post(toggleCommentLike);
router.route("/likesofpost").post(getPostLike);
router.route('/togglelike').post(verifyJWT, togglePostLike);
router.route('/togglereplylike').post(verifyJWT, toggleReplyLike);

export default router