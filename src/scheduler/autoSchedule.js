const cron = require('node-cron');
const bookingModel = require("../models/bookingModel")
const dayjs = require('dayjs')

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
  },
  {
    id_room:'2efd7ba5-219e-11f0-8cbf-066f82d8bae1',
    day: 'Thursday',
    id_user: 2,
    meeting_name: "Ichinoseki Plating Weekly Meeting",
    start:'11:00:00',
    end: "12:00:00"
  }
]

const newSchedule = async () => {
  try {
    const today = dayjs().format('dddd')
    for (const item of schedule) {
      if (item.day === today) {
      
        // cek apakah sudah ada booking di hari dan jam yang sama
        const validateBooking = await bookingModel.validateBooking({
          id_room: item.id_room,
          start: dayjs().format('YYYY-MM-DD') + ' ' + item.start,
          end: dayjs().format('YYYY-MM-DD') + ' ' + item.end,
        })

        if (validateBooking.length == 0) {
          // tambah data booking baru ke database
          await bookingModel.addBooking({
            ...item,
            start: dayjs().format('YYYY-MM-DD') + ' ' + item.start,
            end: dayjs().format('YYYY-MM-DD') + ' ' + item.end,
          })

          // tampilkan success pada log
          console.log(`${dayjs().format('YYYY-MM-DD HH:mm:ss')} ->  Success add booking for ${item.meeting_name} on ${dayjs().format('YYYY-MM-DD')} at ${item.start} - ${item.end}`)
        }
      }
    }
  } catch (error) {
    console.log(error)
  }
}

const autoSchedule = () => {
  cron.schedule('0 6 * * *', () => {
    newSchedule()
  })
}

module.exports = autoSchedule