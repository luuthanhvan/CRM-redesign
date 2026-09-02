const User = require("../models/User");
const apiResponse = require("../ultils/apiResponse");
const passport = require("passport");
const _ = require("lodash");
const logger = require("../configs/winston");
const { CONFIG } = require("../constants/CommonConstants");
const { AUTH_RESPONSE_MESSAGE } = require("../constants/AuthConstants");

const dotenv = require("dotenv");
dotenv.config({ path: "../../.env" });

class AuthController {
  authenticate(req, res) {
    logger.info(AUTH_RESPONSE_MESSAGE.STARTING_PASSPORT_AUTHEN);
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        logger.error(
          `${AUTH_RESPONSE_MESSAGE.PASSPORT_MIDDLEWARE_ERROR} ${err}`,
        );
        return apiResponse.validationError(
          res,
          AUTH_RESPONSE_MESSAGE.PASSPORT_MIDDLEWARE_ERROR,
        );
      } else if (user) {
        logger.info(AUTH_RESPONSE_MESSAGE.REGISTER_USER_SUCCESS);
        return apiResponse.successResponseWithData(
          res,
          AUTH_RESPONSE_MESSAGE.REGISTER_USER_SUCCESS,
          user.generateUserToken(),
        );
      }
      // unknown user or wrong password
      else {
        logger.info(
          `${AUTH_RESPONSE_MESSAGE.AUTHENTICATION_FAILED} Info: ${info}`,
        );
        return apiResponse.notFoundResponse(res, info.message);
      }
    })(req, res);
  }

  verifyUser(req, res, next) {
    try {
      const userId = req._id;
      User.findOne({ _id: userId }).then((user) => {
        if (user) {
          req.isAdmin = user.isAdmin;
          req.name = user.name;
          next();
        } else {
          return apiResponse.notFoundResponse(
            res,
            CONFIG.PASSPORT.USER_NOT_FOUND,
          );
        }
      });
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  }
}

module.exports = new AuthController();
