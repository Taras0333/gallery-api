const express = require("express");
const auth = require("../middleware/authentication");

const {
  getAllProperties,
  getUserProperties,
  createProperty,
  getUserProperty,
  deleteProperty,
  updateProperty,
} = require("../controllers/properties");

const router = express.Router();

router.route("/all-properties").get(getAllProperties);
router.route("/").post(auth, createProperty);
router
  .route("/:propertyId")
  .get(auth, getUserProperty)
  .patch(auth, updateProperty)
  .delete(auth, deleteProperty);

router.route("/agent-properties/:userId").get(getUserProperties);

module.exports = router;
