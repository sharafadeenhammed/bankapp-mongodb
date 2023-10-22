import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import ErrorResponse from "../utils/errorResponse.js";
import UserModel from "../models/UserModel.js";
import asyncHandeler from "../utils/asyncHandler.js";

export const update = asyncHandeler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(req.user.id, req.body);
  const updatedUser = await UserModel.findById(req.user.id);
  res.status(200).json({
    success: true,
    message: "update successful",
    data: updatedUser,
  });
});

export const photoUpload = asyncHandeler(async (req, res, next) => {
  if (!req?.files?.photo) {
    return next(new ErrorResponse("upload a file with name 'photo'", 400));
  }
  const file = path.parse(req?.files?.photo?.name);
  const imageExtension = [".jpg", ".png"];
  if (!imageExtension.includes(file.ext)) {
    const extNames = imageExtension.join(", ");
    return next(
      new ErrorResponse(
        `unsuppoerted '${file.ext}' image we support only ${extNames} files`,
        400
      )
    );
  }
  if (req.files.size > 1024 * 1024 * 1)
    return next(new ErrorResponse("image size must not be more than 1mb", 400));
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // remove initial uploaded files on the server
  imageExtension.forEach((item) => {
    fs.unlink(
      path.join(__dirname, "..", "public", req.user.id + item),
      (err) => {
        if (err) console.log(err);
        console.log(`${req.user.id}${item} deleted`);
      }
    );
  });

  req.files.photo.mv(
    path.join(__dirname, "..", "public", req.user.id + file.ext)
  );
  const user = await UserModel.findByIdAndUpdate(req.user.id, {
    photo_url: `https://${process.env.ASSET_URL}/${req.user.id}${file.ext}`,
  });
  res.status(200).json({
    success: true,
    message: "photo uploaded successful",
    data: user,
  });
});
