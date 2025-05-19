const { validationResult } = require("express-validator");
const { handleError, handleResponse } = require("../utils/responseUtils");
const bookingModel = require("../models/bookings");
const autoScheduleModel = require("../models/auto_schedule");
const dayjs = require("dayjs");


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
      const { id_room, start, end } = req.body
      const day = dayjs(start).format("dddd")
      const checkBooking = await bookingModel.checkBooking(req.body)

      const chechAutoSchedule = await autoScheduleModel.checkConflict({
        id_room,
        day,
        start: start.split(" ")[1].slice(0, 5),
        end: end.split(" ")[1].slice(0, 5)
      })

      if (checkBooking.length > 0 || chechAutoSchedule.length > 0) {
        return handleResponse(res, "Sorry, there's a scheduling conflict. Please check the room's availability.", 400);
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
      const day = dayjs(start).format("dddd")

      const checkBooking = await bookingModel.checkBooking(req.body, id)
      const chechAutoSchedule = await autoScheduleModel.checkConflict({
        id_room,
        day,
        start: start.split(" ")[1].slice(0, 5),
        end: end.split(" ")[1].slice(0, 5)
      })

      if (checkBooking.length > 0 || chechAutoSchedule.length > 0) {
        return handleResponse(res, "Sorry, there's a scheduling conflict. Please check the room's availability.", 400);
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