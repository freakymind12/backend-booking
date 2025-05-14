const { validationResult } = require("express-validator");
const { handleError, handleResponse } = require("../utils/responseUtils");
const bookingModel = require("../models/bookings");


const bookingsController = {
  get: async (req, res) => {
    try {
      const bookings = await bookingModel.get(req.query);
      return handleResponse(res, "Success", 200, bookings)
    } catch (error) {
      return handleError(res, error)
    }
  },

  create: async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return handleResponse(res, errors.array()[0].msg, 400);
    }

    try {
      const checkBooking = await bookingModel.checkBooking(req.body)

      if (checkBooking.length > 0) {
        return handleResponse(res, "Your room booking time clashes with other", 400);
      }

      await bookingModel.create(req.body)
      return handleResponse(res, "Success", 200, req.body);

    } catch (error) {
      return handleError(res, error)
    }
  },

  update: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleResponse(res, errors.array()[0].msg, 400);
    }

    try {
      const { id } = req.params
      const { id_room, start, end, meeting_name, status } = req.body

      const checkBooking = await bookingModel.checkBooking(req.body, id)

      if (checkBooking.length > 0) {
        return handleResponse(res, "Your room booking time clashes with other", 400);
      }

      await bookingModel.update(id, { id_room, start, end, meeting_name, status })
      return handleResponse(res, "Success", 200, req.body)

    } catch (error) {
      return handleError(res, error)
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params
      await bookingModel.delete(id)
      return handleResponse(res, "Success", 200, req.body)
    } catch (error) {
      return handleError(res, error)
    }
  }
}

module.exports = bookingsController