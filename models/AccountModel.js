import mongoose from "mongoose";

const AccountSchema = mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.ObjectId,
    },
    user_id: { type: mongoose.Schema.ObjectId, required: true },
    balance: Number,
    account_number: {
      type: Number,
      unique: true,
      required: true,
    },
    account_type: {
      type: String,
      required: true,
    },
    account_holder_name: String,
  },
  { timestamps: true }
);

AccountSchema.pre("save", function (next) {
  this.id = this._id;
  next();
});

export default mongoose.model("account", AccountSchema);
