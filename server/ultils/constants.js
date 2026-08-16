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

const RESPONSE_MESSAGE = Object.freeze({
  STARTING_PASSPORT_AUTHEN: "Starting passport authentication...",
  PASSPORT_MIDDLEWARE_ERROR: "Error from passport middleware.",
  REGISTER_USER_SUCCESS: "User is registered succesfully!",
  AUTHENTICATION_FAILED: "Unknown user or wrong password!",
  FETCHING_USER_INFO: "Fetching user information...",
  FETCHING_USER_INFO_SUCCESS: "Fetching user information sucessfully!",
  FETCHING_USER_INFO_ERROR: "Error while fetching user information:",
  CREATING_NEW_USER: "Creating new user...",
  CREATING_NEW_USER_SUCCESS: "Create new user successfully!",
  CREATING_NEW_USER_ERROR: "Error while creating user:",
  FETCHING_LIST_OF_USERS: "Fetching list of users...",
  FETCHING_LIST_OF_USERS_SUCCESS: "Fetching list of users successfully!",
  FETCHING_LIST_OF_USERS_ERROR: "Error while fetching list of users:",
  FETCHING_LIST_OF_NAMES_USERS: "Fetching list of names of users...",
  FETCHING_LIST_OF_NAMES_USERS_SUCCESS:
    "Fetching list of names of users successfully!",
  FETCHING_LIST_OF_NAMES_USERS_ERROR:
    "Error while fetching list of names of users:",
  FETCHING_USER_BY_ID: "Fetching user by ID...",
  FETCHING_USER_BY_ID_SUCCESS: "Fetching user by ID successfully!",
  FETCHING_USER_BY_ID_ERROR: "Error while fetching user by ID:",
  UPDATING_USER: "Updating user information...",
  UPDATING_USER_SUCCESS: "Updating user information successfully!",
  UPDATING_USER_ERROR: "Error while updating user information:",
  CHANGING_USER_PASSWORD: "Changing user password...",
  CHANGING_USER_PASSWORD_SUCCESS: "Changing user password successfully!",
  CHANGING_USER_PASSWORD_ERROR: "Error while changing user password:",
  CREATING_NEW_SALES_ORDER: "Creating new sales order...",
  CREATING_NEW_SALES_ORDER_SUCCESS: "Creating new sales order successfully!",
  CREATING_NEW_SALES_ORDER_ERROR: "Error while creating new sales order:",
  FETCHING_LIST_OF_SALES_ORDER: "Fetching list of sales order...",
  FETCHING_LIST_OF_SALES_ORDER_SUCCESS:
    "Fetching list of sales order successfully!",
  FETCHING_LIST_OF_SALES_ORDER_ERROR:
    "Error while fetching list of sales order:",
  FETCHING_SALES_ORDER: "Fetching sales order...",
  FETCHING_SALES_ORDER_SUCCESS: "Fetching sales order successfully!",
  FETCHING_SALES_ORDER_ERROR: "Error while fetching sales order:",
  UPDATING_SALES_ORDER: "Updating sales order...",
  UPDATING_SALES_ORDER_SUCCESS: "Updating sales order successfully!",
  UPDATING_SALES_ORDER_ERROR: "Error while updating sales order:",
  DELETING_SALES_ORDER: "Deleting sales order...",
  DELETING_SALES_ORDER_SUCCESS: "Deleting sales order successfully!",
  DELETING_SALES_ORDER_ERROR: "Error while deleting sales order:",
  DELETING_LIST_OF_SALES_ORDERS: "Deleting list of sales orders...",
  DELETING_LIST_OF_SALES_ORDERS_SUCCESS:
    "Deleting list of sales orders successfully!",
  DELETING_LIST_OF_SALES_ORDERS_ERROR:
    "Error while deleting list of sales orders:",
  FINDING_SALES_ORDER: "Finding sales order...",
  FINDING_SALES_ORDER_SUCCESS: "Finding sales order successfully!",
  FINDING_SALES_ORDER_ERROR: "Error while finding sales order:",
  COUNTING_NO_SALES_ORDERS_BY_STATUS:
    "Counting number of sales order based on Status...",
  COUNTING_NO_SALES_ORDERS_BY_STATUS_SUCCESS:
    "Counting number of sales order based on Status successfully!",
  COUNTING_NO_SALES_ORDERS_BY_STATUS_ERROR:
    "Error while counting number of sales order based on Status:",
  CREATING_NEW_CONTACT: "Creating new contact...",
  CREATING_NEW_CONTACT_SUCCESS: "Creating new contact successfully!",
  CREATING_NEW_CONTACT_ERROR: "Error while creating new contact:",
  FETCHING_LIST_OF_CONTACTS: "Fetching list of contacts...",
  FETCHING_LIST_OF_CONTACTS_SUCCESS: "Fetching list of contacts successfully!",
  FETCHING_LIST_OF_CONTACTS_ERROR: "Error while fetching list of contacts:",
  FETCHING_LIST_OF_CONTACT_NAMES: "Fetching list of contact names...",
  FETCHING_LIST_OF_CONTACT_NAMES_SUCCESS:
    "Fetching list of contact names successfully!",
  FETCHING_LIST_OF_CONTACT_NAMES_ERROR:
    "Error while fetching list of contact names:",
  FETCHING_CONTACT: "Fetching contact...",
  FETCHING_CONTACT_SUCCESS: "Fetching contact successfully!",
  FETCHING_CONTACT_ERROR: "Error while fetching contact:",
  UPDATING_CONTACT: "Updating contact...",
  UPDATING_CONTACT_SUCCESS: "Updating contact successfully!",
  UPDATING_CONTACT_ERROR: "Error while updating contact:",
  DELETING_CONTACT: "Deleting contact...",
  DELETING_CONTACT_SUCCESS: "Deleting contact successfully!",
  DELETING_CONTACT_ERROR: "Error while deleting contact:",
  DELETING_LIST_OF_CONTACTS: "Deleting list of contacts...",
  DELETING_LIST_OF_CONTACTS_SUCCESS: "Deleting list of contacts successfully!",
  DELETING_LIST_OF_CONTACTS_ERROR: "Error while deleting list of contacts:",
  FINDING_CONTACT: "Finding contacts...",
  FINDING_CONTACT_SUCCESS: "Finding contacts successfully!",
  FINDING_CONTACT_ERROR: "Error while finding contacts:",
  COUNTING_NO_CONTACTS_BY_LEAD_SRC:
    "Counting number of contacts based on Lead source...",
  COUNTING_NO_CONTACTS_BY_LEAD_SRC_SUCCESS:
    "Counting number of contacts based on Lead source successfully!",
  COUNTING_NO_CONTACTS_BY_LEAD_SRC_ERROR:
    "Error while counting number of contacts based on Lead source:",
});

module.exports = {
  CONFIG,
  DATABASE,
  RESPONSE_MESSAGE,
};
