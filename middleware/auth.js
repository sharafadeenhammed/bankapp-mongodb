import ErrorResponse from "../utils/errorResponse.js";
import jwt from "jsonwebtoken";
import asyncHandeler from "../utils/asyncHandler.js";

export const protect = asyncHandeler(async (req, res, next) => {
  let token =
    req?.headers?.authorization || req?.cookies?.token || req?.body?.token;
  if (!token || token === "") {
    return next(new ErrorResponse("not autohorised to access this route", 401));
  }
  token = token.split(" ")[1];
  let user = jwt.verify(token, process.env.JWT_SECRET || "lendsqr_secret");
  if (!user) {
    return next(
      new ErrorResponse(
        "not authorized to access this route login session expired",
        401
      )
    );
  }

  // generate token
  // generate token
  const jwtPayload = {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
  };
  const jwtToken = jwt.sign(
    jwtPayload,
    process.env.JWT_SECRET || "lendsqr_secret",
    {
      expiresIn: process.env.JWT_TOKEN_EXPIRES || "30d",
    }
  );
  req.user = user;
  res.cookie("token", `Bearer ${token}`, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 2,
  });
  next();
});

export const authorize = asyncHandeler(async (...roles) => {
  // if(args.contain(res.user.role))
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `user role "${req.user.role}" not allowed to access this route`,
          401
        )
      );
    }
    next();
  };
});
