const express = require('express');
const bookingsController = require('../controllers/bookings.js')
const authMiddleware = require('../middleware/auth.js')

const router = express.Router();

router.get("/", authMiddleware.authenticateToken, bookingsController.get)

router.post("/", authMiddleware.authenticateToken, bookingsController.create)

router.patch("/:id", authMiddleware.authenticateToken, bookingsController.update)

router.delete("/:id", authMiddleware.authenticateToken, bookingsController.delete)


module.exports = router;