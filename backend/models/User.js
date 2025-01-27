const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { CustomError } = require("../middlewares/errorMiddleware");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    role: {
      type: String,
      enum: ["Admin", "Editor", "Viewer"],
      default: "Viewer",
    },
  },

  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();

    if (!this.password) throw new CustomError("Password is required", 400);

    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.comparePassword = async function (password) {
  try {
    const isMatch = await bcrypt.compare(password, this.password);
    if (!isMatch) {
      throw new CustomError("Incorrect password", 401);
    }
    return isMatch;
  } catch (error) {
    throw new CustomError("Incorrect Password", 500);
  }
};

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * (60 * 1000); // 10 minutes

  return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
