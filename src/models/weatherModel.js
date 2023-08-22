const mongoose = require('mongoose');

const weatherSchema = mongoose.Schema(
  {
    ISSLocation: {
      latitude: {
        type: Number,
        alias: 'ISSLocation.latitude',
        default: 0,
      },
      longitude: {
        type: Number,
        alias: 'ISSLocation.longitude',
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  },
);

const Weather = mongoose.model('Weather', weatherSchema);

module.exports = Weather;
