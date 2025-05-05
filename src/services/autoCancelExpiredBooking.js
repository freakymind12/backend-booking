const cron = require("node-cron")
const bookingModel = require("../models/bookings")

const autoCancelExpiredBooking = () => {
  cron.schedule("*/10 * * * * *", async () => {
    try {
      const expiredBookings = await bookingModel.getExpiredBooking()

      for (const booking of expiredBookings) {
        await bookingModel.update(booking.id_booking, { status: "Cancel" })
      }

      if (expiredBookings.length > 0) console.log(`[SCHEDULER] - CANCEL EXPIRED BOOKING ${expiredBookings.length} ITEMS`,)

    } catch (error) {
      console.error(`Error in process delete expired booking`, error)
    }
  })
}

module.exports = autoCancelExpiredBooking