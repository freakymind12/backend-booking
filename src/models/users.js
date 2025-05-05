const dbPool = require("../config/knex");

const userModel = {
  createUser: ({ username, email, password }) =>
    dbPool("users").insert({
      username,
      email,
      password,
      roles: "viewer",
    }),

  updateUser: (id_user, data) => {
    return dbPool("users").where({ id_user }).update(data);
  },

  deleteUser: (id_user) => {
    return dbPool("users").where({ id_user }).del();
  },

  getUser: (filters = {}, withPassword = false) => {
    const { username, email, roles, dept, id_user } = filters
    return dbPool("users")
      .select("id_user", "username", "email", "roles", "dept", "created_at")
      .modify((query) => {
        if (username) {
          query.where("username", username);
        }
        if (email) {
          query.where("email", email);
        }
        if (roles) {
          query.where("roles", roles);
        }
        if (dept) {
          query.where("dept", dept);
        }
        if (id_user) {
          query.where("id_user", id_user);
        }
        if (withPassword) {
          query.select("password");
        }
      })
  },

  getTotalUser: () => {
    return dbPool("users")
      .select("roles")
      .count("* as total_users")
      .groupBy("roles")
  },
};

module.exports = userModel;
