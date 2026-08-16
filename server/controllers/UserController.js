const User = require("../models/User");
const apiResponse = require("../ultils/apiResponse");
const _ = require("lodash");
const logger = require("../configs/winston");
const { hashingPwd } = require("../configs/bcrypt");
const { RESPONSE_MESSAGE } = require("../ultils/constants");
class UserController {
  createNewUser(req, res) {
    try {
      logger.info(RESPONSE_MESSAGE.CREATING_NEW_USER);
      hashingPwd(req.body.password).then(async (result) => {
        const user = new User({
          ...req.body,
          password: result,
        });
        user.save().then(() => {
          logger.info(RESPONSE_MESSAGE.CREATING_NEW_USER_SUCCESS);
          return apiResponse.successResponse(
            res,
            RESPONSE_MESSAGE.CREATING_NEW_USER_SUCCESS
          );
        });
      });
    } catch (err) {
      logger.error(`${RESPONSE_MESSAGE.CREATING_NEW_USER_ERROR} ${err}`);
      return apiResponse.ErrorResponse(res, err);
    }
  }

  getListOfUsers(req, res) {
    try {
      logger.info(RESPONSE_MESSAGE.FETCHING_LIST_OF_USERS);
      const query = req.isAdmin ? {} : { _id: req.userId };
      User.find(query, "-username -password").then((data) => {
        logger.info(RESPONSE_MESSAGE.FETCHING_LIST_OF_USERS_SUCCESS);
        return apiResponse.successResponseWithData(
          res,
          RESPONSE_MESSAGE.FETCHING_LIST_OF_USERS_SUCCESS,
          data
        );
      });
    } catch (err) {
      logger.error(`${RESPONSE_MESSAGE.FETCHING_LIST_OF_USERS_ERROR} ${err}`);
      return apiResponse.ErrorResponse(res, err);
    }
  }

  getListOfNames(req, res) {
    try {
      logger.info(RESPONSE_MESSAGE.FETCHING_LIST_OF_NAMES_USERS);
      const query = req.isAdmin ? {} : { _id: req.userId };
      User.find(query, "-username -password").then((data) => {
        logger.info(RESPONSE_MESSAGE.FETCHING_LIST_OF_NAMES_USERS_SUCCESS);
        const names = data.length > 0 ? _.map(data, _.property("name")) : [];
        return apiResponse.successResponseWithData(
          res,
          RESPONSE_MESSAGE.FETCHING_LIST_OF_NAMES_USERS_SUCCESS,
          names
        );
      });
    } catch (err) {
      logger.error(`${RESPONSE_MESSAGE.FETCHING_LIST_OF_USERS_ERROR} ${err}`);
      return apiResponse.ErrorResponse(res, err);
    }
  }

  getUser(req, res) {
    try {
      const userId = req.params.id;
      logger.info(RESPONSE_MESSAGE.FETCHING_USER_BY_ID);
      User.findOne({ _id: userId }, "-password").then((data) => {
        logger.info(RESPONSE_MESSAGE.FETCHING_USER_BY_ID_SUCCESS);
        return apiResponse.successResponseWithData(
          res,
          RESPONSE_MESSAGE.FETCHING_USER_BY_ID_SUCCESS,
          data
        );
      });
    } catch (err) {
      logger.error(`${RESPONSE_MESSAGE.FETCHING_USER_BY_ID_ERROR} ${err}`);
      return apiResponse.ErrorResponse(res, err);
    }
  }

  userProfile(req, res) {
    try {
      logger.info(RESPONSE_MESSAGE.FETCHING_USER_INFO);
      const userId = req._id;
      User.findOne({ _id: userId }, "-username -password").then((data) => {
        logger.info(RESPONSE_MESSAGE.FETCHING_USER_INFO_SUCCESS);
        return apiResponse.successResponseWithData(
          res,
          RESPONSE_MESSAGE.FETCHING_USER_INFO_SUCCESS,
          data
        );
      });
    } catch (err) {
      logger.info(`${RESPONSE_MESSAGE.FETCHING_USER_INFO_ERROR} ${err}`);
      return apiResponse.ErrorResponse(res, err);
    }
  }

  updateUser(req, res) {
    try {
      logger.info(RESPONSE_MESSAGE.UPDATING_USER);
      let userId = req.params.id;
      let userInfo = req.body;
      User.updateOne({ _id: userId }, userInfo).then(() => {
        logger.info(RESPONSE_MESSAGE.UPDATING_USER_SUCCESS);
        return apiResponse.successResponse(
          res,
          RESPONSE_MESSAGE.UPDATING_USER_SUCCESS
        );
      });
    } catch (err) {
      logger.info(`${RESPONSE_MESSAGE.UPDATING_USER_ERROR} ${err}`);
      return apiResponse.ErrorResponse(res, err);
    }
  }

  changePassword(req, res) {
    try {
      logger.info(RESPONSE_MESSAGE.CHANGING_USER_PASSWORD);
      let userId = req.params.id,
        newPass = req.body.newPass;

      User.findByIdAndUpdate({ _id: userId }, { password: newPass }).then(
        () => {
          logger.info(RESPONSE_MESSAGE.CHANGING_USER_PASSWORD_SUCCESS);
          return apiResponse.successResponse(
            res,
            RESPONSE_MESSAGE.CHANGING_USER_PASSWORD_SUCCESS
          );
        }
      );
    } catch (err) {
      logger.info(`${RESPONSE_MESSAGE.CHANGING_USER_PASSWORD_ERROR} ${err}`);
      return apiResponse.ErrorResponse(res, err);
    }
  }
}

module.exports = new UserController();
