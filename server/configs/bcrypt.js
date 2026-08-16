const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });
const logger = require("./winston");
const { CONFIG } = require("../ultils/constants");

const saltRounds = Number(process.env.SALT_ROUNDS);

const hashingPwd = async (userInputPwd) => {
  logger.info(CONFIG.BCRYPT.HASHING);
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPwd = await bcrypt.hash(userInputPwd, salt);
    logger.info(CONFIG.BCRYPT.SUCCESS);
    return hashedPwd;
  } catch (err) {
    logger.info(`${DATABASE.ERROR}${err}`);
    return;
  }
};

const comparePwds = async (userInputPwd, storedHashedPwd) => {
  try {
    logger.info(CONFIG.BCRYPT.COMPARING);
    const result = await bcrypt.compare(userInputPwd, storedHashedPwd);
    if (result) {
      logger.info(CONFIG.BCRYPT.SUCCESS_COMPARE);
      return true;
    } else {
      logger.info(CONFIG.BCRYPT.FAILED_COMPARE);
      return false;
    }
  } catch (err) {
    logger.info(`${DATABASE.ERROR}${err}`);
    return;
  }
};

module.exports = { hashingPwd, comparePwds };
