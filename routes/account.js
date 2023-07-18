import Express from "express";
import { protect } from "../middleware/auth.js";
import {
  getAccount,
  getAccounts,
  fundAccount,
  getAccountByAccountNumber,
} from "../controllers/account.js";

const route = Express.Router();

route.get("/user", protect, getAccounts);
route.get("/number/:number", getAccountByAccountNumber);
route.route("/:id").post(protect, fundAccount).get(protect, getAccount);

export default route;
