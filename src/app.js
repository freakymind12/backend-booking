require('dotenv').config()
const PORT = process.env.PORT || 5000
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const cron = require('node-cron')
// const apicache = require('apicache')

// IMPORT SCHEDULER
const { startScheduler } = require('./scheduler/deleteExpiredBooking.js')

startScheduler()
// const bookingScheduler = require('./controllers/bookingController.js')

// IMPORT ROUTES
const authRoutes = require('./routes/auth.js');
const usersRoutes = require('./routes/users.js');
const roomRoutes = require('./routes/room.js')
const bookingRoutes = require('./routes/booking.js')

// IMPORT MIDDLEWARE
const middlewareHandle = require('./middleware/middlewareHandle.js');
// const cache = apicache.middleware;
const app = express();

// MIDDLEWARE USED
app.use(middlewareHandle.errorMessage) // error message
app.use(middlewareHandle.logRequest) // log request
// app.use(middlewareHandle.allowCrossDomain) // allow cross domain for make a request to this api
app.use(cors());
// app.use(cache("2 minutes"));

// ALLOW JSON RESPONSE AND PUBLIC FOLDER
app.use(cookieParser())
app.use(express.json())
app.use(express.static('public'));

// TASK SCHEDULER
// cron.schedule('*/10 * * * * *', () => {
  // const now = new Date();
  // const formattedTime = now.toLocaleTimeString();
  // bookingScheduler.deleteExpiredBooking()
  // console.log(`[${formattedTime}] -> running a task by node-cron`);
// });
    


// ROUTES
app.use('/auth', authRoutes) // auth login ✔
app.use('/users', usersRoutes) // users endpoint ✔
app.use('/rooms',  roomRoutes)
app.use('/bookings', bookingRoutes)

// RUN SERVICE REST API
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});
