const bookingModel = require('../models/bookingModel')

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

const newBooking = async (req,res) => {
  try {
    await bookingModel.addBooking(req.body)
    handleResponse(res, "Create new booking room successfully", 200, req.body)
  } catch (error) {
    handleError(res, error)
  }
}

const updateBooking = async (req, res) => {
  try {
    await bookingModel.updateBooking(req.params.id, req.body)
    const updated = await bookingModel.getBookingById(req.params.id)
    handleResponse(res, "Update booking data successfully", 200, updated[0])
  } catch (error) {
    handleError(res, error)
  }
}

const getBookings = async (req, res) => {
  try {
    const bookings = await bookingModel.getBookings()
    handleResponse(res, "Get bookings data successfully", 200, bookings)
  } catch (error) {
    handleError(res, error)
  }
}

const getQueue = async (req, res) => {
  try {
    const { id_room } = req.query;

    if (!id_room) {
      return handleResponse(res, "Room id is required", 400);
    }

    const queue = await bookingModel.getQueue(id_room);

    if (queue) {
      return handleResponse(res, `Get queue for room ${id_room} success`, 200, queue);
    } else {
      return handleResponse(res, `No queue found for room ${id_room}`, 404);
    }
  } catch (error) {
    return handleError(res, error);
  }
};


const deleteBooking = async (req,res) => {
  try {
    const data = await bookingModel.getBookingById(req.params.id)
    if(data.length !==0) {
      const deleted = await bookingModel.deleteBooking(req.params.id)
      const message = deleted ? "Booking data deleted" : "Failed to delete booking data"
      handleResponse(res, message, 200, data[0])
    } else {
      handleResponse(res, "Booking data not found", 404)
    }
  } catch (error) {
    
  }
}


module.exports = {
  newBooking,
  updateBooking,
  getBookings,
  deleteBooking,
  getQueue
}