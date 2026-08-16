class SalesOrderService {
  getSalesOrderSearchQuery(request) {
    const queryObj = request.query;
    const isAdmin = request.isAdmin,
      name = request.name;

    const query = {
      $and: [
        { subject: { $regex: queryObj["subject"] } },
        { ...(!isAdmin && { assignedTo: name }) },
      ],
    };
    if (queryObj && Object.keys(queryObj).length > 0) {
      return query;
    } else {
      return {};
    }
  }
}

module.exports = new SalesOrderService();
