import express from "express";
import { update, photoUpload } from "../controllers/user.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, update);
router.post("/photo", protect, photoUpload);

export default router;
