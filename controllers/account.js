import Account from "../models/AccountModel.js";
import Transaction from "../models/TransctionModel.js";
import asyncHandeler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/errorResponse.js";
//@route GET /api/v1/account/number/:number
//@desc  get single account by account number
//@access PRIVATE
export const getAccountByAccountNumber = asyncHandeler(
  async (req, res, next) => {
    const account_number = parseInt(req.params.number, 10);
    const account = await Account.findOne({
      account_number,
    });
    // check if account is succesfully fetched...
    if (!account) {
      return next(new ErrorResponse("account not found", 404));
    }
    res.status(200).json({
      success: true,
      data: account,
    });
  }
);

//@route GET /api/v1/account/:id
//@desc  get single account
//@access PRIVATE
export const getAccount = asyncHandeler(async (req, res, next) => {
  const account = await Account.findById(req.params.id);
  // check if account is succesfully fetched...
  if (!account) {
    return next(new ErrorResponse(`account not found`, 404));
  }
  // check if account belongs to user.
  if (String(account.user_id) !== String(req.user.id)) {
    return next(
      new ErrorResponse("not unauthorized to access this account", 401)
    );
  }
  res.status(200).json({
    success: true,
    data: account,
  });
});

//@route GET /api/v1/account/:id/fund
//@desc  fund account
//@access PRIVATE
export const fundAccount = asyncHandeler(async (req, res, next) => {
  const amount = parseFloat(req.body?.amount);

  // check if amount is not empty
  if (!amount || amount < 0) {
    return next(new ErrorResponse("Transaction amount can not be  zero", 400));
  }

  // find account
  const account = await Account.findById(req.params.id);
  if (!account) {
    return next(new ErrorResponse(`account not found`, 404));
  }
  // check if account belongs to user.
  if (String(account.user_id) !== String(req.user.id)) {
    return next(
      new ErrorResponse("not unauthorized to access this account", 401)
    );
  }
  const creditAmount = amount + account.balance;
  account.balance = creditAmount;
  account.save();
  //generate beneficiary transaction receipt
  const transaction = await Transaction.create({
    amount: req.body.amount,
    beneficiary_account_id: account.id,
    beneficiary_account_number: account.account_number,
    beneficiary_id: account.user_id,
    beneficiary_name: account.account_holder_name,
    sender_account_id: account.user_id,
    sender_account_number: "1122003967",
    sender_id: account.user_id,
    sender_name: "account funder",
    user_id: account.user_id,
    account_id: account.id,
  });

  res.status(200).json({
    success: true,
    data: {
      id: transaction._id,
      amount: req.body.amount,
      beneficiary_account_id: account.id,
      beneficiary_account_number: account.account_number,
      beneficiary_id: account.user_id,
      beneficiary_name: account.account_holder_name,
      sender_account_id: account.id,
      sender_account_number: account.account_number,
      sender_id: account.user_id,
      sender_name: account.account_holder_name,
      user_id: account.user_id,
      account_id: account.id,
    },
  });
});

//@route GET /api/v1/account/user
//@desc  get account related to user
//@access PRIVATE
export const getAccounts = asyncHandeler(async (req, res, next) => {
  const accounts = await Account.find({ user_id: req.user.id });
  // check if account found;
  if (!accounts) {
    return next(new ErrorResponse(`no account associated to you found`, 404));
  }
  res.status(200).json({
    success: true,
    count: accounts.length || 0,
    data: accounts,
  });
});
