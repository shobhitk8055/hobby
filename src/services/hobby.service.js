const httpStatus = require("http-status");
const { User, Hobby, Track } = require("../models");
const mongoose = require("mongoose");
const moment = require("moment/moment");

/**
 * Get status of hobby on a particular date
 * @param {ObjectId} hobbyid
 * @param {date} date
 * @returns {string}
 */
const getStatus = async (hobby, date) => {
  const startOfDate = new Date(moment(date).startOf("day"));
  const endOfDate = new Date(moment(date).endOf("day"));
  const track = await Track.findOne({
    hobby,
    date: {
      $gte: startOfDate,
      $lte: endOfDate,
    },
  });
  if (!track) {
    return "pending";
  }
  return track.status;
};

/**
 * Get calendar hobbies
 * @param {ObjectId} userId
 * @returns {Object[]}
 */
const getCalendarHobbies = async (userId) => {
  let hobbies = await Hobby.find({ user: userId }, { title: 1, createdAt: 1 });
  hobbies = hobbies.map((i) => i.toObject());
  const result = [];

  for (let hobby of hobbies) {
    const item = {};
    item.hobby = hobby;
    hobby.totalDays = getTotalDays(hobby.createdAt);
    hobby.completedDays = (
      await Track.find({
        hobby: hobby._id,
        date: {
          $gte: moment(hobby.createdAt),
        },
        status: "done",
      })
    ).length;

    let streak = await countHobbyStreak(
      hobby._id,
      moment(hobby.createdAt).format("DD-MM-YYYY"),
      moment().subtract(1, "days").format("DD-MM-YYYY")
    );
    item.calendar = [];
    let lastDayStatus = "";
    for (let i = 6; i >= 0; i--) {
      const date = moment().subtract(i, "days");
      let dayResult = {};
      dayResult.date = date.date();
      dayResult.dateString = date.format("DD-MM-YYYY");
      let status = await getStatus(hobby._id, date);
      dayResult.status = status;
      item.calendar.push(dayResult);
      if (i === 0) {
        lastDayStatus = status;
      }
    }
    if (lastDayStatus === "done") {
      streak++;
    }
    hobby.streak = streak;
    result.push(item);
  }
  return result;
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
  let hobbies = await Hobby.aggregate([
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
        createdAt: 1,
        track: {
          $filter: {
            input: "$track",
            as: "item",
            cond: {
              $and: [
                {
                  $gte: ["$$item.date", new Date(moment().startOf("day"))],
                },
                {
                  $lte: ["$$item.date", new Date(moment().endOf("day"))],
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
  for (let hobby of hobbies) {
    hobby.totalDays = getTotalDays(hobby.createdAt);
    hobby.completedDays = (
      await Track.find({
        hobby: hobby._id,
        date: {
          $gte: moment(hobby.createdAt),
        },
        status: "done",
      })
    ).length;

    let streak = await countHobbyStreak(
      hobby._id,
      moment(hobby.createdAt).format("DD-MM-YYYY"),
      moment().subtract(1, "days").format("DD-MM-YYYY")
    );
    if (hobby.status === "done") {
      streak++;
    }
    hobby.streak = streak;
  }
  return hobbies;
};

/**
 * Change status of hobby for a date
 * @param {ObjectId} hobby
 * @param {date} date
 * @param {string} status
 * @returns {string}
 */
const changeTrackStatus = async (hobby, date, status) => {
  const findHobby = await Hobby.findById(hobby);
  if (findHobby) {
    const startOfDate = moment(date, "DD-MM-YYYY").startOf("day");
    const endOfDate = moment(date, "DD-MM-YYYY").endOf("day");
    const track = await Track.findOne({
      hobby,
      date: {
        $gte: startOfDate,
        $lte: endOfDate,
      },
    });
    if (!track) {
      await Track.create({
        date: moment(date, "DD-MM-YYYY"),
        status,
        hobby,
      });
    } else {
      track.status = status;
      await track.save();
    }
  }
  return "success";
};

/**
 * Count streak for a hobby
 * @param {ObjectId} hobbyId
 * @param {date} startDate
 * @param {date} date
 * @returns {number}
 */
const countHobbyStreak = async (hobbyId, startDate, date) => {
  const startOfDate = moment(date, "DD-MM-YYYY").startOf("day");
  const endOfDate = moment(date, "DD-MM-YYYY").endOf("day");
  const track = await Track.findOne({
    hobby: hobbyId,
    date: {
      $gte: startOfDate,
      $lte: endOfDate,
    },
  });
  if (!track || ["pending", "not_done"].includes(track.status)) {
    return 0;
  }
  if (moment(date, "DD-MM-YYYY").isBefore(moment(startDate, "DD-MM-YYYY"))) {
    return 0;
  }
  if (moment(date, "DD-MM-YYYY").isSame(moment(startDate, "DD-MM-YYYY"))) {
    if (track.status === "done") {
      return 1;
    } else {
      return 0;
    }
  }
  const prevDate = moment(date, "DD-MM-YYYY")
    .subtract(1, "days")
    .format("DD-MM-YYYY");
  const result = await countHobbyStreak(hobbyId, startDate, prevDate);
  return result + 1;
};

const getTotalDays = (createdAt) => {
    let totalDays = moment().diff(moment(createdAt), "days") + 1;

    if (
      moment().format("DD-MM-YYYY") ===
      moment(createdAt).format("DD-MM-YYYY")
    ) {
      totalDays = 1;
    }
    if (
      moment().subtract(1, "days").format("DD-MM-YYYY") ===
      moment(createdAt).format("DD-MM-YYYY")
    ) {
      totalDays = 2;
    }
    return totalDays;
}

module.exports = {
  createHobbyByName,
  getTodayHobbies,
  changeTrackStatus,
  getCalendarHobbies,
  countHobbyStreak,
};
