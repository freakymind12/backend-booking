const cron = require("node-cron")
const bookingModel = require("../models/bookings")

const autoDeleteExpiredBooking = () => {
  cron.schedule("*/10 * * * * *", async () => {
    try {
      const expiredBookings = await bookingModel.getExpiredBooking()

      for (const booking of expiredBookings) {
        await bookingModel.update(booking.id_booking, { status: "Canceled" })
      }
      
      if(expiredBookings.length > 0) console.log(`[SCHEDULER] - CANCELED EXPIRED BOOKING ${expiredBookings.length} ITEMS`,)

    } catch (error) {
      console.error(`Error in process delete expired booking`, error)
    }
  })
}

module.exports = autoDeleteExpiredBooking