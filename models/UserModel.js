import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.ObjectId,
    },
    first_name: {
      trim: true,
      type: String,
      require: [true, "please enter your first name"],
    },
    last_name: {
      trim: true,
      type: String,
      require: [true, "please enter your last name"],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      require: [true, "please enter your email"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "please enter a valid email",
      ],
    },
    password: {
      type: String,
      require: [true, "please enter your password"],
      select: false,
      minLength: 8,
    },
    age: {
      type: Number,
      require: [true, "please enter your age"],
    },
    phone: {
      type: String,
      trim: true,
      unique: true,
      require: [true, "please enter your phone number"],
    },
    address: {
      type: String,
      trim: true,
      require: [true, "please enter your address"],
    },
    photo_url: String,
    accounted_deleted: { type: Boolean, default: false },
    token_expiration: Date,
    password_reset_token: String,
  },
  { timestamps: true }
);

// signed jwt and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY_DURATION }
  );
};

// match user entered password to hashed password in database
UserSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compareSync(enteredPassword, this.password);
};

UserSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    const password = this.password;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    this.password = hashedPassword;
    this.id = this._id;
  }
  next();
});

export default mongoose.model("user", UserSchema);
