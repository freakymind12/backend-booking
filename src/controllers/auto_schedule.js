const { validationResult } = require("express-validator");
const { handleError, handleResponse } = require("../utils/responseUtils");
const autoScheduleModel = require("../models/auto_schedule");

const autoScheduleController = {
  get: async (req, res) => {
    try {
      const autoSchedule = await autoScheduleModel.get(req.query);
      return handleResponse(res, "Success", 200, autoSchedule)
    } catch (error) {
      return handleError(res, error)
    }
  },

  create: async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return handleResponse(res, errors.array()[0].msg, 400);
    }

    try {
      await autoScheduleModel.create(req.body)
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
      await autoScheduleModel.update(id, req.body)
      return handleResponse(res, "Success", 200, req.body);
    } catch (error) {
      return handleError(res, error)
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params
      await autoScheduleModel.delete(id)
      return handleResponse(res, "Success", 200, req.body);
    } catch (error) {
      return handleError(res, error)
    }
  }
}

module.exports = autoScheduleController
