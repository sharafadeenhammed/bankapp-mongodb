import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import colors from "colors";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import connectDb from "./config/db.js";
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

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`server listenning on port ${PORT}`);
});
