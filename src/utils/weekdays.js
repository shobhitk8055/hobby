const moment = require("moment");

/**
 * Get week days
 * @returns {[weekdays]}
 */
const weekdays = () => {
  const week = [];
  for (let i = 6; i >= 0; i--) {
    week.push(moment().subtract(i, "days").format('ddd'));
  }
  return week;
};

module.exports = weekdays;
