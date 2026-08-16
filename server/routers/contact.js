const express = require("express");
const router = express.Router();
const contactController = require("../controllers/ContactController");
const authController = require("../controllers/AuthController");
const jwtHelper = require("../configs/jwt");

router.post("/", jwtHelper.verifyJwtToken, contactController.storeContact);
router.get(
  "/list",
  jwtHelper.verifyJwtToken,
  authController.verifyUser,
  contactController.getListOfContacts
);
router.get(
  "/search",
  jwtHelper.verifyJwtToken,
  authController.verifyUser,
  contactController.findContacts
);
router.get(
  "/count/lead-source",
  jwtHelper.verifyJwtToken,
  contactController.countNoContactsByLeadSrc
);
router.post(
  "/delete",
  jwtHelper.verifyJwtToken,
  contactController.multiDeleteContacts
);
router.get(
  "/list/contact-name",
  jwtHelper.verifyJwtToken,
  authController.verifyUser,
  contactController.getListOfContactNames
);
router.get("/:id", jwtHelper.verifyJwtToken, contactController.getContact);
router.put("/:id", jwtHelper.verifyJwtToken, contactController.updateContact);
router.delete(
  "/:id",
  jwtHelper.verifyJwtToken,
  contactController.deleteContact
);

module.exports = router;
