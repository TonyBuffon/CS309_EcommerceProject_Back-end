const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
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
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre("save", function (next) {
  if (this.isModified("password") || this.isNew) {
    this.password = bcrypt.hash(this.password, 12);
  }
  next();
});

userSchema.methods.checkPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
