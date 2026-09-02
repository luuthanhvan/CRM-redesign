const { ObjectId } = require("mongodb");

class ContactService {
  buildContactsPipeline(request) {
    const isAdmin = request.isAdmin;
    const currentUserName = request.name;

    // for get contact details by contact ID
    let contactId = "";
    if (request.params) {
      contactId = request.params.id || "";
    }

    // for sorting, paging, searching and filtering
    const queryObj = request.query;
    let sortColumn = "contactName"; // default sort column is Contact Name if there is no param sent
    let sortOrder = 1; // default sort order is ascending (smallest to largest / A to Z)
    let page = 1; // default page is the first page
    let limit = 10; // default item per page is 10
    let contactName = "";
    let leadSource = [];

    if (queryObj) {
      // for sorting
      sortColumn = queryObj["sortColumn"] || "contactName";
      sortOrder = queryObj["sortOrder"] || 1;
      // for paging
      page = parseInt(queryObj["page"], 10) || 1;
      limit = parseInt(queryObj["limit"], 10) || 10;
      // for searching by contact name
      contactName = queryObj["contactName"] || "";
      // for filtering by lead sources
      leadSource = queryObj["leadSource"]?.split(",") || [];
    }

    // controls where MongoDB starts returning records
    const offset = (page - 1) * limit;

    let matchStage = isAdmin ? {} : { assignedTo: currentUserName };
    if (contactId && contactId !== "") {
      matchStage = { _id: new ObjectId(contactId) };
    }
    const orConditions = [];
    if (contactName && contactName !== "") {
      orConditions.push({
        $and: [
          { contactName: { $regex: queryObj["contactName"] } },
          { ...(!isAdmin && { assignedTo: currentUserName }) },
        ],
      });
    }
    if (leadSource && leadSource.length > 0) {
      orConditions.push({
        $and: [
          { leadSrc: { $in: leadSource } },
          { ...(!isAdmin && { assignedTo: currentUserName }) },
        ],
      });
    }
    if (orConditions.length > 0) {
      matchStage = { $or: orConditions };
    }

    const pipeline = [
      // Filters
      { $match: matchStage },

      // Date Formatting
      {
        $addFields: {
          createdTime: {
            // %b = Abbreviated month (Jan, Feb, Sep...)
            // %d = Day of month, zero-padded (01, 02...)
            // %Y = Year, 4 digits (2026)
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
        // this last $facet stage wraps results into two buckets
        $facet: {
          // paginatedResults: the list of contacts results from the aggregration above with paging options
          paginatedResults: [
            { $skip: offset }, // Skip records has only one parameter offset, which is the number of records to be skipped
            { $limit: limit }, // Limit records per page defines the maximum amount of documents to be returned by MongoDB
          ],
          // totalRecords: the number of contact records
          totalRecords: [{ $count: "count" }],
        },
      },
    ];
    return pipeline;
  }

  normalizeAggregateResults(result) {
    // facet always returns an array with one object
    const facetResult = result[0] || {}; // unwraps the single object returned by $facet
    const contacts = facetResult.paginatedResults || []; // the actual list of contacts
    const totalRecords = facetResult.totalRecords?.[0]?.count || 0; // extracts the count safely
    return { contacts, totalRecords };
  }
}

module.exports = new ContactService();
