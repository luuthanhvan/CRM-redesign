const contactRouter = require("./contact");
const salesOrderRouter = require("./sales_order");
const userRouter = require("./user");
const authRouter = require("./auth");

function route(app) {
  app.use("/v1/contact", contactRouter);
  app.use("/v1/sales-order", salesOrderRouter);
  app.use("/v1/user", userRouter);
  app.use("/v1/authentication", authRouter);
}

module.exports = route;
