const express = require('express')
const router = express.Router()
const bookingController = require('../controllers/bookingController')

router.post('/', bookingController.newBooking)
router.get('/', bookingController.getBookings)
router.get('/user', bookingController.getUserBookings)
router.get('/queue', bookingController.getRoomBookingList)
router.get('/check', bookingController.checkBookingStatus)
router.patch('/:id', bookingController.updateBooking)
router.delete('/:id', bookingController.deleteBooking)

module.exports = router