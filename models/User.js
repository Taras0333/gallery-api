const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')
const validator = require('validator')

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please provide First Name'],
    minlength: [3, 'First Name should be longer then 3 characters'],
    maxlength: [50, 'First Name is longer then 500 characters'],
  },
  lastName: {
    type: String,
    required: [true, 'Please provide Last Name'],
    minlength: [3, 'Last Name should be longer then 3 characters'],
    maxlength: [50, 'Last Name is longer then 500 characters'],
  },
  nickName: {
    type: String,
    required: [true, 'Please provide Nick Name'],
    minlength: [3, 'Nick Name should be longer then 3 characters'],
    maxlength: [50, 'Nick Name is longer then 500 characters'],
  },
  company: {
    type: String,
    required: [true, 'Please provide Company Name'],
    maxlength: [50, 'Company is longer then 500 characters'],
  },
  address: {
    type: String,
    maxlength: [100, 'Address is longer then 100 characters'],
    default: null,
  },
  postCode: {
    type: String,
    maxlength: [10, 'Post Code is longer then 10 characters'],
    validate: {
      validator: function (value) {
        if (value === null) return true
        return validator.isPostalCode(value, 'any')
      },
      message: 'Please provide valid Post Code',
    },
    default: null,
  },
  phone: {
    type: String,
    validate: {
      validator: function (value) {
        if (value === null) return true
        return validator.isMobilePhone(value, 'any', { strictMode: true })
      },
      message: 'Please provide valid Phone Number',
    },
    default: null,
  },
  linkedIn: {
    type: String,
    validate: {
      validator: function (value) {
        if (value === null) return true
        return validator.isURL
      },
      message: 'Please provide valid LinkedIn URL',
    },
    default: null,
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
    minlength: [6, 'Password should be longer then 6 characters'],
  },
  verificationToken: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  verified: Date,
})

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.getFullName = function () {
  return `${this.firstName} ${this.lastName}`
}

// UserSchema.methods.generateJWT = function (payload) {
//   const { JWT_EXPIRES, JWT_SECRET } = process.env
//   return jwt.sign(payload, JWT_SECRET, {
//     expiresIn: JWT_EXPIRES,
//   })
// }

UserSchema.methods.validatePassword = async function (passwordToValidate) {
  const isValid = await bcrypt.compare(passwordToValidate, this.password)
  return isValid
}

UserSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false, // Removes `__v`
  transform: function (_, ret) {
    delete ret._id // Remove `_id`
  },
})

module.exports = mongoose.model('User', UserSchema)
