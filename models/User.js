const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Please provide email'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide valid email',
    },
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  verificationToken: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  verified: Date,
  passwordToken: {
    type: String,
  },
  passwordTokenExpirationDate: {
    type: Date,
  },
})

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.getFullName = function () {
  return `${this.firstName} ${this.lastName}`
}

UserSchema.methods.generateJWT = function () {
  const { JWT_EXPIRES, JWT_SECRET } = process.env
  return jwt.sign({ id: this._id, fullName: this.getFullName() }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES,
  })
}

UserSchema.methods.validatePassword = async function (passwordToValidate) {
  const isValid = await bcrypt.compare(passwordToValidate, this.password)
  return isValid
}

module.exports = mongoose.model('User', UserSchema)
