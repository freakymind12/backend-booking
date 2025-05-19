const dbPool = require("../config/knex");

const autoScheduleModel = {
  create: (data) => {
    return dbPool("auto_schedule").insert(data)
  },

  update: (id_schedule, data) => {
    return dbPool("auto_schedule").where({ id_schedule }).update(data)
  },

  delete: (id_schedule) => {
    return dbPool("auto_schedule").where({ id_schedule }).del()
  },

  get: () => {
    return dbPool("auto_schedule as a")
      .select("a.*", "u.username", "r.room_name", "u.dept")
      .join("users as u", "a.id_user", "u.id_user")
      .join("rooms as r", "a.id_room", "r.id_room")
      .orderBy("a.day", "asc")
  },

  checkConflict: (filters = {}) => {
    const { id_room, day, start, end } = filters
    return dbPool("auto_schedule")
      .select("*")
      .where("id_room", id_room)
      .andWhere("day", day)
      .andWhere(function () {
        this.where("start", "<", end)
          .andWhere("end", ">", start)
      })
  }
}

module.exports = autoScheduleModel