const mg = require("mongoose");
const db = require("../configs/mongo");
const sampleUsers = require("../mock-json/sample-users.json");
const User = require("../models/User");
const { hashingPwd } = require("../configs/bcrypt");
const logger = require("../configs/winston");
const { DATABASE } = require("../ultils/constants");

db.mongo();

// IIEF (Immediately Invoked Function Expression)
(function () {
  try {
    sampleUsers.forEach((item) => {
      hashingPwd(item.password).then(async (result) => {
        const user = new User({
          ...item,
          password: result,
        });
        user.save().then((data) => {
          logger.info(`${DATABASE.INSERT_USER} Data: ${data}`);
        });
      });
    });
  } catch (err) {
    logger.info(`${DATABASE.ERROR}${err}`);
    mg.connection.close();
  }
})();
