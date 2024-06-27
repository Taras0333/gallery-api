const { StatusCodes } = require("http-status-codes");

const { BadRequestError } = require("../errors");

const Property = require("../models/Property");
const User = require("../models/User");
const { query } = require("express");

const generateNoIdProperty = () => {
  throw new BadRequestError(
    `There is no property with provided id:${propertyId}`
  );
};

// GET
const getUserProperties = async (req, res) => {
  const { userId } = req.params;

  const properties = await Property.find({ authorId: userId });

  if (!properties.length) {
    throw new BadRequestError(
      `There is no properties asociated with provided user id:${userId}`
    );
  }

  res.status(StatusCodes.NOT_FOUND).json({ properties });
};

const getAllProperties = async (req, res) => {
  const {
    query: { fields, title, numberOfRooms, sort, page, limit },
  } = req;

  const queryObj = {};

  if (title) {
    queryObj.title = { $regex: title, $options: "i" };
  }
  if (numberOfRooms) {
    queryObj.numberOfRooms = numberOfRooms;
  }

  let result = Property.find(queryObj);

  if (fields) {
    const modifiedFields = fields.split(",").join(" ");

    result = result.select(modifiedFields);
  }

  if (sort) {
    result = result.sort(sort);
  }

  // pagination
  const chosenPage = Number(page) || 1;
  const chosenLimit = Number(limit) || 2;

  const offset = (chosenPage - 1) * chosenLimit;

  result = result.skip(offset).limit(chosenLimit);

  const properties = await result;
  res.status(StatusCodes.OK).json({ properties, count: properties.length });
};

const getUserProperty = async (req, res) => {
  const { propertyId } = req.params;
  const { userId } = req.user;

  const property = await Property.find({ _id: propertyId, authorId: userId });
  if (!property.length) {
    generateNoIdProperty();
  }

  res.status(StatusCodes.OK).json({ property });
};

// POST
const createProperty = async (req, res) => {
  const { body } = req;
  const {
    user: { userId },
  } = req;
  body.authorId = userId;
  const property = await Property.create(body);

  await User.findOneAndUpdate(
    { _id: userId },
    { $push: { properties: property._id } }
  );
  res.status(StatusCodes.CREATED).json({ property });
};

// PUT/PATCH
const updateProperty = async (req, res) => {
  const { propertyId } = req.params;
  const { body } = req;
  const { userId } = req.user;

  const property = await Property.findOneAndUpdate(
    {
      _id: propertyId,
      authorId: userId,
    },
    body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!property) {
    generateNoIdProperty();
  }

  res.status(StatusCodes.OK).json({ property });
};

// DELETE
const deleteProperty = async (req, res) => {
  const { propertyId } = req.params;
  const { userId } = req.user;

  const property = await Property.findOneAndDelete({
    _id: propertyId,
    authorId: userId,
  });

  if (!property) {
    generateNoIdProperty();
  }

  await User.findOneAndUpdate(
    { _id: userId },
    { $pull: { properties: propertyId } }
  );

  res.status(StatusCodes.OK).json({ property });
};

module.exports = {
  getAllProperties,
  getUserProperties,
  createProperty,
  getUserProperty,
  deleteProperty,
  updateProperty,
};
