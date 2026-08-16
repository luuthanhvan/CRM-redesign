class ContactService {
  getContactSearchQuery(request) {
    const queryObj = request.query;
    const isAdmin = request.isAdmin,
      name = request.name;

    const query = {
      $and: [
        { contactName: { $regex: queryObj["contactName"] } },
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

module.exports = new ContactService();
