const roomModel = require("../models/roomModel");

const handleResponse = (res, message, status = 200, data = null) => {
  if (data !== null) {
    res.status(status).json({ message, data });
  } else {
    res.status(status).json({ message });
  }
};

const handleError = (res, error) => {
  console.error("Error:", error);
  res.status(500).json({ message: "Server Error" });
};

const newRoom = async (req, res) => {
  const { room_name, capacity, description } = req.body;
  try {
    await roomModel.addRoom(room_name, capacity, description);
    handleResponse(res, "Create new room successfully", 200, req.body);
  } catch (error) {
    handleError(res, error);
  }
};

const updateRoom = async (req, res) => {
  try {
    await roomModel.updateRoom(req.params.id, req.body);
    const updated = await roomModel.getRoomById(req.params.id);
    handleResponse(res, "Update room data successfully", 200, updated[0]);
  } catch (error) {
    handleError(res, error);
  }
};

const getRooms = async (req, res) => {
  try {
    const rooms = await roomModel.getRoom();
    handleResponse(res, "Sucess", 200, rooms);
  } catch (error) {
    handleError(res, error);
  }
};

const getRoomsById = async (req, res) => {
  try {
    const room = await roomModel.getRoomById(req.params.id);
    handleResponse(res, "Sucess", 200, room);
  } catch (error) {
    handleError(res, error);
  }
};

const deleteRoom = async (req, res) => {
  try {
    const data = await roomModel.getRoomById(req.params.id);
    if (data.length !== 0) {
      const deleted = await roomModel.deleteRoom(req.params.id);
      const message = deleted
        ? "Room deleted successfully"
        : "Failed to delete room";
      handleResponse(res, message, 200, data[0]);
    } else {
      handleResponse(res, "Room not found", 404);
    }
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  newRoom,
  updateRoom,
  getRooms,
  getRoomsById,
  deleteRoom,
};
