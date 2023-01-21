const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

const trackSchema = mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["pending", "not_done", "done"],
      default: "pending",
    },
    hobby: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Hobby",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
trackSchema.plugin(toJSON);

/**
 * @typedef Track
 */
const Track = mongoose.model("Track", trackSchema);

module.exports = Track;
