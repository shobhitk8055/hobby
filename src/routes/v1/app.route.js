const express = require("express");
const { hobbyService } = require("../../services");
const auth = require("../../middlewares/auth");
const moment = require("moment");
const weekdays = require("../../utils/weekdays");

const router = express.Router();

router.get("/dashboard", auth, async (req, res) => {
  const hobbies = await hobbyService.getTodayHobbies(req.user);
  res.render("dashboard", {
    user: req.user,
    hobbies,
    date: moment().format("DD-MM-YYYY"),
  });
});

router.get("/create-hobby", auth, (req, res) => {
  res.render("createHobbie", { user: req.user });
});

router.get("/calendar", auth, async (req, res) => {
  const calendar = await hobbyService.getCalendarHobbies(req.user);
  res.render("calendar", {
    user: req.user,
    calendar,
    date: moment().format("MMMM YYYY"),
    weekdays: weekdays()
  });
});

module.exports = router;
