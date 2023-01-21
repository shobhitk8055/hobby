const catchAsync = require('../utils/catchAsync');
const { authService } = require('../services');

const login = catchAsync(async (req, res) => {
  const { name } = req.body;
  const user = await authService.login(name);
  res.redirect(`/app/dashboard?user=${user.id}`);
});

module.exports = {
  login
};
