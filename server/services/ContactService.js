class ContactService {
  getContactSearchQuery(request) {
    const queryObj = request.query;
    const contactName = queryObj["contactName"];
    const leadSource = queryObj["leadSource"]
      ? queryObj["leadSource"].split(",")
      : [];
    const isAdmin = request.isAdmin;

    const orConditions = [];

    if (contactName && contactName.trim() !== "") {
      orConditions.push({ contactName: { $regex: contactName } });
    }
    if (leadSource.length > 0) {
      orConditions.push({ leadSrc: { $in: leadSource } });
    }

    const query = orConditions.length > 0 ? { $or: orConditions } : {};

    if (queryObj && Object.keys(queryObj).length > 0) {
      return query;
    } else {
      return {};
    }
  }
}

module.exports = new ContactService();
