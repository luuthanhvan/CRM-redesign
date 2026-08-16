const express = require("express");
const router = express.Router();
const salesOrderController = require("../controllers/SalesOrderController");
const authController = require("../controllers/AuthController");
const jwtHelper = require("../configs/jwt");

router.post(
  "/",
  jwtHelper.verifyJwtToken,
  authController.verifyUser,
  salesOrderController.storeSalesOrder
);
router.get(
  "/list",
  jwtHelper.verifyJwtToken,
  authController.verifyUser,
  salesOrderController.getListOfSalesOrders
);
router.post(
  "/delete",
  jwtHelper.verifyJwtToken,
  authController.verifyUser,
  salesOrderController.deleteMultiSalesOrders
);
router.get(
  "/search",
  jwtHelper.verifyJwtToken,
  authController.verifyUser,
  salesOrderController.findSalesOrders
);
router.get(
  "/count/status",
  jwtHelper.verifyJwtToken,
  salesOrderController.countNoSalesOrdersByStatus
);
router.get(
  "/:id",
  jwtHelper.verifyJwtToken,
  salesOrderController.getSalesOrder
);
router.put(
  "/:id",
  jwtHelper.verifyJwtToken,
  salesOrderController.updateSalesOrder
);
router.delete(
  "/:id",
  jwtHelper.verifyJwtToken,
  salesOrderController.deleteSalesOrder
);

module.exports = router;
