const express = require('express');
const autoScheduleController = require('../controllers/auto_schedule.js')
const authMiddleware = require('../middleware/auth.js');
const { check } = require('express-validator');


const router = express.Router();

const validationCheck = [
  check('id_user').notEmpty().withMessage("id_user is required"),
  check('id_room').notEmpty().withMessage("id_room is required"),
  check('day').notEmpty().withMessage("day is required"),
  check('start').notEmpty().withMessage("start is required"),
  check('end').notEmpty().withMessage("end is required"),
  check('meeting_name').notEmpty().withMessage("meeting_name is required"),
]

router.get("/", authMiddleware.authenticateToken, autoScheduleController.get)

router.post("/", authMiddleware.authenticateToken,
  validationCheck, autoScheduleController.create)

router.patch("/:id", authMiddleware.authenticateToken, validationCheck, autoScheduleController.update)

router.delete("/:id", authMiddleware.authenticateToken, autoScheduleController.delete)

module.exports = router