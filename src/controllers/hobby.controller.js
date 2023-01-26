const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { hobbyService } = require("../services");

const createHobby = catchAsync(async (req, res) => {
  const { user, title } = req.body;
  await hobbyService.createHobbyByName(user, title);
  res.redirect("/app/dashboard?user=" + user);
});

const changeStatus = catchAsync(async (req, res) => {
  const { hobby, date, status } = req.body;
  await hobbyService.changeTrackStatus(hobby, date, status);
  res.redirect("back");
});

module.exports = {
  createHobby,
  changeStatus,
};
