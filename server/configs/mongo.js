const mg = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });
const logger = require('./winston');
const { CONFIG } = require('../ultils/constants');

module.exports.mongo = async () => {
  try {
    logger.info(`${CONFIG.MONGO.INFO} ${process.env.MONGOOSE_URI}...`);
    await mg.connect(process.env.MONGOOSE_URI);
    logger.info(CONFIG.MONGO.SUCCESS);
  } catch (err) {
    logger.error(`${CONFIG.MONGO.ERROR}. Error: ${err}`);
  }
}
