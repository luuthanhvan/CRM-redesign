const mg = require("mongoose");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "../../.env" });
const logger = require('../configs/winston');
const { CONFIG } = require('../ultils/constants');
const bcrypt = require("../configs/bcrypt");

const Schema = mg.Schema;

const User = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  isActive: { type: Boolean, default: false },
  createdTime: { type: Date, default: new Date() },
});

// Methods
User.methods.verifyPassword = function (password) {
  logger.info(CONFIG.BCRYPT.COMPARING);
  return bcrypt.hashingPwd(password, this.password);
};

User.methods.generateUserToken = function () {
  logger.info(CONFIG.JWT.GENERATING_TOKEN);
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP,
  });
};

module.exports = mg.model("User", User);
