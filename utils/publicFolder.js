import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import asyncHandeler from "./asyncHandler.js";
const publicFolder = asyncHandeler(async (req, res, next) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  fs.readdir(path.join(__dirname, "..", "public"), (err, files) => {
    if (err) console.log(err);
    if (files.length > 0) {
      for (const file of files) {
        fs.unlink(path.join(__dirname, "..", "public", file), (err) => {
          if (err) console.log(err);
        });
      }
    }
    fs.rmdirSync(path.join(__dirname, "..", "public"));
    fs.mkdirSync(path.join(__dirname, "..", "public"));
    res
      .status(200)
      .json({ success: true, message: "folder refreshed sucesfully" });
  });
});

export default publicFolder;
