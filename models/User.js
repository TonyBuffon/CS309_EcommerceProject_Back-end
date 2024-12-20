const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { roles } = require("../enums/user.enum");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      lowercase: true,
      unique: true,
      validate: [validator.isEmail, "Please add a valid email"],
    },
    phoneNumber: {
      type: String,
      validate: [validator.isMobilePhone, "Please add a valid phone number"],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(roles),
      default: roles.User,
    },
    active: {
      type: Boolean,
      default: true,
    },
    photo: {
      type: String,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    changedPasswordAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

userSchema.methods.checkPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
