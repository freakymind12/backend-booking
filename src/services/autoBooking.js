const cron = require("node-cron")
const bookingModel = require("../models/bookings")
const dayjs = require("dayjs")

const schedule = [
  {
    id_room: '1d91ade8-219e-11f0-8cbf-066f82d8bae1',
    day: 'Monday',
    id_user: 2,
    meeting_name: "Leader Meeting",
    start: '13:00:00',
    end: "14:00:00"
  },
  {
    id_room: '1d91ade8-219e-11f0-8cbf-066f82d8bae1',
    day: 'Wednesday',
    id_user: 2,
    meeting_name: "Production Meeting",
    start: '13:00:00',
    end: "14:00:00"
  }
]

const autoBookingSchedule = () => {
  cron.schedule("0 6 * * *", async () => {
    try {
      const today = dayjs().format('dddd')
      for (const item of schedule) {
        if (item.day === today) {
          const checkBooking = await bookingModel.checkBooking({
            id_room: item.id_room,
            start: dayjs().format('YYYY-MM-DD') + ' ' + item.start,
            end: dayjs().format('YYYY-MM-DD') + ' ' + item.end,
          })

          if (checkBooking.length === 0) {
            await bookingModel.create({
              ...item,
              start: dayjs().format('YYYY-MM-DD') + ' ' + item.start,
              end: dayjs().format('YYYY-MM-DD') + ' ' + item.end,
            })

            console.log(`[SCHEDULER] - SUCCESS ADD BOOKING FOR ${item.meeting_name} on ${dayjs().format('YYYY-MM-DD')} at ${item.start} - ${item.end}`)
          }
        }
      }
    } catch (error) {
      console.error(error)
    }
  })
}

module.exports = autoBookingSchedule