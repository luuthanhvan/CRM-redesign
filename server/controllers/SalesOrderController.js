const SalesOrder = require("../models/SalesOrder");
const { mutipleMongooseToObject } = require("../ultils/mongoose");
const apiResponse = require("../ultils/apiResponse");
const logger = require("../configs/winston");
const {
  SALES_ORDER_RESPONSE_MESSAGE,
} = require("../constants/SalesOrderConstants");
const salesOrderService = require("../services/SalesOrderService");

class SalesOrderController {
  storeSalesOrder(req, res) {
    try {
      logger.info(SALES_ORDER_RESPONSE_MESSAGE.CREATING_NEW_SALES_ORDER);
      const saleOrder = new SalesOrder(req.body);

      saleOrder.save().then(() => {
        logger.info(
          SALES_ORDER_RESPONSE_MESSAGE.CREATING_NEW_SALES_ORDER_SUCCESS,
        );
        return apiResponse.successResponse(
          res,
          SALES_ORDER_RESPONSE_MESSAGE.CREATING_NEW_SALES_ORDER_SUCCESS,
        );
      });
    } catch (err) {
      logger.error(
        `${SALES_ORDER_RESPONSE_MESSAGE.CREATING_NEW_SALES_ORDER_ERROR} ${err}`,
      );
      return apiResponse.ErrorResponse(res, err);
    }
  }

  getListOfSalesOrders(req, res) {
    try {
      logger.info(SALES_ORDER_RESPONSE_MESSAGE.FETCHING_LIST_OF_SALES_ORDER);
      const pipeline = salesOrderService.buildSalesOrdersPipeline(req);

      SalesOrder.aggregate(pipeline).then((aggregateResults) => {
        logger.info(
          SALES_ORDER_RESPONSE_MESSAGE.FETCHING_LIST_OF_SALES_ORDER_SUCCESS,
        );
        const responseData =
          salesOrderService.normalizeSalesOrdersAggregation(aggregateResults);

        return apiResponse.successResponseWithData(
          res,
          SALES_ORDER_RESPONSE_MESSAGE.FETCHING_LIST_OF_SALES_ORDER_SUCCESS,
          responseData,
        );
      });
    } catch (err) {
      logger.error(
        `${SALES_ORDER_RESPONSE_MESSAGE.FETCHING_LIST_OF_SALES_ORDER_ERROR} ${err}`,
      );
      return apiResponse.ErrorResponse(res, err);
    }
  }

  getSalesOrder(req, res) {
    try {
      logger.info(SALES_ORDER_RESPONSE_MESSAGE.FETCHING_SALES_ORDER);
      const pipeline = salesOrderService.buildSalesOrdersPipeline(req);

      SalesOrder.aggregate(pipeline).then((aggregateResults) => {
        logger.info(SALES_ORDER_RESPONSE_MESSAGE.FETCHING_SALES_ORDER_SUCCESS);
        const responseData =
          salesOrderService.normalizeSalesOrdersAggregation(aggregateResults);

        return apiResponse.successResponseWithData(
          res,
          SALES_ORDER_RESPONSE_MESSAGE.FETCHING_SALES_ORDER_SUCCESS,
          responseData.salesOrders[0],
        );
      });
    } catch (err) {
      logger.error(
        `${SALES_ORDER_RESPONSE_MESSAGE.FETCHING_SALES_ORDER_ERROR} ${err}`,
      );
      return apiResponse.ErrorResponse(res, err);
    }
  }

  updateSalesOrder(req, res) {
    try {
      logger.info(SALES_ORDER_RESPONSE_MESSAGE.UPDATING_SALES_ORDER);
      const saleOrderId = req.params.id;
      const saleOrderInfo = req.body;

      SalesOrder.updateOne({ _id: saleOrderId }, saleOrderInfo).then(() => {
        logger.info(SALES_ORDER_RESPONSE_MESSAGE.UPDATING_SALES_ORDER_SUCCESS);
        return apiResponse.successResponse(
          res,
          SALES_ORDER_RESPONSE_MESSAGE.UPDATING_SALES_ORDER_SUCCESS,
        );
      });
    } catch (err) {
      logger.error(
        `${SALES_ORDER_RESPONSE_MESSAGE.UPDATING_SALES_ORDER_ERROR} ${err}`,
      );
      return apiResponse.ErrorResponse(res, err);
    }
  }

  deleteSalesOrder(req, res) {
    try {
      logger.info(SALES_ORDER_RESPONSE_MESSAGE.DELETING_SALES_ORDER);
      const saleOrderId = req.params.id;

      SalesOrder.deleteOne({ _id: saleOrderId }).then(() => {
        logger.info(SALES_ORDER_RESPONSE_MESSAGE.DELETING_SALES_ORDER_SUCCESS);
        return apiResponse.successResponse(
          res,
          SALES_ORDER_RESPONSE_MESSAGE.DELETING_SALES_ORDER_SUCCESS,
        );
      });
    } catch (err) {
      logger.error(
        `${SALES_ORDER_RESPONSE_MESSAGE.DELETING_SALES_ORDER_ERROR} ${err}`,
      );
      return apiResponse.ErrorResponse(res, err);
    }
  }

  deleteMultiSalesOrders(req, res) {
    try {
      logger.info(SALES_ORDER_RESPONSE_MESSAGE.DELETING_LIST_OF_SALES_ORDERS);
      const salesOrderIds = req.body;

      SalesOrder.deleteMany({ _id: { $in: salesOrderIds } }).then(() => {
        logger.info(
          SALES_ORDER_RESPONSE_MESSAGE.DELETING_LIST_OF_SALES_ORDERS_SUCCESS,
        );
        return apiResponse.successResponse(
          res,
          SALES_ORDER_RESPONSE_MESSAGE.DELETING_LIST_OF_SALES_ORDERS_SUCCESS,
        );
      });
    } catch (err) {
      logger.error(
        `${SALES_ORDER_RESPONSE_MESSAGE.DELETING_LIST_OF_SALES_ORDERS_ERROR} ${err}`,
      );
      return apiResponse.ErrorResponse(res, err);
    }
  }

  findSalesOrders(req, res) {
    try {
      logger.info(SALES_ORDER_RESPONSE_MESSAGE.FINDING_SALES_ORDER);
      const pipeline = salesOrderService.buildSalesOrdersPipeline(req);

      SalesOrder.aggregate(pipeline).then((aggregateResults) => {
        logger.info(SALES_ORDER_RESPONSE_MESSAGE.FINDING_SALES_ORDER_SUCCESS);
        const responseData =
          salesOrderService.normalizeSalesOrdersAggregation(aggregateResults);

        return apiResponse.successResponseWithData(
          res,
          SALES_ORDER_RESPONSE_MESSAGE.FINDING_SALES_ORDER_SUCCESS,
          responseData,
        );
      });
    } catch (err) {
      logger.error(
        `${SALES_ORDER_RESPONSE_MESSAGE.FINDING_SALES_ORDER_ERROR} ${err}`,
      );
      return apiResponse.ErrorResponse(res, err);
    }
  }

  countNoSalesOrdersByStatus(req, res) {
    try {
      logger.info(
        SALES_ORDER_RESPONSE_MESSAGE.COUNTING_NO_SALES_ORDERS_BY_STATUS,
      );
      const pipeline = salesOrderService.buildSalesOrderSummaryPipeline();

      SalesOrder.aggregate(pipeline).then((aggregateResults) => {
        logger.info(
          SALES_ORDER_RESPONSE_MESSAGE.COUNTING_NO_SALES_ORDERS_BY_STATUS_SUCCESS,
        );
        const responseData =
          salesOrderService.normalizeSalesOrderSummaryAggregation(
            aggregateResults,
          );

        return apiResponse.successResponseWithData(
          res,
          SALES_ORDER_RESPONSE_MESSAGE.COUNTING_NO_SALES_ORDERS_BY_STATUS_SUCCESS,
          responseData,
        );
      });
    } catch (err) {
      logger.error(
        `${SALES_ORDER_RESPONSE_MESSAGE.COUNTING_NO_SALES_ORDERS_BY_STATUS_ERROR} ${err}`,
      );
      return apiResponse.ErrorResponse(res, err);
    }
  }
}

module.exports = new SalesOrderController();
