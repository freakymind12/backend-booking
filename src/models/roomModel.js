const dbPool = require('../config/database');

const runQuery = async (query, params = []) => {
  const [result] = await dbPool.query(query, params);
  return result;
};


const addRoom = async (room_name, capacity) => {
  await runQuery('INSERT INTO rooms (id_room, room_name, capacity) VALUES (uuid(), ?, ?)', [room_name, capacity]);
  return true;
};

const updateRoom = async (id, roomData) => {
  const { room_name, capacity } = roomData;
  await runQuery('UPDATE rooms SET room_name = ?, capacity= ? WHERE id_room = ?', [room_name, capacity, id]);
  return true;
};

const getRoom = async () => {
  return await runQuery('SELECT * FROM rooms');
};

const deleteRoom = async (id) => {
  await runQuery('DELETE FROM rooms WHERE id_room = ?', [id]);
  return true;
};

const getRoomById = async (id) => {
  return await runQuery('SELECT * FROM rooms WHERE id_room = ?', [id]);
};


module.exports = {
  addRoom,
  updateRoom,
  getRoom,
  getRoomById,
  deleteRoom
};