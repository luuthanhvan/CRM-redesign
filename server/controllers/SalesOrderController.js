const SalesOrder = require("../models/SalesOrder");
const { mutipleMongooseToObject } = require("../ultils/mongoose");
const apiResponse = require("../ultils/apiResponse");
const logger = require("../configs/winston");
const { RESPONSE_MESSAGE } = require("../ultils/constants");
const salesOrderService = require("../services/SalesOrderService");

class SalesOrderController {
  storeSalesOrder(req, res) {
    try {
      logger.info(RESPONSE_MESSAGE.CREATING_NEW_SALES_ORDER);
      const saleOrder = new SalesOrder(req.body);
      saleOrder.save().then(() => {
        logger.info(RESPONSE_MESSAGE.CREATING_NEW_SALES_ORDER_SUCCESS);
        return apiResponse.successResponse(
          res,
          RESPONSE_MESSAGE.CREATING_NEW_SALES_ORDER_SUCCESS
        );
      });
    } catch (err) {
      logger.error(`${RESPONSE_MESSAGE.CREATING_NEW_SALES_ORDER_ERROR} ${err}`);
      return apiResponse.ErrorResponse(res, err);
    }
  }

  getListOfSalesOrders(req, res) {
    try {
      logger.info(RESPONSE_MESSAGE.FETCHING_LIST_OF_SALES_ORDER);
      const isAdmin = req.isAdmin,
        name = req.name;
      const query = isAdmin ? {} : { assignedTo: name };
      SalesOrder.find(query).then((data) => {
        const resData = data.length > 0 ? mutipleMongooseToObject(data) : [];
        logger.info(RESPONSE_MESSAGE.FETCHING_LIST_OF_SALES_ORDER_SUCCESS);
        return apiResponse.successResponseWithData(
          res,
          RESPONSE_MESSAGE.FETCHING_LIST_OF_SALES_ORDER_SUCCESS,
          resData
        );
      });
    } catch (err) {
      logger.error(
        `${RESPONSE_MESSAGE.FETCHING_LIST_OF_SALES_ORDER_ERROR} ${err}`
      );
      return apiResponse.ErrorResponse(res, err);
    }
  }

  getSalesOrder(req, res) {
    try {
      logger.info(RESPONSE_MESSAGE.FETCHING_SALES_ORDER);
      const saleOrderId = req.params.id;
      SalesOrder.findOne({ _id: saleOrderId }).then((data) => {
        logger.info(RESPONSE_MESSAGE.FETCHING_SALES_ORDER_SUCCESS);
        return apiResponse.successResponseWithData(
          res,
          RESPONSE_MESSAGE.FETCHING_SALES_ORDER_SUCCESS,
          data
        );
      });
    } catch (err) {
      logger.error(`${RESPONSE_MESSAGE.FETCHING_SALES_ORDER_ERROR} ${err}`);
      return apiResponse.ErrorResponse(res, err);
    }
  }

  updateSalesOrder(req, res) {
    try {
      logger.info(RESPONSE_MESSAGE.UPDATING_SALES_ORDER);
      const saleOrderId = req.params.id;
      const saleOrderInfo = req.body;
      SalesOrder.updateOne({ _id: saleOrderId }, saleOrderInfo).then(() => {
        logger.info(RESPONSE_MESSAGE.UPDATING_SALES_ORDER_SUCCESS);
        return apiResponse.successResponse(
          res,
          RESPONSE_MESSAGE.UPDATING_SALES_ORDER_SUCCESS
        );
      });
    } catch (err) {
      logger.error(`${RESPONSE_MESSAGE.UPDATING_SALES_ORDER_ERROR} ${err}`);
      return apiResponse.ErrorResponse(res, err);
    }
  }

  deleteSalesOrder(req, res) {
    try {
      logger.info(RESPONSE_MESSAGE.DELETING_SALES_ORDER);
      const saleOrderId = req.params.id;
      SalesOrder.deleteOne({ _id: saleOrderId }).then(() => {
        logger.info(RESPONSE_MESSAGE.DELETING_SALES_ORDER_SUCCESS);
        return apiResponse.successResponse(
          res,
          RESPONSE_MESSAGE.DELETING_SALES_ORDER_SUCCESS
        );
      });
    } catch (err) {
      logger.error(`${RESPONSE_MESSAGE.DELETING_SALES_ORDER_ERROR} ${err}`);
      return apiResponse.ErrorResponse(res, err);
    }
  }

  deleteMultiSalesOrders(req, res) {
    try {
      logger.info(RESPONSE_MESSAGE.DELETING_LIST_OF_SALES_ORDERS);
      const salesOrderIds = req.body;
      SalesOrder.deleteMany({ _id: { $in: salesOrderIds } }).then(() => {
        logger.info(RESPONSE_MESSAGE.DELETING_LIST_OF_SALES_ORDERS_SUCCESS);
        return apiResponse.successResponse(
          res,
          RESPONSE_MESSAGE.DELETING_LIST_OF_SALES_ORDERS_SUCCESS
        );
      });
    } catch (err) {
      logger.error(
        `${RESPONSE_MESSAGE.DELETING_LIST_OF_SALES_ORDERS_ERROR} ${err}`
      );
      return apiResponse.ErrorResponse(res, err);
    }
  }

  findSalesOrders(req, res) {
    try {
      logger.info(RESPONSE_MESSAGE.FINDING_SALES_ORDER);
      const query = salesOrderService.getSalesOrderSearchQuery(req);
      SalesOrder.find(query).then((data) => {
        logger.info(RESPONSE_MESSAGE.FINDING_SALES_ORDER_SUCCESS);
        return apiResponse.successResponseWithData(
          res,
          RESPONSE_MESSAGE.FINDING_SALES_ORDER_SUCCESS,
          data
        );
      });
    } catch (err) {
      logger.error(`${RESPONSE_MESSAGE.FINDING_SALES_ORDER_ERROR} ${err}`);
      return apiResponse.ErrorResponse(res, err);
    }
  }

  countNoSalesOrdersByStatus(req, res) {
    try {
      logger.info(RESPONSE_MESSAGE.COUNTING_NO_SALES_ORDERS_BY_STATUS);
      SalesOrder.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]).then((data) => {
        logger.info(
          RESPONSE_MESSAGE.COUNTING_NO_SALES_ORDERS_BY_STATUS_SUCCESS
        );
        return apiResponse.successResponseWithData(
          res,
          RESPONSE_MESSAGE.COUNTING_NO_SALES_ORDERS_BY_STATUS_SUCCESS,
          data
        );
      });
    } catch (err) {
      logger.error(
        `${RESPONSE_MESSAGE.COUNTING_NO_SALES_ORDERS_BY_STATUS_ERROR} ${err}`
      );
      return apiResponse.ErrorResponse(res, err);
    }
  }
}

module.exports = new SalesOrderController();
