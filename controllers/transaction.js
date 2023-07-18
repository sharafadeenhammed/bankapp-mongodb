import User from "../models/UserModel.js";
import Account from "../models/AccountModel.js";
import asyncHandeler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/errorResponse.js";
import Transaction from "../models/TransctionModel.js";

// @route POST /api/v1/transaction/account/:id
// @desc  make transfer
// @access PRIVATE
export const makeTransaction = asyncHandeler(async (req, res, next) => {
  const { amount, beneficiary_account } = req.body;
  const senderAccount = await Account.findById(parseInt(req.params.id));
  if (!senderAccount) {
    return next(new ErrorResponse("sender account not found", 404));
  }
  // check if account belongs to the logged in user
  if (req.user.id !== senderAccount.user_id) {
    return next(new ErrorResponse("unauthorized operation on account", 401));
  }
  // check if insufficient fund
  if (senderAccount.balance < req.body.amount) {
    return next(new ErrorResponse("insufficient fund", 400));
  }
  if (!amount || !beneficiary_account || amount < 0) {
    return next(
      new ErrorResponse("include a beneficiary account and amount", 400)
    );
  }
  // find beneficaiary account
  const beneficiaryAccount = await Account.findOne({
    account_number: beneficiary_account,
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
    user_id: senderAccount.user_id,
    account_id: senderAccount.id,
  });

  // credit the beneficiary account
  const transactionAmountCredit = beneficiaryAccount.balance + req.body.amount;
  beneficiaryAccount.balance = transactionAmountCredit;
  // debit the sender account.
  const transactionAmountDebit = senderAccount.balance - req.body.amount;
  senderAccount.balance = transactionAmountDebit;

  res.status(200).json({
    success: true,
    data: {
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
