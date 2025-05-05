const dbPool = require("../config/knex");
const dayjs = require("dayjs")

const bookingModel = {
  create: (data) => {
    return dbPool("bookings").insert({
      ...data,
      id_booking: dbPool.raw("UUID()"),
    })
  },

  update: (id_booking, data) => {
    return dbPool("bookings").where({ id_booking }).update(data)
  },

  delete: (id_booking) => {
    return dbPool("bookings").where({ id_booking }).del()
  },

  get: (filters = {}) => {
    const { id_user, id_room, date, status } = filters
    return dbPool("bookings as b")
      .select(
        "b.*",
        "u.username",
        "u.dept",
        "r.room_name",
        dbPool.raw("DATE_FORMAT(b.start,'%Y-%m-%d %H:%i:%s') as start"),
        dbPool.raw("DATE_FORMAT(b.end, '%Y-%m-%d %H:%i:%s') as end")
      )
      .join("rooms as r", "b.id_room", "r.id_room")
      .join("users as u", "b.id_user", "u.id_user")
      .orderBy("b.start", "desc")
      .modify((query) => {
        if (id_user) query.where("b.id_user", id_user)
        if (id_room) query.where("b.id_room", id_room)
        if (date) query.where("b.start", "like", `${date}%`)
        if (status && status !== "All") {
          query.where("b.status", status)
        }
      })
  },

  // Cek booking yang expired 15 menit setelah masuk waktu start meeting status tidak present
  getExpiredBooking: async () => {
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
    return dbPool('bookings')
      .select('*', dbPool.raw('DATE_FORMAT(start, "%Y-%m-%d %H:%i:%s") as start'), dbPool.raw('DATE_FORMAT(end, "%Y-%m-%d %H:%i:%s") as end'))
      .whereNull('status')
      .andWhereRaw('TIMESTAMPDIFF(MINUTE, start, ?) >= 15', [now]);
  },

  // Cek validasi booking dengan id_room, start, end
  checkBooking: (filters = {}, excludeId = null) => {
    const { id_room, start, end } = filters
    return dbPool("bookings as b")
      .select(
        "b.*",
        "u.username",
        "u.dept",
        dbPool.raw("DATE_FORMAT(b.start,'%Y-%m-%d %H:%i:%s') as start"),
        dbPool.raw("DATE_FORMAT(b.end, '%Y-%m-%d %H:%i:%s') as end"))
      .join("users as u", "b.id_user", "u.id_user")
      .where("b.id_room", id_room)
      // Grouping start dan end filter
      .andWhere(function () {
        this.where("b.start", "<", end)  // b.start harus lebih awal dari booking baru berakhir
          .andWhere("b.end", ">", start)  // b.end harus lebih lambat dari booking baru dimulai
      })
      // Grouping status filter
      .andWhere(function () {
        this.whereNull("b.status").orWhere("b.status", "!=", "Cancel");
      })
      .modify((query) => {
        if (excludeId) {
          query.where("b.id_booking", "!=", excludeId); // Mengecualikan booking tertentu jika diberikan
        }
      });
  }

}

module.exports = bookingModel