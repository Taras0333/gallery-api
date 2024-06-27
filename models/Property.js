const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "The title is required"],
  },
  description: {
    type: String,
    required: [true, "The description is required"],
    minlength: [30, "The description can not be less then 30 characters"],
  },
  numberOfRooms: {
    type: Number,
    required: [true, "Rooms number is required"],
  },
  authorId: { type: mongoose.Types.ObjectId },
});

module.exports = mongoose.model("Property", propertySchema);
