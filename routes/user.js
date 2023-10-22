import express from "express";
import { update, photoUpload } from "../controllers/user.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.put("/", protect, update);
router.post("/", protect, photoUpload);

export default router;
