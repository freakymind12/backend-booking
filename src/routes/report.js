const express = require('express');
const reportController = require('../controllers/report')
const authMiddleware = require('../middleware/auth');
const { check } = require('express-validator');

const router = express.Router();

router.get("/", authMiddleware.authenticateToken, [check('yearmonth').notEmpty().withMessage("yearmonth is required")], reportController.getReportMonthly)

module.exports = router;