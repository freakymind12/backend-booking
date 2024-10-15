const bookingModel = require("../models/bookingModel");

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

const checkBookingStatus = async (req, res) => {
  try {
    const validateSide = await bookingModel.validateBooking(req.query)
    if(validateSide.length==0){
      handleResponse(res, "Room schedule is clear, you can book now!", 200, {booking:[...validateSide]})
    }
    else{
      handleResponse(res, "Your room booking time clashes with other", 400, {booking:[...validateSide]});
    }
  } catch (error) {
    handleError(res, error)
  }
}

// ADD Booking
const newBooking = async (req, res) => {
  try {
    const validateSide = await bookingModel.validateBooking(req.body)
    
    if(validateSide.length==0){
      await bookingModel.addBooking(req.body);
      handleResponse(res, "Create new booking room successfully", 200, req.body);
    }else{
      handleResponse(res, "Your room booking time clashes with other", 400, {booking:[...validateSide]});
    }
  } catch (error) {
    handleError(res, error);
  }
};

// UPDATE Booking
const updateBooking = async (req, res) => {
  try {
    await bookingModel.updateBooking(req.params.id, req.body);
    const updated = await bookingModel.getBookingById(req.params.id);
    handleResponse(res, "Update booking data successfully", 200, updated[0]);
  } catch (error) {
    handleError(res, error);
  }
};

// GET ALL Booking
const getBookings = async (req, res) => {
  try {
    const bookings = await bookingModel.getBookings();
    handleResponse(res, "Get bookings data successfully", 200, bookings);
  } catch (error) {
    handleError(res, error);
  }
};

// GET ALL Booking by id user
const getUserBookings = async (req, res) => {
  try {
    const { id_user, date } = req.query;

    const bookings = await bookingModel.getUserBookings(id_user, date);
    handleResponse(res, "Get bookings data successfully", 200, bookings);
  } catch (error) {
    handleError(res, error);
  }
};

// GET ALL Booking by user, room
const getRoomBookingList = async (req, res) => {
  try {
    const { id_room, date } = req.query;
    const order = req.query.order || 'desc'
    
    let bookingList;

    if (!id_room) {
      return handleResponse(res, "Room id is required", 400);
    }
    
    if (date) {
      
      bookingList = await bookingModel.getBookingListByDateRoom(id_room, date, order);
    } else {
      bookingList = await bookingModel.getRoomBookingList(id_room, order);
    }

    if (bookingList) {
      return handleResponse(
        res,
        `Get queue for room ${id_room} success`,
        200,
        bookingList
      );
    } else {
      return handleResponse(res, `No queue found for room ${id_room}`, 404);
    }
  } catch (error) {
    return handleError(res, error);
  }
};

// DELETE Booking Data
const deleteBooking = async (req, res) => {
  try {
    const data = await bookingModel.getBookingById(req.params.id);
    if (data.length !== 0) {
      const deleted = await bookingModel.deleteBooking(req.params.id);
      const message = deleted
        ? "Booking data deleted"
        : "Failed to delete booking data";
      handleResponse(res, message, 200, data[0]);
    } else {
      handleResponse(res, "Booking data not found", 404);
    }
  } catch (error) {}
};

module.exports = {
  newBooking,
  updateBooking,
  getBookings,
  deleteBooking,
  getUserBookings,
  getRoomBookingList,
  checkBookingStatus
};
