import path from "path";
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
// import colors from "colors";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDb from "./config/db.js";
import errorHandeler from "./utils/errorHandler.js";
import auth from "./routes/auth.js";
// import mongoSanitize from "express-mongo-sanitize"
const app = express();
dotenv.config({ path: "./.env" });
connectDb();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

app.use(express.static("public"));

app.get("/", (req, res, next) => {
  res.redirect("https://documenter.getpostman.com/view/20324776/2s93RNyEuB");
});

app.use("/api/v1/auth", auth);

// app.use("/api/v1/account", account);

// app.use("/api/v1/transaction", transaction);

// mounting error handeler
app.use(errorHandeler);

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`server listenning on port ${PORT}`);
});
