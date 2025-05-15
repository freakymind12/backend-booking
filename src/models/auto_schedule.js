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
  }
}

module.exports = autoScheduleModel