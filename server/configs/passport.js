const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/User");
const { comparePwds } = require("./bcrypt");
const logger = require("./winston");
const { CONFIG } = require("../ultils/constants");

const localLogin = new LocalStrategy(async (username, password, done) => {
  logger.info(CONFIG.PASSPORT.VERIFYING_USER);
  let user = await User.findOne({ username: username });
  if (!user) {
    logger.info(CONFIG.PASSPORT.USER_NOT_FOUND);
    return done(null, false, { message: CONFIG.PASSPORT.USER_NOT_FOUND });
  } else if (!user.isActive) {
    logger.info(CONFIG.PASSPORT.DISABLED_ACCOUNT);
    return done(null, false, { message: CONFIG.PASSPORT.DISABLED_ACCOUNT });
  } else {
    comparePwds(password, user.password).then((result) => {
      if (!result) {
        logger.info(CONFIG.PASSPORT.PASSWORD_INCORRECT);
        return done(null, false, {
          message: CONFIG.PASSPORT.PASSWORD_INCORRECT,
        });
      }
      logger.info(CONFIG.PASSPORT.VERIFYING_USER_DONE);
      done(null, user);
    });
  }
});

passport.use(localLogin);

module.exports = passport;
