import { Router } from "express";
import {
  getAllPosts,
  publishAPost,
  getPostById,
  updatePost,
  deletePost,
  getPostsByTags,
  getPostsByText
} from "../controllers/post.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
  .route("/")
  .get(getAllPosts)
  .post(
    upload.fields([
      {
        name: "image",
        maxCount: 1,
      },
    ]),
    publishAPost
  );

router.route("/getpost").post(getPostById);

router.route("/updatepost").post(
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  updatePost
);

router.route("/deletepost").delete(deletePost);

router.route("/postbytags").post(getPostsByTags);
router.route("/postbytext").post(getPostsByText);

export default router;
