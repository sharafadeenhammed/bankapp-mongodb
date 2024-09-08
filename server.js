import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";

import connectDb from "./config/db.js";
import errorHandeler from "./utils/errorHandler.js";
import auth from "./routes/auth.js";
import transactions from "./routes/transaction.js";
import account from "./routes/account.js";
import user from "./routes/user.js";
import publicFolder from "./utils/publicFolder.js";
import mongoSanitize from "express-mongo-sanitize"
const app = express();
dotenv.config({ path: "./.env" });

// mounting cors
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());
app.use(mongoSanitize());

app.get("/", (req, res, next) => {
  res.redirect("https://documenter.getpostman.com/view/20324776/2s946iaqNP");
});

app.get("/public/make", publicFolder);

app.use(express.static("./public"));

app.use("/api/v1/auth", auth);

app.use("/api/v1/account", account);

app.use("/api/v1/user", user);

app.use("/api/v1/transaction", transactions);

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "route or resource not found or registerd on our system",
  })
});




// mounting error handeler
app.use(errorHandeler);

const PORT = process.env.PORT || 5050;

const startServer = async () => {
  await connectDb();
  app.listen(PORT, async () => {
    console.log(`server listenning on port ${PORT}`);
  })
}

startServer();