const dayjs = require("dayjs");
const dbPool = require("../config/knex");

const roomModel = {
  create: (data) => {
    return dbPool("rooms").insert({
      ...data,
      id_room: dbPool.raw("UUID()"),
    });
  },

  update: (id_room, data) => {
    return dbPool("rooms").where({ id_room }).update(data);
  },

  delete: (id_room) => {
    return dbPool("rooms").where({ id_room }).del();
  },

  get: (filters = {}) => {
    const { id_room } = filters
    return dbPool("rooms")
      .select("*")
      .orderBy("room_name", "asc")
      .modify((query) => {
        if (id_room) query.where("id_room", id_room)
      })
  },
}

module.exports = roomModel