const express = require('express');
const roomsController = require("../controllers/rooms")
const { authenticateToken } = require('../middleware/auth.js');
const { check, param } = require('express-validator');


const router = express.Router();

const validationCheck = [
  check("room_name").notEmpty().withMessage("Room name is required"),
  check("capacity").notEmpty().withMessage("Capacity is required"),
  check("description").notEmpty().withMessage("Description is required"),
]

router.get("/", authenticateToken, roomsController.get)

router.post("/", authenticateToken, validationCheck, roomsController.create)

router.delete("/:id", authenticateToken, [param('id').notEmpty().withMessage("Room id is required")], roomsController.delete)

router.patch("/:id", authenticateToken, [param('id').notEmpty().withMessage("Room id is required"), ...validationCheck], roomsController.update)

module.exports = router