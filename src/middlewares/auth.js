const auth = (req, res, next) => {
  const { user } = req.query;
  if (!user) {
    return res.redirect("/");
  } else {
    req.user = user;
    return next();
  }
};

module.exports = auth;
