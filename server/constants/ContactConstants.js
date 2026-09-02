const CONTACT_DETAILS_EXPORT_COLUMNS = [
  { label: "Contact Name", value: "contactName" },
  { label: "Salutation", value: "salutation" },
  { label: "Date of Birth", value: "dob" },
  { label: "Phone Number", value: "mobilePhone" },
  { label: "Email", value: "email" },
  { label: "Company", value: "organization" },
  { label: "Lead Source", value: "leadSrc" },
  { label: "Created by", value: "creator" },
  { label: "Assigned to", value: "assignedTo" },
  { label: "Address", value: "address" },
  { label: "Created on", value: "createdTime" },
  { label: "Last updated on", value: "updatedTime" },
];

const CONTACT_RESPONSE_MESSAGE = Object.freeze({
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
  EXPORT_CONTACT_DETAILS_ALL: "Exporting contact details all...",
  EXPORT_CONTACT_DETAILS_ALL_SUCCESS:
    "Exporting contact details all successfully!",
  EXPORT_CONTACT_DETAILS_ALL_ERROR:
    "Error while exporting contact details all:",
});

module.exports = {
  CONTACT_DETAILS_EXPORT_COLUMNS,
  CONTACT_RESPONSE_MESSAGE,
};
