const express = require("express");
const router = express.Router();
const authController = require("../controllers/AuthController");

router.post("/signin", authController.authenticate);

module.exports = router;
