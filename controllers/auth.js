import User from "../models/UserModel.js";
import Account from "../models/AccountModel.js";
import asyncHandeler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/errorResponse.js";
import jwt from "jsonwebtoken";

// @route POST /api/v1/auth/register
// @desc  register user
// @access PUBLIC
export const createUser = asyncHandeler(async (req, res, next) => {
  const signUpBalance = 0;
  const accountType = "";
  let user = req.body;
  const {
    first_name,
    last_name,
    password,
    email,
    address,
    age,
    phone,
    account_type,
    balance,
  } = user;
  console.log(user);
  // if (
  //   !first_name ||
  //   !last_name ||
  //   !password ||
  //   !email ||
  //   !address ||
  //   !age ||
  //   !phone
  // ) {
  //   return next(
  //     new ErrorResponse(
  //       "please include a first_name, last_name, password, email, address, age, and phone_number fields",
  //       400
  //     )
  //   );
  // }
  // hashing password...
  user = await User.create(user);
  if (!user) {
    new ErrorResponse(
      "cannot create your account at this time try again later",
      400
    );
  }
  // create user account
  const account = await Account.create({
    user_id: user._id,
    account_number: Date.now().toString().substring(0, 10),
    balance: signUpBalance || balance || 0,
    account_type: account_type || accountType || "savings",
    account_holder_name: `${first_name} ${last_name}`,
  });

  const jwtPayload = {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
  };

  // generate token
  const token = jwt.sign(
    jwtPayload,
    process.env.JWT_SECRET || "lendsqr_secret",
    {
      expiresIn: process.env.JWT_TOKEN_EXPIRES || "30d",
    }
  );
  delete user.password;
  user.id = user._id;
  res
    .status(201)
    .cookie("token", `Bearer ${token}`, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 2,
    })
    .json({
      success: true,
      data: user,
      token,
    });
});

// @route POST /api/v1/auth/login
// @desc  login user
// @access PUBLIC
export const login = asyncHandeler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorResponse("invalid login credentials", 400));
  }
  // verify password
  const isVerified = user.matchPassword(password);
  if (!isVerified) {
    return next(new ErrorResponse("invalid credentials", 400));
  }

  // generate token
  const jwtPayload = {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
  };
  const token = jwt.sign(
    jwtPayload,
    process.env.JWT_SECRET || "lendsqr_secret",
    {
      expiresIn: process.env.JWT_TOKEN_EXPIRES || "30d",
    }
  );
  delete user.password;
  res
    .status(200)
    .cookie("token", `Bearer ${token}`, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 2,
    })
    .json({
      success: true,
      token,
      data: user,
    });
});

// @route GET /api/v1/auth/getme
// @desc  get logged user
// @access PRIVATE
export const getUser = asyncHandeler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorResponse("not authorized to access this route", 401));
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});

//@Desc   Logout user
//@route  POST /api/v1/auth/logout
//@access Public
export const logoutUser = asyncHandeler(async (req, res, next) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "developement",
      expires: new Date(0),
    })
    .status(200)
    .json({
      message: "success",
      token: "",
    });
});
