const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const hobbySchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    user:{
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    }
  },
  {
    timestamps: true,
    
  }
);

// add plugin that converts mongoose to json
hobbySchema.plugin(toJSON);

/**
 * @typedef Hobby
 */
const Hobby = mongoose.model('Hobby', hobbySchema);

module.exports = Hobby;
