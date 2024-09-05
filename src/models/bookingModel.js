const dbPool = require('../config/database');

const runQuery = async (query, params = []) => {
  const [result] = await dbPool.query(query, params);
  return result;
};

const addBooking = async (bookingData) => {
  const { id_user, id_room, meeting_name, start, end, status} = bookingData
  await runQuery('INSERT INTO bookings (id_booking, id_user, id_room, meeting_name, start, end, status) VALUES (uuid(), ?, ?, ?, ?, ?, ?) ', [id_user, id_room, meeting_name, start, end, status])
  return true
}

const updateBooking = async (id, bookingData) => {
  const { id_room, meeting_name, start, end, status} = bookingData
  await runQuery('UPDATE bookings SET meeting_name = ?, start = ?, end = ?, status = ?,id_room = ? where id_booking  = ?', [meeting_name, start, end, status, id_room,  id])
  return true;
}


const getBookings = async () => {
  return await runQuery('SELECT * FROM bookings')
}

const deleteBooking = async(id) => {
  await runQuery('DELETE FROM bookings WHERE id_booking = ?', [id])
  return true
}

const getBookingById = async(id) => {
  return await runQuery('SELECT * FROM bookings WHERE id_booking = ?', [id])
}

const getQueue = async (id_room) => {
  return await runQuery('SELECT * FROM bookings WHERE id_room = ? order by start asc', [id_room])
}

module.exports = {
  addBooking,
  updateBooking,
  getBookings,
  getBookingById,
  deleteBooking,
  getQueue
}