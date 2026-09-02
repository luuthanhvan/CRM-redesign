const { ObjectId } = require("mongodb");

class SalesOrderService {
  buildSalesOrdersPipeline(request) {
    const isAdmin = request.isAdmin;
    const currentUserName = request.name;

    // for get sales order details by sales order ID
    let saleOrderId = "";
    if (request.params) {
      saleOrderId = request.params.id || "";
    }

    // for sorting, paging, searching and filtering
    const queryObj = request.query;
    let sortColumn = "subject"; // default sort column is Subject if there is no param sent
    let sortOrder = 1; // default sort order is ascending (smallest to largest / A to Z)
    let page = 1; // default page is the first page
    let limit = 10; // default item per page is 10
    let subject = "";

    if (queryObj) {
      // for sorting
      sortColumn = queryObj["sortColumn"] || "subject";
      sortOrder = queryObj["sortOrder"] || 1;
      // for paging
      page = parseInt(queryObj["page"], 10) || 1;
      limit = parseInt(queryObj["limit"], 10) || 10;
      // for searching by subject
      subject = queryObj["subject"] || "";
    }

    // controls where MongoDB starts returning records
    const offset = (page - 1) * limit;

    let matchStage = isAdmin ? {} : { assignedTo: currentUserName };
    if (saleOrderId && saleOrderId !== "") {
      matchStage = { _id: new ObjectId(saleOrderId) };
    }

    if (subject && subject !== "") {
      matchStage = {
        $and: [
          { subject: { $regex: queryObj["subject"] } },
          { ...(!isAdmin && { assignedTo: currentUserName }) },
        ],
      };
    }

    const pipeline = [
      // Filters
      { $match: matchStage },

      // Date Formatting
      {
        $addFields: {
          createdTime: {
            $dateToString: {
              format: "%b %d, %Y",
              date: "$createdTime",
            },
          },
          updatedTime: {
            $dateToString: {
              format: "%b %d, %Y",
              date: "$updatedTime",
            },
          },
        },
      },

      // Sorting
      {
        $sort: { [sortColumn]: sortOrder },
      },

      // Paging
      {
        $facet: {
          paginatedResults: [{ $skip: offset }, { $limit: limit }],
          totalRecords: [{ $count: "count" }],
        },
      },
    ];
    return pipeline;
  }

  normalizeSalesOrdersAggregation(result) {
    const facetResult = result[0] || {};
    const salesOrders = facetResult.paginatedResults || [];
    const totalRecords = facetResult.totalRecords?.[0]?.count || 0;
    return { salesOrders, totalRecords };
  }

  buildSalesOrderSummaryPipeline() {
    const pipeline = [
      {
        $facet: {
          salesOrderCount: [
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 },
              },
            },
          ],
          summary: [
            {
              $group: { _id: null, totalSum: { $sum: { $toInt: "$total" } } },
            },
          ],
        },
      },
    ];

    return pipeline;
  }

  normalizeSalesOrderSummaryAggregation(result) {
    const total = result[0].salesOrderCount.reduce(
      (sum, item) => sum + item.count,
      0,
    );
    return {
      salesOrderCount: result[0].salesOrderCount,
      totalSalesOrders: total,
      totalRevenue:
        result[0].summary[0] && result[0].summary[0].totalSum
          ? result[0].summary[0].totalSum
          : 0,
    };
  }
}

module.exports = new SalesOrderService();
