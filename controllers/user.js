import UserModel from "../models/UserModel";
import asyncHandeler from "../utils/asyncHandler";

const update = asyncHandeler(async (req, res, next) => {
  const user = UserModel.findById(req.user.id);
  console.log(user);
});
