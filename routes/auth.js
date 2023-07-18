import Express from "express";
import { protect } from "../middleware/auth.js";
import { createUser, login, getUser, logoutUser } from "../controllers/auth.js";

const route = Express.Router();

route.post("/register", createUser);
route.post("/login", login);
route.get("/getme", protect, getUser);
route.get("/logout", logoutUser);

export default route;
