const { User } = require("../models");

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Create or get user from name
 * @param {string} name
 * @returns {User}
 */
const createUser = async (name) => {
  let findUser = await User.findOne({ name });
  if (!findUser) {
    findUser = await User.create({ name });
  }
  return findUser;
};

module.exports = {
  getUserById,
  createUser,
};
