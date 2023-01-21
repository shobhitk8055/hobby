const express = require("express");
const validate = require("../../middlewares/validate");
const authValidation = require("../../validations/auth.validation");
const authController = require("../../controllers/auth.controller");
const { userService } = require("../../services");

const router = express.Router();

router.get("/dashboard", async (req, res) => {
  const { user } = req.query;
  if (!user) {
    res.redirect("/");
  }
  const hobbies = await userService.getTodayHobbies(user);
  res.render("dashboard", { user, hobbies });
});

router.get("/create-hobby", (req, res) => {
  const { user } = req.query;
  if (!user) {
    res.redirect("/");
  }
  res.render("createHobbie", { user });
});

module.exports = router;
