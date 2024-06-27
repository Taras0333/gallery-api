const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Property = require("./Property");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: [1, "Thr first name can not be shorter then 1 character"],
  },
  lastName: {
    type: String,
    required: true,
    minlength: [1, "Thr last name can not be shorter then 1 character"],
    unique: true,
  },
  age: {
    type: Number,
    required: [true, "The age is required"],
  },
  company: {
    type: String,
  },
  properties: {
    type: [mongoose.Types.ObjectId],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password sould be biger than 6 characters"],
    maxlength: [20, "Password sould be less than 20 characters"],
  },
});

userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.getFullName = function () {
  return `${this.firstName} ${this.lastName}`;
};

userSchema.methods.generateJWT = function () {
  const { JWT_EXPIRES, JWT_SECRET } = process.env;
  return jwt.sign({ id: this._id, fullName: this.getFullName() }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES,
  });
};

userSchema.methods.validatePassword = async function (passwordToValidate) {
  const isValid = await bcrypt.compare(passwordToValidate, this.password);
  return isValid;
};

module.exports = mongoose.model("User", userSchema);
