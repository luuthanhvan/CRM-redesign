const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const authController = require("../controllers/AuthController");
const jwtHelper = require("../configs/jwt");

router.get("/", jwtHelper.verifyJwtToken, userController.userProfile);
router.post("/create", jwtHelper.verifyJwtToken, userController.createNewUser);
router.get(
  "/list",
  jwtHelper.verifyJwtToken,
  authController.verifyUser,
  userController.getListOfUsers
);
router.get("/:id", jwtHelper.verifyJwtToken, userController.getUser);
router.put("/:id", jwtHelper.verifyJwtToken, userController.updateUser);
router.post("/:id", jwtHelper.verifyJwtToken, userController.changePassword);
router.get(
  "/list/name",
  jwtHelper.verifyJwtToken,
  authController.verifyUser,
  userController.getListOfNames
);

module.exports = router;
