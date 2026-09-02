const Contacts = require("../models/Contact");
const _ = require("lodash");
const apiResponse = require("../ultils/apiResponse");
const contactService = require("../services/ContactService");
const logger = require("../configs/winston");
const { Parser } = require("json2csv");
const {
  CONTACT_DETAILS_EXPORT_COLUMNS,
  CONTACT_RESPONSE_MESSAGE,
} = require("../constants/ContactConstants");

class ContactController {
  storeContact(req, res) {
    try {
      logger.info(CONTACT_RESPONSE_MESSAGE.CREATING_NEW_CONTACT);
      const contacts = new Contacts(req.body);

      contacts.save().then(() => {
        logger.info(CONTACT_RESPONSE_MESSAGE.CREATING_NEW_CONTACT_SUCCESS);
        return apiResponse.successResponse(
          res,
          CONTACT_RESPONSE_MESSAGE.CREATING_NEW_CONTACT_SUCCESS,
        );
      });
    } catch (err) {
      logger.error(
        `${CONTACT_RESPONSE_MESSAGE.CREATING_NEW_CONTACT_ERROR} ${err}`,
      );
      return apiResponse.ErrorResponse(res, err);
    }
  }

  getListOfContacts(req, res) {
    try {
      logger.info(CONTACT_RESPONSE_MESSAGE.FETCHING_LIST_OF_CONTACTS);
      const pipeline = contactService.buildContactsPipeline(req);

      Contacts.aggregate(pipeline).then((aggregateResults) => {
        logger.info(CONTACT_RESPONSE_MESSAGE.FETCHING_LIST_OF_CONTACTS_SUCCESS);
        const responseData =
          contactService.normalizeContactsAggregation(aggregateResults);

        return apiResponse.successResponseWithData(
          res,
          CONTACT_RESPONSE_MESSAGE.FETCHING_LIST_OF_CONTACTS_SUCCESS,
          responseData,
        );
      });
    } catch (err) {
      logger.error(
        `${CONTACT_RESPONSE_MESSAGE.FETCHING_LIST_OF_CONTACTS_ERROR} ${err}`,
      );
      return apiResponse.ErrorResponse(res, err);
    }
  }

  getListOfContactNames(req, res) {
    try {
      logger.info(CONTACT_RESPONSE_MESSAGE.FETCHING_LIST_OF_CONTACT_NAMES);
      const query = req.isAdmin ? {} : { assignedTo: req.name };

      Contacts.find(query).then((data) => {
        logger.info(
          CONTACT_RESPONSE_MESSAGE.FETCHING_LIST_OF_CONTACT_NAMES_SUCCESS,
        );
        const contactNames =
          data.length > 0 ? _.map(data, _.property("contactName")) : [];

        return apiResponse.successResponseWithData(
          res,
          CONTACT_RESPONSE_MESSAGE.FETCHING_LIST_OF_CONTACT_NAMES_SUCCESS,
          contactNames,
        );
      });
    } catch (err) {
      logger.error(
        `${CONTACT_RESPONSE_MESSAGE.FETCHING_LIST_OF_CONTACT_NAMES_ERROR} ${err}`,
      );
      return apiResponse.ErrorResponse(res, err);
    }
  }

  getContact(req, res) {
    try {
      logger.info(CONTACT_RESPONSE_MESSAGE.FETCHING_CONTACT);
      const pipeline = contactService.buildContactsPipeline(req);

      Contacts.aggregate(pipeline).then((aggregateResults) => {
        logger.info(CONTACT_RESPONSE_MESSAGE.FETCHING_CONTACT_SUCCESS);
        const responseData =
          contactService.normalizeContactsAggregation(aggregateResults);

        return apiResponse.successResponseWithData(
          res,
          CONTACT_RESPONSE_MESSAGE.FETCHING_CONTACT_SUCCESS,
          responseData.contacts[0],
        );
      });
    } catch (err) {
      logger.error(`${CONTACT_RESPONSE_MESSAGE.FETCHING_CONTACT_ERROR} ${err}`);
      return apiResponse.ErrorResponse(res, err);
    }
  }

  updateContact(req, res) {
    try {
      logger.info(CONTACT_RESPONSE_MESSAGE.UPDATING_CONTACT);
      let contactId = req.params.id;
      let contactInfo = req.body;

      Contacts.updateOne({ _id: contactId }, contactInfo).then(() => {
        logger.info(CONTACT_RESPONSE_MESSAGE.UPDATING_CONTACT_SUCCESS);
        return apiResponse.successResponse(
          res,
          CONTACT_RESPONSE_MESSAGE.UPDATING_CONTACT_SUCCESS,
        );
      });
    } catch (err) {
      logger.error(`${CONTACT_RESPONSE_MESSAGE.UPDATING_CONTACT_ERROR} ${err}`);
      return apiResponse.ErrorResponse(res, err);
    }
  }

  deleteContact(req, res) {
    try {
      logger.info(CONTACT_RESPONSE_MESSAGE.DELETING_CONTACT);
      let contactId = req.params.id;

      Contacts.deleteOne({ _id: contactId }).then(() => {
        logger.info(CONTACT_RESPONSE_MESSAGE.DELETING_CONTACT_SUCCESS);
        return apiResponse.successResponse(
          res,
          CONTACT_RESPONSE_MESSAGE.DELETING_CONTACT_SUCCESS,
        );
      });
    } catch (err) {
      logger.error(`${CONTACT_RESPONSE_MESSAGE.DELETING_CONTACT_ERROR} ${err}`);
      return apiResponse.ErrorResponse(res, err);
    }
  }

  multiDeleteContacts(req, res) {
    try {
      logger.info(CONTACT_RESPONSE_MESSAGE.DELETING_LIST_OF_CONTACTS);
      let contactIds = req.body;

      Contacts.deleteMany({ _id: { $in: contactIds } }).then(() => {
        logger.info(CONTACT_RESPONSE_MESSAGE.DELETING_LIST_OF_CONTACTS_SUCCESS);
        return apiResponse.successResponse(
          res,
          CONTACT_RESPONSE_MESSAGE.DELETING_LIST_OF_CONTACTS_SUCCESS,
        );
      });
    } catch (err) {
      logger.error(
        `${CONTACT_RESPONSE_MESSAGE.DELETING_LIST_OF_CONTACTS_ERROR} ${err}`,
      );
      return apiResponse.ErrorResponse(res, err);
    }
  }

  findContacts(req, res) {
    try {
      logger.info(CONTACT_RESPONSE_MESSAGE.FINDING_CONTACT);
      const pipeline = contactService.buildContactsPipeline(req);

      Contacts.aggregate(pipeline).then((aggregateResults) => {
        logger.info(CONTACT_RESPONSE_MESSAGE.FINDING_CONTACT_SUCCESS);
        const responseData =
          contactService.normalizeContactsAggregation(aggregateResults);

        return apiResponse.successResponseWithData(
          res,
          CONTACT_RESPONSE_MESSAGE.FINDING_CONTACT_SUCCESS,
          responseData,
        );
      });
    } catch (err) {
      logger.error(`${CONTACT_RESPONSE_MESSAGE.FINDING_CONTACT_ERROR} ${err}`);
      return apiResponse.ErrorResponse(res, err);
    }
  }

  countNoContactsByLeadSrc(req, res) {
    try {
      logger.info(CONTACT_RESPONSE_MESSAGE.COUNTING_NO_CONTACTS_BY_LEAD_SRC);
      const pipeline = contactService.buildContactSummaryPipeline();

      Contacts.aggregate(pipeline).then((aggregateResults) => {
        logger.info(
          CONTACT_RESPONSE_MESSAGE.COUNTING_NO_CONTACTS_BY_LEAD_SRC_SUCCESS,
        );
        const responseData =
          contactService.normalizeContactSummaryAggregation(aggregateResults);

        return apiResponse.successResponseWithData(
          res,
          CONTACT_RESPONSE_MESSAGE.COUNTING_NO_CONTACTS_BY_LEAD_SRC_SUCCESS,
          responseData,
        );
      });
    } catch (err) {
      logger.error(
        `${CONTACT_RESPONSE_MESSAGE.COUNTING_NO_CONTACTS_BY_LEAD_SRC_ERROR} ${err}`,
      );
      return apiResponse.ErrorResponse(res, err);
    }
  }

  exportAllContacts(req, res) {
    try {
      logger.info(CONTACT_RESPONSE_MESSAGE.EXPORT_CONTACT_DETAILS_ALL);
      const pipeline = contactService.buildContactsPipeline(req);

      Contacts.aggregate(pipeline).then((aggregateResults) => {
        logger.info(
          CONTACT_RESPONSE_MESSAGE.EXPORT_CONTACT_DETAILS_ALL_SUCCESS,
        );
        const responseData =
          contactService.normalizeContactsAggregation(aggregateResults);
        const fields = CONTACT_DETAILS_EXPORT_COLUMNS;
        const json2csvParser = new Parser({ fields });
        const csvData = json2csvParser.parse(responseData.contacts);

        // Set HTTP headers for file transmission
        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=user_report.csv",
        );

        return res.status(200).send(csvData);
      });
    } catch (err) {
      logger.error(
        `${CONTACT_RESPONSE_MESSAGE.EXPORT_CONTACT_DETAILS_ALL_ERROR} ${err}`,
      );
      return apiResponse.ErrorResponse(res, err);
    }
  }
}

module.exports = new ContactController();
