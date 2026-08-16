const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });
const logger = require('./winston');
const { CONFIG } = require('../ultils/constants');

module.exports.verifyJwtToken = (req, res, next) => {
  logger.info(CONFIG.JWT.VERIFYING_TOKEN);
  let token;
  if ("authorization" in req.headers) {
    token = req.headers["authorization"].split(" ")[1];
  }
  if (!token) {
    logger.error(`${CONFIG.JWT.NO_TOKEN_PROVIDED}`);
    return res.status(403).send({ auth: false, message: CONFIG.JWT.NO_TOKEN_PROVIDED });
  }
  else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        logger.error(`${CONFIG.JWT.AUTHENTICATION_FAILED}`);
        return res
          .status(500)
          .send({ auth: false, message: CONFIG.JWT.AUTHENTICATION_FAILED });
      }
      else {
        logger.info(CONFIG.JWT.DECODING_TOKEN);
        req._id = decoded._id;
        next();
      }
    });
  }
};
