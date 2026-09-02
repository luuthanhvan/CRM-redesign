const CONFIG = Object.freeze({
  MONGO: {
    INFO: "Connecting to",
    ERROR: "Database failure connected!",
    SUCCESS: "Database sucessfully connected!",
  },
  JWT: {
    VERIFYING_TOKEN: "Verifying token...",
    NO_TOKEN_PROVIDED: "No token provided!",
    AUTHENTICATION_FAILED: "Token authentication failed!",
    DECODING_TOKEN: "Decoding token...",
    GENERATING_TOKEN: "Generating JWT token...",
  },
  BCRYPT: {
    HASHING: "Hashing password...",
    COMPARING: "Comparing passwords...",
    ERROR: "Password hashing failed!",
    SUCCESS: "Password hashed done!",
    ERROR_COMPARE: "Error comparing passwords: ",
    SUCCESS_COMPARE: "Passwords match! User authenticated.",
    FAILED_COMPARE: "Passwords do not match! Authentication failed.",
  },
  PASSPORT: {
    VERIFYING_USER: "Verifying user...",
    VERIFYING_USER_DONE: "Verifying user done!",
    USER_NOT_FOUND: "User not found!",
    PASSWORD_INCORRECT: "Your entered password incorrect!",
    DISABLED_ACCOUNT: "Your account has been suspended!",
  },
  SERVER_IS_RUNNING_AT: "Server is running at",
  SERVER_RUNNING_ERROR: "No server port or hostname provided!",
});

const DATABASE = Object.freeze({
  ERROR: "Error occurred: ",
  INSERT_USER: "User is saved to the database!",
});

module.exports = {
  CONFIG,
  DATABASE,
};
