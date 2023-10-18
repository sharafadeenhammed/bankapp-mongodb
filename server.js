import path from "path";
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
// import colors from "colors";
import cookieParser from "cookie-parser";
import cors from "cors";
import axios from "axios";
import connectDb from "./config/db.js";
import errorHandeler from "./utils/errorHandler.js";
import auth from "./routes/auth.js";
import transactions from "./routes/transaction.js";
import account from "./routes/account.js";
// import mongoSanitize from "express-mongo-sanitize"
const app = express();
dotenv.config({ path: "./.env" });
connectDb();
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

app.use(express.static("public"));

app.get("/", (req, res, next) => {
  res.redirect("https://documenter.getpostman.com/view/20324776/2s946iaqNP");
});

app.get("/message", async (req, res, next) => {
  const reqInstance = axios.create({
    headers: {
      Authorization: "Bearer ac56aa4016d2425fa80a9115da2dffc4",
      "Content-Type": "application/json",
    },
  });
  try {
    const response = await reqInstance.post(
      "https://us.sms.api.sinch.com/xms/v1/cd2a975c633c4eba84fa3e4ed3036590/batches",

      {
        from: "447520662453",
        to: ["2348073191813"],
        body: "irrigation pump turned on",
      }
    );

    if (response.status < 200 && response.status > 300) throw res.data;
    console.log(response.data);
    res.status(200).json({ status: "okay" });
  } catch (error) {
    console.log(error);
  }
});

app.use("/api/v1/auth", auth);

app.use("/api/v1/account", account);

app.use("/api/v1/user", account);

app.use("/api/v1/transaction", transactions);

// mounting error handeler
app.use(errorHandeler);

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`server listenning on port ${PORT}`);
});
