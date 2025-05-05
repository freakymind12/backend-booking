// IMPORT MODULES
require('dotenv').config()
const PORT = process.env.APP_PORT || 5050
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require("helmet");

// IMPORT ROUTES
const authRoutes = require('./routes/auth');
const usersRoutes = require("./routes/users")
const bookingRoutes = require("./routes/bookings")
const roomRoutes = require("./routes/rooms")

// IMPORT SERVICES
const autoCancelExpiredBooking = require("./services/autoCancelExpiredBooking")
const autoBookingSchedule = require("../src/services/autoBooking")

// RUN SERVICES
autoCancelExpiredBooking()
autoBookingSchedule()

// IMPORT MIDDLEWARE
const middlewareHandle = require('./middleware/middlewareHandle');
const app = express();

// MIDDLEWARE
app.use(helmet());
app.use(middlewareHandle.errorMessage) // error message
app.use(middlewareHandle.logRequest) // log request
app.use(cors({
  origin: 'http://localhost:5173', // ganti untuk alamat frontend nya 
  credentials: true
}));

// ALLOW JSON RESPONSE AND PUBLIC FOLDER
app.use(cookieParser())
app.use(express.json())
app.use(express.static('public'));

// ROUTES
app.use('/api/auth', authRoutes) // auth login ✔
app.use('/api/users', usersRoutes) // users endpoint ✔
app.use('/api/bookings', bookingRoutes)
app.use('/api/rooms', roomRoutes)


// Run service REST API
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});
