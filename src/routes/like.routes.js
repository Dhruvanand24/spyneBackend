import { Router } from 'express';
import {
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
    togglePostLike,
    getPostLike,
    toggleReplyLike,
} from "../controllers/like.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/toggle/v/:videoId").post(toggleVideoLike);
router.route("/toggle/c/:comment_id").post(toggleCommentLike);
router.route("/toggle/t/:tweetId").post(toggleTweetLike);
router.route("/likesofpost").post(getPostLike);
router.route('/togglelike').post(verifyJWT, togglePostLike);
router.route('/togglereplyike').post(verifyJWT, toggleReplyLike);

export default router