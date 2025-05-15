const cron = require("node-cron")
const bookingModel = require("../models/bookings")
const autoScheduleModel = require("../models/auto_schedule")
const dayjs = require("dayjs")

const dayNameToNumber = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

const autoBookingSchedule = () => {
  cron.schedule("0 5 * * *", async () => {
    try {
      const today = dayjs(); // hari ini (Jumat)

      const schedule = await autoScheduleModel.get();

      for (const item of schedule) {

        const { day, start, end, id_room, id_user, meeting_name } = item
        const targetDayNumber = dayNameToNumber[day];
        if (targetDayNumber === undefined) {
          console.warn(`Hari tidak valid: ${day}`);
          continue;
        }
        // Hitung tanggal hari target di minggu depan dari hari ini
        // Hari ini hari Jumat (day = 5)
        const daysUntilTarget = (targetDayNumber + 7 - today.day()) % 7 || 7;
        // penjelasan: kalau hasilnya 0 berarti hari ini, kita ganti jadi 7 agar minggu depan
        const targetDate = today.add(daysUntilTarget, 'day').format('YYYY-MM-DD');

        const formattedStart = targetDate + ' ' + start;
        const formattedEnd = targetDate + ' ' + end;

        const checkBooking = await bookingModel.checkBooking({
          id_room,
          start: formattedStart,
          end: formattedEnd,
        })
        if (checkBooking.length === 0) {
          await bookingModel.create({
            id_user,
            id_room,
            meeting_name,
            start: formattedStart,
            end: formattedEnd,
          })

          console.log(`[SCHEDULER] - SUCCESS ADD BOOKING FOR ${meeting_name} on ${targetDate} at ${start} - ${end}`)
        }
        else {
          console.log(`[SCHEDULER] - BOOKING FOR ${meeting_name} on ${targetDate} at ${start} - ${end} ALREADY EXIST`)
        }
      }
    } catch (error) {
      console.error(error);
    }
  });
}

module.exports = autoBookingSchedule