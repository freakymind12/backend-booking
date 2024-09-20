// models/userModel.js
const dbPool = require('../config/database');
const bcrypt = require('bcrypt');

const runQuery = async (query, params = []) => {
  const [result] = await dbPool.query(query, params);
  return result;
};

const createUser = async (username, email, hashedPassword, dept) => {
  await runQuery(`INSERT INTO users (username, email, password, dept, roles) VALUES (?, ?, ?, ?, 'viewer')`, [username, email, hashedPassword, dept]);
  return true;
};

const updatePasswordById = async (userId, password) => {
  const hashedPassword = await bcrypt.hash(password, 10); // Enkripsi kata sandi baru
  await runQuery('UPDATE users SET password = ? WHERE id_user = ?', [ hashedPassword, userId]);
  return true; 
};

const updateRoleById = async (userId, role) => {
  await runQuery('UPDATE users SET roles = ? WHERE id_user = ?', [ role, userId]);
  return true; 
};

const getAllUsers = async () => {
  return await runQuery(`SELECT id_user,username,email, dept,roles, created_at, DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at,deleted_at FROM users where deleted_at is null `);
};

const deleteUserById = async (userId) => {
  const currentTime = new Date().toISOString();
  await dbPool.query('UPDATE users SET deleted_at = ? WHERE id_user = ?', [currentTime, userId]);
  return true; // Kembalikan true jika pengguna berhasil dihapus
};

const findUserByUsername = async (username) => {
  return await runQuery('SELECT * FROM users WHERE username = ? and deleted_at is null', [username]);
};

const findUserByEmail = async (email) => {
  return await runQuery('SELECT * FROM users WHERE email = ?', [email]);
};

const findUserById = async (userId) => {
    return await runQuery('SELECT username,email,roles,dept,password FROM users WHERE id_user = ?', [userId]);
};

module.exports = {
  createUser,
  updatePasswordById,
  updateRoleById,
  getAllUsers,
  deleteUserById,
  findUserByUsername,
  findUserByEmail,
  findUserById
};
