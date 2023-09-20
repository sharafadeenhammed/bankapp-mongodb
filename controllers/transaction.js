import User from "../models/UserModel.js";
import Account from "../models/AccountModel.js";
import asyncHandeler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/errorResponse.js";
import Transaction from "../models/TransctionModel.js";

// @route POST /api/v1/transaction/account/:id
// @desc  make transfer
// @access PRIVATE
export const makeTransaction = asyncHandeler(async (req, res, next) => {
  const amount = parseFloat(req.body.amount);
  let beneficiaryAccount = req.body.beneficiaryAccount;
  const senderAccount = await Account.findById(req.params.id);
  if (!senderAccount) {
    return next(new ErrorResponse("sender account not found", 404));
  }

  if (senderAccount.id == req.params.id) {
    return next(
      new ErrorResponse("same account to account transaction error", 404)
    );
  }

  // check if account belongs to the logged in user
  if (String(req.user.id) !== String(senderAccount.user_id)) {
    return next(new ErrorResponse("unauthorized operation on account", 401));
  }

  // check if insufficient fund
  if (senderAccount.balance < req.body.amount) {
    return next(new ErrorResponse("insufficient fund", 400));
  }

  // validate request body fields
  if (!amount || !beneficiaryAccount || amount < 0) {
    return next(
      new ErrorResponse("include a beneficiary account and amount", 400)
    );
  }

  // find beneficaiary account
  beneficiaryAccount = await Account.findOne({
    account_number: beneficiaryAccount,
  });

  if (!beneficiaryAccount) {
    return next(new ErrorResponse("beneficiary account not found", 404));
  }
  // check if beneficiary account is different from the sender account
  if (beneficiaryAccount.id === senderAccount.id) {
    return next(new ErrorResponse(`same account to transaction error`, 400));
  }

  //generate beneficiary transaction receipt
  await Transaction.create({
    amount: amount,
    beneficiary_account_id: beneficiaryAccount.id,
    beneficiary_account_number: beneficiaryAccount.account_number,
    beneficiary_id: beneficiaryAccount.user_id,
    beneficiary_name: beneficiaryAccount.account_holder_name,
    sender_account_id: senderAccount.id,
    sender_account_number: senderAccount.account_number,
    sender_id: senderAccount.user_id,
    sender_name: senderAccount.account_holder_name,
    user_id: beneficiaryAccount.user_id,
    account_id: beneficiaryAccount.id,
  });

  //generate sender transaction receipt
  const senderTransctionReceipt = await Transaction.create({
    amount: amount,
    beneficiary_account_id: beneficiaryAccount.id,
    beneficiary_account_number: beneficiaryAccount.account_number,
    beneficiary_id: beneficiaryAccount.user_id,
    beneficiary_name: beneficiaryAccount.account_holder_name,
    sender_account_id: senderAccount.id,
    sender_account_number: senderAccount.account_number,
    sender_id: senderAccount.user_id,
    sender_name: senderAccount.account_holder_name,
    user_id: senderAccount.user_id,
    account_id: senderAccount.id,
  });

  // credit the beneficiary account
  const transactionAmountCredit = beneficiaryAccount.balance + amount;
  beneficiaryAccount.balance = transactionAmountCredit;
  await beneficiaryAccount.save();
  // debit the sender account.
  const transactionAmountDebit = senderAccount.balance - amount;
  senderAccount.balance = transactionAmountDebit;
  await senderAccount.save();

  res.status(200).json({
    success: true,
    data: {
      id: senderTransctionReceipt._id,
      amount: amount,
      beneficiary_account_id: beneficiaryAccount.id,
      beneficiary_account_number: beneficiaryAccount.account_number,
      beneficiary_id: beneficiaryAccount.user_id,
      beneficiary_name: beneficiaryAccount.account_holder_name,
      sender_account_id: senderAccount.id,
      sender_account_number: senderAccount.account_number,
      sender_id: senderAccount.user_id,
      sender_name: senderAccount.account_holder_name,
      user_id: senderAccount.user_id,
      account_id: senderAccount.id,
    },
  });
});

// @route GET /api/v1/transaction/:id
// @desc  get single transaction
// @access PRIVATE
export const getTransaction = asyncHandeler(async (req, res, next) => {
  const transaction = await Transaction.findById(req.params.id);
  if (!transaction) {
    return next(new ErrorResponse(`transaction not found`, 404));
  }

  // check if transaction belongs to user
  if (String(transaction.user_id) !== String(req.user.id)) {
    console.log("transaction user id: ", transaction.user_id);
    console.log("actual user id: ", req.user.id);
    return next(
      new ErrorResponse(`not authorized to access this transaction`, 401)
    );
  }
  res.status(200).json({
    success: true,
    data: transaction,
  });
});

// @route GET /api/v1/transaction
// @desc  get all transaction associated to user
// @access PRIVATE
export const userTransactions = asyncHandeler(async (req, res, next) => {
  const transactions = await Transaction.find({ user_id: req.user.id });
  if (!transactions) {
    return next(new ErrorResponse(`No trannsactions found`, 404));
  }
  res.status(200).json({
    success: true,
    count: transactions.length,
    data: transactions,
  });
});

// @route GET /api/v1/transaction/account/:id
// @desc  get all transaction associated to an account
// @access PRIVATE
export const getAccountTransactions = asyncHandeler(async (req, res, next) => {
  const transactions = await Transaction.find({ account_id: req.params.id });
  if (!transactions) {
    return next(new ErrorResponse(`No transaction yet`, 404));
  }
  res.status(200).json({
    success: true,
    count: transactions.length,
    data: transactions,
  });
});
