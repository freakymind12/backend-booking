const { validationResult } = require("express-validator");
const { handleError, handleResponse } = require("../utils/responseUtils");
const reportModel = require("../models/report")

const reportController = {
  getReportMonthly: async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return handleResponse(res, errors.array()[0].msg, 400);
    }

    try {
      const { yearmonth } = req.query
      const [totalBookingsMonthly] = await reportModel.getTotalMonthly(yearmonth)
      const { total } = totalBookingsMonthly
      const bookingStatus = await reportModel.getBookingByStatus(yearmonth)
      const topUsers = await reportModel.getTopUsers(yearmonth)
      const deptBookings = await reportModel.getTotalBookingsByDept(yearmonth)
      const roomSummary = await reportModel.getRoomUsageSummary(yearmonth)

      return handleResponse(res, "Success", 200, { totalBookings: total, bookingStatus, topUsers, deptBookings, roomSummary })
    } catch (error) {
      return handleError(res, error)
    }
  }
}


module.exports = reportController