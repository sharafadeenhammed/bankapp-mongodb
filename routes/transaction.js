import Express from "express";
import { protect } from "../middleware/auth.js";
import {
  makeTransaction,
  getTransaction,
  userTransactions,
  getAccountTransactions,
} from "../controllers/transaction.js";

const route = Express.Router();

// route.post("/account/:id", protect, makeTransaction);
route.get("/", protect, userTransactions);
route.get("/:id", protect, getTransaction);
route
  .route("/account/:id")
  .get(protect, getAccountTransactions)
  .post(protect, makeTransaction);

export default route;
