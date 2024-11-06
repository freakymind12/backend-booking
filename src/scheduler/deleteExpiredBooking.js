const cron = require('node-cron');
const bookingModel = require('../models/bookingModel');

const deleteExpiredBooking = async () => {
  try {
    const now = new Date();
    const expiredBookings = await bookingModel.getExpiredBooking(now);

    for (const booking of expiredBookings) {
      await bookingModel.deleteBooking(booking.id_booking);
    }
    console.log(`[${now.toLocaleTimeString()}] -> Deleted ${expiredBookings.length} expired bookings by system scheduler`);
  } catch (error) {
    console.error('Error in process delete expired booking', error);
  }
};

// Fungsi untuk memulai cron job
const startScheduler = () => {
  cron.schedule('*/10 * * * * *', () => {
    deleteExpiredBooking();
    console.log('Running from scheduler');
  });
};

// Ekspor fungsi yang diperlukan
module.exports = { startScheduler, deleteExpiredBooking };
