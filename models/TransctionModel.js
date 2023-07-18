import mongoose from "mongoose";

const TransactionSchema = mongoose.Schema(
  {
    id: { type: mongoose.Schema.ObjectId },
    user_id: { type: mongoose.Schema.ObjectId, required: true },
    account_id: { type: mongoose.Schema.ObjectId, required: true },
    sender_name: {
      type: String,
      required: true,
    },
    sender_account_number: {
      type: Number,
      require: true,
    },
    sender_account_id: {
      type: mongoose.Schema.ObjectId,
      require: true,
    },
    sender_id: {
      type: mongoose.Schema.ObjectId,
      require: true,
    },
    beneficiary_name: {
      type: String,
      required: true,
    },
    beneficiary_account_number: {
      type: Number,
      require: true,
    },
    beneficiary_account_id: {
      type: mongoose.Schema.ObjectId,
      require: true,
    },
    beneficiary_id: {
      type: mongoose.Schema.ObjectId,
      require: true,
    },
    amount: { type: Number, require: true },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

TransactionSchema.pre("save", function (next) {
  this.id = this._id;
  next();
});

export default mongoose.model("transaction", TransactionSchema);
