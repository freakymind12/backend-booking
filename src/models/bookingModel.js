const dbPool = require("../config/database");

const runQuery = async (query, params = []) => {
  const [result] = await dbPool.query(query, params);
  return result;
};

const addBooking = async (bookingData) => {
  const { id_user, id_room, meeting_name, start, end, status } = bookingData;
  await runQuery(
    "INSERT INTO bookings (id_booking, id_user, id_room, meeting_name, start, end, status) VALUES (uuid(), ?, ?, ?, ?, ?, ?) ",
    [id_user, id_room, meeting_name, start, end, status]
  );
  return true;
};

const updateBooking = async (id, bookingData) => {
  const { id_room, meeting_name, start, end, status } = bookingData;
  await runQuery(
    "UPDATE bookings SET meeting_name = ?, start = ?, end = ?, status = ?,id_room = ?, status=? where id_booking  = ?",
    [meeting_name, start, end, status, id_room, status, id]
  );
  return true;
};

const getBookings = async () => {
  return await runQuery(
    `SELECT b.*, r.room_name, DATE_FORMAT(b.start, '%Y-%m-%d %H:%i:%s') AS start,DATE_FORMAT(b.end, '%Y-%m-%d %H:%i:%s') AS end FROM bookings as b INNER JOIN rooms as r ON b.id_room=r.id_room order by b.start desc;`
  );
};

const getUserBookings = async (id, date = null) => {
  const query = `
    SELECT b.*, r.room_name, 
    DATE_FORMAT(b.start, '%Y-%m-%d %H:%i:%s') AS start, 
    DATE_FORMAT(b.end, '%Y-%m-%d %H:%i:%s') AS end 
    FROM bookings AS b 
    INNER JOIN rooms AS r ON b.id_room = r.id_room 
    WHERE b.id_user = ? 
    ${date ? "AND DATE(b.start) = ?" : ""} 
    ORDER BY b.start DESC`;

  return await runQuery(query, date ? [id, date] : [id]);
};

const getRoomBookingList = async (id, order) => {
  return await runQuery(
    `SELECT b.*, u.username, u.dept, r.room_name, DATE_FORMAT(b.start, '%Y-%m-%d %H:%i:%s') AS start,DATE_FORMAT(b.end, '%Y-%m-%d %H:%i:%s') AS end 
    FROM bookings as b 
    INNER JOIN users as u ON b.id_user = u.id_user 
    INNER JOIN rooms as r ON b.id_room = r.id_room
    WHERE b.id_room = ? ORDER BY b.start ${order}`,
    [id]
  );
};

const getBookingListByDateRoom = async (id, date, order) => {
  return await runQuery(
    `SELECT b.*, u.username, u.dept, r.room_name, DATE_FORMAT(b.start, '%Y-%m-%d %H:%i:%s') AS start,DATE_FORMAT(b.end, '%Y-%m-%d %H:%i:%s') AS end 
    FROM bookings as b 
    INNER JOIN users as u ON b.id_user = u.id_user 
    INNER JOIN rooms as r ON b.id_room = r.id_room
    WHERE b.id_room = ? and b.start like ?
    ORDER BY b.start ${order}`,
    [id, date + "%"]
  );
};

const getExpiredBooking = async (now) => {
  return await runQuery(
    `SELECT * FROM bookings
    WHERE status IS NULL AND TIMESTAMPDIFF(MINUTE, start, ?) >= 15`,
    [now]
  );
};

const deleteBooking = async (id) => {
  await runQuery("DELETE FROM bookings WHERE id_booking = ?", [id]);
  return true;
};

const getBookingById = async (id) => {
  return await runQuery("SELECT * FROM bookings WHERE id_booking = ?", [id]);
};

const validateBooking = async (bookingData) => {
  const { id_room, start, end } = bookingData;
  return await runQuery(
    `SELECT b.*, u.username, u.dept, 
      DATE_FORMAT(b.start, '%Y-%m-%d %H:%i:%s') AS start, 
      DATE_FORMAT(b.end, '%Y-%m-%d %H:%i:%s') AS end
    FROM bookings as b
    INNER JOIN users as u ON b.id_user = u.id_user
    WHERE b.id_room = ?
      AND b.start < ?
      AND b.end > ?`,
    [id_room, end, start]
  );
};

module.exports = {
  addBooking,
  updateBooking,
  getBookings,
  getUserBookings,
  getBookingById,
  getRoomBookingList,
  getBookingListByDateRoom,
  getExpiredBooking,
  validateBooking,
  deleteBooking,
};
