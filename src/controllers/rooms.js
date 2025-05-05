const { validationResult } = require("express-validator");
const { handleResponse, handleError } = require("../utils/responseUtils");
const roomModel = require("../models/rooms");
const { update } = require("../config/knex");

const roomsController = {
  get: async (req, res) => {
    try {
      const rooms = await roomModel.get(req.query);
      return handleResponse(res, "Success", 200, rooms)
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
      await roomModel.create(req.body)
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
      await roomModel.update(id, req.body)
      return handleResponse(res, "Success", 200, req.body);
    } catch (error) {
      return handleError(res, error)
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params
      await roomModel.delete(id)
      return handleResponse(res, "Success", 200, req.body);
    } catch (error) {
      return handleError(res, error)
    }
  }
}

module.exports = roomsController