const httpStatus = require("http-status");
const { User, Hobby, Track } = require("../models");
const ApiError = require("../utils/ApiError");
const mongoose = require("mongoose");
const moment = require("moment/moment");

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

/**
 * Create hobby from userId and title
 * @param {ObjectId} userId
 * @param {string} title
 * @returns {string}
 */
const createHobbyByName = async (userId, title) => {
  let findUser = await User.findById(userId);
  if (findUser) {
    const hobby = await Hobby.create({ user: userId, title });
    await Track.create({ hobby: hobby.id, date: new Date() });
  }
  return "success";
};

/**
 * Get all hobbies with tracks for today
 * @param {ObjectId} userId
 * @returns {Promise<Hobbie>}
 */
const getTodayHobbies = async (userId) => {
  console.log();
  console.log();
  const hobbies = await Hobby.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "tracks",
        localField: "_id",
        foreignField: "hobby",
        as: "track",
      },
    },
    {
      $project: {
        title: 1,
        track: {
          $filter: {
            input: "$track",
            as: "item",
            cond: {
              $and: [
                {
                  $gte: [
                    "$$item.date",
                    new Date(moment().startOf('day')),
                  ],
                },
                {
                  $lte: [
                    "$$item.date",
                    new Date(moment().endOf('day')),
                  ],
                },
              ],
            },
          },
        },
      },
    },
    {
      $unwind: {
        path: "$track",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        status: "$track.status",
      },
    },
    {
      $addFields: {
        status: {
          $ifNull: ["$track.status", "pending"],
        },
      },
    },
  ]);
  return hobbies;
};

module.exports = {
  getUserById,
  createHobbyByName,
  createUser,
  getTodayHobbies,
};
