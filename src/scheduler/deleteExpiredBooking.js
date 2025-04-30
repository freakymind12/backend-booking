const cron = require('node-cron');
const bookingModel = require('../models/bookingModel');
const dayjs = require('dayjs');

const deleteExpiredBooking = async () => {
  try {
    const now = new Date();
    const expiredBookings = await bookingModel.getExpiredBooking(now);

    for (const booking of expiredBookings) {
      await bookingModel.deleteBooking(booking.id_booking);
    }
    console.log(`${dayjs().format('YYYY-MM-DD HH:mm:ss')} -> Deleted ${expiredBookings.length} expired bookings by system scheduler`);
  } catch (error) {
    console.error('Error in process delete expired booking', error);
  }
};

// Fungsi untuk memulai cron job
const autoDeleteExpiredBooking = () => {
  cron.schedule('*/10 * * * * *', () => {
    deleteExpiredBooking();
    console.log('Running from scheduler');
  });
};

// Ekspor fungsi yang diperlukan
module.exports = { autoDeleteExpiredBooking, deleteExpiredBooking };
